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
  ArrowLeft, Plus, Trash2, Edit, Users, BookOpen, Upload, FileCode
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

interface Student {
  user_id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface StudentDomain {
  id: string;
  student_id: string;
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

  // Dialog states
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);

  // Form states
  const [domainName, setDomainName] = useState("");
  const [domainDesc, setDomainDesc] = useState("");
  const [editingDomain, setEditingDomain] = useState<StudentDomain | null>(null);
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
        .select("user_id, email, role, first_name, last_name")
        .eq("role", "student")
        .order("first_name");
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
    setDomains((data as StudentDomain[]) || []);
  }, [toast]);

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    fetchDomains(student.user_id);
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
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Domain Area */}
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
                            </CardContent>
                          </Card>
                        ))}
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

export default AdminStudents;
