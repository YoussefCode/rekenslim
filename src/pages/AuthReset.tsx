import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const AuthReset = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({
        title: 'Wachtwoorden komen niet overeen',
        description: 'Voer hetzelfde wachtwoord twee keer in.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error('Wachtwoord bijwerken mislukt:', error);
        toast({
          title: 'Bijwerken mislukt',
          description: 'Probeer het opnieuw.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Wachtwoord bijgewerkt',
          description: 'Je kunt nu inloggen met je nieuwe wachtwoord.',
        });
        navigate('/auth');
      }
    } catch (error) {
      console.error('Onbekende fout bij resetten:', error);
      toast({
        title: 'Fout',
        description: 'Er ging iets mis. Probeer het opnieuw.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Reset wachtwoord</CardTitle>
          <CardDescription>
            {ready ? 'Stel je nieuwe wachtwoord in.' : 'Open deze pagina via de link uit je e-mail.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ready ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nieuw wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Bevestig wachtwoord</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Bezig met opslaan...' : 'Wachtwoord opslaan'}
              </Button>
            </form>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground text-center">
              <p>Geen geldige resetlink gevonden. Vraag een nieuwe resetlink aan en klik die direct aan.</p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>
                Terug naar inloggen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={() => navigate('/')}> 
          <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar home
        </Button>
      </div>
    </div>
  );
};

export default AuthReset;
