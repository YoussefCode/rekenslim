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
  <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg my-3">
    {children}
  </div>
);

const TipBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-sky-100 border border-sky-200 p-4 rounded-lg my-3">
    {children}
  </div>
);

const WarnBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg my-3">
    {children}
  </div>
);

const NoteBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg my-3">
    {children}
  </div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
    {children}
  </span>
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

const verhoudingenSections: Section[] = [
  {
    id: "kernidee",
    title: "Kernidee",
    content: (
      <>
        <p>
          Een <strong>verhouding</strong> vergelijkt hoeveelheden, zoals <em>3 : 2</em>. Je gebruikt verhoudingen om eerlijk te verdelen, te schalen, prijzen te vergelijken en procenten te begrijpen.
        </p>
        <TipBox>
          <strong>Tip:</strong> Noteer steeds <em>wat bij wat</em> hoort. Bijvoorbeeld <Pill>suiker : meel = 2 : 5</Pill> of <Pill>prijs : gewicht</Pill>.
        </TipBox>
      </>
    ),
  },
  {
    id: "begrippen",
    title: "Begrippen",
    content: (
      <div className="grid gap-3 md:grid-cols-2">
        <ExampleBox>
          <strong>Verhouding a : b</strong>
          <br />Vergelijking tussen twee grootheden. Voorbeeld: jongens : meisjes = 3 : 2.
        </ExampleBox>
        <ExampleBox>
          <strong>Deel-geheel</strong>
          <br />Een deel vergeleken met het geheel. Voorbeeld: 12 van 30 = 12 : 30 = 2 : 5 = 40%.
        </ExampleBox>
        <ExampleBox>
          <strong>Evenredig</strong>
          <br />Als één hoeveelheid ×k gaat, gaat de andere ook ×k. In een grafiek: rechte lijn door (0,0).
        </ExampleBox>
        <ExampleBox>
          <strong>Verhoudingstabel</strong>
          <br />Netjes ×k of ÷k toepassen en tussenstappen bijhouden.
        </ExampleBox>
        <ExampleBox>
          <strong>Dubbele getallenlijn</strong>
          <br />Twee evenwijdige lijnen met bij elkaar horende waarden.
        </ExampleBox>
        <ExampleBox>
          <strong>Schaal</strong>
          <br />Kaart of model versus echt. Bijvoorbeeld 1 : 50 000 → 1 cm op kaart = 500 m echt.
        </ExampleBox>
      </div>
    ),
  },
  {
    id: "representaties",
    title: "Representaties",
    content: (
      <>
        <h3 className="text-lg font-semibold mt-2">1) Verhoudingstabel</h3>
        <ExampleBox>
          <p>
            <strong>Voorbeeld:</strong> 3 pennen kosten €6. Wat kosten 5 pennen?
          </p>
          <SimpleTable headers={["stuks", "3", "1", "5"]} rows={[["prijs (€)", "6", "2", "10"]]} />
          <p>Stap: ÷3 naar 1 stuk (€2), daarna ×5 → €10.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">2) Dubbele getallenlijn</h3>
        <ExampleBox>
          <p>
            <strong>Voorbeeld:</strong> 4 kg appels kost €7,50. Wat kost 2,5 kg?
          </p>
          <pre className="bg-slate-900 text-slate-100 text-xs md:text-sm rounded-lg p-3 overflow-auto">
{`kg: 0 ───── 2 ───── 4
€ : 0 ─── 3,75 ─── 7,50`}
          </pre>
          <p>Eerst naar 1 kg (7,50 ÷ 4 = 1,875), daarna naar 2,5 kg → €4,69.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">3) Strookmodel (deel-geheel)</h3>
        <ExampleBox>
          <p>
            <strong>Voorbeeld:</strong> In een klas is de verhouding jongens : meisjes = 3 : 2. Er zijn 25 leerlingen.
          </p>
          <p>Totaal delen = 3 + 2 = 5 → 25 ÷ 5 = 5 per deel. Jongens = 3×5 = 15, meisjes = 2×5 = 10.</p>
        </ExampleBox>
      </>
    ),
  },
  {
    id: "omzetten",
    title: "Omzetten & vereenvoudigen",
    content: (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Vereenvoudigen</h3>
            <ExampleBox>
              <p>18 : 24 → beide ÷6 → 3 : 4.</p>
            </ExampleBox>
            <TipBox>
              <strong>Truc:</strong> Gebruik de <em>grootste gemene deler</em> om meteen de kleinste vorm te krijgen.
            </TipBox>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Gelijkwaardige verhoudingen</h3>
            <ExampleBox>
              <p>2 : 5 = 4 : 10 = 6 : 15 (vermenigvuldig of deel beide kanten met dezelfde factor).</p>
            </ExampleBox>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-4">Breuk ↔ verhouding ↔ percentage</h3>
        <ExampleBox>
          <ul className="list-disc ml-5 space-y-1">
            <li>12 van 30 → 12/30 = 2/5 = 40% = verhouding 2 : 5.</li>
            <li>0,25 = 1/4 = 25% = 1 : 4 (deel-geheel).</li>
          </ul>
        </ExampleBox>
        <WarnBox>
          <strong>Let op:</strong> Bij deel-geheel hoort het geheel = 100% (= alle delen samen).
        </WarnBox>
      </>
    ),
  },
  {
    id: "rekenen",
    title: "Rekenen met verhoudingen",
    content: (
      <>
        <h3 className="text-lg font-semibold">1) Schalen</h3>
        <ExampleBox>
          <p>
            <strong>Voorbeeld:</strong> Recept voor 4 personen → 10 personen. Factor = 10/4 = 2,5. Alle hoeveelheden × 2,5.
          </p>

        const breukenSections: Section[] = [
          {
            id: "kernidee",
            title: "Kernidee",
            content: (
              <>
                <p>
                  Een <strong>breuk</strong> beschrijft een deel van een geheel: de <em>teller</em> staat boven en zegt hoeveel delen je hebt, de <em>noemer</em> onderaan geeft aan in hoeveel gelijke stukken het geheel verdeeld is.
                </p>
                <TipBox>
                  <strong>Tip:</strong> Werk altijd met gelijke delen; zonder gelijke stukken kun je breuken niet eerlijk vergelijken of optellen.
                </TipBox>
              </>
            ),
          },
          {
            id: "begrippen",
            title: "Begrippen",
            content: (
              <div className="grid gap-3 md:grid-cols-3">
                <ExampleBox>
                  <strong>Teller / noemer</strong>
                  <br />Teller = aantal delen, noemer = totaal gelijke delen van het geheel.
                </ExampleBox>
                <ExampleBox>
                  <strong>Stambreuk</strong>
                  <br />Breuk met teller 1: 1/2, 1/3, 1/4 ...
                </ExampleBox>
                <ExampleBox>
                  <strong>Eigen vs. oneigen</strong>
                  <br />Eigen: teller < noemer (3/5). Oneigen: teller ≥ noemer (7/4).
                </ExampleBox>
                <ExampleBox>
                  <strong>Gelijknamig</strong>
                  <br />Breuken met dezelfde noemer (bijv. 2/7 en 5/7) tel je eenvoudig op/af.
                </ExampleBox>
                <ExampleBox>
                  <strong>Gemengd getal</strong>
                  <br />Hele + breukdeel, bijvoorbeeld 2 3/4 = 11/4.
                </ExampleBox>
                <ExampleBox>
                  <strong>GGD &amp; KGV</strong>
                  <br />GGD → vereenvoudigen, KGV → gelijknamig maken.
                </ExampleBox>
              </div>
            ),
          },
          {
            id: "modellen",
            title: "Modellen",
            content: (
              <div className="grid gap-3 md:grid-cols-3">
                <ExampleBox>
                  <strong>Strookmodel</strong>
                  <br />Een rechthoek verdeeld in gelijke vakjes. 3/5 = 3 gekleurde vakken van 5.
                </ExampleBox>
                <ExampleBox>
                  <strong>Cirkel/pizza</strong>
                  <br />Taart in punten. 1/8 is één punt van acht.
                </ExampleBox>
                <ExampleBox>
                  <strong>Getallenlijn</strong>
                  <br />Tussen 0 en 1 in gelijke stukken. 3/4 ligt op driekwart van de lijn.
                </ExampleBox>
              </div>
            ),
          },
          {
            id: "vereenvoudigen",
            title: "Vereenvoudigen & gelijkwaardig",
            content: (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold">Vereenvoudigen</h3>
                    <ExampleBox>
                      <p>12/18 → deel teller én noemer door GGD(12,18) = 6 → <strong>2/3</strong>.</p>
                    </ExampleBox>
                    <TipBox>
                      <strong>Truc:</strong> Kruislings vereenvoudigen bij vermenigvuldigen voorkomt grote getallen.
                    </TipBox>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Gelijkwaardige breuken</h3>
                    <ExampleBox>
                      <p>2/3 = 4/6 = 6/9 → vermenigvuldig teller én noemer met hetzelfde getal.</p>
                    </ExampleBox>
                  </div>
                </div>
                <WarnBox>
                  <strong>Let op:</strong> Je mag teller en noemer alleen door hetzelfde getal delen of met hetzelfde getal vermenigvuldigen (≠ 0). De breuk krijgt dan een andere vorm maar blijft even groot.
                </WarnBox>
              </>
            ),
          },
          {
            id: "gelijknamig",
            title: "Gelijknamig maken",
            content: (
              <>
                <ExampleBox>
                  <p>Voor 3/4 en 2/3 is KGV(4,3) = 12 → 3/4 = 9/12 en 2/3 = 8/12.</p>
                </ExampleBox>
                <TipBox>
                  <strong>Tip:</strong> Soms volstaat kruislings ×-ruilen: 3/4 = (×3)/(×3) → 9/12 en 2/3 = (×4)/(×4) → 8/12.
                </TipBox>
              </>
            ),
          },
          {
            id: "optellen",
            title: "Optellen & aftrekken",
            content: (
              <>
                <h3 className="text-lg font-semibold">1) Gelijknamig</h3>
                <ExampleBox>
                  <p>2/7 + 3/7 = (2 + 3)/7 = <strong>5/7</strong>.</p>
                </ExampleBox>
                <h3 className="text-lg font-semibold mt-4">2) Ongelijknamig</h3>
                <ExampleBox>
                  <p>3/4 + 2/3 → KGV = 12 → 9/12 + 8/12 = 17/12 = <strong>1 5/12</strong>.</p>
                </ExampleBox>
                <h3 className="text-lg font-semibold mt-4">3) Aftrekken</h3>
                <ExampleBox>
                  <p>5/6 − 1/4 → KGV = 12 → 10/12 − 3/12 = <strong>7/12</strong>.</p>
                </ExampleBox>
                <details className="bg-white border border-dashed border-border rounded-lg p-3 mt-3">
                  <summary className="cursor-pointer font-semibold text-primary">Veelgebruikt schema</summary>
                  <pre className="bg-slate-900 text-slate-100 text-xs md:text-sm rounded-lg p-3 mt-2 overflow-auto">
        a   c     ad ± bc
        - ± -  =  -------  (met m = KGV(b,d))
        </ExampleBox>

                  </pre>
                </details>
              </>
            ),
          },
          {
            id: "vermenigvuldigen",
            title: "Vermenigvuldigen",
            content: (
              <>
                <ExampleBox>
                  <p>
                    (3/5) × (10/9) = (3 × 10)/(5 × 9). Vereenvoudig eerst: 3 en 9 → 1 en 3; 10 en 5 → 2 en 1. Resultaat = <strong>2/3</strong>.
                  </p>
                </ExampleBox>
                <TipBox>
                  <strong>Truc:</strong> Vereenvoudig kruislings <em>voor</em> je vermenigvuldigt; zo houd je de getallen klein.
                </TipBox>
              </>
            ),
          },
          {
            id: "delen",
            title: "Delen",
            content: (
              <>
                <ExampleBox>
                  <p>(4/7) ÷ (2/3) = (4/7) × (3/2) = 12/14 = <strong>6/7</strong>.</p>
                </ExampleBox>
                <TipBox>
                  <strong>Onthouden:</strong> Delen door een breuk = vermenigvuldigen met de <em>omgekeerde</em> breuk (teller ↔ noemer).
                </TipBox>
              </>
            ),
          },
          {
            id: "gemengd",
            title: "Gemengde getallen",
            content: (
              <div className="grid gap-4 md:grid-cols-2">
                <ExampleBox>
                  <strong>Oneigen maken</strong>
                  <br />2 3/4 = (2 × 4 + 3)/4 = 11/4.
                </ExampleBox>
                <ExampleBox>
                  <strong>Gemengd maken</strong>
                  <br />17/5 = 3 rest 2 = <strong>3 2/5</strong>.
                </ExampleBox>
              </div>
            ),
          },
          {
            id: "breukgetal",
            title: "Breuk van een getal",
            content: (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold">Breuk van een getal</h3>
                  <ExampleBox>
                    3/8 van 64 = (64 ÷ 8) × 3 = <strong>24</strong>.
                  </ExampleBox>
                  <TipBox>Eerst delen door de noemer, daarna vermenigvuldigen met de teller.</TipBox>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Getal bij een breuk</h3>
                  <ExampleBox>
                    2/5 is 18 → 1 deel = 18 ÷ 2 = 9 → geheel = 5 × 9 = <strong>45</strong>.
                  </ExampleBox>
                </div>
              </div>
            ),
          },
          {
            id: "decimaal",
            title: "Decimaal & procent",
            content: (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <ExampleBox>
                    <strong>Breuk → decimaal</strong>
                    <br />1/4 = 0,25 • 3/8 = 0,375 • 1/3 ≈ 0,333…
                  </ExampleBox>
                  <ExampleBox>
                    <strong>Breuk → procent</strong>
                    <br />2/5 = 0,4 = <strong>40%</strong> • 3/4 = 0,75 = <strong>75%</strong>.
                  </ExampleBox>
                  <ExampleBox>
                    <strong>Wanneer decimaal?</strong>
                    <br />Rekenen met geld of lengtes is soms sneller in decimalen, exact uitrekenen doe je vaak met breuken.
                  </ExampleBox>
                </div>
                <NoteBox>
                  <strong>Notatie:</strong> Gebruik in het Nederlands een komma voor decimalen (0,5). Een rekenmachine mag met punten werken, maar schrijf de uitkomst met komma.
                </NoteBox>
              </>
            ),
          },
          {
            id: "oefenen",
            title: "Oefenen & checks",
            content: (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold">Snelquiz</h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                      <li>Vereenvoudig 14/21.</li>
                      <li>3/4 + 5/6 = ? (maak gelijknamig).</li>
                      <li>2 1/3 − 3/5 = ?</li>
                      <li>(5/8) × (12/15) = ? (vereenvoudig eerst).</li>
                      <li>(7/9) ÷ (14/27) = ?</li>
                      <li>3/10 van 250 = ?</li>
                    </ul>
                    <TipBox>Controleer of je antwoord logisch ligt tussen 0 en het hele getal.</TipBox>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Veelgemaakte fouten</h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                      <li><strong>Tellers én noemers optellen:</strong> mag alleen met gelijke noemer de tellers samenvoegen.</li>
                      <li><strong>Vergeten te keren</strong> bij delen door een breuk.</li>
                      <li><strong>Niet vereenvoudigen:</strong> geef het antwoord in de kleinste vorm.</li>
                      <li><strong>Gemengde getallen bij elkaar optellen:</strong> zet om naar oneigen breuken of werk apart met hele en breukdeel.</li>
                    </ul>
                  </div>
                </div>
              </>
            ),
          },
        ];
        <h3 className="text-lg font-semibold mt-4">2) Verdeling naar verhouding</h3>
        <ExampleBox>
          <p>
            <strong>Voorbeeld:</strong> Verdeel €84 in verhouding 3 : 4 : 5.
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Som delen = 12 → 1 deel = €7.</li>
            <li>Bedragen: 21, 28, 35.</li>
          </ul>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">3) Snelheid / dichtheid / eenheidsprijs</h3>
        <ExampleBox>
          <p>150 km in 2 uur → 75 km/u. Benzine €1,89 per liter → 10 L kost €18,90.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">4) Omgekeerd evenredig</h3>
        <ExampleBox>
          <p>
            <strong>Voorbeeld:</strong> 6 arbeiders → 10 dagen. Tempo blijft gelijk, dus 6×10 = 60. Met 15 arbeiders: 60 ÷ 15 = 4 dagen.
          </p>
        </ExampleBox>
      </>
    ),
  },
  {
    id: "procenten",
    title: "Procenten",
    content: (
      <>
        <h3 className="text-lg font-semibold">1) Basis</h3>
        <ExampleBox>
          <p>30% van 250 = 0,30 × 250 = 75.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">2) Korting & btw</h3>
        <ExampleBox>
          <p>€80 met 25% korting → betaal 75% = €60.</p>
          <p>€120 incl. 21% btw → deel door 1,21 ≈ €99,17.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">3) Procentpunt vs procent</h3>
        <ExampleBox>
          <p>Van 20% naar 25% is +5 procentpunt. Relatieve stijging = 5/20 = 25%.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">4) Na elkaar</h3>
        <ExampleBox>
          <p>+10% en daarna −10% → 1,1 × 0,9 = 0,99 → totaal −1%.</p>
        </ExampleBox>
        <TipBox>
          <strong>Truc:</strong> Denk in factoren: +p% = ×(1 + p/100), −p% = ×(1 − p/100).
        </TipBox>
      </>
    ),
  },
  {
    id: "schaal",
    title: "Schaal",
    content: (
      <>
        <ExampleBox>
          <p>
            <strong>Schaal 1 : 50 000</strong> → 1 cm op kaart = 500 m echt. 7,2 cm → 7,2 × 500 m = 3,6 km.
          </p>
        </ExampleBox>
        <ExampleBox>
          <p>
            <strong>Omgekeerd:</strong> 2 km echt → 200 000 cm → 200 000 ÷ 50 000 = 4 cm op kaart.
          </p>
        </ExampleBox>
        <TipBox>
          <strong>Stappenplan:</strong> Zet alle maten eerst om naar dezelfde eenheid, pas daarna de schaal toe.
        </TipBox>
      </>
    ),
  },
  {
    id: "recepten",
    title: "Recepten & verdunnen",
    content: (
      <>
        <h3 className="text-lg font-semibold">1) Recept aanpassen</h3>
        <ExampleBox>
          <p>Voor 6 personen heb je 300 g pasta nodig. Voor 14 personen → factor 14/6 ≈ 2,33 → 300 × 2,33 ≈ 700 g.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">2) Verdunnen</h3>
        <ExampleBox>
          <p>Siroop : water = 1 : 7. Voor 2 liter drank → delen = 8 → 2 000 mL ÷ 8 = 250 mL siroop + 1 750 mL water.</p>
        </ExampleBox>

        <h3 className="text-lg font-semibold mt-4">3) Mengverhouding</h3>
        <ExampleBox>
          <p>Verf mengen 2 : 3. Nodig 1,25 L → delen = 5 → 1 deel = 0,25 L → A = 0,5 L, B = 0,75 L.</p>
        </ExampleBox>
      </>
    ),
  },
  {
    id: "oefenen",
    title: "Oefenen & checks",
    content: (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Snelquiz</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Vereenvoudig 42 : 56.</li>
              <li>Artikel €45 met 20% korting. Wat betaal je?</li>
              <li>Recept 5 → 12 personen (150 g suiker → ?).</li>
              <li>Schaal 1 : 25 000, kaart 9,6 cm → echt?</li>
              <li>Verdeel €96 in 2 : 5.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Veelgemaakte fouten</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li><strong>Verkeerde grootheid:</strong> schrijf eenheden erbij.</li>
              <li><strong>Niet naar 1 deel:</strong> reken eerst eenheidsprijs uit.</li>
              <li><strong>Percentages optellen:</strong> werk met factoren.</li>
              <li><strong>Schaal vergeten:</strong> zet eerst alles om naar dezelfde eenheid.</li>
            </ul>
          </div>
        </div>
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
  verhoudingen: {
    title: "Rekenslim: Verhoudingen",
    subtitle: "Verhoudingstabel • Dubbele getallenlijn • Schalen • Percentages • Recepten • Verdeling naar verhouding",
    gradient: "from-sky-600 to-cyan-600",
    sections: verhoudingenSections,
  },
  breuken: {
    title: "Rekenslim: Breuken",
    subtitle: "Vereenvoudigen • Gelijknamig maken • Optellen • Aftrekken • Vermenigvuldigen • Delen • Gemengde getallen",
    gradient: "from-violet-600 to-indigo-600",
    sections: breukenSections,
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
