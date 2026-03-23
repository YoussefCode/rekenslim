import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Student {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface SchoolClass {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface ClassDomain {
  id: string;
  class_id: string;
  domain_name: string;
  description: string | null;
  html_file_url: string | null;
  created_at: string;
}

interface ClassDomainStudentResult {
  student_id: string;
  student_name: string;
  student_email: string;
  submitted_at: string;
  result_data: Record<string, any>;
}

const PERFORMANCE_BUCKET_COLORS = ["#16a34a", "#eab308", "#ef4444"];

const getResultPercentage = (resultData: Record<string, any>) => {
  const percentage = resultData?.percentage;
  if (typeof percentage === "number") {
    return Math.max(0, Math.min(100, Math.round(percentage)));
  }

  const score = resultData?.score;
  const total = resultData?.total ?? resultData?.totalQuestions ?? resultData?.total_questions;
  if (typeof score === "number" && typeof total === "number" && total > 0) {
    return Math.max(0, Math.min(100, Math.round((score / total) * 100)));
  }

  return null;
};

const AdminClasses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [classDomains, setClassDomains] = useState<ClassDomain[]>([]);

  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [selectedStudentForClass, setSelectedStudentForClass] = useState("");
  const [newClassDomainName, setNewClassDomainName] = useState("");
  const [newClassDomainDescription, setNewClassDomainDescription] = useState("");
  const [newClassDomainHtmlFile, setNewClassDomainHtmlFile] = useState<File | null>(null);

  const [creatingClass, setCreatingClass] = useState(false);
  const [addingStudentToClass, setAddingStudentToClass] = useState(false);
  const [creatingClassDomain, setCreatingClassDomain] = useState(false);
  const [deletingClassDomainId, setDeletingClassDomainId] = useState<string | null>(null);

  const [classResultsByDomain, setClassResultsByDomain] = useState<Record<string, ClassDomainStudentResult[]>>({});
  const [expandedClassResults, setExpandedClassResults] = useState<Record<string, boolean>>({});
  const [loadingClassResults, setLoadingClassResults] = useState(false);

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Onbekend";
    return new Intl.DateTimeFormat("nl-NL", { dateStyle: "short", timeStyle: "short" }).format(date);
  };

  const formatResultSummary = (resultData: Record<string, any>) => {
    const percentage = resultData?.percentage;
    if (typeof percentage === "number") return `${Math.round(percentage)}%`;

    const score = resultData?.score;
    const totalQuestions = resultData?.totalQuestions ?? resultData?.total_questions;
    if (typeof score === "number" && typeof totalQuestions === "number" && totalQuestions > 0) {
      const pct = Math.round((score / totalQuestions) * 100);
      return `${score}/${totalQuestions} (${pct}%)`;
    }

    return "Resultaat beschikbaar";
  };

  const classOverview = useMemo(() => {
    return classDomains
      .map((domain) => {
        const entries = classResultsByDomain[domain.id] || [];
        if (entries.length === 0) return null;

        const latestByStudent = new Map<string, ClassDomainStudentResult>();
        entries.forEach((entry) => {
          const prev = latestByStudent.get(entry.student_id);
          if (!prev || new Date(entry.submitted_at).getTime() > new Date(prev.submitted_at).getTime()) {
            latestByStudent.set(entry.student_id, entry);
          }
        });

        const latestResults = Array.from(latestByStudent.values())
          .map((entry) => ({ ...entry, percentage: getResultPercentage(entry.result_data) }))
          .filter(
            (entry): entry is ClassDomainStudentResult & { percentage: number } =>
              typeof entry.percentage === "number"
          );

        if (latestResults.length === 0) return null;

        const average = Math.round(
          latestResults.reduce((sum, entry) => sum + entry.percentage, 0) / latestResults.length
        );

        return {
          domainId: domain.id,
          domainName: domain.domain_name,
          average,
          count: latestResults.length,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [classDomains, classResultsByDomain]);

  useEffect(() => {
    if (profile?.role !== "admin") {
      navigate("/");
      return;
    }

    const load = async () => {
      await Promise.all([fetchStudents(), fetchClasses()]);
      setLoading(false);
    };

    void load();
  }, [profile]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, email, first_name, last_name")
      .eq("role", "student")
      .order("first_name");

    if (error) {
      toast({ title: "Fout bij laden leerlingen", variant: "destructive" });
      return;
    }

    setStudents((data as Student[]) || []);
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Fout bij laden klassen", variant: "destructive" });
      return;
    }

    setClasses((data as SchoolClass[]) || []);
  };

  const fetchClassStudents = async (classId: string) => {
    const { data: links, error: linksError } = await supabase
      .from("class_students")
      .select("student_id")
      .eq("class_id", classId);

    if (linksError) {
      toast({ title: "Fout bij laden klasleerlingen", variant: "destructive" });
      return;
    }

    const ids = ((links as { student_id: string }[]) || []).map((x) => x.student_id);
    if (ids.length === 0) {
      setClassStudents([]);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, email, first_name, last_name")
      .in("user_id", ids)
      .eq("role", "student");

    if (error) {
      toast({ title: "Fout bij laden klasleerlingen", variant: "destructive" });
      return;
    }

    setClassStudents((data as Student[]) || []);
  };

  const fetchClassDomains = async (classId: string) => {
    const { data, error } = await supabase
      .from("class_domains")
      .select("id, class_id, domain_name, description, html_file_url, created_at")
      .eq("class_id", classId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Fout bij laden klasmateriaal", variant: "destructive" });
      return;
    }

    setClassDomains((data as ClassDomain[]) || []);
  };

  const fetchClassResults = async (classDomainIds: string[]) => {
    if (classDomainIds.length === 0) {
      setClassResultsByDomain({});
      return;
    }

    setLoadingClassResults(true);
    try {
      const { data: studentDomainsData, error: studentDomainsError } = await supabase
        .from("student_domains")
        .select("id, class_domain_id, student_id")
        .in("class_domain_id", classDomainIds);
      if (studentDomainsError) throw studentDomainsError;

      const studentDomains = (studentDomainsData || []) as Array<{ id: string; class_domain_id: string | null; student_id: string }>;
      if (studentDomains.length === 0) {
        setClassResultsByDomain({});
        return;
      }

      const studentIds = [...new Set(studentDomains.map((sd) => sd.student_id))];
      const studentDomainIds = studentDomains.map((sd) => sd.id);
      const studentDomainById = new Map(studentDomains.map((sd) => [sd.id, sd]));

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, email, first_name, last_name")
        .in("user_id", studentIds);
      if (profilesError) throw profilesError;
      const profileById = new Map(((profilesData as any[]) || []).map((p) => [p.user_id, p]));

      const { data: resultsData, error: resultsError } = await supabase
        .from("student_domain_results" as any)
        .select("student_domain_id, result_data, submitted_at")
        .in("student_domain_id", studentDomainIds)
        .order("submitted_at", { ascending: false });
      if (resultsError) throw resultsError;

      const grouped: Record<string, ClassDomainStudentResult[]> = {};
      ((resultsData as any[]) || []).forEach((r) => {
        const sd = studentDomainById.get(r.student_domain_id);
        if (!sd || !sd.class_domain_id) return;

        const p = profileById.get(sd.student_id);
        const studentName = p && (p.first_name || p.last_name)
          ? `${p.first_name || ""} ${p.last_name || ""}`.trim()
          : p?.email || sd.student_id;

        if (!grouped[sd.class_domain_id]) grouped[sd.class_domain_id] = [];
        grouped[sd.class_domain_id].push({
          student_id: sd.student_id,
          student_name: studentName,
          student_email: p?.email || "",
          submitted_at: r.submitted_at,
          result_data: r.result_data,
        });
      });

      setClassResultsByDomain(grouped);
    } catch {
      toast({ title: "Fout bij laden klasresultaten", variant: "destructive" });
    } finally {
      setLoadingClassResults(false);
    }
  };

  useEffect(() => {
    if (!selectedClass) {
      setClassResultsByDomain({});
      return;
    }
    void fetchClassResults(classDomains.map((d) => d.id));
  }, [selectedClass?.id, classDomains]);

  const selectClass = (schoolClass: SchoolClass) => {
    setSelectedClass(schoolClass);
    void fetchClassStudents(schoolClass.id);
    void fetchClassDomains(schoolClass.id);
  };

  const createClass = async () => {
    const name = newClassName.trim();
    const description = newClassDescription.trim();
    if (!name) {
      toast({ title: "Klasnaam is verplicht", variant: "destructive" });
      return;
    }

    setCreatingClass(true);
    try {
      const { data, error } = await supabase
        .from("classes")
        .insert({ name, description: description || null, created_by: user?.id ?? null })
        .select("id, name, description, created_at")
        .single();

      if (error) throw error;

      setNewClassName("");
      setNewClassDescription("");
      toast({ title: "Klas aangemaakt" });
      await fetchClasses();
      if (data) selectClass(data as SchoolClass);
    } catch {
      toast({ title: "Fout bij aanmaken klas", variant: "destructive" });
    } finally {
      setCreatingClass(false);
    }
  };

  const addStudentToSelectedClass = async () => {
    if (!selectedClass || !selectedStudentForClass) return;

    setAddingStudentToClass(true);
    try {
      const { error: linkError } = await supabase.from("class_students").insert({
        class_id: selectedClass.id,
        student_id: selectedStudentForClass,
      });
      if (linkError) throw linkError;

      const { data: sourceDomains, error: sourceDomainsError } = await supabase
        .from("class_domains")
        .select("id, domain_name, description, html_file_url")
        .eq("class_id", selectedClass.id);
      if (sourceDomainsError) throw sourceDomainsError;

      const fanoutRows = ((sourceDomains as any[]) || []).map((d) => ({
        student_id: selectedStudentForClass,
        class_domain_id: d.id,
        domain_name: d.domain_name,
        description: d.description,
        html_file_url: d.html_file_url,
      }));

      if (fanoutRows.length > 0) {
        const { error: fanoutError } = await supabase
          .from("student_domains")
          .upsert(fanoutRows, { onConflict: "student_id,class_domain_id" });
        if (fanoutError) throw fanoutError;
      }

      setSelectedStudentForClass("");
      toast({ title: "Leerling toegevoegd aan klas" });
      await fetchClassStudents(selectedClass.id);
      await fetchClassDomains(selectedClass.id);
    } catch {
      toast({ title: "Fout bij toevoegen aan klas", variant: "destructive" });
    } finally {
      setAddingStudentToClass(false);
    }
  };

  const removeStudentFromSelectedClass = async (studentId: string) => {
    if (!selectedClass) return;
    if (!confirm("Deze leerling uit de klas verwijderen?")) return;

    try {
      const { error: unlinkError } = await supabase
        .from("class_students")
        .delete()
        .eq("class_id", selectedClass.id)
        .eq("student_id", studentId);
      if (unlinkError) throw unlinkError;

      const classDomainIds = classDomains.map((d) => d.id);
      if (classDomainIds.length > 0) {
        const { error: cleanupError } = await supabase
          .from("student_domains")
          .delete()
          .eq("student_id", studentId)
          .in("class_domain_id", classDomainIds);
        if (cleanupError) throw cleanupError;
      }

      toast({ title: "Leerling verwijderd uit klas" });
      await fetchClassStudents(selectedClass.id);
      await fetchClassDomains(selectedClass.id);
    } catch {
      toast({ title: "Fout bij verwijderen uit klas", variant: "destructive" });
    }
  };

  const addClassDomain = async () => {
    if (!selectedClass || !newClassDomainName.trim()) return;
    setCreatingClassDomain(true);

    try {
      let htmlFileUrl: string | null = null;
      if (newClassDomainHtmlFile) {
        const filePath = `classes/${selectedClass.id}/${Date.now()}_${newClassDomainHtmlFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("student-files")
          .upload(filePath, newClassDomainHtmlFile, { contentType: "text/html" });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("student-files").getPublicUrl(filePath);
        htmlFileUrl = urlData.publicUrl;
      }

      const { data: createdDomain, error: createDomainError } = await supabase
        .from("class_domains")
        .insert({
          class_id: selectedClass.id,
          domain_name: newClassDomainName.trim(),
          description: newClassDomainDescription.trim() || null,
          html_file_url: htmlFileUrl,
        })
        .select("id, class_id, domain_name, description, html_file_url, created_at")
        .single();
      if (createDomainError || !createdDomain) throw createDomainError;

      const { data: links, error: linksError } = await supabase
        .from("class_students")
        .select("student_id")
        .eq("class_id", selectedClass.id);
      if (linksError) throw linksError;

      const rows = ((links as { student_id: string }[]) || []).map((x) => ({
        student_id: x.student_id,
        class_domain_id: createdDomain.id,
        domain_name: createdDomain.domain_name,
        description: createdDomain.description,
        html_file_url: createdDomain.html_file_url,
      }));

      if (rows.length > 0) {
        const { error: fanoutError } = await supabase
          .from("student_domains")
          .upsert(rows, { onConflict: "student_id,class_domain_id" });
        if (fanoutError) throw fanoutError;
      }

      setNewClassDomainName("");
      setNewClassDomainDescription("");
      setNewClassDomainHtmlFile(null);
      toast({ title: "Klasdomein toegevoegd" });
      await fetchClassDomains(selectedClass.id);
    } catch (error) {
      toast({
        title: "Fout bij toevoegen klasdomein",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setCreatingClassDomain(false);
    }
  };

  const deleteClassDomain = async (classDomainId: string) => {
    if (!selectedClass) return;
    if (!confirm("Dit klasdomein verwijderen voor alle leerlingen in deze klas?")) return;

    setDeletingClassDomainId(classDomainId);
    try {
      const { error: cleanupError } = await supabase
        .from("student_domains")
        .delete()
        .eq("class_domain_id", classDomainId);
      if (cleanupError) throw cleanupError;

      const { error: deleteError } = await supabase
        .from("class_domains")
        .delete()
        .eq("id", classDomainId)
        .eq("class_id", selectedClass.id);
      if (deleteError) throw deleteError;

      toast({ title: "Klasdomein verwijderd" });
      await fetchClassDomains(selectedClass.id);
    } catch {
      toast({ title: "Fout bij verwijderen klasdomein", variant: "destructive" });
    } finally {
      setDeletingClassDomainId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Klassen Beheer</h1>
            <p className="text-muted-foreground">Beheer klassen, leerlingen en klassikaal lesmateriaal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Klas toevoegen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="Klasnaam" />
                <Textarea value={newClassDescription} onChange={(e) => setNewClassDescription(e.target.value)} placeholder="Beschrijving (optioneel)" />
                <Button className="w-full" onClick={createClass} disabled={creatingClass}>
                  {creatingClass ? "Aanmaken..." : "Maak klas aan"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Klassen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {classes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nog geen klassen</p>
                ) : (
                  classes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectClass(c)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedClass?.id === c.id ? "bg-secondary" : "hover:bg-muted"}`}
                    >
                      <span className="font-medium block">{c.name}</span>
                      {c.description && <span className="text-xs text-muted-foreground block">{c.description}</span>}
                      <span className="text-xs text-muted-foreground block">Toegevoegd op: {formatDate(c.created_at)}</span>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-9">
            {!selectedClass ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  Selecteer een klas om te beheren.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Klas: {selectedClass.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{selectedClass.description || "Geen beschrijving"}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor="class-student-select">Leerling toevoegen aan klas</Label>
                        <select
                          id="class-student-select"
                          value={selectedStudentForClass}
                          onChange={(e) => setSelectedStudentForClass(e.target.value)}
                          className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">Kies leerling</option>
                          {students
                            .filter((s) => !classStudents.some((cs) => cs.user_id === s.user_id))
                            .map((s) => (
                              <option key={s.user_id} value={s.user_id}>
                                {(s.first_name || s.last_name) ? `${s.first_name || ""} ${s.last_name || ""}`.trim() : s.email}
                              </option>
                            ))}
                        </select>
                      </div>
                      <Button onClick={addStudentToSelectedClass} disabled={addingStudentToClass || !selectedStudentForClass}>
                        {addingStudentToClass ? "Toevoegen..." : "Toevoegen"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Leerlingen in klas</Label>
                      {classStudents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nog geen leerlingen in deze klas</p>
                      ) : (
                        classStudents.map((s) => (
                          <div key={s.user_id} className="flex items-center justify-between border rounded-md px-3 py-2">
                            <div>
                              <p className="text-sm font-medium">{(s.first_name || s.last_name) ? `${s.first_name || ""} ${s.last_name || ""}`.trim() : s.email}</p>
                              <p className="text-xs text-muted-foreground">{s.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeStudentFromSelectedClass(s.user_id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Klaslokaal lesmateriaal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input value={newClassDomainName} onChange={(e) => setNewClassDomainName(e.target.value)} placeholder="Naam lesmateriaal" />
                      <Input type="file" accept=".html,.htm" onChange={(e) => setNewClassDomainHtmlFile(e.target.files?.[0] || null)} />
                    </div>
                    <Textarea value={newClassDomainDescription} onChange={(e) => setNewClassDomainDescription(e.target.value)} placeholder="Beschrijving (optioneel)" />
                    <Button onClick={addClassDomain} disabled={creatingClassDomain}>
                      {creatingClassDomain ? "Toevoegen..." : "Voeg lesmateriaal toe aan hele klas"}
                    </Button>

                    {classDomains.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nog geen klasmateriaal</p>
                    ) : (
                      <div className="space-y-2">
                        {classDomains.map((d) => (
                          <div key={d.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                            <div>
                              <p className="text-sm font-medium">{d.domain_name}</p>
                              {d.description && <p className="text-xs text-muted-foreground">{d.description}</p>}
                              <p className="text-xs text-muted-foreground">Toegevoegd op: {formatDate(d.created_at)}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteClassDomain(d.id)} disabled={deletingClassDomainId === d.id}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Klasresultaten</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {loadingClassResults ? (
                      <p className="text-sm text-muted-foreground">Resultaten laden...</p>
                    ) : classDomains.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nog geen klasmateriaal om resultaten op te tonen.</p>
                    ) : (
                      <div className="space-y-4">
                        {classOverview.length > 0 && (
                          <div className="rounded-md border p-3">
                            <p className="text-sm font-semibold mb-2">Klasanalyse per domein</p>
                            <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classOverview} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="domainName" tick={{ fontSize: 12 }} />
                                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                  <Tooltip formatter={(value) => [`${value}%`, "Gemiddelde"]} />
                                  <Bar dataKey="average" name="Gemiddelde score" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        {classDomains.map((d) => {
                        const entries = classResultsByDomain[d.id] || [];
                        const attempts = entries.length;
                        const totalStudentsInClass = classStudents.length;
                        const studentsWithResult = new Set(entries.map((e) => e.student_id)).size;

                        const latestByStudent = new Map<string, ClassDomainStudentResult>();
                        entries.forEach((entry) => {
                          const previous = latestByStudent.get(entry.student_id);
                          if (!previous || new Date(entry.submitted_at).getTime() > new Date(previous.submitted_at).getTime()) {
                            latestByStudent.set(entry.student_id, entry);
                          }
                        });

                        const latestResults = Array.from(latestByStudent.values())
                          .map((entry) => ({
                            ...entry,
                            percentage: getResultPercentage(entry.result_data),
                          }))
                          .filter(
                            (entry): entry is ClassDomainStudentResult & { percentage: number } =>
                              typeof entry.percentage === "number"
                          );

                        const latestChartData = latestResults
                          .map((entry) => ({
                            leerling: entry.student_name,
                            percentage: entry.percentage,
                          }))
                          .sort((a, b) => b.percentage - a.percentage);

                        const performanceBuckets = [
                          {
                            name: "Sterk (>=70%)",
                            value: latestResults.filter((entry) => entry.percentage >= 70).length,
                          },
                          {
                            name: "Midden (50-69%)",
                            value: latestResults.filter(
                              (entry) => entry.percentage >= 50 && entry.percentage < 70
                            ).length,
                          },
                          {
                            name: "Aandacht (<50%)",
                            value: latestResults.filter((entry) => entry.percentage < 50).length,
                          },
                        ].filter((bucket) => bucket.value > 0);

                        return (
                          <div key={`result-${d.id}`} className="border rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{d.domain_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Pogingen: {attempts} · Leerlingen met resultaat: {studentsWithResult}/{totalStudentsInClass}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedClassResults((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
                                disabled={attempts === 0}
                              >
                                {expandedClassResults[d.id] ? "Verberg" : "Toon"}
                              </Button>
                            </div>

                            {attempts === 0 ? (
                              <p className="text-xs text-muted-foreground">Nog geen resultaten beschikbaar.</p>
                            ) : (
                              <div className="space-y-3">
                                {latestChartData.length > 0 && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <div className="rounded-md border bg-muted/20 p-3">
                                      <p className="text-xs font-medium text-muted-foreground mb-2">Laatste score per leerling</p>
                                      <div className="h-56 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={latestChartData} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                              dataKey="leerling"
                                              interval={0}
                                              angle={-25}
                                              textAnchor="end"
                                              height={54}
                                              tick={{ fontSize: 11 }}
                                            />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                                            <Bar dataKey="percentage" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                                          </BarChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>

                                    <div className="rounded-md border bg-muted/20 p-3">
                                      <p className="text-xs font-medium text-muted-foreground mb-2">Verdeling prestaties</p>
                                      <p className="text-[11px] text-muted-foreground mb-2">
                                        Aandacht betekent: leerling scoort onder 50% op de laatste poging in dit domein.
                                      </p>
                                      <div className="h-56 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                            <Pie
                                              data={performanceBuckets}
                                              dataKey="value"
                                              nameKey="name"
                                              cx="50%"
                                              cy="50%"
                                              outerRadius={72}
                                              label
                                            >
                                              {performanceBuckets.map((bucket, index) => (
                                                <Cell key={`${d.id}-${bucket.name}`} fill={PERFORMANCE_BUCKET_COLORS[index % PERFORMANCE_BUCKET_COLORS.length]} />
                                              ))}
                                            </Pie>
                                            <Tooltip />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {expandedClassResults[d.id] && (
                              <div className="space-y-2">
                                {entries.map((entry) => (
                                  <div key={`${d.id}-${entry.student_id}-${entry.submitted_at}`} className="rounded-md bg-muted/40 p-2">
                                    <p className="text-sm font-medium">{entry.student_name}</p>
                                    <p className="text-xs text-muted-foreground">{entry.student_email}</p>
                                    <p className="text-xs text-muted-foreground">Poging op: {formatDate(entry.submitted_at)}</p>
                                    <p className="text-xs">Score: {formatResultSummary(entry.result_data)}</p>
                                  </div>
                                ))}
                              </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClasses;
