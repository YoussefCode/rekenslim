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
  ArrowLeft, Plus, Trash2, Edit, Users, BookOpen, FileText, Upload,
  ChevronRight, Download, HelpCircle
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Student {
  user_id: string;
  email: string;
  role: string;
}

interface StudentDomain {
  id: string;
  student_id: string;
  domain_name: string;
  description: string | null;
  created_at: string;
}

interface StudentMaterial {
  id: string;
  student_domain_id: string;
  title: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
}

interface StudentQuestion {
  id: string;
  student_domain_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
}

const AdminStudents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [domains, setDomains] = useState<StudentDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<StudentDomain | null>(null);
  const [materials, setMaterials] = useState<StudentMaterial[]>([]);
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  // Form states
  const [domainName, setDomainName] = useState("");
  const [domainDesc, setDomainDesc] = useState("");
  const [editingDomain, setEditingDomain] = useState<StudentDomain | null>(null);

  const [materialTitle, setMaterialTitle] = useState("");
  const [materialContent, setMaterialContent] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [questionText, setQuestionText] = useState("");
  const [questionOptions, setQuestionOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<StudentQuestion | null>(null);

  useEffect(() => {
    if (profile?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStudents();
  }, [profile]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, email, role")
        .eq("role", "student")
        .order("email");
      if (error) throw error;
      setStudents(data || []);
    } catch {
      toast({ title: "Fout bij laden leerlingen", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = useCallback(async (studentId: string) => {
    const { data, error } = await supabase
      .from("student_domains")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at");
    if (error) {
      toast({ title: "Fout bij laden domeinen", variant: "destructive" });
      return;
    }
    setDomains(data || []);
  }, [toast]);

  const fetchMaterials = useCallback(async (domainId: string) => {
    const { data, error } = await supabase
      .from("student_materials")
      .select("*")
      .eq("student_domain_id", domainId)
      .order("created_at");
    if (error) return;
    setMaterials(data || []);
  }, []);

  const fetchQuestions = useCallback(async (domainId: string) => {
    const { data, error } = await supabase
      .from("student_questions")
      .select("*")
      .eq("student_domain_id", domainId)
      .order("created_at");
    if (error) return;
    const processed = (data || []).map((q: any) => ({
      ...q,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    }));
    setQuestions(processed);
  }, []);

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedDomain(null);
    setMaterials([]);
    setQuestions([]);
    fetchDomains(student.user_id);
  };

  const selectDomain = (domain: StudentDomain) => {
    setSelectedDomain(domain);
    fetchMaterials(domain.id);
    fetchQuestions(domain.id);
  };

  // Domain CRUD
  const saveDomain = async () => {
    if (!selectedStudent || !domainName.trim()) return;
    try {
      if (editingDomain) {
        await supabase.from("student_domains").update({
          domain_name: domainName,
          description: domainDesc || null,
        }).eq("id", editingDomain.id);
        toast({ title: "Domein bijgewerkt" });
      } else {
        await supabase.from("student_domains").insert({
          student_id: selectedStudent.user_id,
          domain_name: domainName,
          description: domainDesc || null,
        });
        toast({ title: "Domein toegevoegd" });
      }
      setDomainDialogOpen(false);
      setDomainName("");
      setDomainDesc("");
      setEditingDomain(null);
      fetchDomains(selectedStudent.user_id);
    } catch {
      toast({ title: "Fout bij opslaan domein", variant: "destructive" });
    }
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("Dit domein en alle bijbehorende materialen en vragen verwijderen?")) return;
    await supabase.from("student_domains").delete().eq("id", id);
    if (selectedDomain?.id === id) {
      setSelectedDomain(null);
      setMaterials([]);
      setQuestions([]);
    }
    if (selectedStudent) fetchDomains(selectedStudent.user_id);
    toast({ title: "Domein verwijderd" });
  };

  // Material CRUD
  const saveMaterial = async () => {
    if (!selectedDomain || !materialTitle.trim()) return;
    setUploading(true);
    try {
      let fileUrl: string | null = null;
      if (materialFile) {
        const filePath = `${selectedStudent!.user_id}/${selectedDomain.id}/${Date.now()}_${materialFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("student-files")
          .upload(filePath, materialFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("student-files")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }

      await supabase.from("student_materials").insert({
        student_domain_id: selectedDomain.id,
        title: materialTitle,
        content: materialContent || null,
        file_url: fileUrl,
      });

      toast({ title: "Materiaal toegevoegd" });
      setMaterialDialogOpen(false);
      setMaterialTitle("");
      setMaterialContent("");
      setMaterialFile(null);
      fetchMaterials(selectedDomain.id);
    } catch {
      toast({ title: "Fout bij opslaan materiaal", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    await supabase.from("student_materials").delete().eq("id", id);
    if (selectedDomain) fetchMaterials(selectedDomain.id);
    toast({ title: "Materiaal verwijderd" });
  };

  // Question CRUD
  const saveQuestion = async () => {
    if (!selectedDomain || !questionText.trim() || questionOptions.some(o => !o.trim())) return;
    try {
      const payload = {
        student_domain_id: selectedDomain.id,
        question_text: questionText,
        options: JSON.stringify(questionOptions),
        correct_answer: correctAnswer,
        explanation: questionExplanation || null,
      };

      if (editingQuestion) {
        await supabase.from("student_questions").update(payload).eq("id", editingQuestion.id);
        toast({ title: "Vraag bijgewerkt" });
      } else {
        await supabase.from("student_questions").insert(payload);
        toast({ title: "Vraag toegevoegd" });
      }

      setQuestionDialogOpen(false);
      resetQuestionForm();
      fetchQuestions(selectedDomain.id);
    } catch {
      toast({ title: "Fout bij opslaan vraag", variant: "destructive" });
    }
  };

  const deleteQuestion = async (id: string) => {
    await supabase.from("student_questions").delete().eq("id", id);
    if (selectedDomain) fetchQuestions(selectedDomain.id);
    toast({ title: "Vraag verwijderd" });
  };

  const resetQuestionForm = () => {
    setQuestionText("");
    setQuestionOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setQuestionExplanation("");
    setEditingQuestion(null);
  };

  const editQuestionHandler = (q: StudentQuestion) => {
    setEditingQuestion(q);
    setQuestionText(q.question_text);
    setQuestionOptions([...q.options]);
    setCorrectAnswer(q.correct_answer);
    setQuestionExplanation(q.explanation || "");
    setQuestionDialogOpen(true);
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leerling Beheer</h1>
            <p className="text-muted-foreground">Beheer domeinen, lesstof en oefenvragen per leerling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student List */}
          <div className="lg:col-span-3">
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
                      {s.email}
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Domain + Content Area */}
          <div className="lg:col-span-9">
            {!selectedStudent ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecteer een leerling om te beginnen</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Domains */}
                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      Domeinen van {selectedStudent.email}
                    </CardTitle>
                    <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingDomain(null);
                            setDomainName("");
                            setDomainDesc("");
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
                          <Button onClick={saveDomain} className="w-full">
                            Opslaan
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {domains.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nog geen domeinen toegevoegd</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {domains.map((d) => (
                          <div
                            key={d.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedDomain?.id === d.id
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => selectDomain(d)}
                          >
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <div>
                                <p className="font-medium text-sm">{d.domain_name}</p>
                                {d.description && (
                                  <p className="text-xs text-muted-foreground">{d.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDomain(d);
                                  setDomainName(d.domain_name);
                                  setDomainDesc(d.description || "");
                                  setDomainDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDomain(d.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Domain Content */}
                {selectedDomain && (
                  <Tabs defaultValue="materials" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="materials">
                        <FileText className="h-4 w-4 mr-1" /> Lesstof
                      </TabsTrigger>
                      <TabsTrigger value="questions">
                        <HelpCircle className="h-4 w-4 mr-1" /> Oefenvragen
                      </TabsTrigger>
                    </TabsList>

                    {/* Materials Tab */}
                    <TabsContent value="materials" className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">
                          Lesstof - {selectedDomain.domain_name}
                        </h3>
                        <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => {
                                setMaterialTitle("");
                                setMaterialContent("");
                                setMaterialFile(null);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Materiaal
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Nieuw lesmateriaal</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Titel *</Label>
                                <Input
                                  value={materialTitle}
                                  onChange={(e) => setMaterialTitle(e.target.value)}
                                  placeholder="bijv. Uitleg breuken"
                                />
                              </div>
                              <div>
                                <Label>Uitleg / tekst</Label>
                                <Textarea
                                  value={materialContent}
                                  onChange={(e) => setMaterialContent(e.target.value)}
                                  placeholder="Schrijf hier de uitleg..."
                                  rows={5}
                                />
                              </div>
                              <div>
                                <Label>PDF bestand (optioneel)</Label>
                                <Input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) =>
                                    setMaterialFile(e.target.files?.[0] || null)
                                  }
                                />
                              </div>
                              <Button
                                onClick={saveMaterial}
                                className="w-full"
                                disabled={uploading}
                              >
                                {uploading ? "Uploaden..." : "Opslaan"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {materials.length === 0 ? (
                        <Card>
                          <CardContent className="py-8 text-center text-muted-foreground">
                            Nog geen lesmateriaal
                          </CardContent>
                        </Card>
                      ) : (
                        materials.map((m) => (
                          <Card key={m.id}>
                            <CardContent className="py-4 flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="font-medium">{m.title}</p>
                                {m.content && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {m.content}
                                  </p>
                                )}
                                {m.file_url && (
                                  <a
                                    href={m.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary flex items-center gap-1"
                                  >
                                    <Download className="h-3 w-3" /> PDF downloaden
                                  </a>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMaterial(m.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>

                    {/* Questions Tab */}
                    <TabsContent value="questions" className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">
                          Oefenvragen - {selectedDomain.domain_name}
                        </h3>
                        <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={resetQuestionForm}>
                              <Plus className="h-4 w-4 mr-1" /> Vraag
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {editingQuestion ? "Vraag bewerken" : "Nieuwe vraag"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Vraag *</Label>
                                <Textarea
                                  value={questionText}
                                  onChange={(e) => setQuestionText(e.target.value)}
                                  placeholder="Stel je vraag..."
                                />
                              </div>
                              {questionOptions.map((opt, i) => (
                                <div key={i}>
                                  <Label>
                                    Optie {String.fromCharCode(65 + i)}{" "}
                                    {i === correctAnswer && "✓"}
                                  </Label>
                                  <Input
                                    value={opt}
                                    onChange={(e) => {
                                      const newOpts = [...questionOptions];
                                      newOpts[i] = e.target.value;
                                      setQuestionOptions(newOpts);
                                    }}
                                    placeholder={`Antwoord ${String.fromCharCode(65 + i)}`}
                                  />
                                </div>
                              ))}
                              <div>
                                <Label>Correct antwoord</Label>
                                <Select
                                  value={String(correctAnswer)}
                                  onValueChange={(v) => setCorrectAnswer(Number(v))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {questionOptions.map((_, i) => (
                                      <SelectItem key={i} value={String(i)}>
                                        Optie {String.fromCharCode(65 + i)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Uitleg (optioneel)</Label>
                                <Textarea
                                  value={questionExplanation}
                                  onChange={(e) =>
                                    setQuestionExplanation(e.target.value)
                                  }
                                  placeholder="Uitleg bij het antwoord..."
                                />
                              </div>
                              <Button onClick={saveQuestion} className="w-full">
                                Opslaan
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {questions.length === 0 ? (
                        <Card>
                          <CardContent className="py-8 text-center text-muted-foreground">
                            Nog geen oefenvragen
                          </CardContent>
                        </Card>
                      ) : (
                        questions.map((q, idx) => (
                          <Card key={q.id}>
                            <CardContent className="py-4">
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-medium">
                                  {idx + 1}. {q.question_text}
                                </p>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editQuestionHandler(q)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteQuestion(q.id)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid gap-1">
                                {q.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className={`px-3 py-1 rounded text-sm ${
                                      i === q.correct_answer
                                        ? "bg-green-50 border border-green-200 text-green-800"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + i)}. {opt}
                                    {i === q.correct_answer && " ✓"}
                                  </div>
                                ))}
                              </div>
                              {q.explanation && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  💡 {q.explanation}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
