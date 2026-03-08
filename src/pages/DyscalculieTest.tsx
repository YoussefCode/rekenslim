import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserInfoForm, { UserInfo } from "@/components/UserInfoForm";

interface Vraag {
  q: string;
  a: number;
  cat: string;
}

const vragenPool: Vraag[] = [
  { q: "Zes-en-dertig", a: 36, cat: "omdraaiing" },
  { q: "Zestien", a: 16, cat: "getalbegrip" },
  { q: "Negen-en-zestig", a: 69, cat: "omdraaiing" },
  { q: "Wat is meer: 71 of 17?", a: 71, cat: "visueel" },
  { q: "Vijf-en-dertig", a: 35, cat: "omdraaiing" },
  { q: "Twaalf", a: 12, cat: "getalbegrip" },
  { q: "Honderd-en-vijf", a: 105, cat: "positiewaarde" },
  { q: "Wat is minder: 54 of 45?", a: 45, cat: "visueel" },
  { q: "Drie-en-tachtig", a: 83, cat: "omdraaiing" },
  { q: "Wat is 10 meer dan 56?", a: 66, cat: "rekenen" },
  { q: "Dertien", a: 13, cat: "getalbegrip" },
  { q: "Elf", a: 11, cat: "getalbegrip" },
  { q: "Twee-en-veertig", a: 42, cat: "omdraaiing" },
  { q: "Zeven-en-negentig", a: 97, cat: "omdraaiing" },
  { q: "Wat is meer: 102 of 120?", a: 120, cat: "positiewaarde" },
  { q: "Acht-en-vijftig", a: 58, cat: "omdraaiing" },
  { q: "Wat is 10 minder dan 31?", a: 21, cat: "rekenen" },
  { q: "Veertien", a: 14, cat: "getalbegrip" },
  { q: "Zes-en-zeventig", a: 76, cat: "omdraaiing" },
  { q: "Wat is meer: 89 of 98?", a: 98, cat: "visueel" },
  { q: "Honderd-en-twaalf", a: 112, cat: "positiewaarde" },
  { q: "Negen-en-negentig", a: 99, cat: "getalbegrip" },
  { q: "Vijf-en-tachtig", a: 85, cat: "omdraaiing" },
  { q: "Wat is 10 meer dan 88?", a: 98, cat: "rekenen" },
  { q: "Twee-en-twintig", a: 22, cat: "getalbegrip" },
  { q: "Drie-en-dertig", a: 33, cat: "getalbegrip" },
  { q: "Acht-en-veertig", a: 48, cat: "omdraaiing" },
  { q: "Vijftien", a: 15, cat: "getalbegrip" },
  { q: "Honderd-en-twintig", a: 120, cat: "positiewaarde" },
  { q: "Negen-en-dertig", a: 39, cat: "omdraaiing" },
  { q: "Wat is meer: 65 of 56?", a: 65, cat: "visueel" },
  { q: "Een-en-zestig", a: 61, cat: "omdraaiing" },
  { q: "Tweehonderd-en-een", a: 201, cat: "positiewaarde" },
  { q: "Vier-en-tachtig", a: 84, cat: "omdraaiing" },
  { q: "Wat is 10 minder dan 100?", a: 90, cat: "rekenen" },
];

interface Fout {
  v: string;
  c: number;
  u: string;
  cat: string;
}

const TIMER_SECONDS = 15;

const DyscalculieTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [current, setCurrent] = useState(0);
  const [goed, setGoed] = useState(0);
  const [fouten, setFouten] = useState<Fout[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answer, setAnswer] = useState("");
  const [finished, setFinished] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Handle time running out
  useEffect(() => {
    if (timeLeft === 0 && !finished && !processingRef.current) {
      processingRef.current = true;
      processAnswer(null, true);
    }
  }, [timeLeft, finished]);

  // Start timer on new question
  useEffect(() => {
    if (!finished && userInfo && current < vragenPool.length) {
      startTimer();
      inputRef.current?.focus();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, finished, userInfo, startTimer]);

  const processAnswer = (val: string | null, timeUp = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = vragenPool[current].a;
    let isCorrect = false;

    if (!timeUp && val !== null) {
      const parsed = parseInt(val);
      if (parsed === correct) {
        isCorrect = true;
        setGoed((prev) => prev + 1);
      }
    }

    if (!isCorrect) {
      setFouten((prev) => [
        ...prev,
        {
          v: vragenPool[current].q,
          c: correct,
          u: val || "TIJD VERSTREKEN",
          cat: vragenPool[current].cat,
        },
      ]);
    }

    setAnswer("");
    
    if (current + 1 >= vragenPool.length) {
      setFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
    }
    
    processingRef.current = false;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !processingRef.current) {
      processingRef.current = true;
      processAnswer(answer);
    }
  };

  const sendResults = async () => {
    if (!userInfo) return;
    setIsSending(true);

    try {
      const omdraaiFouten = fouten.filter((f) => f.cat === "omdraaiing").length;
      const totaalFout = fouten.length;
      const riskHigh = omdraaiFouten >= 4 || totaalFout >= 8;
      const conclusie = riskHigh ? "VERDENKING DYSCALCULIE" : "GEEN DIRECTE SIGNALEN";

      const foutenDetail = fouten
        .map((f) => `${f.v} | Ingevuld: ${f.u} (Correct: ${f.c})`)
        .join("\n");

      const categoryBreakdown: Record<string, number> = {};
      fouten.forEach((f) => {
        categoryBreakdown[f.cat] = (categoryBreakdown[f.cat] || 0) + 1;
      });

      await supabase.functions.invoke("send-dyscalculie-results", {
        body: {
          userInfo,
          score: goed,
          totalQuestions: vragenPool.length,
          fouten,
          conclusie,
          omdraaiFouten,
          totaalFout,
          categoryBreakdown,
        },
      });

      setEmailSent(true);
      toast({
        title: "Resultaten verstuurd",
        description: "De resultaten zijn per email verstuurd.",
      });
    } catch (error) {
      console.error("Error sending results:", error);
      toast({
        title: "Fout bij versturen",
        description: "Er is iets misgegaan bij het versturen.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Send email automatically when finished
  useEffect(() => {
    if (finished && userInfo && !emailSent && !isSending) {
      sendResults();
    }
  }, [finished]);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-black text-white text-center mb-6 uppercase tracking-wide">
            Dyscalculie Screening
          </h1>
          <UserInfoForm onSubmit={setUserInfo} />
        </div>
      </div>
    );
  }

  if (finished) {
    const omdraaiFouten = fouten.filter((f) => f.cat === "omdraaiing").length;
    const totaalFout = fouten.length;
    const riskHigh = omdraaiFouten >= 4 || totaalFout >= 8;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Test Afgerond
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {goed} <span className="text-2xl text-muted-foreground">/ {vragenPool.length}</span>
              </p>
              {emailSent && (
                <p className="text-sm text-muted-foreground mt-2">
                  Resultaten zijn verstuurd per email.
                </p>
              )}
            </div>

            {!showReport ? (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">Roep nu de docent voor de resultaten.</p>
                <Button onClick={() => {
                  const pass = prompt("Wachtwoord docent:");
                  if (pass === "admin123") {
                    setShowReport(true);
                  } else {
                    toast({
                      title: "Onjuist wachtwoord",
                      variant: "destructive",
                    });
                  }
                }} className="bg-primary hover:bg-primary/90">
                  Docentenverslag openen
                </Button>
              </div>
            ) : (
              <div className="bg-primary/10 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-primary">Diagnostisch Rapport</h3>
                <p className="text-lg">
                  Analyse:{" "}
                  <span className={riskHigh ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {riskHigh ? "VERDENKING DYSCALCULIE" : "GEEN DIRECTE SIGNALEN"}
                  </span>
                </p>
                <p>Omdraai-fouten: {omdraaiFouten}</p>
                <p>Totaal fout/te laat: {totaalFout}</p>
                <hr className="border-primary/30" />
                <div className="space-y-1 text-sm">
                  {fouten.map((f, i) => (
                    <p key={i}>
                      {f.v} | Ingevuld: <strong>{f.u}</strong> (Correct: {f.c})
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setCurrent(0);
                  setGoed(0);
                  setFouten([]);
                  setFinished(false);
                  setShowReport(false);
                  setEmailSent(false);
                  setUserInfo(null);
                }}
                variant="outline"
              >
                Opnieuw
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                Terug naar home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-primary/5">
        <CardContent className="pt-8 space-y-6">
          <p className="text-center text-muted-foreground font-bold">
            Vraag {current + 1} van {vragenPool.length}
          </p>

          <div className="w-full h-3.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-destructive transition-all duration-1000 ease-linear"
              style={{ width: `${timerPercent}%` }}
            />
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-4xl font-black text-primary text-center leading-tight">
              {vragenPool[current].q}
            </p>
          </div>

          <div className="flex justify-center">
            <Input
              ref={inputRef}
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="?"
              className="text-4xl font-bold text-center w-48 h-16 border-4 border-primary/60 rounded-2xl text-primary"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground font-bold">
            Typ het getal en druk op ENTER
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DyscalculieTest;
