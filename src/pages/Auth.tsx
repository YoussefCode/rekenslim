import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Inloggen mislukt",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd...",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: "Registratie mislukt",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account bestaat al",
          description: "Er bestaat al een account met dit e-mailadres. Ga naar Inloggen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registratie succesvol",
          description: "Check je email voor bevestiging",
        });
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const redirectTo = `${window.location.origin}/#/magic-link`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        toast({
          title: 'Resetlink versturen mislukt',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Resetlink verstuurd',
          description: 'Check je e-mail en klik de link binnen enkele minuten.',
        });
      }
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is iets misgegaan bij het versturen van de resetlink.',
        variant: 'destructive',
      });
    } finally {
      setResetLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Rekenslim.nl</CardTitle>
          <CardDescription>
            Log in als leerling of beheerder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Inloggen</TabsTrigger>
              <TabsTrigger value="signup">Registreren</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                </Button>
                <div className="text-sm text-muted-foreground text-center space-y-2">
                  <p>Wachtwoord vergeten? Verstuur een resetlink.</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResetLink}
                    disabled={resetLoading || !email}
                  >
                    {resetLoading ? 'Versturen...' : 'Stuur resetlink'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Wachtwoord</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Bezig met registreren...' : 'Registreren'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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

export default Auth;