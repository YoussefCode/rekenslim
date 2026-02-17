import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, BookOpen, TrendingUp, Divide, ArrowLeft, Percent, Ruler } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const domains = [
  {
    id: "getallen",
    title: "Getallen",
    description: "Rekenen met hele getallen, kommagetallen en percentages",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "verhoudingen",
    title: "Verhoudingen",
    description: "Verhoudingstabellen, procenten en schaal",
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
  },
  {
    id: "procenten",
    title: "Procenten",
    description: "Percentages omzetten, korting, btw en groei",
    icon: Percent,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "breuken",
    title: "Breuken",
    description: "Tellers, noemers, gelijknamig maken en gemengde getallen",
    icon: Divide,
    color: "from-violet-500 to-violet-600",
  },
  {
    id: "meten",
    title: "Meten en meetkunde",
    description: "Lengte, oppervlakte, inhoud, hoeken, driehoeken en symmetrie",
    icon: Ruler,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "verbanden",
    title: "Verbanden",
    description: "Formules, tabellen en grafieken",
    icon: BookOpen,
    color: "from-orange-500 to-orange-600",
  },
];

const Practice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 mt-8">
          <h1 className="text-3xl font-bold text-foreground">Oefenen</h1>
          <p className="text-muted-foreground mt-2">Kies een domein om mee te oefenen</p>
        </div>

        <div className="grid gap-4">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/oefenen/${domain.id}`)}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${domain.color} flex items-center justify-center text-white shrink-0`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{domain.title}</CardTitle>
                    <CardDescription>{domain.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
