import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calculator, Ruler, TrendingUp, Divide } from "lucide-react";

interface DomainStartScreenProps {
  domain: string;
  questionCount: number;
  totalDomains: number;
  currentDomainIndex: number;
  onStart: () => void;
}

const getDomainInfo = (domain: string) => {
  const domainData = {
    "Getallen": {
      icon: Calculator,
      description: "Rekenen met hele getallen, kommagetallen, percentages en machten",
      color: "from-blue-500 to-blue-600"
    },
    "Verhoudingen": {
      icon: TrendingUp,
      description: "Verhoudingen, schaal, procenten en BTW berekeningen",
      color: "from-green-500 to-green-600"
    },
    "Meten & Meetkunde": {
      icon: Ruler,
      description: "Oppervlakte, omtrek, volume en meetkundige figuren",
      color: "from-purple-500 to-purple-600"
    },
    "Verbanden": {
      icon: BookOpen,
      description: "Formules, vergelijkingen en lineaire verbanden",
      color: "from-orange-500 to-orange-600"
    },
    "Breuken": {
      icon: Divide,
      description: "Rekenen met breuken, optellen, aftrekken, vermenigvuldigen en delen",
      color: "from-red-500 to-red-600"
    }
  };

  return domainData[domain as keyof typeof domainData] || {
    icon: Calculator,
    description: "Rekenvaardigheden",
    color: "from-gray-500 to-gray-600"
  };
};

const DomainStartScreen = ({
  domain,
  questionCount,
  totalDomains,
  currentDomainIndex,
  onStart,
}: DomainStartScreenProps) => {
  const domainInfo = getDomainInfo(domain);
  const Icon = domainInfo.icon;
  const progress = ((currentDomainIndex + 1) / totalDomains) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mb-4">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${domainInfo.color} flex items-center justify-center text-white mb-4`}>
              <Icon size={32} />
            </div>
            <Progress value={progress} className="w-full mb-2" />
            <span className="text-sm text-muted-foreground">
              Domein {currentDomainIndex + 1} van {totalDomains}
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {domain}
          </CardTitle>
          <CardDescription className="text-lg">
            {domainInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-card/50 rounded-lg border">
              <div className="text-3xl font-bold text-primary">{questionCount}</div>
              <div className="text-sm text-muted-foreground">vragen in dit domein</div>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Je gaat nu {questionCount} vragen beantwoorden over <strong>{domain}</strong>.
              </p>
              <p className="text-muted-foreground text-sm">
                Neem je tijd en lees elke vraag goed door.
              </p>
            </div>
          </div>
          
          <Button onClick={onStart} size="lg" className="w-full">
            Start {domain} vragen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainStartScreen;