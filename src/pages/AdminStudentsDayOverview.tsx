import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as SimpleCalendar } from "@/components/ui/calendar"; // placeholder, fallback below

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
  student_id: string;
  display_name: string;
  email: string;
  time: string; // ISO
};

const mockData: Record<string, LoginRecord[]> = {
  // date: records
  [new Date().toISOString().slice(0, 10)]: [
    { student_id: "s1", display_name: "Jan Jansen", email: "jan@example.com", time: new Date().toISOString() },
    { student_id: "s2", display_name: "Marie de Vries", email: "marie@example.com", time: new Date().toISOString() },
  ],
};

export default function AdminStudentsDayOverview() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [records, setRecords] = useState<LoginRecord[]>([]);

  useEffect(() => {
    // TODO: replace mock fetch with real API call to fetch logins for date
    setRecords(mockData[selectedDate] || []);
  }, [selectedDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dagoverzicht: ingelogde leerlingen</h1>

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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details voor {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-muted-foreground">Geen ingelogde leerlingen gevonden voor deze dag.</p>
              ) : (
                <div className="space-y-3">
                  {records.map((r) => (
                    <div key={r.student_id} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{r.display_name}</div>
                        <div className="text-sm text-muted-foreground">{r.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{new Date(r.time).toLocaleTimeString()}</div>
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
