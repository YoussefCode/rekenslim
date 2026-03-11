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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
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
        console.error('Inloggen mislukt:', error);
        toast({
          title: "Inloggen mislukt",
          description: "Controleer je gegevens en probeer opnieuw.",
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
      console.error('Onbekende fout bij inloggen:', error);
      toast({
        title: "Fout",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
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
        console.error('Registratie mislukt:', error);
        toast({
          title: "Registratie mislukt",
          description: "Er is iets misgegaan. Probeer het opnieuw.",
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
      console.error('Onbekende fout bij registreren:', error);
      toast({
        title: "Fout",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetLink = async () => {
    if (!forgotEmail.trim()) {
      toast({
        title: 'Email ontbreekt',
        description: 'Vul je e-mailadres in om een resetlink te ontvangen.',
        variant: 'destructive',
      });
      return;
    }
    setResetLoading(true);

    try {
      const redirectTo = `${window.location.origin}/#/magic-link`;
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo,
      });

      if (error) {
        console.error('Resetlink versturen mislukt:', error);
        toast({
          title: 'Resetlink versturen mislukt',
          description: error.message || 'Wacht even en probeer het opnieuw.',
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
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => {
                      setForgotOpen((open) => {
                        const next = !open;
                        if (next && !forgotEmail) {
                          setForgotEmail(email);
                        }
                        return next;
                      });
                    }}
                  >
                    Wachtwoord vergeten?
                  </Button>

                  {forgotOpen && (
                    <div className="space-y-2">
                      <div className="space-y-1 text-left">
                        <Label htmlFor="forgot-email">E-mailadres voor reset</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="naam@voorbeeld.nl"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        disabled={resetLoading}
                        onClick={handleResetLink}
                      >
                        {resetLoading ? 'Versturen...' : 'Stuur resetlink'}
                      </Button>
                    </div>
                  )}
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