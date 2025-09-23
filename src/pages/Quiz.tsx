import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserInfoForm, { UserInfo } from "@/components/UserInfoForm";
import { useContent } from "@/hooks/useContent";
import FractionDisplay from "@/components/FractionDisplay";
import DomainStartScreen from "@/components/DomainStartScreen";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  level: string;
  domain?: string;
}

const Quiz = () => {
  const { level = 'basis' } = useParams<{ level: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { getContent } = useContent();
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [resultPercentage, setResultPercentage] = useState<number | null>(null);
  const [domainResults, setDomainResults] = useState<Record<string, { correct: number; total: number }> | null>(null);
  
  // Domain-based quiz state
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [showDomainStart, setShowDomainStart] = useState(false);
  const [questionsByDomain, setQuestionsByDomain] = useState<Record<string, Question[]>>({});
  const [domainOrder, setDomainOrder] = useState<string[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_quiz_questions', { quiz_level: level });

      if (error) throw error;
      
      const processedQuestions = (data || []).map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct_answer: q.correct_answer,
        level: q.level || level,
        domain: q.domain
      }));
      
      setQuestions(processedQuestions);
      
      // Group questions by domain for f2 level
      if (level === 'f2') {
        const grouped = processedQuestions.reduce((acc: Record<string, Question[]>, question: Question) => {
          const domain = question.domain || 'Algemeen';
          if (!acc[domain]) {
            acc[domain] = [];
          }
          acc[domain].push(question);
          return acc;
        }, {});
        
        setQuestionsByDomain(grouped);
        const domains = Object.keys(grouped);
        setDomainOrder(domains);
        
        if (domains.length > 0) {
          setShowDomainStart(true);
        }
      }
    } catch (error) {
      toast({
        title: "Fout bij laden vragen",
        description: "Kon quiz vragen niet laden",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(parseInt(value));
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Selecteer een antwoord",
        description: "Kies een antwoord voordat je verder gaat",
        variant: "destructive",
      });
      return;
    }

    const currentQuestions = getCurrentQuestions();
    const globalQuestionIndex = getGlobalQuestionIndex();
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[globalQuestionIndex] = selectedAnswer;
    setSelectedAnswers(newSelectedAnswers);

    // Check if we're at the end of current domain (f2 level)
    if (level === 'f2' && domainOrder.length > 0) {
      if (currentQuestion + 1 < currentQuestions.length) {
        // More questions in current domain
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // End of current domain
        if (currentDomainIndex + 1 < domainOrder.length) {
          // Move to next domain
          setCurrentDomainIndex(currentDomainIndex + 1);
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setShowDomainStart(true);
        } else {
          // All domains completed
          submitQuizResults(newSelectedAnswers);
        }
      }
    } else {
      // Standard quiz flow (basis level)
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        submitQuizResults(newSelectedAnswers);
      }
    }
  };

  const getCurrentQuestions = () => {
    if (level === 'f2' && domainOrder.length > 0) {
      const currentDomain = domainOrder[currentDomainIndex];
      return questionsByDomain[currentDomain] || [];
    }
    return questions;
  };

  const getGlobalQuestionIndex = () => {
    if (level === 'f2' && domainOrder.length > 0) {
      let index = 0;
      // Add questions from previous domains
      for (let i = 0; i < currentDomainIndex; i++) {
        const domain = domainOrder[i];
        index += questionsByDomain[domain]?.length || 0;
      }
      // Add current question index
      index += currentQuestion;
      return index;
    }
    return currentQuestion;
  };

  const submitQuizResults = async (answers: number[]) => {
    if (!userInfo) {
      toast({
        title: "Gebruikersinformatie ontbreekt",
        description: "Vul eerst je gegevens in",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-quiz-results', {
        body: {
          userInfo,
          answers,
          questionIds: questions.map((q) => q.id),
          level,
        },
      });

      if (error) throw error;

      setResultScore(data?.score ?? null);
      setResultPercentage(data?.percentage ?? null);
      setDomainResults(data?.domain_results ?? null);
      setSelectedAnswers(answers);
      setShowResults(true);
      toast({
        title: "Quiz voltooid!",
        description: `Je hebt ${data?.score ?? '-'} van de ${questions.length} vragen goed beantwoord.`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Fout bij versturen",
        description: "Er is iets misgegaan bij het versturen van je resultaten",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = (answers: number[]) => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct_answer ? 1 : 0);
    }, 0);
  };

  const handleDomainStart = () => {
    setShowDomainStart(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setUserInfo(null);
    setDomainResults(null);
    setCurrentDomainIndex(0);
    
    if (level === 'f2' && domainOrder.length > 0) {
      setShowDomainStart(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Quiz wordt geladen...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Geen vragen beschikbaar</CardTitle>
            <CardDescription>
              Er zijn momenteel geen quiz vragen beschikbaar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Terug naar home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userInfo) {
    return <UserInfoForm onSubmit={setUserInfo} />;
  }

  // Show domain start screen for f2 level
  if (level === 'f2' && showDomainStart && domainOrder.length > 0) {
    const currentDomain = domainOrder[currentDomainIndex];
    const domainQuestions = questionsByDomain[currentDomain] || [];
    
    return (
      <DomainStartScreen
        domain={currentDomain}
        questionCount={domainQuestions.length}
        totalDomains={domainOrder.length}
        currentDomainIndex={currentDomainIndex}
        onStart={handleDomainStart}
      />
    );
  }

  if (showResults) {
    const finalScore = resultScore ?? calculateScore(selectedAnswers);
    const finalPercentage = resultPercentage ?? Math.round((finalScore / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">Quiz Voltooid! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Bedankt voor het maken van de quiz, {userInfo.firstName}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{finalScore}/{questions.length}</div>
              <div className="text-2xl text-muted-foreground">{finalPercentage}% correct</div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{finalScore}</div>
                  <div className="text-sm text-muted-foreground">Goede antwoorden</div>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{questions.length - finalScore}</div>
                  <div className="text-sm text-muted-foreground">Foute antwoorden</div>
                </div>
              </div>

              {/* Domain Results */}
              {domainResults && Object.keys(domainResults).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Resultaten per Domein</h3>
                  <div className="grid gap-3">
                    {Object.entries(domainResults).map(([domain, result]) => {
                      const domainPercentage = Math.round((result.correct / result.total) * 100);
                      return (
                        <div key={domain} className="p-4 bg-card border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{domain}</span>
                            <span className="text-sm text-muted-foreground">
                              {result.correct}/{result.total} ({domainPercentage}%)
                            </span>
                          </div>
                          <div className="mt-2">
                            <Progress value={domainPercentage} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Je resultaten zijn verstuurd naar je email adres.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRestart} size="lg">
                  Opnieuw proberen
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" size="lg">
                  Terug naar home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestions = getCurrentQuestions();
  const progress = currentQuestions.length > 0 ? ((currentQuestion + 1) / currentQuestions.length) * 100 : 0;
  const currentQ = currentQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{getContent('quiz_title', `Rekenquiz ${level === '2f' ? 'Niveau 2F' : 'Basis'}`)}</h1>
            <span className="text-sm text-muted-foreground">
              {level === 'f2' ? 
                `Domein ${currentDomainIndex + 1}/${domainOrder.length} - Vraag ${currentQuestion + 1}/${getCurrentQuestions().length}` :
                `Vraag ${currentQuestion + 1} van ${questions.length}`
              }
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <FractionDisplay text={currentQ.question_text} />
            </CardTitle>
            {currentQ.domain && (
              <CardDescription className="text-sm text-muted-foreground">
                Domein: {currentQ.domain}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer?.toString() || ""} onValueChange={handleAnswerSelect}>
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer p-3 rounded-lg hover:bg-accent/50">
                    <FractionDisplay text={option} />
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    const globalIndex = getGlobalQuestionIndex() - 1;
                    setSelectedAnswer(selectedAnswers[globalIndex] || null);
                  }
                }}
                disabled={currentQuestion === 0}
              >
                Vorige
              </Button>
              
              <Button onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? 'Bezig...' : 
                 level === 'f2' ? 
                   (currentQuestion === currentQuestions.length - 1 && currentDomainIndex === domainOrder.length - 1 ? 'Voltooien' : 'Volgende') :
                   (currentQuestion === questions.length - 1 ? 'Voltooien' : 'Volgende')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
