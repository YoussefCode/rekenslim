import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Practice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6 mt-12">
          <div className="bg-primary/20 p-4 rounded-full">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Oefenen</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Oefen op je eigen tempo zonder tijdsdruk
        </p>
        <Button variant="outline" size="lg" onClick={() => navigate("/")}>
          Terug naar home
        </Button>
      </div>
    </div>
  );
};

export default Practice;
