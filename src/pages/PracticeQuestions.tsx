import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Question = { q: string; a: number | string; exp?: string };
type DomainSet = { title: string; description?: string; items: Question[] };

const questionsByDomain: Record<string, DomainSet[]> = {
  getallen: [
    {
      title: "Getallen – Set 1",
      description: "Strategieën: splitsen, compenseren, getallenlijn, distributief, halveren & verdubbelen, rechthoekmodel, happen, schattend delen, delen door 5.",
      items: [
        { q: "1. 38 + 47 =", a: 85, exp: "Splits: 38=30+8, 47=40+7. Tientallen: 30+40=70. Eenheden: 8+7=15 → 70+15=85." },
        { q: "2. 56 + 39 =", a: 95, exp: "Splits: 56=50+6, 39=30+9. Tientallen: 50+30=80. Eenheden: 6+9=15 → 80+15=95." },
        { q: "3. 74 + 68 =", a: 142, exp: "Splits: 74=70+4, 68=60+8. Tientallen: 70+60=130. Eenheden: 4+8=12 → 130+12=142." },
        { q: "4. 125 + 87 =", a: 212, exp: "Splits: 125=120+5, 87=80+7. Tientallen: 120+80=200. Eenheden: 5+7=12 → 200+12=212." },
        { q: "5. 199 + 58 =", a: 257, exp: "Maak 199 → 200. Reken: 200+58=258. Compenseer −1 → 257." },
        { q: "6. 399 + 76 =", a: 475, exp: "Maak 399 → 400. Reken: 400+76=476. Compenseer −1 → 475." },
        { q: "7. 999 + 125 =", a: 1124, exp: "Maak 999 → 1000. Reken: 1000+125=1125. Compenseer −1 → 1124." },
        { q: "8. 250 + 49 =", a: 299, exp: "Rond 49 op: 49≈50. 250+50=300, daarna −1 → 299." },
        { q: "9. 346 + 79 =", a: 425, exp: "Getallenlijn: +70 → 416; dan +9 → 425." },
        { q: "10. 580 + 125 =", a: 705, exp: "Getallenlijn: +120 → 700; dan +5 → 705." },
        { q: "11. 907 + 68 =", a: 975, exp: "Getallenlijn: +60 → 967; dan +8 → 975." },
        { q: "12. 135 + 167 =", a: 302, exp: "Getallenlijn: +160 → 295; dan +7 → 302." },
        { q: "13. 503 − 468 =", a: 35, exp: "Verschil via getallenlijn: 468 +2 → +33 → 503. Bij elkaar: 35." },
        { q: "14. 800 − 372 =", a: 428, exp: "Verschil via getallenlijn: 372 +8 → +100 → +100 → +100 → +100 → +20 → 800. Bij elkaar: 428." },
        { q: "15. 1000 − 942 =", a: 58, exp: "Verschil via getallenlijn: 942 +8 → +50 → 1000. Bij elkaar: 58." },
        { q: "16. 724 − 389 =", a: 335, exp: "Verschil via getallenlijn: 389 +1 → +100 → +100 → +100 → +34 → 724. Bij elkaar: 335." },
        { q: "17. 600 − 198 =", a: 402, exp: "Maak 198 → 200 (denk +2 aan beide kanten). 602 − 200 = 402." },
        { q: "18. 1000 − 497 =", a: 503, exp: "Compenseren: rond het tweede getal af en trek met dezelfde compensatie: 503." },
        { q: "19. 700 − 299 =", a: 401, exp: "Maak 299 → 300. 701 − 300 = 401." },
        { q: "20. 502 − 198 =", a: 304, exp: "Maak 198 → 200 (denk +2 aan beide kanten). 504 − 200 = 304." },
        { q: "21. 702 − 389 =", a: 313, exp: "Kolomsgewijs (lenen waar nodig). Controle: 313+389=702." },
        { q: "22. 845 − 468 =", a: 377, exp: "Kolomsgewijs (lenen waar nodig). Controle: 377+468=845." },
        { q: "23. 1003 − 578 =", a: 425, exp: "Kolomsgewijs (lenen waar nodig). Controle: 425+578=1003." },
        { q: "24. 900 − 356 =", a: 544, exp: "Kolomsgewijs (lenen waar nodig). Controle: 544+356=900." },
        { q: "25. 7 × 8 =", a: 56, exp: "Tafels: 7×8 = 56. Tafelpatroon." },
        { q: "26. 9 × 6 =", a: 54, exp: "Tafels: 9×6 = 54. 9-rij: 10×−1×." },
        { q: "27. 12 × 7 =", a: 84, exp: "Tafels: 12×7 = 84. Tafelpatroon." },
        { q: "28. 6 × 11 =", a: 66, exp: "Tafels: 6×11 = 66. Tafelpatroon." },
        { q: "29. 8 × 12 =", a: 96, exp: "Tafels: 8×12 = 96. Tafelpatroon." },
        { q: "30. 5 × 14 =", a: 70, exp: "Tafels: 5×14 = 70. 5-rij: eindigt op 0/5." },
        { q: "31. 7 × 18 =", a: 126, exp: "Distributief: 7×(20−2) = 140 − 14 = 126." },
        { q: "32. 13 × 19 =", a: 247, exp: "Distributief: 13×(20−1) = 260 − 13 = 247." },
        { q: "33. 24 × 17 =", a: 408, exp: "Distributief: 24×(20−3) = 480 − 72 = 408." },
        { q: "34. 16 × 29 =", a: 464, exp: "Distributief: 16×(30−1) = 480 − 16 = 464." },
        { q: "35. 25 × 16 =", a: 400, exp: "Halveren & verdubbelen: 25×16 = (50×8) = 400." },
        { q: "36. 50 × 28 =", a: 1400, exp: "Halveren & verdubbelen toepassen waar handig; uitkomst 1400." },
        { q: "37. 12 × 75 =", a: 900, exp: "Halveren & verdubbelen: 12×75 = (6×150) = 900." },
        { q: "38. 18 × 25 =", a: 450, exp: "Halveren & verdubbelen: 18×25 = (9×50) = 450." },
        { q: "39. 34 × 27 =", a: 918, exp: "(30+4)×(20+7) = 600+210+80+28 = 918." },
        { q: "40. 46 × 38 =", a: 1748, exp: "(40+6)×(30+8) = 1200+320+180+48 = 1748." },
        { q: "41. 23 × 45 =", a: 1035, exp: "(20+3)×(40+5) = 800+100+120+15 = 1035." },
        { q: "42. 34 × 27 =", a: 918, exp: "Onder elkaar: 34×7=238, 34×20=680; optellen → 918." },
        { q: "43. 58 × 46 =", a: 2668, exp: "Onder elkaar: 58×6=348, 58×40=2320; optellen → 2668." },
        { q: "44. 72 × 39 =", a: 2808, exp: "Onder elkaar: 72×9=648, 72×30=2160; optellen → 2808." },
        { q: "45. 156 ÷ 6 =", a: 26.0, exp: "Happen: 6×(groot) + … tot 0. Voorbeeld: 6×26=156, rest 0." },
        { q: "46. 252 ÷ 7 =", a: 36.0, exp: "Happen: 7×(groot) + … tot 0. Voorbeeld: 7×36=252, rest 0." },
        { q: "47. 368 ÷ 8 =", a: 46.0, exp: "Happen: 8×(groot) + … tot 0. Voorbeeld: 8×46=368, rest 0." },
        { q: "48. 432 ÷ 9 =", a: 48.0, exp: "Happen: 9×(groot) + … tot 0. Voorbeeld: 9×48=432, rest 0." },
        { q: "49. 50 ÷ 8 = (geef in decimaal, 2 dec)", a: 6.25, exp: "Rest als decimaal: 50/8 ≈ 6.25. Terugcheck: 6.25×8≈50.0." },
        { q: "50. 95 ÷ 6 = (geef in decimaal, 2 dec)", a: 15.83, exp: "Rest als decimaal: 95/6 ≈ 15.83. Terugcheck: 15.83×6≈94.98." },
        { q: "51. 77 ÷ 12 = (geef in decimaal, 2 dec)", a: 6.42, exp: "Rest als decimaal: 77/12 ≈ 6.42. Terugcheck: 6.42×12≈77.04." },
        { q: "52. 125 ÷ 14 = (geef in decimaal, 2 dec)", a: 8.93, exp: "Rest als decimaal: 125/14 ≈ 8.93. Terugcheck: 8.93×14≈125.02." },
        { q: "53. 598 ÷ 7 ≈ (afgerond op hele) =", a: 85, exp: "Schatten: rond handig af → ≈600÷7 ≈ 85." },
        { q: "54. 995 ÷ 12 ≈ (afgerond op hele) =", a: 83, exp: "Schatten: rond handig af → ≈1000÷12 ≈ 83." },
        { q: "55. 118 ÷ 7 ≈ (afgerond op hele) =", a: 17, exp: "Schatten: rond handig af → ≈120÷7 ≈ 17." },
        { q: "56. 1490 ÷ 49 ≈ (afgerond op hele) =", a: 30, exp: "Schatten: rond handig af → ≈1490÷49 ≈ 30." },
        { q: "57. 340 ÷ 5 =", a: 68.0, exp: "Truc: ÷10 en ×2: 340÷10=34 → ×2 = 68.0." },
        { q: "58. 725 ÷ 5 =", a: 145.0, exp: "Truc: ÷10 en ×2: 725÷10=72.5 → ×2 = 145.0." },
        { q: "59. 195 ÷ 5 =", a: 39.0, exp: "Truc: ÷10 en ×2: 195÷10=19.5 → ×2 = 39.0." },
        { q: "60. 1025 ÷ 5 =", a: 205.0, exp: "Truc: ÷10 en ×2: 1025÷10=102.5 → ×2 = 205.0." },
      ],
    },
    {
      title: "Getallen – Set 2",
      description: "Gemengde vraagstukken: contextopgaven, breuken, procenten, verhoudingen, meten en tijd.",
      items: [
        { q: "1. Sam heeft 348 knikkers, hij koopt er 129 bij =", a: 477, exp: "Splitsen: 348=300+48, 129=100+29 → (300+100)+(48+29)=400+77=477." },
        { q: "2. 785 werkboeken, 268 uitgedeeld =", a: 517, exp: "Getallenlijn: 268→+32=300, +485=785 → 32+485=517." },
        { q: "3. Bibliotheek: 1200 +315 −278 =", a: 1237, exp: "Eerst erbij: 1200+315=1515, dan eraf: 1515−278=1237." },
        { q: "4. Bus: +38 in, −12 uit → saldo =", a: 26, exp: "Netto: 38−12=26." },
        { q: "5. 950 pakken, 487 verkocht → over =", a: 463, exp: "Kolomsgewijs aftrekken → 463." },
        { q: "6. Bezoekers: 12.584 − 11.837 =", a: 747, exp: "Verschil via getallenlijn: 11.837→+163=12.000→+584=12.584 → 163+584=747." },
        { q: "7. Game: 4500 − 725 =", a: 3775, exp: "Compenseren: 4500−700=3800, daarna −25=3775." },
        { q: "8. Massa: 4,36 kg − 1,85 kg =", a: 2.51, exp: "Kolomsgewijs met komma: 4,36−1,85=2,51 kg." },
        { q: "9. Wandelaars: 12,8 km + 9,75 km =", a: 22.55, exp: "12,80 + 9,75 = 22,55 km." },
        { q: "10. Print: 350 − 97 =", a: 253, exp: "350−100=250 → +3 = 253." },
        { q: "11. Tank: 45,00 − 13,70 =", a: 31.3, exp: "45,00 − 13,70 = 31,30 L." },
        { q: "12. Sparen: 1099 − 289 =", a: 810, exp: "1100−289=811 → compenseer −1 → 810." },
        { q: "13. Koeken: 24 × 17 =", a: 408, exp: "(20+4)×17 = 340+68 = 408." },
        { q: "14. Productie: 275 × 8 =", a: 2200, exp: "275×8 = 1600+600 = 2200." },
        { q: "15. Ballen: 18 × €14,50 =", a: 261.0, exp: "Eenheidsprijs × aantal: 14,50×18 = €261,00." },
        { q: "16. Lezen: 32 × 15 =", a: 480, exp: "32×15 = 320+160=480." },
        { q: "17. Zakken: 960 ÷ 24 =", a: 40, exp: "24×40 = 960." },
        { q: "18. Ritjes: 8750 ÷ 1250 =", a: 7, exp: "8750/1250 = 7." },
        { q: "19. Snoep: 38 × 12 =", a: 456, exp: "38×12=380+76=456." },
        { q: "20. Rijst: 11,75 ÷ 5 =", a: 2.35, exp: "€/kg = 11,75 ÷ 5 = 2,35." },
        { q: "21. 684 ÷ 19 ≈ (2 dec)", a: 36.0, exp: "684 ÷ 19 ≈ 36.00." },
        { q: "22. Magazijn: 420 × 36 =", a: 15120, exp: "42×36×10 = (1260+252)×10 = 15.120." },
        { q: "23. 5,5 uur = 330 min; 330 ÷ 22 =", a: 15, exp: "330 ÷ 22 = 15 activiteiten." },
        { q: "24. Koekjes: 96 // 15 = volle doosjes", a: 6, exp: "Volle doosjes = 6; over = 6." },
        { q: "25. 3,75 ÷ 0,45 ≈ (2 dec)", a: 8.33, exp: "≈ 8.33." },
        { q: "26. 1,50 − 0,23 =", a: 1.27, exp: "= 1,27 L." },
        { q: "27. 18,7 × 3 =", a: 56.1, exp: "Snelheid × tijd = 56,1 km." },
        { q: "28. 2,85 + 3,47 =", a: 6.32, exp: "= 6,32 kg." },
        { q: "29. 12,4 − 4,7 =", a: 7.7, exp: "= 7,7 m." },
        { q: "30. 1,52 − 1,43 =", a: 0.09, exp: "= 0,09 m." },
        { q: "31. Omtrek: 2×(1,98+2,45) =", a: 8.86, exp: "2×4,43 = 8,86 m." },
        { q: "32. 3,785 → 2 dec =", a: 3.79, exp: "3,785 → 3,79." },
        { q: "33. Verhouding 3:4, meisjes=21 → jongens (rekenwaarde) =", a: 15.75, exp: "1 deel = 21/4=5,25; jongens = 3×5,25 = 15,75." },
        { q: "34. Water bij 5:2 en 2,5 L limonade =", a: 6.25, exp: "Water = 5/2 × 2,5 = 6,25 L." },
        { q: "35. Gemiddelde snelheid: 144 km in 2 u =", a: 72, exp: "144/2 = 72 km/u." },
        { q: "36. 5/7 van 420 =", a: 300, exp: "420÷7=60 → 60×5=300." },
        { q: "37. 3/10 van 1300 =", a: 390, exp: "= 390." },
        { q: "38. Water bij 7:3 totaal 250 =", a: 75, exp: "3/10×250=75." },
        { q: "39. 3/8 van 48 =", a: 18, exp: "= 18." },
        { q: "40. 4,2 × 25 =", a: 105.0, exp: "= 105,0 L." },
        { q: "41. Kassabon: 12,45 + 8,90 + 3,50 =", a: 24.85, exp: "= 24,85." },
        { q: "42. Kassa: 50,00 − 18,75 =", a: 31.25, exp: "= 31,25." },
        { q: "43. Afstand: 2,6 + 3,4 + 1,25 =", a: 7.25, exp: "= 7,25 km." },
        { q: "44. 9 × 28 =", a: 252, exp: "= 252." },
        { q: "45. 2 u 45 min = (min)", a: 165, exp: "= 165 min." },
        { q: "46. 3,5 km = (m)", a: 3500, exp: "= 3500 m." },
        { q: "47. Gemiddelde massa (2 dec): (2,3+1,9+3,0)/3 =", a: 2.4, exp: "≈ 2.40." },
        { q: "48. 185 snoepjes // 12 = volle doosjes", a: 15, exp: "Volle doosjes = 15 (over 5)." },
        { q: "49. 18×7 =", a: 126, exp: "= 126." },
        { q: "50. 32×24 =", a: 768, exp: "= 768." },
        { q: "51. Omtrek cirkel r=7, π≈3,14 → 2πr ≈", a: 43.96, exp: "≈ 43.96 m." },
        { q: "52. Reistijd: 126 ÷ 42 =", a: 3, exp: "= 3 uur." },
        { q: "53. Bereik: 45 L bij 6 L/100 km →", a: 750, exp: "45×(100/6)=750 km." },
        { q: "54. Lezen: 240 ÷ 18 ≈ (hele)", a: 13, exp: "≈ 13 (of 14 indien naar boven)." },
        { q: "55. 2,10 + 0,25 =", a: 2.35, exp: "= 2,35 bar." },
        { q: "56. 3×1,45 + 2×2,35 =", a: 9.05, exp: "= 4,35 + 4,70 = 9,05." },
        { q: "57. 5/8 van 256 =", a: 160, exp: "256÷8=32; 32×5=160." },
        { q: "58. 1,75 uur = (min)", a: 105, exp: "1,75×60=105." },
        { q: "59. Oppervlakte: 8,5×4,2 =", a: 35.7, exp: "= 35,7 m²." },
        { q: "60. €/kg: 6,30 ÷ 0,9 ≈ (2 dec)", a: 7.0, exp: "≈ 7.00." },
      ],
    },
  ],
  verbanden: [
    {
      title: "Verbanden",
      items: [
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
        { q: "38. Hellingsgetал a door punten (6,-2) en (9,-11) =", a: -3.0, exp: "a = (y2−y1)/(x2−x1) = (-11−-2)/(9−6) = -9/3 = -3.0." },
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
    },
  ],
  verhoudingen: [
    {
      title: "Verhoudingen",
      description: "Strategieën: vereenvoudigen, naar 1 deel, constante factor k, schaalfactor, recept-opschalen, verhoudingstabellen.",
      items: [
        { q: "1. Vereenvoudig: 18:12 (geef als a:b)", a: "3:2", exp: "GGD(18,12)=6 → 3:2." },
        { q: "2. Vereenvoudig: 45:30 (geef als a:b)", a: "3:2", exp: "GGD(45,30)=15 → 3:2." },
        { q: "3. Vereenvoudig: 50:20 (geef als a:b)", a: "5:2", exp: "GGD(50,20)=10 → 5:2." },
        { q: "4. Vereenvoudig: 42:56 (geef als a:b)", a: "3:4", exp: "GGD(42,56)=14 → 3:4." },
        { q: "5. Vereenvoudig: 36:48 (geef als a:b)", a: "3:4", exp: "GGD(36,48)=12 → 3:4." },
        { q: "6. Vereenvoudig: 96:72 (geef als a:b)", a: "4:3", exp: "GGD(96,72)=24 → 4:3." },
        { q: "7. Vereenvoudig: 14:35 (geef als a:b)", a: "2:5", exp: "GGD(14,35)=7 → 2:5." },
        { q: "8. Vereenvoudig: 28:42 (geef als a:b)", a: "2:3", exp: "GGD(28,42)=14 → 2:3." },
        { q: "9. Vereenvoudig: 63:84 (geef als a:b)", a: "3:4", exp: "GGD(63,84)=21 → 3:4." },
        { q: "10. Vereenvoudig: 120:150 (geef als a:b)", a: "4:5", exp: "GGD(120,150)=30 → 4:5." },
        { q: "11. Vereenvoudig: 81:27 (geef als a:b)", a: "3:1", exp: "GGD(81,27)=27 → 3:1." },
        { q: "12. Vereenvoudig: 44:11 (geef als a:b)", a: "4:1", exp: "GGD(44,11)=11 → 4:1." },
        { q: "13. 500 verdeeld over 20 → gram per portie (2 dec) =", a: 25.0, exp: "Eenheidsmaat = 25.0 g/p." },
        { q: "14. 2.5 verdeeld over 5 → liter per deel (2 dec) =", a: 0.5, exp: "Eenheidsmaat = 0.5 L/deel." },
        { q: "15. 3.6 verdeeld over 12 → km per min (2 dec) =", a: 0.3, exp: "Eenheidsmaat = 0.3 km/min." },
        { q: "16. 240 verdeeld over 3 → € per kg (2 dec) =", a: 80.0, exp: "Eenheidsmaat = 80.0 €/kg." },
        { q: "17. 90 verdeeld over 15 → km/u (2 dec) =", a: 6.0, exp: "Eenheidsmaat = 6.0 km/u." },
        { q: "18. 7.2 verdeeld over 12 → € per stuk (2 dec) =", a: 0.6, exp: "Eenheidsmaat = 0.6 €/stuk." },
        { q: "19. 1.5 verdeeld over 6 → L per persoon (2 dec) =", a: 0.25, exp: "Eenheidsmaat = 0.25 L/p." },
        { q: "20. 8 verdeeld over 0.5 → km per uur (2 dec) =", a: 16.0, exp: "Eenheidsmaat = 16.0 km/u." },
        { q: "21. 24 verdeeld over 3 → stuks per doos (2 dec) =", a: 8.0, exp: "Eenheidsmaat = 8.0 st/doos." },
        { q: "22. 450 verdeeld over 9 → g per koek (2 dec) =", a: 50.0, exp: "Eenheidsmaat = 50.0 g/koek." },
        { q: "23. (x,y)=(3,12); bereken y bij x=7", a: 28.0, exp: "k=12/3=4.00 → y=kx=4.00×7=28.0." },
        { q: "24. (x,y)=(5,40); bereken y bij x=12", a: 96.0, exp: "k=40/5=8.00 → y=kx=8.00×12=96.0." },
        { q: "25. (x,y)=(8,24); bereken x bij y=9", a: 3.0, exp: "k=24/8=3.00 → x=y/k=9/3.00=3.0." },
        { q: "26. (x,y)=(12,30); bereken x bij y=20", a: 8.0, exp: "k=30/12=2.50 → x=y/k=20/2.50=8.0." },
        { q: "27. (x,y)=(7,56); bereken y bij x=3", a: 24.0, exp: "k=56/7=8.00 → y=kx=8.00×3=24.0." },
        { q: "28. (x,y)=(4,18); bereken x bij y=27", a: 6.0, exp: "k=18/4=4.50 → x=y/k=27/4.50=6.0." },
        { q: "29. (x,y)=(9,63); bereken y bij x=5", a: 35.0, exp: "k=63/9=7.00 → y=kx=7.00×5=35.0." },
        { q: "30. (x,y)=(6,21); bereken x bij y=14", a: 4.0, exp: "k=21/6=3.50 → x=y/k=14/3.50=4.0." },
        { q: "31. Schaal 1:10000. Kaart = 3.5 → werkelijkheid =", a: 35000.0, exp: "Vermenigvuldig met 10000/1 → 35000.0." },
        { q: "32. Schaal 1:5000. Werkelijkheid = 125 → kaart =", a: 0.03, exp: "Vermenigvuldig met 1/5000 → 0.03." },
        { q: "33. Schaal 2:1. Kaart = 6 → werkelijkheid =", a: 3.0, exp: "Vermenigvuldig met 1/2 → 3.0." },
        { q: "34. Schaal 1:2. Werkelijkheid = 14 → kaart =", a: 7.0, exp: "Vermenigvuldig met 1/2 → 7.0." },
        { q: "35. Schaal 1:25000. Kaart = 8 → werkelijkheid =", a: 200000.0, exp: "Vermenigvuldig met 25000/1 → 200000.0." },
        { q: "36. Schaal 1:200. Werkelijkheid = 3.6 → kaart =", a: 0.02, exp: "Vermenigvuldig met 1/200 → 0.02." },
        { q: "37. Schaal 3:2. Kaart = 45 → werkelijkheid =", a: 30.0, exp: "Vermenigvuldig met 2/3 → 30.0." },
        { q: "38. Schaal 5:1. Werkelijkheid = 12 → kaart =", a: 60.0, exp: "Vermenigvuldig met 5/1 → 60.0." },
        { q: "39. Recept water:siroop=5:2. Als eerste=14, tweede=", a: 5.6, exp: "b/a=2/5 → b=5.6." },
        { q: "40. Recept melk:meel=3:2. Als tweede=450, eerste=", a: 675.0, exp: "a/b=3/2 → a=675.0." },
        { q: "41. Recept bloem:suiker=4:1. Als eerste=300, tweede=", a: 75.0, exp: "b/a=1/4 → b=75.0." },
        { q: "42. Recept rijst:water=1:1,5. Als tweede=600, eerste=", a: 400.0, exp: "a/b=1/1.5 → a=400.0." },
        { q: "43. Recept appels:peren=7:3. Als tweede=900, eerste=", a: 2100.0, exp: "a/b=7/3 → a=2100.0." },
        { q: "44. Recept tomaat:olie=5:1. Als eerste=250, tweede=", a: 50.0, exp: "b/a=1/5 → b=50.0." },
        { q: "45. d bij s=60, t=2 =", a: 120, exp: "d=s×t=120." },
        { q: "46. s bij d=210, t=3 =", a: 70.0, exp: "s=d/t=70.0." },
        { q: "47. t bij d=180, s=90 =", a: 2.0, exp: "t=d/s=2.0." },
        { q: "48. d bij s=72, t=2.5 =", a: 180.0, exp: "d=s×t=180.0." },
        { q: "49. s bij d=35, t=0.5 =", a: 70.0, exp: "s=d/t=70.0." },
        { q: "50. t bij d=132, s=48 =", a: 2.75, exp: "t=d/s=2.75." },
        { q: "51. d bij s=5.5, t=1.75 =", a: 9.62, exp: "d=s×t=9.62." },
        { q: "52. s bij d=66, t=1.2 =", a: 55.0, exp: "s=d/t=55.0." },
        { q: "53. Equivalent?: 2:3 vs 8:12 (1=ja,0=nee)", a: 1, exp: "Vergelijk a/b." },
        { q: "54. Equivalent?: 5:7 vs 25:30 (1=ja,0=nee)", a: 0, exp: "Vergelijk a/b." },
        { q: "55. Equivalent?: 4:6 vs 10:15 (1=ja,0=nee)", a: 1, exp: "Vergelijk a/b." },
        { q: "56. Equivalent?: 9:12 vs 15:21 (1=ja,0=nee)", a: 0, exp: "Vergelijk a/b." },
        { q: "57. Schaal 1:25000, 7,2 cm → werkelijkheid (m) =", a: 1800.0, exp: "7,2×250 m = 1800,0." },
        { q: "58. 4:3 = a:450 → a =", a: 600.0, exp: "a=(4/3)×450=600." },
        { q: "59. 3 kg voor €7,50 → €/kg =", a: 2.5, exp: "=2,50." },
        { q: "60. 2:5 = x:20 → x =", a: 8.0, exp: "=8." },
      ],
    },
  ],
  procenten: [
    {
      title: "Procenten",
      description: "Basis • procent naar decimaal/breuk • procent van een getal • korting • btw • groei & daling • omgekeerde procenten",
      items: [
        { q: "1. 20% van 150 =", a: 30, exp: "20% van 150 = 150 ÷ 100 × 20 = 30. Truc: 10% = 15, 5% = 7.5, 1% = 1.5." },
        { q: "2. 12% van 240 =", a: 28.8, exp: "12% van 240 = 240 ÷ 100 × 12 = 28.8. Truc: 10% = 24, 5% = 12, 1% = 2.4." },
        { q: "3. 35% van 80 =", a: 28, exp: "35% van 80 = 80 ÷ 100 × 35 = 28. Truc: 10% = 8, 5% = 4, 1% = 0.8." },
        { q: "4. 15% van 200 =", a: 30, exp: "15% van 200 = 200 ÷ 100 × 15 = 30. Truc: 10% = 20, 5% = 10, 1% = 2." },
        { q: "5. 18% van 350 =", a: 63, exp: "18% van 350 = 350 ÷ 100 × 18 = 63. Truc: 10% = 35, 5% = 17.5, 1% = 3.5." },
        { q: "6. 25% van 96 =", a: 24, exp: "25% van 96 = 96 ÷ 100 × 25 = 24. Truc: 10% = 9.6, 5% = 4.8, 1% = 0.96." },
        { q: "7. 30% van 420 =", a: 126, exp: "30% van 420 = 420 ÷ 100 × 30 = 126. Truc: 10% = 42, 5% = 21, 1% = 4.2." },
        { q: "8. 45% van 220 =", a: 99, exp: "45% van 220 = 220 ÷ 100 × 45 = 99. Truc: 10% = 22, 5% = 11, 1% = 2.2." },
        { q: "9. 5% van 860 =", a: 43, exp: "5% van 860 = 860 ÷ 100 × 5 = 43. Truc: 10% = 86, 5% = 43, 1% = 8.6." },
        { q: "10. 40% van 125 =", a: 50, exp: "40% van 125 = 125 ÷ 100 × 40 = 50. Truc: 10% = 12.5, 5% = 6.25, 1% = 1.25." },
        { q: "11. 60% van 90 =", a: 54, exp: "60% van 90 = 90 ÷ 100 × 60 = 54. Truc: 10% = 9, 5% = 4.5, 1% = 0.9." },
        { q: "12. 75% van 48 =", a: 36, exp: "75% van 48 = 48 ÷ 100 × 75 = 36. Truc: 10% = 4.8, 5% = 2.4, 1% = 0.48." },
        { q: "13. 8% van 375 =", a: 30, exp: "8% van 375 = 375 ÷ 100 × 8 = 30. Truc: 10% = 37.5, 5% = 18.75, 1% = 3.75." },
        { q: "14. 22% van 560 =", a: 123.2, exp: "22% van 560 = 560 ÷ 100 × 22 = 123.2. Truc: 10% = 56, 5% = 28, 1% = 5.6." },
        { q: "15. 12.5% van 320 =", a: 40, exp: "12.5% van 320 = 320 ÷ 100 × 12.5 = 40. Truc: 10% = 32, 5% = 16, 1% = 3.2." },
        { q: "16. 25% korting op €80,00 → eindprijs =", a: 60, exp: "25% korting → je betaalt 75% = 0.75×. €80,00 × 0.75 = €60,00." },
        { q: "17. 30% korting op €50,00 → eindprijs =", a: 35, exp: "30% korting → je betaalt 70% = 0.7×. €50,00 × 0.7 = €35,00." },
        { q: "18. 15% korting op €120,00 → eindprijs =", a: 102, exp: "15% korting → je betaalt 85% = 0.85×. €120,00 × 0.85 = €102,00." },
        { q: "19. 20% korting op €240,00 → eindprijs =", a: 192, exp: "20% korting → je betaalt 80% = 0.8×. €240,00 × 0.8 = €192,00." },
        { q: "20. 35% korting op €180,00 → eindprijs =", a: 117, exp: "35% korting → je betaalt 65% = 0.65×. €180,00 × 0.65 = €117,00." },
        { q: "21. 12% korting op €75,00 → eindprijs =", a: 66, exp: "12% korting → je betaalt 88% = 0.88×. €75,00 × 0.88 = €66,00." },
        { q: "22. 40% korting op €90,00 → eindprijs =", a: 54, exp: "40% korting → je betaalt 60% = 0.6×. €90,00 × 0.6 = €54,00." },
        { q: "23. 10% korting op €260,00 → eindprijs =", a: 234, exp: "10% korting → je betaalt 90% = 0.9×. €260,00 × 0.9 = €234,00." },
        { q: "24. 22% korting op €140,00 → eindprijs =", a: 109.2, exp: "22% korting → je betaalt 78% = 0.78×. €140,00 × 0.78 = €109,20." },
        { q: "25. 5% korting op €400,00 → eindprijs =", a: 380, exp: "5% korting → je betaalt 95% = 0.95×. €400,00 × 0.95 = €380,00." },
        { q: "26. €100,00 excl. btw, 21% → inclusief =", a: 121, exp: "Excl. → incl. met 21%: ×1.21. €100,00 × 1.21 = €121,00." },
        { q: "27. €150,00 excl. btw, 21% → inclusief =", a: 181.5, exp: "Excl. → incl. met 21%: ×1.21. €150,00 × 1.21 = €181,50." },
        { q: "28. €80,00 excl. btw, 9% → inclusief =", a: 87.2, exp: "Excl. → incl. met 9%: ×1.09. €80,00 × 1.09 = €87,20." },
        { q: "29. €220,00 excl. btw, 9% → inclusief =", a: 239.8, exp: "Excl. → incl. met 9%: ×1.09. €220,00 × 1.09 = €239,80." },
        { q: "30. €75,00 excl. btw, 21% → inclusief =", a: 90.75, exp: "Excl. → incl. met 21%: ×1.21. €75,00 × 1.21 = €90,75." },
        { q: "31. €121,00 inclusief 21% btw → exclusief =", a: 100, exp: "Incl. → excl. met 21%: ÷1.21. €121,00 ÷ 1.21 = €100,00." },
        { q: "32. €242,00 inclusief 21% btw → exclusief =", a: 200, exp: "Incl. → excl. met 21%: ÷1.21. €242,00 ÷ 1.21 = €200,00." },
        { q: "33. €87,20 inclusief 9% btw → exclusief =", a: 80, exp: "Incl. → excl. met 9%: ÷1.09. €87,20 ÷ 1.09 = €80,00." },
        { q: "34. €305,80 inclusief 9% btw → exclusief =", a: 280.55, exp: "Incl. → excl. met 9%: ÷1.09. €305,80 ÷ 1.09 = €280,55." },
        { q: "35. €181,50 inclusief 21% btw → exclusief =", a: 150, exp: "Incl. → excl. met 21%: ÷1.21. €181,50 ÷ 1.21 = €150,00." },
        { q: "36. Nu €750,00 na 25% korting → oude prijs =", a: 1000, exp: "Na 25% korting is de prijs 0.75× het origineel. Oude prijs = nieuw ÷ 0.75 = €1.000,00." },
        { q: "37. Nu €350,00 na 30% korting → oude prijs =", a: 500, exp: "Na 30% korting is de prijs 0.7× het origineel. Oude prijs = nieuw ÷ 0.7 = €500,00." },
        { q: "38. Nu €680,00 na 15% korting → oude prijs =", a: 800, exp: "Na 15% korting is de prijs 0.85× het origineel. Oude prijs = nieuw ÷ 0.85 = €800,00." },
        { q: "39. Nu €96,00 na 20% korting → oude prijs =", a: 120, exp: "Na 20% korting is de prijs 0.8× het origineel. Oude prijs = nieuw ÷ 0.8 = €120,00." },
        { q: "40. Nu €132,00 na 12% korting → oude prijs =", a: 150, exp: "Na 12% korting is de prijs 0.88× het origineel. Oude prijs = nieuw ÷ 0.88 = €150,00." },
        { q: "41. Nu €180,00 na 40% korting → oude prijs =", a: 300, exp: "Na 40% korting is de prijs 0.6× het origineel. Oude prijs = nieuw ÷ 0.6 = €300,00." },
        { q: "42. Nu €109,20 na 22% korting → oude prijs =", a: 140, exp: "Na 22% korting is de prijs 0.78× het origineel. Oude prijs = nieuw ÷ 0.78 = €140,00." },
        { q: "43. Nu €270,00 na 10% korting → oude prijs =", a: 300, exp: "Na 10% korting is de prijs 0.9× het origineel. Oude prijs = nieuw ÷ 0.9 = €300,00." },
        { q: "44. Nu €84,50 na 35% korting → oude prijs =", a: 130, exp: "Na 35% korting is de prijs 0.65× het origineel. Oude prijs = nieuw ÷ 0.65 = €130,00." },
        { q: "45. Nu €380,00 na 5% korting → oude prijs =", a: 400, exp: "Na 5% korting is de prijs 0.95× het origineel. Oude prijs = nieuw ÷ 0.95 = €400,00." },
        { q: "46. Waarde 250 stijgt met 10.0% → nieuwe waarde =", a: 275, exp: "stijgt met 10.0% → ×1.1. 250 × 1.1 = 275.0." },
        { q: "47. Waarde 480 daalt met 15.0% → nieuwe waarde =", a: 408, exp: "daalt met 15.0% → ×0.85. 480 × 0.85 = 408.0." },
        { q: "48. Waarde 900 stijgt met 8.0% → nieuwe waarde =", a: 972, exp: "stijgt met 8.0% → ×1.08. 900 × 1.08 = 972.0." },
        { q: "49. Waarde 360 daalt met 12.0% → nieuwe waarde =", a: 316.8, exp: "daalt met 12.0% → ×0.88. 360 × 0.88 = 316.8." },
        { q: "50. Waarde 128 stijgt met 25.0% → nieuwe waarde =", a: 160, exp: "stijgt met 25.0% → ×1.25. 128 × 1.25 = 160.0." },
        { q: "51. Waarde 740 daalt met 5.0% → nieuwe waarde =", a: 703, exp: "daalt met 5.0% → ×0.95. 740 × 0.95 = 703.0." },
        { q: "52. Waarde 50 stijgt met 30.0% → nieuwe waarde =", a: 65, exp: "stijgt met 30.0% → ×1.3. 50 × 1.3 = 65.0." },
        { q: "53. 15% is 18. Wat is 100%?", a: 120, exp: "15% = 18. 1% = 18/15 = 1.2. 100% = 120.0." },
        { q: "54. 12% is 24. Wat is 100%?", a: 200, exp: "12% = 24. 1% = 24/12 = 2.0. 100% = 200.0." },
        { q: "55. 8% is 36. Wat is 100%?", a: 450, exp: "8% = 36. 1% = 36/8 = 4.5. 100% = 450.0." },
        { q: "56. 25% is 47.5. Wat is 100%?", a: 190, exp: "25% = 47.5. 1% = 47.5/25 = 1.9. 100% = 190.0." },
        { q: "57. Welk percentage is 45 van 60? (antwoord in %) =", a: 75, exp: "(deel/geheel)×100 = (45/60)×100 = 75.0%." },
        { q: "58. Welk percentage is 72 van 90? (antwoord in %) =", a: 80, exp: "(deel/geheel)×100 = (72/90)×100 = 80.0%." },
        { q: "59. Welk percentage is 18 van 120? (antwoord in %) =", a: 15, exp: "(deel/geheel)×100 = (18/120)×100 = 15.0%." },
        { q: "60. Welk percentage is 37.5 van 150? (antwoord in %) =", a: 25, exp: "(deel/geheel)×100 = (37.5/150)×100 = 25.0%." },
      ],
    },
  ],
  breuken: [
    {
      title: "Breuken",
      description: "Kern: teller/noemer, vereenvoudigen, gelijknamig maken, optellen/aftrekken, vermenigvuldigen, delen, gemengde getallen, breuk van een getal.",
      items: [
        { q: "1. Vereenvoudig: 12/18", a: "2/3", exp: "Deel teller en noemer door 6 → 2/3." },
        { q: "2. Vereenvoudig: 15/25", a: "3/5", exp: "Deel teller en noemer door 5 → 3/5." },
        { q: "3. Vereenvoudig: 42/56", a: "3/4", exp: "Deel teller en noemer door 14 → 3/4." },
        { q: "4. Vereenvoudig: 48/60", a: "4/5", exp: "Deel teller en noemer door 12 → 4/5." },
        { q: "5. Vereenvoudig: 21/35", a: "3/5", exp: "Deel teller en noemer door 7 → 3/5." },
        { q: "6. Vereenvoudig: 36/54", a: "2/3", exp: "Deel teller en noemer door 18 → 2/3." },
        { q: "7. Vereenvoudig: 16/40", a: "2/5", exp: "Deel teller en noemer door 8 → 2/5." },
        { q: "8. Vereenvoudig: 27/45", a: "3/5", exp: "Deel teller en noemer door 9 → 3/5." },
        { q: "9. Vereenvoudig: 50/80", a: "5/8", exp: "Deel teller en noemer door 10 → 5/8." },
        { q: "10. Vereenvoudig: 63/84", a: "3/4", exp: "Deel teller en noemer door 21 → 3/4." },
        { q: "11. Vereenvoudig: 18/24", a: "3/4", exp: "Deel teller en noemer door 6 → 3/4." },
        { q: "12. Vereenvoudig: 32/48", a: "2/3", exp: "Deel teller en noemer door 16 → 2/3." },
        { q: "13. Zet om naar gemengd getal: 11/4", a: 2.75, exp: "11 ÷ 4 = 2 rest 3 → 2 3/4 (2.75)." },
        { q: "14. Zet om naar gemengd getal: 17/5", a: 3.4, exp: "17 ÷ 5 = 3 rest 2 → 3 2/5 (3.4)." },
        { q: "15. Zet om naar gemengd getal: 23/6", a: 3.833333, exp: "23 ÷ 6 = 3 rest 5 → 3 5/6 (≈3.833333)." },
        { q: "16. Zet om naar gemengd getal: 29/8", a: 3.625, exp: "29 ÷ 8 = 3 rest 5 → 3 5/8 (3.625)." },
        { q: "17. Zet om naar oneigen breuk: 2 3/4", a: "11/4", exp: "2 × 4 + 3 = 11 → 11/4." },
        { q: "18. Zet om naar oneigen breuk: 3 1/5", a: "16/5", exp: "3 × 5 + 1 = 16 → 16/5." },
        { q: "19. Zet om naar oneigen breuk: 1 5/6", a: "11/6", exp: "1 × 6 + 5 = 11 → 11/6." },
        { q: "20. Zet om naar oneigen breuk: 4 2/3", a: "14/3", exp: "4 × 3 + 2 = 14 → 14/3." },
        { q: "21. 2/7 + 3/7 =", a: "5/7", exp: "Gelijknamig: tel tellers op → 5/7." },
        { q: "22. 5/12 + 1/12 =", a: "1/2", exp: "5/12 + 1/12 = 6/12 → 1/2." },
        { q: "23. 7/20 + 9/20 =", a: "4/5", exp: "7/20 + 9/20 = 16/20 → 4/5." },
        { q: "24. 3/8 + 4/8 =", a: "7/8", exp: "Gelijknamig: 3 + 4 = 7 op noemer 8." },
        { q: "25. 11/15 + 2/15 =", a: "13/15", exp: "Gelijknamig: 11 + 2 = 13 → 13/15." },
        { q: "26. 3/4 + 2/3 =", a: "17/12", exp: "KGV(4,3)=12 → 9/12 + 8/12 = 17/12." },
        { q: "27. 5/6 + 1/4 =", a: "13/12", exp: "KGV(6,4)=12 → 10/12 + 3/12 = 13/12." },
        { q: "28. 7/9 + 2/5 =", a: "53/45", exp: "KGV(9,5)=45 → 35/45 + 18/45 = 53/45." },
        { q: "29. 3/10 + 1/6 =", a: "7/15", exp: "KGV(10,6)=30 → 9/30 + 5/30 = 14/30 = 7/15." },
        { q: "30. 4/7 + 5/14 =", a: "13/14", exp: "4/7 = 8/14 → 8/14 + 5/14 = 13/14." },
        { q: "31. 7/12 − 3/12 =", a: "1/3", exp: "(7 − 3)/12 = 4/12 = 1/3." },
        { q: "32. 9/20 − 4/20 =", a: "1/4", exp: "(9 − 4)/20 = 5/20 = 1/4." },
        { q: "33. 11/15 − 1/15 =", a: "2/3", exp: "(11 − 1)/15 = 10/15 = 2/3." },
        { q: "34. 5/8 − 2/8 =", a: "3/8", exp: "(5 − 2)/8 = 3/8." },
        { q: "35. 5/6 − 1/4 =", a: "7/12", exp: "KGV(6,4)=12 → 10/12 − 3/12 = 7/12." },
        { q: "36. 7/9 − 1/3 =", a: "4/9", exp: "1/3 = 3/9 → 7/9 − 3/9 = 4/9." },
        { q: "37. 11/12 − 5/8 =", a: "7/24", exp: "KGV(12,8)=24 → 22/24 − 15/24 = 7/24." },
        { q: "38. 5/7 − 2/5 =", a: "11/35", exp: "KGV(7,5)=35 → 25/35 − 14/35 = 11/35." },
        { q: "39. (3/5) × (10/9) =", a: "2/3", exp: "Vermenigvuldig tellers/noemers en vereenvoudig → 30/45 = 2/3." },
        { q: "40. (2/7) × (7/3) =", a: "2/3", exp: "Na vereenvoudigen blijft 2/3 over." },
        { q: "41. (5/8) × (12/15) =", a: "1/2", exp: "60/120 = 1/2." },
        { q: "42. (4/9) × (3/16) =", a: "1/12", exp: "12/144 = 1/12." },
        { q: "43. (7/12) × (6/7) =", a: "1/2", exp: "42/84 = 1/2." },
        { q: "44. (9/10) × (5/18) =", a: "1/4", exp: "45/180 = 1/4." },
        { q: "45. (11/14) × (7/22) =", a: "1/4", exp: "77/308 = 1/4." },
        { q: "46. (3/4) × (2/9) =", a: "1/6", exp: "6/36 = 1/6." },
        { q: "47. (4/7) ÷ (2/3) =", a: "6/7", exp: "Delen = vermenigvuldigen met omgekeerde → 12/14 = 6/7." },
        { q: "48. (5/8) ÷ (10/3) =", a: "3/16", exp: "(5/8) × (3/10) = 15/80 = 3/16." },
        { q: "49. (7/9) ÷ (14/27) =", a: "3/2", exp: "(7/9) × (27/14) = 189/126 = 3/2." },
        { q: "50. (3/5) ÷ (9/10) =", a: "2/3", exp: "(3/5) × (10/9) = 30/45 = 2/3." },
        { q: "51. (8/15) ÷ (4/9) =", a: "6/5", exp: "(8/15) × (9/4) = 72/60 = 6/5." },
        { q: "52. (2/3) ÷ (5/12) =", a: "8/5", exp: "(2/3) × (12/5) = 24/15 = 8/5." },
        { q: "53. (11/12) ÷ (22/9) =", a: "3/8", exp: "(11/12) × (9/22) = 99/264 = 3/8." },
        { q: "54. (5/6) ÷ (25/18) =", a: "3/5", exp: "(5/6) × (18/25) = 90/150 = 3/5." },
        { q: "55. 3/8 van 64 =", a: 24, exp: "64 ÷ 8 = 8 → 8 × 3 = 24." },
        { q: "56. 5/12 van 144 =", a: 60, exp: "144 ÷ 12 = 12 → 12 × 5 = 60." },
        { q: "57. 7/20 van 200 =", a: 70, exp: "200 ÷ 20 = 10 → 10 × 7 = 70." },
        { q: "58. 2/5 van 85 =", a: 34, exp: "85 ÷ 5 = 17 → 17 × 2 = 34." },
        { q: "59. 9/10 van 70 =", a: 63, exp: "70 ÷ 10 = 7 → 7 × 9 = 63." },
        { q: "60. 11/12 van 132 =", a: 121, exp: "132 ÷ 12 = 11 → 11 × 11 = 121." },
      ],
    },
  ],
  meten: [
    {
      title: "Oppervlakte",
      description: "Bereken de oppervlakte van vierkanten, cirkels en driehoeken.",
      items: (() => {
        const results: Question[] = [];
        for (let i = 0; i < 60; i++) {
          const s = ["square", "circle", "triangle"][i % 3];
          const v = +(2 + (i % 4) * 0.7 + i * 0.015).toFixed(2);
          if (s === "square") {
            const ans = +(v * v).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de oppervlakte van het vierkant met zijde ${v} m.`, a: ans, exp: `Oppervlakte = ${v} × ${v} = ${ans} m².` });
          } else if (s === "circle") {
            const ans = +(3.14 * v * v).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de oppervlakte van de cirkel met straal ${v} m.`, a: ans, exp: `Oppervlakte = 3,14 × ${v}² = ${ans} m².` });
          } else {
            const h = +(v * 1.4).toFixed(2);
            const ans = +(0.5 * v * h).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de oppervlakte van de driehoek met basis ${v} m en hoogte ${h} m.`, a: ans, exp: `Oppervlakte = 0,5 × ${v} × ${h} = ${ans} m².` });
          }
        }
        return results;
      })(),
    },
    {
      title: "Omtrek",
      description: "Bereken de omtrek van vierkanten, cirkels en driehoeken.",
      items: (() => {
        const results: Question[] = [];
        for (let i = 0; i < 60; i++) {
          const s = ["square", "circle", "triangle"][i % 3];
          const v = +(2 + (i % 4) * 0.7 + i * 0.015).toFixed(2);
          if (s === "square") {
            const ans = +(4 * v).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de omtrek van het vierkant met zijde ${v} m.`, a: ans, exp: `Omtrek = 4 × ${v} = ${ans} m.` });
          } else if (s === "circle") {
            const ans = +(2 * 3.14 * v).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de omtrek van de cirkel met straal ${v} m.`, a: ans, exp: `Omtrek = 2 × π × r ≈ 2 × 3,14 × ${v} = ${ans} m.` });
          } else {
            const b = v;
            const s2 = +(v * 1.2).toFixed(2);
            const s3 = +(v * 1.4).toFixed(2);
            const ans = +(b + s2 + s3).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de omtrek van de driehoek met zijden ${b} m, ${s2} m en ${s3} m.`, a: ans, exp: `Omtrek = ${b} + ${s2} + ${s3} = ${ans} m.` });
          }
        }
        return results;
      })(),
    },
    {
      title: "Inhoud",
      description: "Bereken de inhoud van kubussen, cilinders en prisma's.",
      items: (() => {
        const results: Question[] = [];
        for (let i = 0; i < 60; i++) {
          const s = ["cube", "cylinder", "prism"][i % 3];
          const a = +(2 + (i % 5) * 0.6 + i * 0.01).toFixed(2);
          const b = +(3 + (i % 4) * 0.4).toFixed(2);
          const h = +(2 + (i % 3) * 0.5).toFixed(2);
          if (s === "cube") {
            const ans = +(a * a * a).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de inhoud van de kubus met ribbe ${a} m.`, a: ans, exp: `Inhoud kubus = ribbe³ = ${a} × ${a} × ${a} = ${ans} m³.` });
          } else if (s === "cylinder") {
            const ans = +(3.14 * a * a * h).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de inhoud van de cilinder met straal ${a} m en hoogte ${h} m.`, a: ans, exp: `Inhoud cilinder = πr²h ≈ 3,14 × ${a}² × ${h} = ${ans} m³.` });
          } else {
            const ans = +(0.5 * a * b * h).toFixed(2);
            results.push({ q: `${i + 1}. Bereken de inhoud van het prisma met driehoekige basis (b=${a} m, h=${b} m) en hoogte ${h} m.`, a: ans, exp: `Inhoud prisma = (1/2 × b × h) × hoogte = 0,5×${a}×${b}×${h} = ${ans} m³.` });
          }
        }
        return results;
      })(),
    },
    {
      title: "Omrekenen",
      description: "Omrekenen van eenheden: km↔m, cm↔m, minuten↔seconden, snelheid.",
      items: (() => {
        const results: Question[] = [];
        for (let i = 0; i < 60; i++) {
          const type = i % 5;
          if (type === 0) {
            const km = +(2 + i * 0.1).toFixed(2);
            const ans = +(km * 1000).toFixed(2);
            results.push({ q: `${i + 1}. Zet ${km} km om naar meter.`, a: ans, exp: `${km} km × 1000 = ${ans} m.` });
          } else if (type === 1) {
            const m = +(500 + i * 3).toFixed(2);
            const ans = +(m / 1000).toFixed(3);
            results.push({ q: `${i + 1}. Zet ${m} m om naar kilometer.`, a: ans, exp: `${m} ÷ 1000 = ${ans} km.` });
          } else if (type === 2) {
            const min = 30 + i;
            const ans = min * 60;
            results.push({ q: `${i + 1}. Zet ${min} minuten om naar seconden.`, a: ans, exp: `${min} × 60 = ${ans} sec.` });
          } else if (type === 3) {
            const cm = 50 + i * 2;
            const ans = +(cm / 100).toFixed(2);
            results.push({ q: `${i + 1}. Zet ${cm} cm om naar meter.`, a: ans, exp: `${cm} ÷ 100 = ${ans} m.` });
          } else {
            const km = 10 + i;
            const t = 2 + i * 0.1;
            const ans = +(km / t).toFixed(2);
            results.push({ q: `${i + 1}. Bereken snelheid: ${km} km in ${t} uur.`, a: ans, exp: `snelheid = afstand ÷ tijd = ${km} ÷ ${t} = ${ans} km/u.` });
          }
        }
        return results;
      })(),
    },
  ],
};

const QuizSet: React.FC<{ items: Question[] }> = ({ items }) => {
  const [answers, setAnswers] = React.useState<string[]>(() => Array(items.length).fill(""));
  const [feedback, setFeedback] = React.useState<string[]>(() => Array(items.length).fill(""));
  const [explanations, setExplanations] = React.useState<string[]>(() => Array(items.length).fill(""));
  const [score, setScore] = React.useState("");

  React.useEffect(() => {
    setAnswers(Array(items.length).fill(""));
    setFeedback(Array(items.length).fill(""));
    setExplanations(Array(items.length).fill(""));
    setScore("");
  }, [items]);

  const normalize = React.useCallback((value: string) => {
    let v = value.trim();
    if (v.includes("%")) {
      v = v.replace(/%/g, "");
    }
    if (v.includes("/")) {
      const parts = v.split("/");
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0].replace(",", "."));
        const denominator = parseFloat(parts[1].replace(",", "."));
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return (numerator / denominator).toString();
        }
      }
    }
    return v.replace(",", ".");
  }, []);

  const parseRatio = React.useCallback((value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned.includes(":")) {
      return null;
    }
    const parts = cleaned.split(":");
    if (parts.length !== 2) {
      return null;
    }
    const left = parseFloat(parts[0].replace(",", "."));
    const right = parseFloat(parts[1].replace(",", "."));
    if (isNaN(left) || isNaN(right) || right === 0) {
      return null;
    }
    return { left, right };
  }, []);

  const equal = React.useCallback(
    (input: string, expected: number | string) => {
      const expectedRatio = typeof expected === "string" ? parseRatio(expected) : null;
      const inputRatio = parseRatio(input);

      if (expectedRatio) {
        if (inputRatio) {
          const cross = Math.abs(expectedRatio.left * inputRatio.right - expectedRatio.right * inputRatio.left);
          return cross < 0.0001;
        }
        const parsedInput = parseFloat(normalize(input));
        if (isNaN(parsedInput)) {
          return false;
        }
        const target = expectedRatio.left / expectedRatio.right;
        return Math.abs(parsedInput - target) <= 0.01;
      }

      const normalizedExpected = typeof expected === "string" ? parseFloat(normalize(expected)) : expected;
      const parsedInput = parseFloat(normalize(input));

      if (isNaN(parsedInput) || isNaN(normalizedExpected)) {
        return typeof expected === "string" && normalize(input).toLowerCase() === normalize(expected).toLowerCase();
      }

      const tolerance = Math.floor(normalizedExpected) === normalizedExpected ? 0 : 0.01;
      return Math.abs(parsedInput - normalizedExpected) <= tolerance;
    },
    [normalize, parseRatio]
  );

  const handleCheck = React.useCallback(() => {
    let correct = 0;
    const updatedFeedback = items.map((item, index) => {
      const ok = equal(answers[index], item.a);
      if (ok) {
        correct++;
      }
      return ok ? "Goed ✔" : "Fout ✘";
    });
    setFeedback(updatedFeedback);
    setExplanations(Array(items.length).fill(""));
    setScore(`Score: ${correct}/${items.length}`);
  }, [answers, equal, items]);

  const handleShow = React.useCallback(() => {
    setFeedback(items.map((item) => `Antwoord: ${item.a}`));
    setExplanations(items.map((item) => item.exp || ""));
    setScore("");
  }, [items]);

  const handleReset = React.useCallback(() => {
    setAnswers(Array(items.length).fill(""));
    setFeedback(Array(items.length).fill(""));
    setExplanations(Array(items.length).fill(""));
    setScore("");
  }, [items]);

  const handleChange = React.useCallback(
    (value: string, index: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 border border-sky-100 shadow-md rounded-xl p-6 space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[minmax(360px,1.6fr)_minmax(200px,0.8fr)_minmax(160px,0.6fr)] gap-5 items-start"
          >
            <div className="text-foreground">{item.q}</div>
            <input
              className="border rounded-lg p-2 bg-background text-foreground"
              value={answers[index]}
              onChange={(event) => handleChange(event.target.value, index)}
            />
            <div className={feedback[index]?.includes("Goed") ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {feedback[index]}
            </div>
            {explanations[index] && (
              <details className="md:col-span-3 bg-sky-50 border border-sky-200 rounded-lg p-3">
                <summary className="cursor-pointer text-sm font-semibold text-sky-900">Uitleg</summary>
                <p className="mt-2 text-sm text-sky-900/80">{explanations[index]}</p>
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Button onClick={handleCheck}>Controleer</Button>
        <Button variant="secondary" onClick={handleShow}>
          Toon antwoorden + uitleg
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Wissen
        </Button>
        <span className="font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
};

const PracticeQuestions = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const domainSets = questionsByDomain[domain || ""] || [];

  if (domainSets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Geen vragen beschikbaar voor dit domein.</p>
      </div>
    );
  }

  const domainTitle =
    domain === "getallen"
      ? "Getallen"
      : domain === "verhoudingen"
      ? "Verhoudingen"
      : domain === "breuken"
      ? "Breuken"
      : domain === "verbanden"
      ? "Verbanden"
      : domain === "procenten"
      ? "Procenten"
      : domain === "meten"
      ? "Meten en meetkunde"
      : domain;
  const totalQuestions = domainSets.reduce((sum, set) => sum + set.items.length, 0);
  const infoText = domainSets.length > 1 ? `${totalQuestions} vragen over ${domainSets.length} sets – automatische controle` : `${totalQuestions} vragen – automatische controle`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <h1 className="text-3xl font-bold text-foreground">Oefenen – {domainTitle}</h1>
          <p className="text-muted-foreground mt-2">{infoText}</p>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {domainSets.map((set, index) => (
            <AccordionItem key={set.title} value={`set-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold bg-sky-100 hover:bg-sky-100/80 rounded-lg px-4">
                {set.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 bg-sky-50/60 border border-sky-100 rounded-lg px-4 py-6">
                {set.description && <p className="text-sm text-muted-foreground">{set.description}</p>}
                <QuizSet items={set.items} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10">
          <Button variant="outline" onClick={() => navigate(`/oefenen/${domain}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar uitleg
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestions;
