import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import {
  ArrowLeft, BookOpen, FileText, Download, HelpCircle, CheckCircle, XCircle, ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StudentDomain {
  id: string;
  domain_name: string;
  description: string | null;
}

interface StudentMaterial {
  id: string;
  title: string;
  content: string | null;
  file_url: string | null;
}

interface StudentQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [domains, setDomains] = useState<StudentDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<StudentDomain | null>(null);
  const [materials, setMaterials] = useState<StudentMaterial[]>([]);
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchDomains();
  }, [user, authLoading]);

  const fetchDomains = async () => {
    try {
      const { data, error } = await supabase
        .from("student_domains")
        .select("id, domain_name, description")
        .eq("student_id", user!.id)
        .order("created_at");
      if (error) throw error;
      setDomains(data || []);
    } catch {
      toast({ title: "Fout bij laden", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openDomain = async (domain: StudentDomain) => {
    setSelectedDomain(domain);
    setQuizActive(false);
    setQuizFinished(false);

    const [matRes, qRes] = await Promise.all([
      supabase
        .from("student_materials")
        .select("id, title, content, file_url")
        .eq("student_domain_id", domain.id)
        .order("created_at"),
      supabase
        .from("student_questions")
        .select("*")
        .eq("student_domain_id", domain.id)
        .order("created_at"),
    ]);

    setMaterials(matRes.data || []);
    const processedQ = (qRes.data || []).map((q: any) => ({
      ...q,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    }));
    setQuestions(processedQ);
  };

  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizFinished(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === questions[currentQ].correct_answer) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentQ + 1 >= questions.length) {
      setQuizFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  // Quiz finished view
  if (quizActive && quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Oefening Afgerond!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-5xl font-bold text-primary">{percentage}%</p>
              <p className="text-muted-foreground">
                {score} van {questions.length} goed
              </p>
              <Progress value={percentage} className="h-3" />
              <div className="flex gap-3 justify-center pt-4">
                <Button onClick={startQuiz}>Opnieuw</Button>
                <Button variant="outline" onClick={() => setQuizActive(false)}>
                  Terug naar domein
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active quiz
  if (quizActive && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-xl">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setQuizActive(false)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Stop
            </Button>
            <span className="text-sm text-muted-foreground">
              Vraag {currentQ + 1} / {questions.length}
            </span>
          </div>
          <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2 mb-6" />

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg font-semibold">{q.question_text}</p>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let style = "border hover:bg-muted cursor-pointer";
                  if (showResult) {
                    if (i === q.correct_answer) style = "border-green-500 bg-green-50 text-green-800";
                    else if (i === selectedAnswer) style = "border-destructive bg-destructive/10 text-destructive";
                    else style = "border opacity-50";
                  } else if (i === selectedAnswer) {
                    style = "border-primary bg-primary/10";
                  }

                  return (
                    <button
                      key={i}
                      disabled={showResult}
                      onClick={() => setSelectedAnswer(i)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${style}`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                      {showResult && i === q.correct_answer && (
                        <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                      )}
                      {showResult && i === selectedAnswer && i !== q.correct_answer && (
                        <XCircle className="inline ml-2 h-4 w-4 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResult && q.explanation && (
                <div className="bg-primary/5 p-3 rounded-lg text-sm">
                  💡 {q.explanation}
                </div>
              )}

              <div className="flex justify-end pt-2">
                {!showResult ? (
                  <Button onClick={submitAnswer} disabled={selectedAnswer === null}>
                    Controleer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    {currentQ + 1 >= questions.length ? "Bekijk resultaat" : "Volgende"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Domain detail view
  if (selectedDomain) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDomain(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Terug naar domeinen
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedDomain.domain_name}
              </h1>
              {selectedDomain.description && (
                <p className="text-muted-foreground">{selectedDomain.description}</p>
              )}
            </div>

            {/* Materials */}
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary" /> Lesstof
              </h2>
              {materials.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen lesstof beschikbaar</p>
              ) : (
                <div className="space-y-3">
                  {materials.map((m) => (
                    <Card key={m.id}>
                      <CardContent className="py-4">
                        <h3 className="font-medium">{m.title}</h3>
                        {m.content && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {m.content}
                          </p>
                        )}
                        {m.file_url && (
                          <a
                            href={m.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                          >
                            <Download className="h-4 w-4" /> Download PDF
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Practice */}
            {questions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <HelpCircle className="h-5 w-5 text-primary" /> Oefenvragen
                </h2>
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="mb-3 text-muted-foreground">
                      {questions.length} oefenvragen beschikbaar
                    </p>
                    <Button onClick={startQuiz}>
                      Start oefening
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Domain list
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Terug naar home
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-2">Mijn Leeromgeving</h1>
        <p className="text-muted-foreground mb-6">
          Jouw persoonlijke domeinen, lesstof en oefenvragen
        </p>

        {domains.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Er zijn nog geen domeinen aan jou toegewezen.</p>
              <p className="text-sm">Neem contact op met je docent.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {domains.map((d) => (
              <Card
                key={d.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openDomain(d)}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{d.domain_name}</p>
                      {d.description && (
                        <p className="text-sm text-muted-foreground">{d.description}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
