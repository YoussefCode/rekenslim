import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  level: string;
  domain?: string;
  created_at?: string;
  updated_at?: string;
}

interface Content {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const Admin = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('basis');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentLevel, setCurrentLevel] = useState('basis');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [contentValue, setContentValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
    fetchContent();
  }, [currentLevel]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('level', currentLevel)
        .not('domain', 'is', null) // Only show questions with domains
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
            correct_answer: correctAnswer,
            level: selectedLevel,
            domain: selectedDomain || null
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
            correct_answer: correctAnswer,
            level: selectedLevel,
            domain: selectedDomain || null
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
    setSelectedLevel(question.level);
    setSelectedDomain(question.domain || '');
    setIsDialogOpen(true);
  };

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      toast({
        title: "Fout bij laden content",
        description: "Kon website tekst niet laden",
        variant: "destructive",
      });
    }
  };

  const saveContent = async () => {
    if (!editingContent || !contentValue.trim()) {
      toast({
        title: "Validatiefout",
        description: "Vul alle velden in",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('content')
        .update({ value: contentValue })
        .eq('id', editingContent.id);

      if (error) throw error;
      toast({ title: "Content bijgewerkt" });
      
      resetContentForm();
      fetchContent();
      setIsContentDialogOpen(false);
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Kon content niet opslaan",
        variant: "destructive",
      });
    }
  };

  const editContent = (contentItem: Content) => {
    setEditingContent(contentItem);
    setContentValue(contentItem.value);
    setIsContentDialogOpen(true);
  };

  const resetContentForm = () => {
    setEditingContent(null);
    setContentValue('');
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setSelectedLevel(currentLevel);
    setSelectedDomain('');
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
            <h1 className="text-3xl font-bold">Admin Beheer</h1>
            <p className="text-muted-foreground">Beheer quiz vragen en website content</p>
          </div>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Quiz Vragen</TabsTrigger>
            <TabsTrigger value="content">Website Tekst</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Quiz Vragen</h2>
                <Select value={currentLevel} onValueChange={setCurrentLevel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Kies niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basis">Basis</SelectItem>
                    <SelectItem value="2f">Niveau 2F</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addNewQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Vraag
              </Button>
            </div>

            <div className="grid gap-4">
              {questions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Nog geen vragen voor niveau {currentLevel === 'basis' ? 'Basis' : '2F'}</p>
                  </CardContent>
                </Card>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Vraag {index + 1} ({question.level === 'basis' ? 'Basis' : 'Niveau 2F'})</CardTitle>
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
              )))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <h2 className="text-2xl font-semibold">Website Tekst</h2>
            <div className="grid gap-4">
              {content.map((contentItem) => (
                <Card key={contentItem.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg capitalize">{contentItem.key.replace('_', ' ')}</CardTitle>
                        <CardDescription>{contentItem.description}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editContent(contentItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-muted p-3 rounded">{contentItem.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="level">Niveau</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kies niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basis">Basis</SelectItem>
                      <SelectItem value="2f">Niveau 2F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="domain">Domein (optioneel)</Label>
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kies domein" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Geen domein</SelectItem>
                      <SelectItem value="Verhoudingen">Verhoudingen</SelectItem>
                      <SelectItem value="Procenten">Procenten</SelectItem>
                      <SelectItem value="Kommagetallen">Kommagetallen</SelectItem>
                      <SelectItem value="Meten en Meetkunde">Meten en Meetkunde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
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

        <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Website Tekst Bewerken
              </DialogTitle>
              <DialogDescription>
                {editingContent?.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Tekst</Label>
                <Textarea
                  id="content"
                  value={contentValue}
                  onChange={(e) => setContentValue(e.target.value)}
                  placeholder="Voer de tekst in..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsContentDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={saveContent}>
                  Bijwerken
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