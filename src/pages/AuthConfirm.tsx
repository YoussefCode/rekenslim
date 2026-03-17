import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const AuthConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verified = Boolean(location.state?.verified);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Account bevestigd</CardTitle>
          <CardDescription>
            {verified
              ? 'Je account is succesvol geactiveerd. Je kunt meteen inloggen.'
              : 'Open deze pagina via de bevestigingslink in je e-mail om je account te activeren.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-sm text-muted-foreground">
              Zodra je via de e-mail bevestigt, krijg je toegang tot al het Rekenslim lesmateriaal.
            </p>
          </div>
          <Button className="w-full" onClick={() => navigate('/auth')}>
            Ga naar inloggen
          </Button>
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

export default AuthConfirm;
