import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, BookOpen, PenLine } from "lucide-react";

const domainContent: Record<string, { title: string; icon: React.ElementType; color: string; explanation: string[] }> = {
  getallen: {
    title: "Getallen",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
    explanation: [
      "In dit domein oefen je met rekenen met getallen. Denk aan optellen, aftrekken, vermenigvuldigen en delen.",
      "Je oefent ook met kommagetallen, percentages en breuken.",
      "Tips: werk stap voor stap, schrijf tussenantwoorden op en controleer je antwoord door terug te rekenen.",
    ],
  },
  verbanden: {
    title: "Verbanden",
    icon: BookOpen,
    color: "from-orange-500 to-orange-600",
    explanation: [
      "In dit domein oefen je met verbanden tussen getallen. Denk aan formules, tabellen en grafieken.",
      "Je leert patronen herkennen, formules toepassen en gegevens aflezen uit tabellen en grafieken.",
      "Tips: lees de vraag goed, kijk naar de eenheden en controleer of je antwoord logisch is.",
    ],
  },
};

const PracticeDomain = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const info = domainContent[domain || ""];

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Domein niet gevonden.</p>
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center text-white mb-4`}>
              <Icon size={32} />
            </div>
            <CardTitle className="text-2xl">{info.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {info.explanation.map((text, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">{text}</p>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate(`/oefenen/${domain}/vragen`)}
            >
              <PenLine className="mr-2 h-5 w-5" /> Wil je oefenen?
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate("/oefenen")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar domeinen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeDomain;
