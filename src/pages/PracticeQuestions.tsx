import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const questionsByDomain: Record<string, { q: string; a: number; exp?: string }[]> = {
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
    { q: "1. Hellingsgetal a bij y = 3x + 4 =", a: 3, exp: "In y = ax + b is a het hellingsgetal (toename per x). Hier a = 3." },
    { q: "2. Startgetal b bij y = 3x + 4 =", a: 4, exp: "In y = ax + b is b het startgetal: y bij x=0. Hier b = 4." },
    { q: "3. Hellingsgetal a bij y = -2x + 7 =", a: -2, exp: "In y = ax + b is a het hellingsgetal (toename per x). Hier a = -2." },
    { q: "4. Startgetal b bij y = -2x + 7 =", a: 7, exp: "In y = ax + b is b het startgetal: y bij x=0. Hier b = 7." },
    { q: "5. Hellingsgetal a bij y = 0,5x - 1 =", a: 0.5, exp: "In y = ax + b is a het hellingsgetal (toename per x). Hier a = 0.5." },
    { q: "6. Startgetal b bij y = 0,5x - 1 =", a: -1, exp: "In y = ax + b is b het startgetal: y bij x=0. Hier b = -1." },
    { q: "7. Hellingsgetal a bij y = 4x =", a: 4, exp: "In y = ax + b is a het hellingsgetal (toename per x). Hier a = 4." },
    { q: "8. Startgetal b bij y = 4x =", a: 0, exp: "In y = ax + b is b het startgetal: y bij x=0. Hier b = 0." },
    { q: "9. Hellingsgetal a bij y = -1,5x + 6 =", a: -1.5, exp: "In y = ax + b is a het hellingsgetal (toename per x). Hier a = -1.5." },
    { q: "10. Startgetal b bij y = -1,5x + 6 =", a: 6, exp: "In y = ax + b is b het startgetal: y bij x=0. Hier b = 6." },
    { q: "11. Hellingsgetal a bij y = 2,25x - 3 =", a: 2.25, exp: "In y = ax + b is a het hellingsgetal (toename per x). Hier a = 2.25." },
    { q: "12. Startgetal b bij y = 2,25x - 3 =", a: -3, exp: "In y = ax + b is b het startgetal: y bij x=0. Hier b = -3." },
    { q: "13. Gegeven y = 3x + 4. Bereken y voor x = 5", a: 19, exp: "Vul x in: y = 3·5 + 4 = 15 + 4 = 19." },
    { q: "14. Gegeven y = -2x + 7. Bereken y voor x = 6", a: -5, exp: "Vul x in: y = -2·6 + 7 = -12 + 7 = -5." },
    { q: "15. Gegeven y = 0.5x + -1. Bereken y voor x = 14", a: 6.0, exp: "Vul x in: y = 0.5·14 + -1 = 7.0 + -1 = 6.0." },
    { q: "16. Gegeven y = 4x + 0. Bereken y voor x = 3", a: 12, exp: "Vul x in: y = 4·3 + 0 = 12 + 0 = 12." },
    { q: "17. Gegeven y = -1.5x + 6. Bereken y voor x = 8", a: -6.0, exp: "Vul x in: y = -1.5·8 + 6 = -12.0 + 6 = -6.0." },
    { q: "18. Gegeven y = 2.25x + -3. Bereken y voor x = 4", a: 6.0, exp: "Vul x in: y = 2.25·4 + -3 = 9.0 + -3 = 6.0." },
    { q: "19. Gegeven y = 1.2x + 2. Bereken y voor x = 10", a: 14.0, exp: "Vul x in: y = 1.2·10 + 2 = 12.0 + 2 = 14.0." },
    { q: "20. Gegeven y = -0.75x + 5. Bereken y voor x = 12", a: -4.0, exp: "Vul x in: y = -0.75·12 + 5 = -9.0 + 5 = -4.0." },
    { q: "21. Gegeven y = 0.8x + -4. Bereken y voor x = 20", a: 12.0, exp: "Vul x in: y = 0.8·20 + -4 = 16.0 + -4 = 12.0." },
    { q: "22. Gegeven y = 5x + -10. Bereken y voor x = 2", a: 0, exp: "Vul x in: y = 5·2 + -10 = 10 + -10 = 0." },
    { q: "23. y = 3x + 4. Los op voor x als y = 19", a: 5.0, exp: "3x + 4 = 19 → 3x = 15 → x = (19 - 4)/3 = 5.0." },
    { q: "24. y = -2x + 7. Los op voor x als y = -5", a: 6.0, exp: "-2x + 7 = -5 → -2x = -12 → x = (-5 - 7)/-2 = 6.0." },
    { q: "25. y = 0.5x + -1. Los op voor x als y = 6", a: 14.0, exp: "0.5x + -1 = 6 → 0.5x = 7 → x = (6 - -1)/0.5 = 14.0." },
    { q: "26. y = 4x + 0. Los op voor x als y = 28", a: 7.0, exp: "4x + 0 = 28 → 4x = 28 → x = (28 - 0)/4 = 7.0." },
    { q: "27. y = -1.5x + 6. Los op voor x als y = 1.5", a: 3.0, exp: "-1.5x + 6 = 1.5 → -1.5x = -4.5 → x = (1.5 - 6)/-1.5 = 3.0." },
    { q: "28. y = 2.25x + -3. Los op voor x als y = 2", a: 2.22, exp: "2.25x + -3 = 2 → 2.25x = 5 → x = (2 - -3)/2.25 = 2.22." },
    { q: "29. y = 1.2x + 2. Los op voor x als y = 14", a: 10.0, exp: "1.2x + 2 = 14 → 1.2x = 12 → x = (14 - 2)/1.2 = 10.0." },
    { q: "30. y = -0.75x + 5. Los op voor x als y = -1", a: 8.0, exp: "-0.75x + 5 = -1 → -0.75x = -6 → x = (-1 - 5)/-0.75 = 8.0." },
    { q: "31. Hellingsgetal a door punten (1,4) en (3,10) =", a: 3.0, exp: "a = (y2−y1)/(x2−x1) = (10−4)/(3−1) = 6/2 = 3.0." },
    { q: "32. Hellingsgetal a door punten (2,5) en (5,14) =", a: 3.0, exp: "a = (y2−y1)/(x2−x1) = (14−5)/(5−2) = 9/3 = 3.0." },
    { q: "33. Hellingsgetal a door punten (-1,2) en (3,-6) =", a: -2.0, exp: "a = (y2−y1)/(x2−x1) = (-6−2)/(3−-1) = -8/4 = -2.0." },
    { q: "34. Hellingsgetal a door punten (0,7) en (4,15) =", a: 2.0, exp: "a = (y2−y1)/(x2−x1) = (15−7)/(4−0) = 8/4 = 2.0." },
    { q: "35. Hellingsgetal a door punten (-2,-5) en (2,3) =", a: 2.0, exp: "a = (y2−y1)/(x2−x1) = (3−-5)/(2−-2) = 8/4 = 2.0." },
    { q: "36. Hellingsgetal a door punten (1.5,2) en (2.5,5) =", a: 3.0, exp: "a = (y2−y1)/(x2−x1) = (5−2)/(2.5−1.5) = 3/1.0 = 3.0." },
    { q: "37. Hellingsgetal a door punten (-3,4) en (-1,0) =", a: -2.0, exp: "a = (y2−y1)/(x2−x1) = (0−4)/(-1−-3) = -4/2 = -2.0." },
    { q: "38. Hellingsgetal a door punten (6,-2) en (9,-11) =", a: -3.0, exp: "a = (y2−y1)/(x2−x1) = (-11−-2)/(9−6) = -9/3 = -3.0." },
    { q: "39. Is de relatie evenredig voor punten [(0, 0), (2, 6), (5, 15)]? (1=ja, 0=nee)", a: 1, exp: "Evenredig ⇒ lijn door oorsprong en y/x constant. Hier wel evenredig." },
    { q: "40. Is de relatie evenredig voor punten [(0, 4), (2, 6), (5, 10)]? (1=ja, 0=nee)", a: 0, exp: "Evenredig ⇒ lijn door oorsprong en y/x constant. Hier niet evenredig." },
    { q: "41. Is de relatie evenredig voor punten [(1, 3), (2, 6), (3, 9)]? (1=ja, 0=nee)", a: 1, exp: "Evenredig ⇒ lijn door oorsprong en y/x constant. Hier wel evenredig." },
    { q: "42. Is de relatie evenredig voor punten [(2, 5), (4, 10), (6, 16)]? (1=ja, 0=nee)", a: 0, exp: "Evenredig ⇒ lijn door oorsprong en y/x constant. Hier niet evenredig." },
    { q: "43. Is de relatie evenredig voor punten [(0, 0), (3, -9), (5, -15)]? (1=ja, 0=nee)", a: 1, exp: "Evenredig ⇒ lijn door oorsprong en y/x constant. Hier wel evenredig." },
    { q: "44. Is de relatie evenredig voor punten [(1, 4), (2, 8), (0, 0)]? (1=ja, 0=nee)", a: 1, exp: "Evenredig ⇒ lijn door oorsprong en y/x constant. Hier wel evenredig." },
    { q: "45. Taxi: start €3 en €2/km. Kosten bij 12 km?", a: 27, exp: "Model: y = 2x + 3. Voor x=12: y = 2·12 + 3 = 24 + 3 = 27." },
    { q: "46. Taxi: start €3 en €2/km. Kilometerafstand bij €29? (rond af op 1 dec)", a: 13.0, exp: "Model: y = 2x + 3. x = (y−b)/2 = (29−3)/2 = 13.0." },
    { q: "47. Sportschool: inschrijving €25 en €15/maand. Kosten na 6 maanden?", a: 115, exp: "Model: y = 15x + 25. Voor x=6: y = 15·6 + 25 = 90 + 25 = 115." },
    { q: "48. Telefoon: bundel €10 + €0,20/min. Kosten bij 35 min?", a: 17.0, exp: "Model: y = 0.2x + 10. Voor x=35: y = 0.2·35 + 10 = 7.0 + 10 = 17.0." },
    { q: "49. Treinkaart: basis €5 + €0,12/km. Kosten bij 80 km?", a: 14.6, exp: "Model: y = 0.12x + 5. Voor x=80: y = 0.12·80 + 5 = 9.6 + 5 = 14.6." },
    { q: "50. Waterverbruik: vast €12 + €1,5/m³. Kosten bij 18 m³?", a: 39.0, exp: "Model: y = 1.5x + 12. Voor x=18: y = 1.5·18 + 12 = 27.0 + 12 = 39.0." },
    { q: "51. Parkeren: €1 start + €0,75/uur. Kosten bij 7 uur?", a: 6.25, exp: "Model: y = 0.75x + 1. Voor x=7: y = 0.75·7 + 1 = 5.25 + 1 = 6.25." },
    { q: "52. Deelstep: start €0,50 + €0,18/min. Hoeveel minuten bij €5? (1 dec)", a: 25.0, exp: "Model: y = 0.18x + 0.5. x = (y−b)/0.18 = (5−0.5)/0.18 = 25.0." },
    { q: "53. Lijn door (2,9) en (6,21). Hellingsgetal a =", a: 3.0, exp: "a = (y2−y1)/(x2−x1) = (21−9)/(6−2) = 12/4 = 3.0." },
    { q: "54. Lijn door (2,9) en (6,21). Startgetal b =", a: 3.0, exp: "Gebruik b = y − ax met (2,9). b = 9 − (3.0·2) = 3.0." },
    { q: "55. Hoort punt (5,19) bij y=3x+4? (1=ja, 0=nee)", a: 1, exp: "Controle: y_calc = a·x + b = 3·5 + 4 = 19. Vergelijk met 19 → ja." },
    { q: "56. Hoort punt (7,13) bij y=2x−1? (1=ja, 0=nee)", a: 1, exp: "Controle: y_calc = a·x + b = 2·7 + -1 = 13. Vergelijk met 13 → ja." },
    { q: "57. Hoort punt (4,0) bij y=−1,5x+6? (1=ja, 0=nee)", a: 1, exp: "Controle: y_calc = a·x + b = -1.5·4 + 6 = 0.0. Vergelijk met 0 → ja." },
    { q: "58. Hoort punt (6,0.8) bij y=0,8x−4? (1=ja, 0=nee)", a: 1, exp: "Controle: y_calc = a·x + b = 0.8·6 + -4 = 0.8. Vergelijk met 0.8 → ja." },
    { q: "59. Hoort punt (3,13) bij y=4x? (1=ja, 0=nee)", a: 0, exp: "Controle: y_calc = a·x + b = 4·3 + 0 = 12. Vergelijk met 13 → nee." },
    { q: "60. Hoort punt (4,3) bij y=−2x+10? (1=ja, 0=nee)", a: 0, exp: "Controle: y_calc = a·x + b = -2·4 + 10 = 2. Vergelijk met 3 → nee." },
  ],
};

const PracticeQuestions = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const items = questionsByDomain[domain || ""] || [];

  const [answers, setAnswers] = useState(Array(items.length).fill(""));
  const [feedback, setFeedback] = useState(Array(items.length).fill(""));
  const [explanations, setExplanations] = useState(Array(items.length).fill(""));
  const [score, setScore] = useState("");

  const normalize = (v: string) => {
    v = v.trim();
    if (v.includes("%")) {
      v = v.replace(/%/g, "");
    }
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
    setExplanations(Array(items.length).fill(""));
    setScore(`Score: ${correct}/${items.length}`);
  };

  const handleShow = () => {
    setFeedback(items.map((item) => `Antwoord: ${item.a}`));
    setExplanations(items.map((item) => item.exp || ""));
    setScore("");
  };

  const handleReset = () => {
    setAnswers(Array(items.length).fill(""));
    setFeedback(Array(items.length).fill(""));
    setExplanations(Array(items.length).fill(""));
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
            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_minmax(160px,1fr)_minmax(140px,1fr)] gap-4 items-start">
              <div className="text-foreground">{item.q}</div>
              <input
                className="border rounded-lg p-2 bg-background text-foreground"
                value={answers[index]}
                onChange={(e) => handleChange(e.target.value, index)}
              />
              <div className={feedback[index]?.includes("Goed") ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {feedback[index]}
              </div>
              {explanations[index] && (
                <details className="md:col-span-3 bg-muted/30 border border-muted-foreground/20 rounded-lg p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">Uitleg</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{explanations[index]}</p>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4 items-center flex-wrap">
          <Button onClick={handleCheck}>Controleer</Button>
          <Button variant="secondary" onClick={handleShow}>Toon antwoorden + uitleg</Button>
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
