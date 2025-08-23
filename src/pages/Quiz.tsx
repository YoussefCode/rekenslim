import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { CheckCircle2, XCircle } from "lucide-react";

const dummyQuestions = [
  {
    id: 1,
    question: "Wat is 5 + 3?",
    options: ["6", "7", "8", "9"],
    correct: 2
  },
  {
    id: 2,
    question: "Wat is 12 - 7?",
    options: ["4", "5", "6", "7"],
    correct: 1
  },
  {
    id: 3,
    question: "Wat is 4 × 6?",
    options: ["20", "22", "24", "26"],
    correct: 2
  },
  {
    id: 4,
    question: "Wat is 15 ÷ 3?",
    options: ["4", "5", "6", "7"],
    correct: 1
  },
  {
    id: 5,
    question: "Wat is 8 + 9?",
    options: ["15", "16", "17", "18"],
    correct: 2
  },
  {
    id: 6,
    question: "Wat is 20 - 13?",
    options: ["6", "7", "8", "9"],
    correct: 1
  },
  {
    id: 7,
    question: "Wat is 7 × 8?",
    options: ["54", "56", "58", "60"],
    correct: 1
  },
  {
    id: 8,
    question: "Wat is 36 ÷ 6?",
    options: ["5", "6", "7", "8"],
    correct: 1
  },
  {
    id: 9,
    question: "Wat is 14 + 27?",
    options: ["39", "40", "41", "42"],
    correct: 2
  },
  {
    id: 10,
    question: "Wat is 50 - 23?",
    options: ["25", "26", "27", "28"],
    correct: 2
  },
  {
    id: 11,
    question: "Wat is 9 × 7?",
    options: ["61", "62", "63", "64"],
    correct: 2
  },
  {
    id: 12,
    question: "Wat is 48 ÷ 8?",
    options: ["5", "6", "7", "8"],
    correct: 1
  },
  {
    id: 13,
    question: "Wat is 25 + 37?",
    options: ["60", "61", "62", "63"],
    correct: 2
  },
  {
    id: 14,
    question: "Wat is 83 - 47?",
    options: ["34", "35", "36", "37"],
    correct: 2
  },
  {
    id: 15,
    question: "Wat is 12 × 5?",
    options: ["58", "59", "60", "61"],
    correct: 2
  },
  {
    id: 16,
    question: "Wat is 72 ÷ 9?",
    options: ["7", "8", "9", "10"],
    correct: 1
  },
  {
    id: 17,
    question: "Wat is 43 + 29?",
    options: ["70", "71", "72", "73"],
    correct: 2
  },
  {
    id: 18,
    question: "Wat is 95 - 38?",
    options: ["55", "56", "57", "58"],
    correct: 2
  },
  {
    id: 19,
    question: "Wat is 11 × 4?",
    options: ["42", "43", "44", "45"],
    correct: 2
  },
  {
    id: 20,
    question: "Wat is 84 ÷ 12?",
    options: ["6", "7", "8", "9"],
    correct: 1
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    const answerIndex = parseInt(selectedAnswer);
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestion < dummyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setSelectedAnswer("");
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === dummyQuestions[index].correct ? 1 : 0);
    }, 0);
  };

  const progress = ((currentQuestion + 1) / dummyQuestions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / dummyQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">
                  Quiz Resultaten
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="text-6xl font-bold text-primary">
                  {percentage}%
                </div>
                <p className="text-xl text-muted-foreground">
                  Je hebt {score} van de {dummyQuestions.length} vragen goed beantwoord!
                </p>
                
                <div className="space-y-2">
                  {dummyQuestions.map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-2 rounded">
                      <span className="text-sm">Vraag {index + 1}</span>
                      {selectedAnswers[index] === question.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>

                <Button onClick={handleRestart} className="w-full">
                  Opnieuw beginnen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Vraag {currentQuestion + 1} van {dummyQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                {dummyQuestions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                {dummyQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button 
                onClick={handleNext} 
                disabled={selectedAnswer === ""} 
                className="w-full mt-6"
              >
                {currentQuestion === dummyQuestions.length - 1 ? "Afronden" : "Volgende"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;