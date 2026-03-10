import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const MagicLinkRelay = () => {
  const navigate = useNavigate();

  // The Supabase redirect with hash router ends up like: #/magic-link#access_token=...&type=recovery
  const tokenHash = useMemo(() => {
    const full = window.location.hash; // e.g. "#/magic-link#access_token=..."
    const secondHashIndex = full.indexOf('#', 1);
    if (secondHashIndex === -1) return '';
    return full.slice(secondHashIndex + 1); // access_token=...&type=...
  }, []);

  const hasToken = tokenHash.length > 0;
  const forwardUrl = `${window.location.origin}/#/auth-reset#${tokenHash}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Reset je wachtwoord</CardTitle>
          <CardDescription>
            Klik hieronder om door te gaan naar het reset-scherm.
            Dit voorkomt dat e-mail scanners de link al verbruiken.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasToken ? (
            <Button className="w-full" onClick={() => (window.location.href = forwardUrl)}>
              Ga verder <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground text-center space-y-3">
              <p>Geen geldige resetlink gevonden. Vraag een nieuwe resetlink aan en klik hem direct aan.</p>
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

export default MagicLinkRelay;
