import React, { useState, useEffect, useCallback, useMemo } from "react";
import AdminStudentsDayOverview from "./AdminStudentsDayOverview";
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
  ArrowLeft, Plus, Trash2, Edit, Users, BookOpen, Upload, FileCode, BarChart3, ChevronDown, ChevronUp, UserPlus, UserX, Mail, Send
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  class_domain_id: string | null;
  domain_name: string;
  description: string | null;
  html_file_url: string | null;
  created_at: string;
  classroom_name?: string | null;
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

interface ClassDomainStudentResult {
  student_id: string;
  student_name: string;
  student_email: string;
  submitted_at: string;
  result_data: Record<string, any>;
}

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

const AdminStudents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
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
  const [classResultsByDomain, setClassResultsByDomain] = useState<Record<string, ClassDomainStudentResult[]>>({});
  const [expandedClassResults, setExpandedClassResults] = useState<Record<string, boolean>>({});
  const [loadingClassResults, setLoadingClassResults] = useState(false);

  // Student-class membership
  const [studentClasses, setStudentClasses] = useState<SchoolClass[]>([]);
  const [addingStudentToClassId, setAddingStudentToClassId] = useState("");
  const [addingStudentToClassLoading, setAddingStudentToClassLoading] = useState(false);

  // Message state
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

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

  const formatResultSummary = (resultData: Record<string, any>) => {
    const percentage = resultData?.percentage;
    if (typeof percentage === "number") {
      return `${Math.round(percentage)}%`;
    }

    const score = resultData?.score;
    const totalQuestions = resultData?.totalQuestions ?? resultData?.total_questions;
    if (typeof score === "number" && typeof totalQuestions === "number" && totalQuestions > 0) {
      const pct = Math.round((score / totalQuestions) * 100);
      return `${score}/${totalQuestions} (${pct}%)`;
    }

    return "Resultaat beschikbaar";
  };

  const studentDomainOverview = useMemo(() => {
    return domains
      .map((domain) => {
        const attempts = (domainResults[domain.id] || []).map((entry) => ({
          ...entry,
          percentage: getResultPercentage(entry.result_data),
        }));

        const attemptsWithScore = attempts.filter(
          (entry): entry is DomainResult & { percentage: number } =>
            typeof entry.percentage === "number"
        );

        if (attemptsWithScore.length === 0) {
          return null;
        }

        const percentages = attemptsWithScore.map((entry) => entry.percentage);
        const latest = attemptsWithScore[0]?.percentage ?? 0;
        const average = Math.round(
          percentages.reduce((sum, value) => sum + value, 0) / percentages.length
        );
        const best = Math.max(...percentages);

        return {
          domainId: domain.id,
          domainName: domain.domain_name,
          attempts: attemptsWithScore.length,
          latest,
          average,
          best,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [domains, domainResults]);

  const domainOverviewChartData = useMemo(
    () =>
      studentDomainOverview.map((entry) => ({
        domein: entry.domainName,
        gemiddeld: entry.average,
        beste: entry.best,
        laatste: entry.latest,
      })),
    [studentDomainOverview]
  );

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) => {
      const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim().toLowerCase();
      const email = (student.email || "").toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [studentSearch, students]);

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

    const domainIds = domainList.map((d) => d.id);
    const classDomainIds = [
      ...new Set(
        domainList
          .map((domain) => domain.class_domain_id)
          .filter((value): value is string => Boolean(value))
      ),
    ];

    const classNameById = new Map(classes.map((c) => [c.id, c.name]));

    const [classDomainResponse, resultsResponse] = await Promise.all([
      classDomainIds.length > 0
        ? supabase
            .from("class_domains")
            .select("id, class_id")
            .in("id", classDomainIds)
        : Promise.resolve({ data: [], error: null } as { data: any[]; error: null }),
      domainIds.length > 0
        ? supabase
            .from("student_domain_results" as any)
            .select("id, student_domain_id, result_data, submitted_at")
            .in("student_domain_id", domainIds)
            .order("submitted_at", { ascending: false })
        : Promise.resolve({ data: [], error: null } as { data: any[]; error: null }),
    ]);

    let classroomByClassDomainId = new Map<string, string>();

    if (!classDomainResponse.error && classDomainIds.length > 0) {
      const classDomainsWithClass = (classDomainResponse.data || []) as Array<{ id: string; class_id: string }>;
      classroomByClassDomainId = new Map(
        classDomainsWithClass.map((row) => [row.id, classNameById.get(row.class_id) || "Onbekend klaslokaal"])
      );
    }

    const enrichedDomains = domainList.map((domain) => ({
      ...domain,
      classroom_name: domain.class_domain_id ? classroomByClassDomainId.get(domain.class_domain_id) || null : null,
    }));

    setDomains(enrichedDomains);

    // Results are loaded in parallel with classroom metadata.
    if (domainIds.length > 0) {
      const resultsData = (resultsResponse as any).data;
      const grouped: Record<string, DomainResult[]> = {};
      ((resultsData as any[]) || []).forEach((r: any) => {
        if (!grouped[r.student_domain_id]) grouped[r.student_domain_id] = [];
        grouped[r.student_domain_id].push(r);
      });
      setDomainResults(grouped);
    } else {
      setDomainResults({});
    }
  }, [toast, classes]);

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

      const studentDomains = (studentDomainsData || []) as Array<{
        id: string;
        class_domain_id: string | null;
        student_id: string;
      }>;

      if (studentDomains.length === 0) {
        setClassResultsByDomain({});
        return;
      }

      const studentIds = [...new Set(studentDomains.map((sd) => sd.student_id))];
      const studentDomainIds = studentDomains.map((sd) => sd.id);

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, email, first_name, last_name")
        .in("user_id", studentIds);
      if (profilesError) throw profilesError;

      const profileById = new Map(
        ((profilesData as any[]) || []).map((p) => [p.user_id, p])
      );

      const { data: resultsData, error: resultsError } = await supabase
        .from("student_domain_results" as any)
        .select("student_domain_id, result_data, submitted_at")
        .in("student_domain_id", studentDomainIds)
        .order("submitted_at", { ascending: false });
      if (resultsError) throw resultsError;

      const studentDomainById = new Map(
        studentDomains.map((sd) => [sd.id, sd])
      );

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

      Object.keys(grouped).forEach((domainId) => {
        grouped[domainId].sort(
          (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
        );
      });

      setClassResultsByDomain(grouped);
    } catch (error) {
      console.error("Fout bij laden klasresultaten:", error);
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

    const classDomainIds = classDomains.map((d) => d.id);
    fetchClassResults(classDomainIds);
  }, [selectedClass?.id, classDomains]);

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

  const fetchStudentClasses = async (studentId: string) => {
    const { data: links, error: linksError } = await supabase
      .from("class_students")
      .select("class_id")
      .eq("student_id", studentId);

    if (linksError) {
      toast({ title: "Fout bij laden klassen van leerling", variant: "destructive" });
      return;
    }

    const classIds = ((links as { class_id: string }[]) || []).map((x) => x.class_id);
    if (classIds.length === 0) {
      setStudentClasses([]);
      return;
    }

    const { data, error } = await supabase
      .from("classes")
      .select("id, name, description, created_at")
      .in("id", classIds);

    if (error) {
      toast({ title: "Fout bij laden klassen", variant: "destructive" });
      return;
    }

    setStudentClasses((data as SchoolClass[]) || []);
  };

  const addStudentToClassFromDetail = async () => {
    if (!selectedStudent || !addingStudentToClassId) return;

    setAddingStudentToClassLoading(true);
    try {
      const { error: linkError } = await supabase.from("class_students").insert({
        class_id: addingStudentToClassId,
        student_id: selectedStudent.user_id,
      });
      if (linkError) throw linkError;

      // Fan out class domains to student
      const { data: sourceDomains } = await supabase
        .from("class_domains")
        .select("id, domain_name, description, html_file_url")
        .eq("class_id", addingStudentToClassId);

      const fanoutRows = ((sourceDomains as any[]) || []).map((d) => ({
        student_id: selectedStudent.user_id,
        class_domain_id: d.id,
        domain_name: d.domain_name,
        description: d.description,
        html_file_url: d.html_file_url,
      }));

      if (fanoutRows.length > 0) {
        await supabase
          .from("student_domains")
          .upsert(fanoutRows, { onConflict: "student_id,class_domain_id" });
      }

      toast({ title: "Leerling toegevoegd aan klas" });
      setAddingStudentToClassId("");
      fetchStudentClasses(selectedStudent.user_id);
      fetchDomains(selectedStudent.user_id);
    } catch (error) {
      console.error("Fout bij toevoegen aan klas:", error);
      toast({ title: "Fout bij toevoegen aan klas", variant: "destructive" });
    } finally {
      setAddingStudentToClassLoading(false);
    }
  };

  const removeStudentFromClassFromDetail = async (classId: string) => {
    if (!selectedStudent) return;
    if (!confirm("Deze leerling uit de klas verwijderen?")) return;

    try {
      const { error: unlinkError } = await supabase
        .from("class_students")
        .delete()
        .eq("class_id", classId)
        .eq("student_id", selectedStudent.user_id);
      if (unlinkError) throw unlinkError;

      // Clean up student_domains linked to class_domains of that class
      const { data: cDomains } = await supabase
        .from("class_domains")
        .select("id")
        .eq("class_id", classId);

      const cDomainIds = ((cDomains as { id: string }[]) || []).map((d) => d.id);
      if (cDomainIds.length > 0) {
        await supabase
          .from("student_domains")
          .delete()
          .eq("student_id", selectedStudent.user_id)
          .in("class_domain_id", cDomainIds);
      }

      toast({ title: "Leerling uit klas verwijderd" });
      fetchStudentClasses(selectedStudent.user_id);
      fetchDomains(selectedStudent.user_id);
    } catch (error) {
      console.error("Fout bij verwijderen uit klas:", error);
      toast({ title: "Fout bij verwijderen uit klas", variant: "destructive" });
    }
  };

  const sendMessageToStudent = async () => {
    if (!selectedStudent) return;
    const subject = messageSubject.trim();
    const message = messageBody.trim();

    if (!subject || !message) {
      toast({ title: "Onderwerp en bericht zijn verplicht", variant: "destructive" });
      return;
    }

    setSendingMessage(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-student-message", {
        body: {
          to: selectedStudent.email,
          subject,
          message,
        },
      });

      if (error) {
        const msg = typeof error === "object" && "message" in error ? error.message : String(error);
        throw new Error(msg);
      }

      // The function returns JSON – check for application-level errors
      if (data?.error) {
        throw new Error(data.error);
      }

      toast({ title: "Bericht verzonden", description: `E-mail verstuurd naar ${selectedStudent.email}` });
      setMessageSubject("");
      setMessageBody("");
    } catch (error) {
      console.error("Fout bij verzenden bericht:", error);
      toast({
        title: "Fout bij verzenden bericht",
        description: error instanceof Error ? error.message : "Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const selectStudent = (student: Student) => {
    setSelectedClass(null);
    setClassStudents([]);
    setClassDomains([]);
    setSelectedStudent(student);
    setStudentFirstName(student.first_name || "");
    setStudentLastName(student.last_name || "");
    setAddingStudentToClassId("");
    setMessageSubject("");
    setMessageBody("");
    fetchDomains(student.user_id);
    fetchStudentClasses(student.user_id);
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
                <Input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Zoek op naam of e-mail"
                  className="mb-2"
                />

                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Geen leerlingen gevonden</p>
                ) : filteredStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Geen resultaten voor je zoekopdracht</p>
                ) : (
                  filteredStudents.map((s) => (
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

          </div>

          {/* Domain Area */}
          <div className="lg:col-span-9">
              {selectedStudent ? (
                <Tabs defaultValue="gegevens" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="gegevens">Gegevens</TabsTrigger>
                    <TabsTrigger value="klassen">Klassen ({studentClasses.length})</TabsTrigger>
                    <TabsTrigger value="domeinen">Domeinen ({domains.length})</TabsTrigger>
                    <TabsTrigger value="analyse">Analyse</TabsTrigger>
                    <TabsTrigger value="berichten">
                      <Mail className="h-3.5 w-3.5 mr-1" /> Berichten
                    </TabsTrigger>
                    <TabsTrigger value="dagoverzicht">Dagoverzicht</TabsTrigger>
                  </TabsList>
                  {/* Tab: Dagoverzicht */}
                  <TabsContent value="dagoverzicht">
                    <AdminStudentsDayOverview showBackButton onBack={() => navigate("/admin")}/>
                  </TabsContent>

                  {/* Tab: Gegevens */}
                  <TabsContent value="gegevens">
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
                  </TabsContent>

                  {/* Tab: Klassen */}
                  <TabsContent value="klassen">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Klassen</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                          <div className="md:col-span-2">
                            <Label>Toevoegen aan klas</Label>
                            <select
                              value={addingStudentToClassId}
                              onChange={(e) => setAddingStudentToClassId(e.target.value)}
                              className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="">Kies klas</option>
                              {classes
                                .filter((c) => !studentClasses.some((sc) => sc.id === c.id))
                                .map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                          </div>
                          <Button
                            onClick={addStudentToClassFromDetail}
                            disabled={addingStudentToClassLoading || !addingStudentToClassId}
                          >
                            {addingStudentToClassLoading ? "Toevoegen..." : "Toevoegen"}
                          </Button>
                        </div>

                        {studentClasses.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Deze leerling zit nog in geen enkele klas.</p>
                        ) : (
                          <div className="space-y-2">
                            {studentClasses.map((c) => (
                              <div key={c.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                                <div>
                                  <p className="text-sm font-medium">{c.name}</p>
                                  {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => removeStudentFromClassFromDetail(c.id)}>
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab: Domeinen */}
                  <TabsContent value="domeinen">
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
                                        <p className="font-medium">
                                          {d.domain_name}
                                          {d.classroom_name ? ` • Klaslokaal: ${d.classroom_name}` : ""}
                                        </p>
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
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab: Analyse */}
                  <TabsContent value="analyse">
                    <div className="space-y-4">
                      {domainOverviewChartData.length > 0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Overzicht per domein</CardTitle>
                            <p className="text-xs text-muted-foreground">Gemiddelde, beste en laatste score per domein</p>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={domainOverviewChartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="domein" tick={{ fontSize: 12 }} />
                                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                                  <Legend />
                                  <Bar dataKey="gemiddeld" name="Gemiddeld" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="beste" name="Beste" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="laatste" name="Laatste" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {domains.filter((d) => (domainResults[d.id] || []).length > 0).length === 0 && domainOverviewChartData.length === 0 && (
                        <Card>
                          <CardContent className="py-8 text-center text-muted-foreground">
                            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <p>Nog geen resultaten beschikbaar voor analyse.</p>
                          </CardContent>
                        </Card>
                      )}

                      {domains.map((d) => {
                        const results = domainResults[d.id] || [];
                        if (results.length === 0) return null;
                        return (
                          <Card key={`analyse-${d.id}`}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{d.domain_name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="rounded-md border bg-muted/20 p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Trend per poging</p>
                                <div className="h-44 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                      data={results
                                        .slice()
                                        .sort(
                                          (a, b) =>
                                            new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
                                        )
                                        .map((result, index) => ({
                                          poging: index + 1,
                                          percentage: getResultPercentage(result.result_data),
                                        }))
                                        .filter((entry) => typeof entry.percentage === "number")}
                                      margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="poging" allowDecimals={false} tick={{ fontSize: 12 }} />
                                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                      <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                                      <Line
                                        type="monotone"
                                        dataKey="percentage"
                                        stroke="#1d4ed8"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <button
                                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setExpandedResults((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
                              >
                                <BarChart3 className="h-3 w-3" />
                                {results.length} resultaat{results.length !== 1 ? 'en' : ''}
                                {expandedResults[d.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              </button>
                              {expandedResults[d.id] && (
                                <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
                                  {results.map((r) => (
                                    <DomainResultCard
                                      key={r.id}
                                      resultData={r.result_data}
                                      submittedAt={r.submitted_at}
                                    />
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* Tab: Berichten */}
                  <TabsContent value="berichten">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Bericht sturen</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Stuur een e-mail naar {selectedStudent.first_name || selectedStudent.email}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="msg-to">Aan</Label>
                          <Input
                            id="msg-to"
                            value={selectedStudent.email}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="msg-subject">Onderwerp</Label>
                          <Input
                            id="msg-subject"
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                            placeholder="bijv. Huiswerk deze week"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="msg-body">Bericht</Label>
                          <Textarea
                            id="msg-body"
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            placeholder="Typ hier je bericht..."
                            rows={6}
                          />
                        </div>
                        <Button
                          onClick={sendMessageToStudent}
                          disabled={sendingMessage || !messageSubject.trim() || !messageBody.trim()}
                          className="w-full sm:w-auto"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {sendingMessage ? "Verzenden..." : "Verstuur e-mail"}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
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
  );
};

export default AdminStudents;
