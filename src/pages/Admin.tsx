import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  created_at?: string;
  updated_at?: string;
}

const Admin = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const processedQuestions = (data || []).map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
      
      setQuestions(processedQuestions);
    } catch (error) {
      toast({
        title: "Fout bij laden vragen",
        description: "Kon vragen niet laden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = async () => {
    if (!questionText.trim() || options.some(option => !option.trim())) {
      toast({
        title: "Validatiefout",
        description: "Vul alle velden in",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from('questions')
          .update({
            question_text: questionText,
            options: JSON.stringify(options),
            correct_answer: correctAnswer
          })
          .eq('id', editingQuestion.id);

        if (error) throw error;
        toast({ title: "Vraag bijgewerkt" });
      } else {
        const { error } = await supabase
          .from('questions')
          .insert({
            question_text: questionText,
            options: JSON.stringify(options),
            correct_answer: correctAnswer
          });

        if (error) throw error;
        toast({ title: "Vraag toegevoegd" });
      }

      resetForm();
      fetchQuestions();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Kon vraag niet opslaan",
        variant: "destructive",
      });
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Vraag verwijderd" });
      fetchQuestions();
    } catch (error) {
      toast({
        title: "Fout bij verwijderen",
        description: "Kon vraag niet verwijderen",
        variant: "destructive",
      });
    }
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.question_text);
    setOptions(question.options);
    setCorrectAnswer(question.correct_answer);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const addNewQuestion = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quiz Beheer</h1>
            <p className="text-muted-foreground">Beheer quiz vragen</p>
          </div>
          <Button onClick={addNewQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Vraag
          </Button>
        </div>

        <div className="grid gap-4">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Vraag {index + 1}</CardTitle>
                    <CardDescription>{question.question_text}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editQuestion(question)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded border ${
                        optionIndex === question.correct_answer
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                      {option}
                      {optionIndex === question.correct_answer && (
                        <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Vraag Bewerken' : 'Nieuwe Vraag Toevoegen'}
              </DialogTitle>
              <DialogDescription>
                Vul alle velden in om een vraag toe te voegen of te bewerken.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Vraag</Label>
                <Textarea
                  id="question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Voer de vraag in..."
                />
              </div>

              <div className="space-y-3">
                <Label>Antwoordopties</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Label className="w-8">{String.fromCharCode(65 + index)}.</Label>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Optie ${String.fromCharCode(65 + index)}`}
                    />
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={saveQuestion}>
                  {editingQuestion ? 'Bijwerken' : 'Toevoegen'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;