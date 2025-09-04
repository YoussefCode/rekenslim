import { Check, Calculator, Users, BookOpen, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useContent } from "@/hooks/useContent";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { getContent, loading } = useContent();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Quiz Section */}
      <section className="py-8 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Test je rekenvaardigheden
              </h3>
              <p className="text-muted-foreground">
                Start direct met de rekenquiz
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/quiz')} size="lg">
                  Start Quiz
                </Button>
                {user && profile?.role === 'admin' && (
                  <Button onClick={() => navigate('/admin')} variant="outline" size="lg">
                    Quiz Beheer
                  </Button>
                )}
              </div>
              {user && (
                <p className="text-sm text-muted-foreground">
                  Welkom terug{profile?.role === 'admin' ? ', Beheerder' : ''}!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-6">
                Rekenslim.nl
              </h1>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed text-left">
                <p>
                  Rekenslim.nl is hét platform voor leerlingen die hun rekenvaardigheden willen versterken.
                  Wij combineren oefenmateriaal met professionele begeleiding en voeren vooronderzoek
                  uit bij een mogelijke verdenking op dyscalculie of een hardnekkige rekenachterstand.
                </p>
                <p>
                  Met een persoonlijk handelingsplan krijgt iedere leerling een duidelijk werkplan voor een
                  afgesproken periode. Tijdens dit traject werken we stap voor stap met de juiste
                  leermethode, zodat rekenachterstanden doelgericht worden aangepakt. Na afloop volgt
                  een nieuwe test en wordt het handelingsplan waar nodig aangepast.
                </p>
                <p>
                  Wij hechten veel waarde aan samenwerking met ouders en leerkrachten. Door
                  regelmatig contact te houden, zorgen we ervoor dat de begeleiding goed aansluit op de
                  behoeften van de leerling.
                </p>
                <p>
                  Ons doel is niet alleen het verbeteren van rekenvaardigheden, maar vooral het opbouwen
                  van zelfvertrouwen en plezier in rekenen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Waarom kiezen voor Rekenslim.nl?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  Vooronderzoek bij dyscalculie en hardnekkige achterstanden
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  Persoonlijke handelingsplannen met duidelijke doelen
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  Effectieve begeleiding op maat
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  Samenwerking met ouders en leerkrachten
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  Leerlingen groeien in zelfvertrouwen en resultaat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Contact</h2>
            <div className="space-y-4 text-lg">
              <div className="flex items-center justify-center space-x-2">
                <span>■</span>
                <span>www.rekenslim.nl</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>■</span>
                <span>info@rekenslim.nl</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>■</span>
                <span>Amsterdam</span>
              </div>
            </div>
            <div className="mt-12 text-xl font-semibold">
              Rekenslim.nl – Samen bouwen we aan rekenvaardigheid!
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;