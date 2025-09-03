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
                {loading ? 'Test je rekenvaardigheden' : getContent('home_subtitle', 'Test je rekenvaardigheden')}
              </h3>
              <p className="text-muted-foreground">
                {loading ? 'Start direct met de rekenquiz' : getContent('home_description', 'Start direct met de rekenquiz')}
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
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  {loading ? 'Waarom Rekenslim.nl voor uw school?' : getContent('hero_title', 'Waarom Rekenslim.nl voor uw school?')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {loading ? 'Veel leerlingen ervaren moeite met rekenen of kampen met dyscalculie. Dit heeft niet alleen gevolgen voor hun schoolprestaties, maar ook voor hun zelfvertrouwen en motivatie.' : getContent('hero_description', 'Veel leerlingen ervaren moeite met rekenen of kampen met dyscalculie. Dit heeft niet alleen gevolgen voor hun schoolprestaties, maar ook voor hun zelfvertrouwen en motivatie.')}
                </p>
              </div>
              <div className="ml-8 hidden lg:block">
                <div className="bg-accent/20 p-8 rounded-2xl">
                  <Calculator className="h-24 w-24 text-accent mx-auto mb-4" />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-foreground">2+2=</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {loading ? 'Wat wij voor scholen doen' : getContent('services_title', 'Wat wij voor scholen doen')}
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">
                        {loading ? `Service ${index}` : getContent(`service_${index}`, `Service ${index}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ml-8 hidden lg:block">
                <div className="bg-accent/20 p-6 rounded-2xl">
                  <BookOpen className="h-20 w-20 text-accent mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {loading ? 'Voordelen voor uw school' : getContent('benefits_title', 'Voordelen voor uw school')}
            </h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">
                    {loading ? `Benefit ${index}` : getContent(`benefit_${index}`, `Benefit ${index}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Users className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {loading ? 'Voor wie?' : getContent('for_who_title', 'Voor wie?')}
                  </h3>
                  <p className="text-muted-foreground">
                    {loading ? 'Basisscholen die hun zorgstructuur willen versterken' : getContent('for_who_description', 'Basisscholen die hun zorgstructuur willen versterken')}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Target className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {loading ? 'Onze missie' : getContent('mission_title', 'Onze missie')}
                  </h3>
                  <p className="text-muted-foreground">
                    {loading ? 'Rekenslim.nl gelooven er aridern rekenen náam ééno andere mónier va leren.' : getContent('mission_description', 'Rekenslim.nl gelooven er aridern rekenen náam ééno andere mónier va leren.')}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Award className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {loading ? 'Resultaten' : getContent('results_title', 'Resultaten')}
                  </h3>
                  <p className="text-muted-foreground">
                    {loading ? 'Bewezen methodes voor betere rekenprestaties' : getContent('results_description', 'Bewezen methodes voor betere rekenprestaties')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>{loading ? 'www.rekenslim.nl' : getContent('website_url', 'www.rekenslim.nl')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✉️</span>
              <span>{loading ? 'info@rekenslim.nl' : getContent('contact_email', 'info@rekenslim.nl')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>{loading ? '0 - 12447030' : getContent('contact_phone', '0 - 12447030')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;