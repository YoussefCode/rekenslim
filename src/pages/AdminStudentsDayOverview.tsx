import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Minimal inline calendar if project doesn't have Calendar component
const InlineCalendar: React.FC<{
  selectedDate: string;
  onSelect: (date: string) => void;
}> = ({ selectedDate, onSelect }) => {
  const [days, setDays] = useState<string[]>([]);
  useEffect(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const arr: string[] = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(dt.toISOString().slice(0, 10));
    }
    setDays(arr);
  }, []);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onSelect(day)}
          className={`p-2 border rounded text-sm ${day === selectedDate ? "bg-primary text-white" : "bg-white"}`}
        >
          {new Date(day).getDate()}
        </button>
      ))}
    </div>
  );
};

type LoginRecord = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  last_login_at: string | null;
};

interface Props {
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function AdminStudentsDayOverview({ showBackButton = true, onBack }: Props) {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [records, setRecords] = useState<LoginRecord[]>([]);
  const [domainsByUser, setDomainsByUser] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLoginsAndDomains() {
      setLoading(true);
      setError(null);
      const start = selectedDate + "T00:00:00";
      const end = selectedDate + "T23:59:59.999";
      // Stap 1: Haal alle leerlingen die die dag zijn ingelogd
      const { data: users, error: userError } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, email, last_login_at")
        .gte("last_login_at", start)
        .lte("last_login_at", end)
        .order("last_login_at", { ascending: true });
      if (userError) {
        setError("Fout bij ophalen van login-data");
        setRecords([]);
        setDomainsByUser({});
        setLoading(false);
        return;
      }
      setRecords(users || []);

      // Stap 2: Haal per leerling de afgeronde domeinen op deze dag
      const userIds = (users || []).map((u: any) => u.user_id);
      if (userIds.length === 0) {
        setDomainsByUser({});
        setLoading(false);
        return;
      }
      // Haal alle student_domains op voor deze users
      const { data: studentDomains, error: sdError } = await supabase
        .from("student_domains")
        .select("id, student_id, domain_name").in("student_id", userIds);
      if (sdError) {
        setError("Fout bij ophalen van domeinen");
        setDomainsByUser({});
        setLoading(false);
        return;
      }
      const studentDomainIds = (studentDomains || []).map((sd: any) => sd.id);
      // Haal alle resultaten op deze dag
      const { data: results, error: resError } = await supabase
        .from("student_domain_results")
        .select("student_domain_id, submitted_at")
        .in("student_domain_id", studentDomainIds)
        .gte("submitted_at", start)
        .lte("submitted_at", end);
      if (resError) {
        setError("Fout bij ophalen van resultaten");
        setDomainsByUser({});
        setLoading(false);
        return;
      }
      // Map student_id -> set van domeinnamen afgerond op deze dag
      const sdById = Object.fromEntries((studentDomains || []).map((sd: any) => [sd.id, sd]));
      const domainsByUser: Record<string, Set<string>> = {};
      (results || []).forEach((r: any) => {
        const sd = sdById[r.student_domain_id];
        if (!sd) return;
        if (!domainsByUser[sd.student_id]) domainsByUser[sd.student_id] = new Set();
        domainsByUser[sd.student_id].add(sd.domain_name);
      });
      // Zet om naar array voor weergave
      const domainsByUserArr: Record<string, string[]> = {};
      Object.entries(domainsByUser).forEach(([uid, set]) => {
        domainsByUserArr[uid] = Array.from(set);
      });
      setDomainsByUser(domainsByUserArr);
      setLoading(false);
    }
    fetchLoginsAndDomains();
  }, [selectedDate]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        {showBackButton && (
          <button
            className="px-3 py-1 rounded bg-muted text-foreground border hover:bg-primary/10 transition"
            onClick={() => (onBack ? onBack() : navigate("/admin/leerlingen"))}
          >
            Ga terug
          </button>
        )}
        <h1 className="text-2xl font-bold">Dagoverzicht: ingelogde leerlingen</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
            </CardHeader>
            <CardContent>
              {/* if a Calendar component exists in project, import and use it instead */}
              <InlineCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Samenvatting {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Aantal unieke inloggers: {records.length}</p>
              {loading && <p className="text-xs text-muted-foreground">Laden...</p>}
              {error && <p className="text-xs text-red-500">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details voor {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Laden...</p>
              ) : records.length === 0 ? (
                <p className="text-muted-foreground">Geen ingelogde leerlingen gevonden voor deze dag.</p>
              ) : (
                <div className="space-y-3">
                  {records.map((r) => (
                    <div key={r.user_id} className="p-3 border rounded flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{r.first_name || "-"} {r.last_name || ""}</div>
                          <div className="text-sm text-muted-foreground">{r.email}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{r.last_login_at ? new Date(r.last_login_at).toLocaleTimeString() : "-"}</div>
                      </div>
                      <div className="text-xs mt-1">
                        <span className="font-medium">Domeinen afgerond:</span> {domainsByUser[r.user_id]?.length ? domainsByUser[r.user_id].join(", ") : <span className="text-muted-foreground">geen</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
