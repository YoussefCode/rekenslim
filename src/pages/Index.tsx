import { Check, Calculator, Users, BookOpen, Target, Award, Brain, Heart, Trophy, Lightbulb, GraduationCap, Star } from "lucide-react";
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
      <section className="py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-2 left-4 opacity-10">
          <Calculator className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute top-3 right-8 opacity-10">
          <Brain className="h-6 w-6 text-accent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-3">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/20 p-2 rounded-full">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Test je rekenvaardigheid niveau 1f
              </h3>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Start direct met de rekenquiz en ontdek waar je staat
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <Button onClick={() => navigate('/quiz')} size="lg" className="hover-scale">
                  <Calculator className="mr-2 h-4 w-4" />
                  Test 1F
                </Button>
                {user && profile?.role === 'admin' && (
                  <Button onClick={() => navigate('/admin')} variant="outline" size="lg" className="hover-scale">
                    <Target className="mr-2 h-4 w-4" />
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
      <section className="py-12 bg-gradient-to-b from-background to-secondary/20 relative">
        {/* Decorative elements */}
        <div className="absolute top-8 left-8 opacity-5">
          <Brain className="h-20 w-20 text-primary" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-5">
          <Heart className="h-16 w-16 text-accent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 rounded-full">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-6 animate-fade-in">
                Rekenslim.nl
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <Card className="p-6 hover-scale transition-all duration-300 border-l-4 border-l-primary">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Rekenslim.nl helpt leerlingen hun rekenvaardigheden versterken. 
                      Bij een vermoeden van dyscalculie of een hardnekkige rekenachterstand doen wij een vooronderzoek.
                      We combineren onderzoek met professionele begeleiding, stellen een persoonlijk handelingsplan op en begeleiden leerlingen naar betere resultaten en meer zelfvertrouwen.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover-scale transition-all duration-300 border-l-4 border-l-accent">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="bg-accent/10 p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Met een persoonlijk handelingsplan krijgt iedere leerling een duidelijk werkplan voor een
                      afgesproken periode. Tijdens dit traject werken we stap voor stap met de juiste
                      leermethode, zodat rekenachterstanden doelgericht worden aangepakt.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover-scale transition-all duration-300 border-l-4 border-l-primary">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Wij hechten veel waarde aan samenwerking met ouders en leerkrachten. Door
                      regelmatig contact te houden, zorgen we ervoor dat de begeleiding goed aansluit op de
                      behoeften van de leerling.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover-scale transition-all duration-300 border-l-4 border-l-accent">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="bg-accent/10 p-2 rounded-full">
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Ons doel is niet alleen het verbeteren van rekenvaardigheden, maar vooral het opbouwen
                      van zelfvertrouwen en plezier in rekenen.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 relative">
        {/* Decorative background */}
        <div className="absolute top-6 right-8 opacity-10">
          <Award className="h-12 w-12 text-accent" />
        </div>
        <div className="absolute bottom-6 left-8 opacity-10">
          <Lightbulb className="h-10 w-10 text-primary" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-3 rounded-full">
                  <Star className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Waarom kiezen voor Rekenslim.nl?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Ontdek wat ons onderscheidt en waarom wij de juiste keuze zijn voor uw kind
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 hover-scale transition-all duration-300 border-t-4 border-t-primary group">
                <CardContent className="pt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <span className="text-foreground font-medium text-sm">
                    Vooronderzoek bij dyscalculie en hardnekkige achterstanden
                  </span>
                </CardContent>
              </Card>
              
              <Card className="p-4 hover-scale transition-all duration-300 border-t-4 border-t-accent group">
                <CardContent className="pt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-accent/10 p-2 rounded-full group-hover:bg-accent/20 transition-colors">
                      <Target className="h-4 w-4 text-accent" />
                    </div>
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <span className="text-foreground font-medium text-sm">
                    Persoonlijke handelingsplannen met duidelijke doelen
                  </span>
                </CardContent>
              </Card>
              
              <Card className="p-4 hover-scale transition-all duration-300 border-t-4 border-t-primary group">
                <CardContent className="pt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <span className="text-foreground font-medium text-sm">
                    Effectieve begeleiding op maat
                  </span>
                </CardContent>
              </Card>
              
              <Card className="p-4 hover-scale transition-all duration-300 border-t-4 border-t-accent group">
                <CardContent className="pt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-accent/10 p-2 rounded-full group-hover:bg-accent/20 transition-colors">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <span className="text-foreground font-medium text-sm">
                    Samenwerking met ouders en leerkrachten
                  </span>
                </CardContent>
              </Card>
              
              <Card className="p-4 hover-scale transition-all duration-300 border-t-4 border-t-primary group md:col-span-2 lg:col-span-1">
                <CardContent className="pt-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <span className="text-foreground font-medium text-sm">
                    Leerlingen groeien in zelfvertrouwen en resultaat
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Footer */}
      <footer className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Contact</h2>
            <div className="space-y-2 text-base">
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
            <div className="mt-8 text-lg font-semibold">
              Rekenslim.nl – Samen bouwen we aan rekenvaardigheid!
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
