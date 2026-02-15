import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const questionsByDomain: Record<string, { q: string; a: number }[]> = {
  getallen: [
    { q: "1. 48 + 29 =", a: 77 },
    { q: "2. 302 − 178 =", a: 124 },
    { q: "3. 25 × 16 =", a: 400 },
    { q: "4. 480 ÷ 6 =", a: 80 },
    { q: "5. 12% van 240 =", a: 28.8 },
    { q: "6. 3/4 van 200 =", a: 150 },
    { q: "7. 1,5 liter = hoeveel ml?", a: 1500 },
    { q: "8. 36 × 8 =", a: 288 },
    { q: "9. 299 + 58 =", a: 357 },
    { q: "10. 900 − 475 =", a: 425 },
    { q: "11. 72 ÷ 8 =", a: 9 },
    { q: "12. 140% van 50 =", a: 70 },
    { q: "13. 0,25 × 400 =", a: 100 },
    { q: "14. 2,4 × 3 =", a: 7.2 },
    { q: "15. 7,2 ÷ 0,8 =", a: 9 },
    { q: "16. 5/8 van 320 =", a: 200 },
    { q: "17. 84 ÷ 6 =", a: 14 },
    { q: "18. 17 × 14 =", a: 238 },
    { q: "19. 102 − 58 =", a: 44 },
    { q: "20. Rond 56,78 af op één decimaal =", a: 56.8 },
  ],
  verbanden: [
    { q: "1. y = 3x + 2, wat is y als x = 4?", a: 14 },
    { q: "2. y = 2x − 5, wat is y als x = 10?", a: 15 },
    { q: "3. Een lijn stijgt 3 per stap. Start = 5. Wat is de waarde bij stap 6?", a: 23 },
    { q: "4. y = x/2 + 1, wat is y als x = 8?", a: 5 },
    { q: "5. Kosten = 0,20 × aantal + 5. Wat kost 30 stuks?", a: 11 },
    { q: "6. y = 100 − 4x, wat is y als x = 15?", a: 40 },
    { q: "7. Na 3 uur is 120 km afgelegd. Gemiddelde snelheid?", a: 40 },
    { q: "8. y = 5x, wat is x als y = 45?", a: 9 },
    { q: "9. Een bad vult 8 liter per minuut. Hoeveel na 12 minuten?", a: 96 },
    { q: "10. y = −2x + 20, wat is y als x = 7?", a: 6 },
  ],
};

const PracticeQuestions = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const items = questionsByDomain[domain || ""] || [];

  const [answers, setAnswers] = useState(Array(items.length).fill(""));
  const [feedback, setFeedback] = useState(Array(items.length).fill(""));
  const [score, setScore] = useState("");

  const normalize = (v: string) => {
    v = v.trim();
    if (v.includes("/")) {
      const p = v.split("/");
      if (p.length === 2) {
        const n = parseFloat(p[0].replace(",", "."));
        const d = parseFloat(p[1].replace(",", "."));
        if (!isNaN(n) && !isNaN(d) && d !== 0) return (n / d).toString();
      }
    }
    return v.replace(",", ".");
  };

  const equal = (x: string, y: number) => {
    const a = parseFloat(normalize(x));
    const b = y;
    if (isNaN(a) || isNaN(b)) return false;
    const tol = Math.floor(b) === b ? 0 : 0.01;
    return Math.abs(a - b) <= tol;
  };

  const handleCheck = () => {
    let correct = 0;
    const newFeedback = items.map((item, i) => {
      const ok = equal(answers[i], item.a);
      if (ok) correct++;
      return ok ? "Goed ✔" : "Fout ✘";
    });
    setFeedback(newFeedback);
    setScore(`Score: ${correct}/${items.length}`);
  };

  const handleShow = () => {
    setFeedback(items.map((item) => `Antwoord: ${item.a}`));
    setScore("");
  };

  const handleReset = () => {
    setAnswers(Array(items.length).fill(""));
    setFeedback(Array(items.length).fill(""));
    setScore("");
  };

  const handleChange = (value: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Geen vragen beschikbaar voor dit domein.</p>
      </div>
    );
  }

  const domainTitle = domain === "getallen" ? "Getallen" : domain === "verbanden" ? "Verbanden" : domain;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <h1 className="text-3xl font-bold text-foreground">Oefenen – {domainTitle}</h1>
          <p className="text-muted-foreground mt-2">{items.length} vragen – automatische controle</p>
        </div>

        <div className="bg-card shadow-md rounded-xl p-6 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="text-foreground">{item.q}</div>
              <input
                className="border rounded-lg p-2 bg-background text-foreground"
                value={answers[index]}
                onChange={(e) => handleChange(e.target.value, index)}
              />
              <div className={feedback[index]?.includes("Goed") ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {feedback[index]}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4 items-center flex-wrap">
          <Button onClick={handleCheck}>Controleer</Button>
          <Button variant="secondary" onClick={handleShow}>Toon antwoorden</Button>
          <Button variant="outline" onClick={handleReset}>Wissen</Button>
          <span className="font-bold text-foreground">{score}</span>
        </div>

        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate(`/oefenen/${domain}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar uitleg
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestions;
