import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

interface StudentDomain {
  id: string;
  domain_name: string;
  description: string | null;
  html_file_url: string | null;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [domains, setDomains] = useState<StudentDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<StudentDomain | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loadingHtml, setLoadingHtml] = useState(false);

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
        .select("id, domain_name, description, html_file_url")
        .eq("student_id", user!.id)
        .order("created_at");
      if (error) throw error;
      setDomains((data as StudentDomain[]) || []);
    } catch {
      toast({ title: "Fout bij laden", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Listen for postMessage results from iframe
  useEffect(() => {
    if (!selectedDomain || !user) return;

    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'domain-result' && event.data.result) {
        try {
          await supabase.from('student_domain_results' as any).insert({
            student_domain_id: selectedDomain.id,
            student_id: user.id,
            result_data: event.data.result,
          });
          toast({ title: 'Resultaat opgeslagen!' });
        } catch {
          toast({ title: 'Fout bij opslaan resultaat', variant: 'destructive' });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedDomain, user, toast]);

  const fetchHtmlContent = async (url: string) => {
    setLoadingHtml(true);
    try {
      const response = await fetch(url);
      const text = await response.text();
      setHtmlContent(text);
    } catch {
      toast({ title: "Fout bij laden HTML", variant: "destructive" });
      setHtmlContent(null);
    } finally {
      setLoadingHtml(false);
    }
  };

  const handleSelectDomain = (domain: StudentDomain) => {
    setSelectedDomain(domain);
    if (domain.html_file_url) {
      fetchHtmlContent(domain.html_file_url);
    } else {
      setHtmlContent(null);
    }
  };

  const handleBack = () => {
    setSelectedDomain(null);
    setHtmlContent(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  // Domain detail: show HTML in iframe
  if (selectedDomain) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="px-4 py-2">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Terug naar domeinen
          </Button>
        </div>

        {loadingHtml ? (
          <div className="flex-1 flex items-center justify-center">
            <p>Laden...</p>
          </div>
        ) : htmlContent ? (
          <iframe
            srcDoc={htmlContent}
            className="flex-1 w-full border-0"
            title={selectedDomain.domain_name}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Er is nog geen inhoud beschikbaar voor dit domein.</p>
                <p className="text-sm">Neem contact op met je docent.</p>
              </CardContent>
            </Card>
          </div>
        )}
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
          Jouw persoonlijke domeinen met lesstof en oefenvragen
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
                onClick={() => handleSelectDomain(d)}
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