import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, Plus, Trash2, Edit, Users, BookOpen, Upload, FileCode, BarChart3, ChevronDown, ChevronUp, UserPlus, UserX
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import DomainResultCard from "@/components/DomainResultCard";

interface Student {
  user_id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  last_login_at: string | null;
}

interface StudentDomain {
  id: string;
  student_id: string;
  domain_name: string;
  description: string | null;
  html_file_url: string | null;
  created_at: string;
}

interface DomainResult {
  id: string;
  student_domain_id: string;
  result_data: Record<string, any>;
  submitted_at: string;
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

const AdminStudents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [domains, setDomains] = useState<StudentDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [domainResults, setDomainResults] = useState<Record<string, DomainResult[]>>({});
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});

  // Dialog states
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);

  // Form states
  const [domainName, setDomainName] = useState("");
  const [domainDesc, setDomainDesc] = useState("");
  const [editingDomain, setEditingDomain] = useState<StudentDomain | null>(null);
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [newStudentPasswordConfirm, setNewStudentPasswordConfirm] = useState("");
  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");

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

  const formatLastLogin = (value: string | null) => {
    if (!value) return "Nog nooit ingelogd";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Onbekend";

    return new Intl.DateTimeFormat("nl-NL", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  const formatAddedAt = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Onbekend";

    return new Intl.DateTimeFormat("nl-NL", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  useEffect(() => {
    if (profile?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStudents();
    fetchClasses();
  }, [profile]);

  const fetchStudents = async () => {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc("get_students_with_last_login");
      if (!rpcError) {
        setStudents((rpcData as Student[] | null) || []);
        return;
      }

      const { data: tableData, error: tableError } = await supabase
        .from("profiles")
        .select("user_id, email, role, first_name, last_name, last_login_at")
        .eq("role", "student")
        .order("first_name");

      if (!tableError) {
        setStudents(tableData || []);
        return;
      }

      // Last fallback for databases that do not have the new column.
      if (tableError.code === "42703" || rpcError.code === "42883") {
        const { data: basicData, error: basicError } = await supabase
          .from("profiles")
          .select("user_id, email, role, first_name, last_name")
          .eq("role", "student")
          .order("first_name");

        if (basicError) throw basicError;

        setStudents(
          (basicData || []).map((s) => ({
            ...s,
            last_login_at: null,
          }))
        );
        return;
      }

      throw tableError;
    } catch (error) {
      console.error("Fout bij laden leerlingen:", error);
      toast({
        title: "Fout bij laden leerlingen",
        description: "Controleer of je rechten en database-migraties up-to-date zijn.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = useCallback(async (studentId: string) => {
    const { data, error } = await supabase
      .from("student_domains")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Fout bij laden domeinen", variant: "destructive" });
      return;
    }
    const domainList = (data as StudentDomain[]) || [];
    setDomains(domainList);

    // Fetch results for all domains
    if (domainList.length > 0) {
      const domainIds = domainList.map((d) => d.id);
      const { data: resultsData } = await supabase
        .from("student_domain_results" as any)
        .select("id, student_domain_id, result_data, submitted_at")
        .in("student_domain_id", domainIds)
        .order("submitted_at", { ascending: false });

      const grouped: Record<string, DomainResult[]> = {};
      ((resultsData as any[]) || []).forEach((r: any) => {
        if (!grouped[r.student_domain_id]) grouped[r.student_domain_id] = [];
        grouped[r.student_domain_id].push(r);
      });
      setDomainResults(grouped);
    } else {
      setDomainResults({});
    }
  }, [toast]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("id, name, description, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClasses((data as SchoolClass[]) || []);
    } catch (error) {
      console.error("Fout bij laden klassen:", error);
      toast({ title: "Fout bij laden klassen", variant: "destructive" });
    }
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

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, email, role, first_name, last_name, last_login_at")
      .in("user_id", ids)
      .eq("role", "student");

    if (profilesError) {
      toast({ title: "Fout bij laden klasleerlingen", variant: "destructive" });
      return;
    }

    setClassStudents((profilesData as Student[]) || []);
  };

  const fetchClassDomains = async (classId: string) => {
    const { data, error } = await supabase
      .from("class_domains")
      .select("id, class_id, domain_name, description, html_file_url, created_at")
      .eq("class_id", classId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Fout bij laden klasdomeinen", variant: "destructive" });
      return;
    }

    setClassDomains((data as ClassDomain[]) || []);
  };

  const selectClass = (schoolClass: SchoolClass) => {
    setSelectedStudent(null);
    setDomains([]);
    setDomainResults({});
    setSelectedClass(schoolClass);
    fetchClassStudents(schoolClass.id);
    fetchClassDomains(schoolClass.id);
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
        .insert({
          name,
          description: description || null,
          created_by: user?.id ?? null,
        })
        .select("id, name, description, created_at")
        .single();

      if (error) throw error;

      toast({ title: "Klas aangemaakt" });
      setNewClassName("");
      setNewClassDescription("");
      fetchClasses();
      if (data) {
        selectClass(data as SchoolClass);
      }
    } catch (error) {
      console.error("Fout bij aanmaken klas:", error);
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

      toast({ title: "Leerling toegevoegd aan klas" });
      setSelectedStudentForClass("");
      fetchClassStudents(selectedClass.id);
    } catch (error) {
      console.error("Fout bij toevoegen leerling aan klas:", error);
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
      fetchClassStudents(selectedClass.id);
    } catch (error) {
      console.error("Fout bij verwijderen uit klas:", error);
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

        const { data: urlData } = supabase.storage
          .from("student-files")
          .getPublicUrl(filePath);
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

      toast({ title: "Klasdomein toegevoegd" });
      setNewClassDomainName("");
      setNewClassDomainDescription("");
      setNewClassDomainHtmlFile(null);
      fetchClassDomains(selectedClass.id);
    } catch (error) {
      console.error("Fout bij toevoegen klasdomein:", error);
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
      fetchClassDomains(selectedClass.id);
    } catch (error) {
      console.error("Fout bij verwijderen klasdomein:", error);
      toast({ title: "Fout bij verwijderen klasdomein", variant: "destructive" });
    } finally {
      setDeletingClassDomainId(null);
    }
  };

  const selectStudent = (student: Student) => {
    setSelectedClass(null);
    setClassStudents([]);
    setClassDomains([]);
    setSelectedStudent(student);
    setStudentFirstName(student.first_name || "");
    setStudentLastName(student.last_name || "");
    fetchDomains(student.user_id);
  };

  const saveStudentName = async () => {
    if (!selectedStudent) return;
    try {
      const nextFirstName = studentFirstName.trim();
      const nextLastName = studentLastName.trim();

      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: nextFirstName,
          last_name: nextLastName,
        })
        .eq("user_id", selectedStudent.user_id)
        .select("user_id, first_name, last_name");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Geen rechten om deze leerling te wijzigen.");
      }

      toast({ title: "Naam bijgewerkt" });
      setSelectedStudent((prev) =>
        prev ? { ...prev, first_name: nextFirstName, last_name: nextLastName } : prev
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === selectedStudent.user_id
            ? { ...s, first_name: nextFirstName, last_name: nextLastName }
            : s
        )
      );
      fetchStudents();
    } catch (error) {
      console.error("Fout bij opslaan naam:", error);
      toast({
        title: "Fout bij opslaan naam",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  const createStudent = async () => {
    const email = newStudentEmail.trim().toLowerCase();
    const password = newStudentPassword;
    const firstName = newStudentFirstName.trim();
    const lastName = newStudentLastName.trim();

    if (!email || !password) {
      toast({
        title: "E-mail en wachtwoord zijn verplicht",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Wachtwoord te kort",
        description: "Gebruik minimaal 6 tekens.",
        variant: "destructive",
      });
      return;
    }

    if (password !== newStudentPasswordConfirm) {
      toast({
        title: "Wachtwoorden komen niet overeen",
        description: "Controleer de bevestiging van het wachtwoord.",
        variant: "destructive",
      });
      return;
    }

    setCreatingStudent(true);
    try {
      const { error } = await supabase.functions.invoke("admin-create-student", {
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      });

      if (error) throw error;

      toast({
        title: "Leerling aangemaakt",
        description: "De leerling kan nu inloggen met e-mail en wachtwoord.",
      });

      setNewStudentEmail("");
      setNewStudentPassword("");
      setNewStudentPasswordConfirm("");
      setNewStudentFirstName("");
      setNewStudentLastName("");
      fetchStudents();
    } catch (error) {
      console.error("Fout bij aanmaken leerling:", error);
      toast({
        title: "Fout bij aanmaken leerling",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setCreatingStudent(false);
    }
  };

  const deleteStudent = async () => {
    if (!selectedStudent) return;

    const displayName = selectedStudent.first_name || selectedStudent.last_name
      ? `${selectedStudent.first_name || ""} ${selectedStudent.last_name || ""}`.trim()
      : selectedStudent.email;

    if (!confirm(`Deze leerling verwijderen?\n\n${displayName} (${selectedStudent.email})\n\nDit verwijdert ook gekoppelde domeinen en resultaten.`)) {
      return;
    }

    setDeletingStudent(true);
    try {
      const { error } = await supabase.functions.invoke("admin-delete-student", {
        body: {
          userId: selectedStudent.user_id,
        },
      });

      if (error) throw error;

      toast({ title: "Leerling verwijderd" });
      setSelectedStudent(null);
      setDomains([]);
      setDomainResults({});
      fetchStudents();
    } catch (error) {
      console.error("Fout bij verwijderen leerling:", error);
      toast({
        title: "Fout bij verwijderen leerling",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setDeletingStudent(false);
    }
  };

  const saveDomain = async () => {
    if (!selectedStudent || !domainName.trim()) return;
    setUploading(true);
    try {
      let htmlFileUrl: string | null = editingDomain?.html_file_url || null;

      if (htmlFile) {
        const filePath = `${selectedStudent.user_id}/${Date.now()}_${htmlFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("student-files")
          .upload(filePath, htmlFile, { contentType: "text/html" });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("student-files")
          .getPublicUrl(filePath);
        htmlFileUrl = urlData.publicUrl;
      }

      if (editingDomain) {
        await supabase.from("student_domains").update({
          domain_name: domainName,
          description: domainDesc || null,
          html_file_url: htmlFileUrl,
        }).eq("id", editingDomain.id);
        toast({ title: "Domein bijgewerkt" });
      } else {
        await supabase.from("student_domains").insert({
          student_id: selectedStudent.user_id,
          domain_name: domainName,
          description: domainDesc || null,
          html_file_url: htmlFileUrl,
        });
        toast({ title: "Domein toegevoegd" });
      }
      setDomainDialogOpen(false);
      setDomainName("");
      setDomainDesc("");
      setHtmlFile(null);
      setEditingDomain(null);
      fetchDomains(selectedStudent.user_id);
    } catch {
      toast({ title: "Fout bij opslaan domein", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("Dit domein verwijderen?")) return;
    await supabase.from("student_domains").delete().eq("id", id);
    if (selectedStudent) fetchDomains(selectedStudent.user_id);
    toast({ title: "Domein verwijderd" });
  };

  const uploadHtmlForDomain = async (domain: StudentDomain, file: File) => {
    if (!selectedStudent) return;
    try {
      const filePath = `${selectedStudent.user_id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("student-files")
        .upload(filePath, file, { contentType: "text/html" });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      await supabase.from("student_domains").update({
        html_file_url: urlData.publicUrl,
      }).eq("id", domain.id);

      toast({ title: "HTML bestand geüpload" });
      fetchDomains(selectedStudent.user_id);
    } catch {
      toast({ title: "Fout bij uploaden", variant: "destructive" });
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
            <h1 className="text-3xl font-bold text-foreground">Leerling Beheer</h1>
            <p className="text-muted-foreground">Beheer domeinen per leerling — upload een HTML bestand met vragen en uitleg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student List */}
          <div className="lg:col-span-3">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Leerling toevoegen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="E-mail"
                />
                <Input
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="Wachtwoord"
                />
                <Input
                  type="password"
                  value={newStudentPasswordConfirm}
                  onChange={(e) => setNewStudentPasswordConfirm(e.target.value)}
                  placeholder="Bevestig wachtwoord"
                />
                <Input
                  value={newStudentFirstName}
                  onChange={(e) => setNewStudentFirstName(e.target.value)}
                  placeholder="Voornaam (optioneel)"
                />
                <Input
                  value={newStudentLastName}
                  onChange={(e) => setNewStudentLastName(e.target.value)}
                  placeholder="Achternaam (optioneel)"
                />
                <Button className="w-full" onClick={createStudent} disabled={creatingStudent}>
                  {creatingStudent ? "Aanmaken..." : "Maak leerling aan"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> Leerlingen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Geen leerlingen gevonden</p>
                ) : (
                  students.map((s) => (
                    <button
                      key={s.user_id}
                      onClick={() => selectStudent(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedStudent?.user_id === s.user_id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="font-medium">
                        {s.first_name || s.last_name
                          ? `${s.first_name} ${s.last_name}`.trim()
                          : s.email}
                      </span>
                      {(s.first_name || s.last_name) && (
                        <span className="block text-xs opacity-70">{s.email}</span>
                      )}
                      <span className="block text-xs opacity-70">
                        Laatste login: {formatLastLogin(s.last_login_at)}
                      </span>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Klas toevoegen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Klasnaam"
                />
                <Textarea
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Beschrijving (optioneel)"
                />
                <Button className="w-full" onClick={createClass} disabled={creatingClass}>
                  {creatingClass ? "Aanmaken..." : "Maak klas aan"}
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedClass?.id === c.id ? "bg-secondary" : "hover:bg-muted"
                      }`}
                    >
                      <span className="font-medium block">{c.name}</span>
                      {c.description && (
                        <span className="text-xs text-muted-foreground block">{c.description}</span>
                      )}
                      <span className="text-xs text-muted-foreground block">
                        Toegevoegd op: {formatAddedAt(c.created_at)}
                      </span>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Domain Area */}
          <div className="lg:col-span-9">
            <div className="space-y-4">
              {selectedClass ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Klas: {selectedClass.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {selectedClass.description || "Geen beschrijving"}
                      </p>
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
                                  {(s.first_name || s.last_name)
                                    ? `${s.first_name || ""} ${s.last_name || ""}`.trim()
                                    : s.email}
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
                              <button
                                className="text-left flex-1"
                                onClick={() => selectStudent(s)}
                              >
                                <p className="text-sm font-medium">
                                  {(s.first_name || s.last_name)
                                    ? `${s.first_name || ""} ${s.last_name || ""}`.trim()
                                    : s.email}
                                </p>
                                <p className="text-xs text-muted-foreground">{s.email}</p>
                              </button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStudentFromSelectedClass(s.user_id)}
                              >
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
                        <Input
                          value={newClassDomainName}
                          onChange={(e) => setNewClassDomainName(e.target.value)}
                          placeholder="Naam lesmateriaal"
                        />
                        <Input
                          type="file"
                          accept=".html,.htm"
                          onChange={(e) => setNewClassDomainHtmlFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <Textarea
                        value={newClassDomainDescription}
                        onChange={(e) => setNewClassDomainDescription(e.target.value)}
                        placeholder="Beschrijving (optioneel)"
                      />
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
                                {d.description && (
                                  <p className="text-xs text-muted-foreground">{d.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Toegevoegd op: {formatAddedAt(d.created_at)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteClassDomain(d.id)}
                                disabled={deletingClassDomainId === d.id}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>Selecteer een klas om leerlingen en klassikaal lesmateriaal te beheren.</p>
                  </CardContent>
                </Card>
              )}

              {selectedStudent ? (
                <>
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Leerlinggegevens</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={deleteStudent}
                      disabled={deletingStudent}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      {deletingStudent ? "Verwijderen..." : "Verwijder leerling"}
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-first-name">Voornaam</Label>
                      <Input
                        id="student-first-name"
                        value={studentFirstName}
                        onChange={(e) => setStudentFirstName(e.target.value)}
                        placeholder="Voornaam"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-last-name">Achternaam</Label>
                      <Input
                        id="student-last-name"
                        value={studentLastName}
                        onChange={(e) => setStudentLastName(e.target.value)}
                        placeholder="Achternaam"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button onClick={saveStudentName}>
                        Sla naam op
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      Domeinen van {selectedStudent.first_name || selectedStudent.last_name
                        ? `${selectedStudent.first_name} ${selectedStudent.last_name}`.trim()
                        : selectedStudent.email}
                    </CardTitle>
                    <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingDomain(null);
                            setDomainName("");
                            setDomainDesc("");
                            setHtmlFile(null);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Domein
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingDomain ? "Domein bewerken" : "Nieuw domein"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Naam *</Label>
                            <Input
                              value={domainName}
                              onChange={(e) => setDomainName(e.target.value)}
                              placeholder="bijv. Breuken"
                            />
                          </div>
                          <div>
                            <Label>Beschrijving</Label>
                            <Textarea
                              value={domainDesc}
                              onChange={(e) => setDomainDesc(e.target.value)}
                              placeholder="Korte beschrijving van het domein"
                            />
                          </div>
                          <div>
                            <Label>HTML bestand (vragen + uitleg)</Label>
                            <Input
                              type="file"
                              accept=".html,.htm"
                              onChange={(e) => setHtmlFile(e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload een HTML bestand met daarin de vragen en uitleg
                            </p>
                          </div>
                          <Button onClick={saveDomain} className="w-full" disabled={uploading}>
                            {uploading ? "Uploaden..." : "Opslaan"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {domains.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nog geen domeinen toegevoegd</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {domains.map((d) => (
                          <Card key={d.id} className="border">
                            <CardContent className="py-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <BookOpen className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="font-medium">{d.domain_name}</p>
                                    {d.description && (
                                      <p className="text-xs text-muted-foreground">{d.description}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Toegevoegd op: {formatAddedAt(d.created_at)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {d.html_file_url ? (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                          <FileCode className="h-3 w-3" /> HTML bestand gekoppeld
                                        </span>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">Geen HTML bestand</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {/* Upload/replace HTML */}
                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept=".html,.htm"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadHtmlForDomain(d, file);
                                        e.target.value = "";
                                      }}
                                    />
                                    <Button variant="ghost" size="sm" asChild>
                                      <span>
                                        <Upload className="h-3 w-3" />
                                      </span>
                                    </Button>
                                  </label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingDomain(d);
                                      setDomainName(d.domain_name);
                                      setDomainDesc(d.description || "");
                                      setHtmlFile(null);
                                      setDomainDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteDomain(d.id)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              {d.html_file_url && (
                                <div className="mt-3">
                                  <a
                                    href={d.html_file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    Bekijk HTML bestand →
                                  </a>
                                </div>
                              )}

                              {/* Results section */}
                              {(domainResults[d.id] || []).length > 0 && (
                                <div className="mt-3 border-t pt-3">
                                  <button
                                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setExpandedResults((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
                                  >
                                    <BarChart3 className="h-3 w-3" />
                                    {domainResults[d.id].length} resultaat{domainResults[d.id].length !== 1 ? 'en' : ''}
                                    {expandedResults[d.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  </button>
                                  {expandedResults[d.id] && (
                                    <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
                                      {domainResults[d.id].map((r) => (
                                        <DomainResultCard
                                          key={r.id}
                                          resultData={r.result_data}
                                          submittedAt={r.submitted_at}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Selecteer een leerling voor individueel lesmateriaal en resultaten.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
