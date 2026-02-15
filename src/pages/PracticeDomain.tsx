import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenLine } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const ExampleBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-accent/50 p-4 border-l-4 border-primary rounded-lg my-3">
    {children}
  </div>
);

const TipBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-secondary/50 p-4 border-l-4 border-secondary-foreground/30 rounded-lg my-3">
    {children}
  </div>
);

const SimpleTable = ({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) => (
  <table className="w-full border-collapse my-2 text-sm">
    <thead>
      <tr>{headers.map((h, i) => <th key={i} className="border border-border p-2 text-left bg-muted/50">{h}</th>)}</tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>{row.map((cell, j) => <td key={j} className="border border-border p-2">{cell}</td>)}</tr>
      ))}
    </tbody>
  </table>
);

const verbandenSections: Section[] = [
  {
    id: "kernidee",
    title: "Kernidee",
    content: (
      <>
        <p>Een <strong>verband</strong> laat zien hoe twee grootheden samenhangen. Je kunt een verband tonen in een <strong>tabel</strong>, <strong>grafiek</strong> of <strong>formule</strong>. Deze drie horen altijd bij elkaar.</p>
        <TipBox><strong>Belangrijk:</strong> Een grafiek vertelt hetzelfde verhaal als een tabel en formule — maar in een andere vorm.</TipBox>
      </>
    ),
  },
  {
    id: "begrippen",
    title: "Begrippen",
    content: (
      <>
        <ExampleBox><strong>Variabelen:</strong> grootheden die kunnen veranderen (x, y).</ExampleBox>
        <ExampleBox><strong>Afhankelijk / onafhankelijk:</strong> x → input, y → resultaat.</ExampleBox>
        <ExampleBox><strong>Lineair verband:</strong> rechte lijn, formule y = ax + b.</ExampleBox>
        <ExampleBox><strong>Evenredig verband:</strong> rechte lijn door (0,0), formule y = ax.</ExampleBox>
      </>
    ),
  },
  {
    id: "tabellen",
    title: "Tabellen",
    content: (
      <>
        <p>Een tabel laat zien hoe x en y samen veranderen.</p>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> Taxi: €3 start + €2 per km.</p>
          <SimpleTable headers={["km (x)", "kosten (y)"]} rows={[[0, 3], [1, 5], [2, 7], [5, 13]]} />
        </ExampleBox>
        <TipBox>Bij lineaire verbanden verandert y steeds met hetzelfde aantal.</TipBox>
      </>
    ),
  },
  {
    id: "grafieken",
    title: "Grafieken",
    content: (
      <>
        <p>Een grafiek geeft het verband visueel weer.</p>
        <ExampleBox>
          <p><strong>Belangrijk:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Een lineaire grafiek is een <strong>rechte lijn</strong>.</li>
            <li>Evenredig → rechte lijn <strong>door de oorsprong</strong>.</li>
          </ul>
        </ExampleBox>
        <ExampleBox>
          <p><strong>Voorbeeld grafiek uitleg</strong></p>
          <p>Voor taxi-formule y = 2x + 3:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Begin bij y = 3 (startgetal).</li>
            <li>Elke +1 km → +2 euro (hellingsgetal).</li>
          </ul>
        </ExampleBox>
      </>
    ),
  },
  {
    id: "formules",
    title: "Formules",
    content: (
      <>
        <p>Een formule beschrijft het verband in 1 regel.</p>
        <ExampleBox>
          <p><strong>Taxi:</strong> y = 2x + 3</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>a = 2</strong> → hellingsgetal (toename per x)</li>
            <li><strong>b = 3</strong> → startgetal (bij x = 0)</li>
          </ul>
        </ExampleBox>
        <TipBox>Bij evenredigheid is b = 0 → y = ax.</TipBox>
      </>
    ),
  },
  {
    id: "lineair",
    title: "Lineaire verbanden",
    content: (
      <>
        <ExampleBox>
          <p><strong>Formule:</strong> y = ax + b</p>
          <p><strong>a = hellingsgetal:</strong> hoe snel y groeit</p>
          <p><strong>b = startgetal:</strong> beginpunt op de y-as</p>
        </ExampleBox>
        <h3 className="text-lg font-semibold mt-4 mb-2">Hellingsgetal bepalen</h3>
        <ExampleBox>
          <p>In tabel:</p>
          <SimpleTable headers={["x", "1", "2", "3"]} rows={[["y", 4, 7, 10]]} />
          <p>y gaat steeds +3 → hellingsgetal = 3</p>
        </ExampleBox>
        <h3 className="text-lg font-semibold mt-4 mb-2">Startgetal bepalen</h3>
        <ExampleBox>
          <p>Gebruik x = 0:</p>
          <p>y = 3x + 4 → startgetal = 4</p>
        </ExampleBox>
      </>
    ),
  },
  {
    id: "evenredig",
    title: "Evenredige verbanden",
    content: (
      <>
        <ExampleBox>
          <p>Formule: <strong>y = ax</strong> (zonder + b)</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Rechte lijn door (0,0)</li>
            <li>Verhouding blijft steeds gelijk</li>
          </ul>
        </ExampleBox>
        <ExampleBox><strong>Voorbeeld:</strong> 3 repen kosten €6 → 1 reep = €2 → 5 repen = €10</ExampleBox>
      </>
    ),
  },
];

const getallenSections: Section[] = [
  {
    id: "kernidee",
    title: "Kernidee",
    content: (
      <>
        <p>Bij het domein <strong>Getallen</strong> draait alles om rekenen met verschillende soorten getallen: hele getallen, kommagetallen, breuken en percentages.</p>
        <TipBox><strong>Belangrijk:</strong> Werk altijd stap voor stap en controleer je antwoord door terug te rekenen.</TipBox>
      </>
    ),
  },
  {
    id: "optellen-aftrekken",
    title: "Optellen & Aftrekken",
    content: (
      <>
        <p>Bij optellen en aftrekken is de volgorde belangrijk. Werk van links naar rechts.</p>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 302 − 178 = ?</p>
          <p>302 − 178 = 124</p>
        </ExampleBox>
        <TipBox>Tip: rond af om te schatten. 302 − 178 ≈ 300 − 180 = 120. Klopt ongeveer!</TipBox>
      </>
    ),
  },
  {
    id: "vermenigvuldigen-delen",
    title: "Vermenigvuldigen & Delen",
    content: (
      <>
        <p>Ken je tafels goed! Ze zijn de basis van vermenigvuldigen en delen.</p>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 25 × 16 = ?</p>
          <p>25 × 16 = 25 × 10 + 25 × 6 = 250 + 150 = 400</p>
        </ExampleBox>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 480 ÷ 6 = ?</p>
          <p>480 ÷ 6 = 80</p>
        </ExampleBox>
        <TipBox>Tip: splits moeilijke vermenigvuldigingen op in makkelijke stukken.</TipBox>
      </>
    ),
  },
  {
    id: "percentages",
    title: "Percentages",
    content: (
      <>
        <p>Percentage = per honderd. 12% betekent 12 van de 100.</p>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 12% van 240 = ?</p>
          <p>10% van 240 = 24</p>
          <p>1% van 240 = 2,4</p>
          <p>12% = 24 + 2×2,4 = 28,8</p>
        </ExampleBox>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 140% van 50 = ?</p>
          <p>100% = 50, 40% = 20 → 140% = 70</p>
        </ExampleBox>
        <TipBox>Tip: bereken eerst 10% en 1%, dan kun je elk percentage samenstellen.</TipBox>
      </>
    ),
  },
  {
    id: "breuken",
    title: "Breuken & kommagetallen",
    content: (
      <>
        <p>Breuken en kommagetallen zijn twee manieren om hetzelfde getal te schrijven.</p>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 3/4 van 200 = ?</p>
          <p>200 ÷ 4 = 50 → 50 × 3 = 150</p>
        </ExampleBox>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> 0,25 × 400 = ?</p>
          <p>0,25 = 1/4 → 400 ÷ 4 = 100</p>
        </ExampleBox>
        <TipBox>Tip: 0,25 = 1/4, 0,5 = 1/2, 0,75 = 3/4. Onthoud deze!</TipBox>
      </>
    ),
  },
  {
    id: "afronden",
    title: "Afronden",
    content: (
      <>
        <p>Bij afronden kijk je naar het cijfer achter de plek waarop je afrondt.</p>
        <ExampleBox>
          <p><strong>Voorbeeld:</strong> Rond 56,78 af op één decimaal.</p>
          <p>Kijk naar de 8 (tweede decimaal). 8 ≥ 5, dus naar boven: <strong>56,8</strong></p>
        </ExampleBox>
        <TipBox>Regel: 0-4 → naar beneden, 5-9 → naar boven.</TipBox>
      </>
    ),
  },
];

const domainData: Record<string, { title: string; subtitle: string; gradient: string; sections: Section[] }> = {
  getallen: {
    title: "Rekenslim: Getallen",
    subtitle: "Optellen • Aftrekken • Vermenigvuldigen • Delen • Percentages • Breuken • Afronden",
    gradient: "from-blue-600 to-indigo-600",
    sections: getallenSections,
  },
  verbanden: {
    title: "Rekenslim: Verbanden",
    subtitle: "Tabellen • Grafieken • Formules • Lineaire verbanden • Evenredigheid • Hellingsgetal • Startgetal",
    gradient: "from-primary to-purple-600",
    sections: verbandenSections,
  },
};

const PracticeDomain = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const data = domainData[domain || ""];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">Domein niet gevonden.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`bg-gradient-to-r ${data.gradient} text-white py-10 px-4`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="mt-2 opacity-90">{data.subtitle}</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2 flex-wrap">
          {data.sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-sm text-primary hover:bg-accent transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {data.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h2 className="text-xl font-bold mb-3 text-foreground">{section.title}</h2>
            <div className="text-foreground/90 space-y-2">{section.content}</div>
          </section>
        ))}

        {/* CTA */}
        <section className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Wil je oefenen?</h2>
          <p className="text-muted-foreground">Test je kennis met oefenvragen over {data.title.split(": ")[1]}.</p>
          <Button size="lg" onClick={() => navigate(`/oefenen/${domain}/vragen`)}>
            <PenLine className="mr-2 h-5 w-5" /> Start met oefenen
          </Button>
        </section>

        <div className="pb-8">
          <Button variant="outline" onClick={() => navigate("/oefenen")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar domeinen
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PracticeDomain;
