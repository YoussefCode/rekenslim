-- Fix Dutch language errors in homepage content
UPDATE public.content SET value = 'Verbetering van rekenresultaten bij risicoleerlingen' WHERE key = 'benefit_3';
UPDATE public.content SET value = 'Positieve bijdrage aan het schoolklimaat en oudertevredenheid' WHERE key = 'benefit_4';
UPDATE public.content SET value = 'Flexibel inzetbaar: op locatie en op afstand of online' WHERE key = 'benefit_5';
UPDATE public.content SET value = 'Ontwikkeling van materialen voor ouders en apps voor rekenen' WHERE key = 'service_4';
UPDATE public.content SET value = 'Samenwerking tussen ouders en lerenden' WHERE key = 'service_5';
UPDATE public.content SET value = 'Rekenslim.nl gelooft erin dat kinderen rekenen op een andere manier kunnen leren.' WHERE key = 'mission_description';