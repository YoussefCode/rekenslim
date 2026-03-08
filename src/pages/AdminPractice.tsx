import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DOMAINS = [
  { id: 'getallen', label: 'Getallen' },
  { id: 'verhoudingen', label: 'Verhoudingen' },
  { id: 'procenten', label: 'Procenten' },
  { id: 'breuken', label: 'Breuken' },
  { id: 'meten', label: 'Meten en meetkunde' },
  { id: 'verbanden', label: 'Verbanden' },
];

interface PracticeSet {
  id: string;
  domain: string;
  title: string;
  description: string | null;
  sort_order: number;
}

interface PracticeQuestion {
  id: string;
  practice_set_id: string;
  question_text: string;
  answer: string;
  explanation: string | null;
  sort_order: number;
}

const AdminPractice = () => {
  const [currentDomain, setCurrentDomain] = useState('getallen');
  const [sets, setSets] = useState<PracticeSet[]>([]);
  const [questions, setQuestions] = useState<Record<string, PracticeQuestion[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Set dialog
  const [isSetDialogOpen, setIsSetDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<PracticeSet | null>(null);
  const [setTitle, setSetTitle] = useState('');
  const [setDescription, setSetDescription] = useState('');

  // Question dialog
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PracticeQuestion | null>(null);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [questionExplanation, setQuestionExplanation] = useState('');

  useEffect(() => {
    fetchSets();
  }, [currentDomain]);

  const fetchSets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('practice_sets')
        .select('*')
        .eq('domain', currentDomain)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setSets(data || []);

      // Fetch questions for all sets
      if (data && data.length > 0) {
        const { data: qData, error: qError } = await supabase
          .from('practice_questions')
          .select('*')
          .in('practice_set_id', data.map(s => s.id))
          .order('sort_order', { ascending: true });
        if (qError) throw qError;
        const grouped: Record<string, PracticeQuestion[]> = {};
        (qData || []).forEach(q => {
          if (!grouped[q.practice_set_id]) grouped[q.practice_set_id] = [];
          grouped[q.practice_set_id].push(q);
        });
        setQuestions(grouped);
      } else {
        setQuestions({});
      }
    } catch (error) {
      toast({ title: "Fout bij laden", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Set CRUD
  const openNewSet = () => {
    setEditingSet(null);
    setSetTitle('');
    setSetDescription('');
    setIsSetDialogOpen(true);
  };

  const openEditSet = (s: PracticeSet) => {
    setEditingSet(s);
    setSetTitle(s.title);
    setSetDescription(s.description || '');
    setIsSetDialogOpen(true);
  };

  const saveSet = async () => {
    if (!setTitle.trim()) return;
    try {
      if (editingSet) {
        const { error } = await supabase.from('practice_sets').update({
          title: setTitle,
          description: setDescription || null,
        }).eq('id', editingSet.id);
        if (error) throw error;
        toast({ title: "Set bijgewerkt" });
      } else {
        const { error } = await supabase.from('practice_sets').insert({
          domain: currentDomain,
          title: setTitle,
          description: setDescription || null,
          sort_order: sets.length,
        });
        if (error) throw error;
        toast({ title: "Set toegevoegd" });
      }
      setIsSetDialogOpen(false);
      fetchSets();
    } catch (error) {
      toast({ title: "Fout bij opslaan set", variant: "destructive" });
    }
  };

  const deleteSet = async (id: string) => {
    try {
      const { error } = await supabase.from('practice_sets').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Set verwijderd" });
      fetchSets();
    } catch (error) {
      toast({ title: "Fout bij verwijderen", variant: "destructive" });
    }
  };

  // Question CRUD
  const openNewQuestion = (setId: string) => {
    setActiveSetId(setId);
    setEditingQuestion(null);
    setQuestionText('');
    setQuestionAnswer('');
    setQuestionExplanation('');
    setIsQuestionDialogOpen(true);
  };

  const openEditQuestion = (q: PracticeQuestion) => {
    setActiveSetId(q.practice_set_id);
    setEditingQuestion(q);
    setQuestionText(q.question_text);
    setQuestionAnswer(q.answer);
    setQuestionExplanation(q.explanation || '');
    setIsQuestionDialogOpen(true);
  };

  const saveQuestion = async () => {
    if (!questionText.trim() || !questionAnswer.trim() || !activeSetId) return;
    try {
      if (editingQuestion) {
        const { error } = await supabase.from('practice_questions').update({
          question_text: questionText,
          answer: questionAnswer,
          explanation: questionExplanation || null,
        }).eq('id', editingQuestion.id);
        if (error) throw error;
        toast({ title: "Vraag bijgewerkt" });
      } else {
        const existing = questions[activeSetId] || [];
        const { error } = await supabase.from('practice_questions').insert({
          practice_set_id: activeSetId,
          question_text: questionText,
          answer: questionAnswer,
          explanation: questionExplanation || null,
          sort_order: existing.length,
        });
        if (error) throw error;
        toast({ title: "Vraag toegevoegd" });
      }
      setIsQuestionDialogOpen(false);
      fetchSets();
    } catch (error) {
      toast({ title: "Fout bij opslaan vraag", variant: "destructive" });
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase.from('practice_questions').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Vraag verwijderd" });
      fetchSets();
    } catch (error) {
      toast({ title: "Fout bij verwijderen", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Oefenvragen Beheer</h1>
            <p className="text-muted-foreground">Beheer oefensets en vragen per domein</p>
          </div>
          <Button variant="outline" onClick={() => window.location.hash = '#/admin'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar Admin
          </Button>
        </div>

        {/* Domain selector */}
        <div className="flex items-center gap-4 mb-6">
          <Label>Domein:</Label>
          <Select value={currentDomain} onValueChange={setCurrentDomain}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOMAINS.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openNewSet}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Set
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Laden...</div>
        ) : sets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nog geen oefensets voor dit domein</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {sets.map((set) => {
              const setQuestions = questions[set.id] || [];
              return (
                <AccordionItem key={set.id} value={set.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <span className="font-semibold">{set.title}</span>
                      <span className="text-sm text-muted-foreground">({setQuestions.length} vragen)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {set.description && (
                      <p className="text-sm text-muted-foreground mb-4">{set.description}</p>
                    )}
                    
                    <div className="flex gap-2 mb-4">
                      <Button size="sm" variant="outline" onClick={() => openEditSet(set)}>
                        <Edit className="w-3 h-3 mr-1" /> Bewerk Set
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSet(set.id)}>
                        <Trash2 className="w-3 h-3 mr-1" /> Verwijder Set
                      </Button>
                      <Button size="sm" onClick={() => openNewQuestion(set.id)}>
                        <Plus className="w-3 h-3 mr-1" /> Vraag Toevoegen
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {setQuestions.map((q, idx) => (
                        <div key={q.id} className="flex items-start gap-2 p-3 bg-background rounded border">
                          <span className="text-sm font-medium text-muted-foreground w-8 shrink-0">{idx + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{q.question_text}</p>
                            <p className="text-sm text-primary">Antwoord: {q.answer}</p>
                            {q.explanation && (
                              <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditQuestion(q)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteQuestion(q.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* Set Dialog */}
        <Dialog open={isSetDialogOpen} onOpenChange={setIsSetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSet ? 'Set Bewerken' : 'Nieuwe Set'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Titel</Label>
                <Input value={setTitle} onChange={e => setSetTitle(e.target.value)} placeholder="bijv. Getallen – Set 1" />
              </div>
              <div>
                <Label>Beschrijving (optioneel)</Label>
                <Textarea value={setDescription} onChange={e => setSetDescription(e.target.value)} placeholder="Korte beschrijving van de set..." />
              </div>
              <Button onClick={saveSet} className="w-full">Opslaan</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Question Dialog */}
        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Vraag Bewerken' : 'Nieuwe Vraag'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Vraag</Label>
                <Input value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="bijv. 38 + 47 =" />
              </div>
              <div>
                <Label>Antwoord</Label>
                <Input value={questionAnswer} onChange={e => setQuestionAnswer(e.target.value)} placeholder="bijv. 85" />
              </div>
              <div>
                <Label>Uitleg (optioneel)</Label>
                <Textarea value={questionExplanation} onChange={e => setQuestionExplanation(e.target.value)} placeholder="Stapsgewijze uitleg..." />
              </div>
              <Button onClick={saveQuestion} className="w-full">Opslaan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPractice;
