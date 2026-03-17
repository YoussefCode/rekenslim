import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MagicLinkRelay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);

  const linkData = useMemo(() => {
    const fullHash = window.location.hash; // e.g. "#/magic-link?token_hash=...&type=recovery" or "#/magic-link#access_token=..."

    // Legacy Supabase redirect flow: #/magic-link#access_token=...&type=recovery
    const secondHashIndex = fullHash.indexOf('#', 1);
    const legacyToken = secondHashIndex === -1 ? '' : fullHash.slice(secondHashIndex + 1);

    // Custom relay flow: #/magic-link?token_hash=...&type=recovery
    const routePart = secondHashIndex === -1 ? fullHash.slice(1) : fullHash.slice(1, secondHashIndex);
    const queryIndex = routePart.indexOf('?');
    const hashQuery = queryIndex === -1 ? '' : routePart.slice(queryIndex + 1);

    // Also support non-hash query params as fallback
    const searchQuery = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : '';

    const params = new URLSearchParams(hashQuery || searchQuery);
    const tokenHash = params.get('token_hash') || '';
    const type = params.get('type') || '';

    return {
      legacyToken,
      tokenHash,
      type,
    };
  }, []);

  const hasLegacyToken = linkData.legacyToken.length > 0;
  const isRecoveryFlow = linkData.type === 'recovery';
  const isSignupFlow = linkData.type === 'signup';
  const activeType = isSignupFlow ? 'signup' : isRecoveryFlow ? 'recovery' : '';
  const hasTokenHash = linkData.tokenHash.length > 0 && activeType.length > 0;
  const hasToken = hasLegacyToken || hasTokenHash;

  const forwardLegacyUrl = `${window.location.origin}/#/auth-reset#${linkData.legacyToken}`;
  const heading = isSignupFlow ? 'Bevestig je account' : 'Reset je wachtwoord';
  const description = isSignupFlow
    ? 'Klik hieronder om je account te activeren en toegang te krijgen tot Rekenslim.'
    : 'Klik hieronder om door te gaan naar het reset-scherm. Dit voorkomt dat e-mail scanners de link al verbruiken.';
  const buttonLabel = verifying
    ? 'Bevestigen...'
    : isSignupFlow
      ? 'Account bevestigen'
      : 'Ga verder';

  const handleContinue = async () => {
    if (hasLegacyToken) {
      window.location.href = forwardLegacyUrl;
      return;
    }

    if (!hasTokenHash) return;

    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      type: activeType as 'signup' | 'recovery',
      token_hash: linkData.tokenHash,
    });

    if (error) {
      toast({
        title: isSignupFlow ? 'Bevestigen mislukt' : 'Resetlink ongeldig',
        description: isSignupFlow
          ? 'Vraag een nieuwe bevestigingsmail aan en klik de link direct aan.'
          : 'Vraag een nieuwe resetlink aan en klik die direct aan.',
        variant: 'destructive',
      });
      setVerifying(false);
      return;
    }

    toast({
      title: isSignupFlow ? 'Account bevestigd' : 'Token bevestigd',
      description: isSignupFlow
        ? 'Je account is geactiveerd. Je kunt meteen inloggen.'
        : 'Ga verder met het instellen van je wachtwoord.',
    });

    if (isSignupFlow) {
      navigate('/auth-confirm', { replace: true, state: { verified: true } });
      return;
    }

    navigate('/auth-reset', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">{heading}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasToken ? (
            <Button className="w-full" onClick={handleContinue} disabled={verifying}>
              {buttonLabel} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground text-center space-y-3">
              <p>
                {isSignupFlow
                  ? 'Geen geldige bevestigingslink gevonden. Vraag een nieuwe mail aan en klik die direct aan.'
                  : 'Geen geldige resetlink gevonden. Vraag een nieuwe resetlink aan en klik hem direct aan.'}
              </p>
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
