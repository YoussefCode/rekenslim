import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, TrendingUp } from "lucide-react";

const QuizSelection = () => {
  const navigate = useNavigate();

  const quizLevels = [
    {
      id: "1f",
      title: "Test 1F",
      description: "Test je basisvaardigheden in rekenen niveau 1F",
      icon: Calculator,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "2f",
      title: "Test 2F", 
      description: "Gevorderde rekenvaardigheden voor niveau 2F",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    }
  ];

  const handleQuizSelect = (level: string) => {
    navigate(`/quiz/${level}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Kies je rekentest niveau
          </h1>
          <p className="text-lg text-muted-foreground">
            Selecteer het niveau dat bij jou past
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizLevels.map((level) => {
            const IconComponent = level.icon;
            return (
              <Card 
                key={level.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleQuizSelect(level.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{level.title}</CardTitle>
                  <CardDescription className="text-base">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuizSelect(level.id);
                    }}
                  >
                    Start {level.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            size="lg"
          >
            Terug naar home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSelection;
