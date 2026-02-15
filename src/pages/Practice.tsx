import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const items = [
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
];

const Practice = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(items.length).fill(""));
  const [feedback, setFeedback] = useState(Array(items.length).fill(""));
  const [score, setScore] = useState("");

  const normalize = (v) => {
    v = v.trim();
    if (v.includes("/")) {
      let p = v.split("/");
      if (p.length === 2) {
        let n = parseFloat(p[0].replace(",", "."));
        let d = parseFloat(p[1].replace(",", "."));
        if (!isNaN(n) && !isNaN(d) && d !== 0) return (n / d).toString();
      }
    }
    return v.replace(",", ".");
  };

  const equal = (x, y) => {
    let a = parseFloat(normalize(x));
    let b = parseFloat(y);
    if (isNaN(a) || isNaN(b)) return false;
    let tol = Math.floor(b) === b ? 0 : 0.01;
    return Math.abs(a - b) <= tol;
  };

  const handleCheck = () => {
    let newFeedback = [];
    let correct = 0;

    items.forEach((item, i) => {
      const ok = equal(answers[i], item.a);
      newFeedback[i] = ok ? "Goed ✔" : "Fout ✘";
      if (ok) correct++;
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

  const handleChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-200 p-4 rounded-full">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            rekenslim.nl – Domein Getallen
          </h1>
          <p className="text-muted-foreground mt-2">
            20 vragen – automatische controle
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            >
              <div>{item.q}</div>
              <input
                className="border rounded-lg p-2"
                value={answers[index]}
                onChange={(e) => handleChange(e.target.value, index)}
              />
              <div
                className={
                  feedback[index].includes("Goed")
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {feedback[index]}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4 items-center flex-wrap">
          <Button onClick={handleCheck}>Controleer</Button>
          <Button variant="secondary" onClick={handleShow}>
            Toon antwoorden
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Wissen
          </Button>
          <span className="font-bold">{score}</span>
        </div>

        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            Terug naar home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
