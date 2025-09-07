import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-primary-foreground text-primary rounded-lg p-2 font-bold text-xl">
              R+
            </div>
            <div>
              <h1 className="text-2xl font-bold">Rekenslim.nl</h1>
              <p className="text-sm opacity-90">Slim leren omgaan met rekenen</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link to="/quiz" className="hover:opacity-80 transition-opacity">
              Quiz
            </Link>
            {profile?.role === 'admin' && (
              <>
                <Link to="/admin" className="hover:opacity-80 transition-opacity">
                  Admin
                </Link>
                {user && (
                  <Button variant="secondary" size="sm" onClick={signOut}>
                    Uitloggen
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;