import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import QuizSelection from "./pages/QuizSelection";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Practice from "./pages/Practice";
import PracticeDomain from "./pages/PracticeDomain";
import PracticeQuestions from "./pages/PracticeQuestions";
import DyscalculieTest from "./pages/DyscalculieTest";
import AdminStudents from "./pages/AdminStudents";
import AdminPractice from "./pages/AdminPractice";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import AuthReset from "./pages/AuthReset";
import MagicLinkRelay from "./pages/MagicLinkRelay";
import AuthConfirm from "./pages/AuthConfirm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz-selection" element={<QuizSelection />} />
            <Route path="/quiz/:level" element={<Quiz />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/magic-link" element={<MagicLinkRelay />} />
            <Route path="/auth-reset" element={<AuthReset />} />
            <Route path="/auth-confirm" element={<AuthConfirm />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/oefenen" element={<Practice />} />
            <Route path="/oefenen/:domain" element={<PracticeDomain />} />
            <Route path="/oefenen/:domain/vragen" element={<PracticeQuestions />} />
            <Route path="/dyscalculie-test" element={<DyscalculieTest />} />
            <Route path="/admin/leerlingen" element={<AdminStudents />} />
            <Route path="/admin/oefenvragen" element={<AdminPractice />} />
            <Route path="/mijn-omgeving" element={<StudentDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
