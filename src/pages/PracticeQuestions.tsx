import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Question = { q: string; a: number; exp?: string };
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
      title: "Verbanden – Auto-check 60",
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

  const equal = React.useCallback(
    (input: string, expected: number) => {
      const parsed = parseFloat(normalize(input));
      if (isNaN(parsed) || isNaN(expected)) {
        return false;
      }
      const tolerance = Math.floor(expected) === expected ? 0 : 0.01;
      return Math.abs(parsed - expected) <= tolerance;
    },
    [normalize]
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

  const domainTitle = domain === "getallen" ? "Getallen" : domain === "verbanden" ? "Verbanden" : domain;
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
