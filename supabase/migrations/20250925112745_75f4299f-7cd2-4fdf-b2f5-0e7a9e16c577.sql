-- Update existing basis level to 1f
UPDATE public.questions SET level = '1f' WHERE level = 'basis';
UPDATE public.quiz_submissions SET level = '1f' WHERE level = 'basis';

-- Delete all existing 1f questions to replace with new ones
DELETE FROM public.questions WHERE level = '1f';

-- Insert new 1F questions
-- Domain 1 - Getallen
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('47 + 26 = ...', '["73", "63", "72", "83"]', 0, '1f', 'Getallen'),
('84 - 29 = ...', '["55", "65", "56", "45"]', 0, '1f', 'Getallen'),
('6 × 7 = ...', '["42", "48", "36", "54"]', 0, '1f', 'Getallen'),
('56 ÷ 8 = ...', '["7", "6", "8", "9"]', 0, '1f', 'Getallen'),
('Rond 23,68 af op 1 decimaal.', '["23,7", "23,6", "24,0", "23,8"]', 0, '1f', 'Getallen'),
('120 - 85 = ...', '["35", "45", "25", "55"]', 0, '1f', 'Getallen'),
('3 × 25 = ...', '["75", "65", "85", "95"]', 0, '1f', 'Getallen'),
('300 ÷ 10 = ...', '["30", "3", "300", "33"]', 0, '1f', 'Getallen'),
('Gemiddelde van 5, 10 en 15 = ...', '["10", "15", "12", "8"]', 0, '1f', 'Getallen'),
('2,4 + 1,8 = ...', '["4,2", "3,2", "4,8", "3,8"]', 0, '1f', 'Getallen'),
('5² = ...', '["25", "10", "15", "20"]', 0, '1f', 'Getallen'),
('90 ÷ 9 = ...', '["10", "9", "11", "8"]', 0, '1f', 'Getallen'),
('1/2 van 48 = ...', '["24", "12", "36", "18"]', 0, '1f', 'Getallen'),
('10 × 0,5 = ...', '["5", "50", "0,5", "15"]', 0, '1f', 'Getallen'),
('250 + 75 = ...', '["325", "175", "300", "350"]', 0, '1f', 'Getallen');

-- Domain 2 - Verhoudingen  
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('De helft van 24 = ...', '["12", "8", "16", "10"]', 0, '1f', 'Verhoudingen'),
('3 van de 10 kinderen dragen een bril. Hoeveel procent?', '["30%", "3%", "13%", "33%"]', 0, '1f', 'Verhoudingen'),
('2 : 5 = ? : 100', '["40", "25", "50", "20"]', 0, '1f', 'Verhoudingen'),
('1/4 van 200 = ...', '["50", "25", "75", "100"]', 0, '1f', 'Verhoudingen'),
('Een fiets kost €400, korting 25%. Nieuwe prijs?', '["€300", "€350", "€325", "€275"]', 0, '1f', 'Verhoudingen'),
('12 l limonade, verhouding siroop:water = 1:3. Hoeveel siroop?', '["3 l", "4 l", "2 l", "6 l"]', 0, '1f', 'Verhoudingen'),
('8 jongens, 12 meisjes. Verhouding = ... : ...', '["2:3", "3:2", "4:6", "1:2"]', 0, '1f', 'Verhoudingen'),
('25% van 80 = ...', '["20", "25", "15", "30"]', 0, '1f', 'Verhoudingen'),
('Kaart schaal 1:1000. Hoeveel cm is 50 m?', '["5 cm", "50 cm", "0,5 cm", "500 cm"]', 0, '1f', 'Verhoudingen'),
('3/5 als percentage = ...', '["60%", "35%", "53%", "65%"]', 0, '1f', 'Verhoudingen'),
('Een klas 30 kinderen. 2/3 meisjes. Hoeveel jongens?', '["10", "20", "15", "5"]', 0, '1f', 'Verhoudingen'),
('Een pak koekjes €2,50. Hoeveel kosten 4 pakken?', '["€10", "€8", "€12", "€6"]', 0, '1f', 'Verhoudingen'),
('5 : 20 = ? : 100', '["25", "20", "15", "30"]', 0, '1f', 'Verhoudingen'),
('Prijs stijgt van €20 naar €25. % stijging?', '["25%", "20%", "5%", "15%"]', 0, '1f', 'Verhoudingen'),
('0,2 = ... %', '["20%", "2%", "0,2%", "200%"]', 0, '1f', 'Verhoudingen');

-- Domain 3 - Meten & Meetkunde
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Hoeveel cm is 2 meter?', '["200 cm", "20 cm", "2000 cm", "0,2 cm"]', 0, '1f', 'Meten & Meetkunde'),
('Een rechthoek 3×2 m. Oppervlakte = ...', '["6 m²", "10 m²", "5 m²", "12 m²"]', 0, '1f', 'Meten & Meetkunde'),
('Hoeveel minuten in 1,5 uur?', '["90 min", "150 min", "60 min", "75 min"]', 0, '1f', 'Meten & Meetkunde'),
('Een fles 1,5 liter. Hoeveel cl?', '["150 cl", "15 cl", "1500 cl", "1,5 cl"]', 0, '1f', 'Meten & Meetkunde'),
('Omtrek van vierkant zijde 5 cm = ...', '["20 cm", "25 cm", "10 cm", "15 cm"]', 0, '1f', 'Meten & Meetkunde'),
('Kamer 4×3 m. Omtrek = ...', '["14 m", "12 m", "7 m", "24 m"]', 0, '1f', 'Meten & Meetkunde'),
('250 ml = ... liter', '["0,25 l", "2,5 l", "25 l", "0,025 l"]', 0, '1f', 'Meten & Meetkunde'),
('Driehoek basis 6 cm, hoogte 4 cm. Oppervlakte = ...', '["12 cm²", "24 cm²", "10 cm²", "6 cm²"]', 0, '1f', 'Meten & Meetkunde'),
('100 cm = ... m', '["1 m", "10 m", "0,1 m", "1000 m"]', 0, '1f', 'Meten & Meetkunde'),
('Doos 10×5×4 cm. Inhoud = ...', '["200 cm³", "190 cm³", "54 cm³", "38 cm³"]', 0, '1f', 'Meten & Meetkunde'),
('Hoeveel dagen in 2 weken?', '["14", "7", "21", "10"]', 0, '1f', 'Meten & Meetkunde'),
('5000 g = ... kg', '["5 kg", "50 kg", "0,5 kg", "500 kg"]', 0, '1f', 'Meten & Meetkunde'),
('Cirkel straal 7 cm. Omtrek = ... (π=3,14)', '["43,96 cm", "21,98 cm", "153,86 cm", "49 cm"]', 0, '1f', 'Meten & Meetkunde'),
('3,5 km = ... m', '["3500 m", "350 m", "35 m", "35000 m"]', 0, '1f', 'Meten & Meetkunde'),
('Auto rijdt 60 km in 2 uur. Snelheid = ...', '["30 km/h", "120 km/h", "60 km/h", "15 km/h"]', 0, '1f', 'Meten & Meetkunde');

-- Domain 4 - Verbanden
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Een pak melk kost €1,20. Hoeveel kosten 3 pakken?', '["€3,60", "€2,40", "€4,20", "€1,80"]', 0, '1f', 'Verbanden'),
('Bus 8:15–9:00. Hoe lang?', '["45 min", "15 min", "30 min", "1 uur"]', 0, '1f', 'Verbanden'),
('Tabel: x=1,2,3 → y=2x', '["y=2,4,6", "y=1,2,3", "y=3,4,5", "y=2,3,4"]', 0, '1f', 'Verbanden'),
('Telefoon €240 in 12 maanden. Bedrag/maand?', '["€20", "€24", "€30", "€15"]', 0, '1f', 'Verbanden'),
('10 snoepjes €2,00. Hoeveel 25 snoepjes?', '["€5,00", "€4,00", "€6,00", "€2,50"]', 0, '1f', 'Verbanden'),
('Bij x=5 hoort y=10. Bij x=10 hoort y=...', '["20", "15", "25", "5"]', 0, '1f', 'Verbanden'),
('Temp stijgt 12→18 °C. Verschil = ...', '["6°C", "30°C", "12°C", "18°C"]', 0, '1f', 'Verbanden'),
('Broek €40, korting 10%. Nieuwe prijs = ...', '["€36", "€30", "€44", "€35"]', 0, '1f', 'Verbanden'),
('Auto rijdt 150 km in 3 uur. Snelheid = ...', '["50 km/h", "450 km/h", "47 km/h", "153 km/h"]', 0, '1f', 'Verbanden'),
('Lezen 14:30–15:10. Duur = ...', '["40 min", "80 min", "1 uur", "20 min"]', 0, '1f', 'Verbanden'),
('Tabel: x=0,1,2,3 → y=x+4', '["y=4,5,6,7", "y=0,1,2,3", "y=4,4,4,4", "y=0,5,6,7"]', 0, '1f', 'Verbanden'),
('Taxi: €3 start + €1/km. Kosten 5 km?', '["€8", "€5", "€3", "€15"]', 0, '1f', 'Verbanden'),
('Een getal wordt 2× zo groot. 15 → ...', '["30", "17", "13", "7,5"]', 0, '1f', 'Verbanden'),
('Prijs daalt €50→€40. % daling?', '["20%", "10%", "25%", "€10"]', 0, '1f', 'Verbanden'),
('y=10-x, bij x=6 → y=?', '["4", "16", "60", "-4"]', 0, '1f', 'Verbanden');

-- Domain 5 - Breuken
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('1/2 + 1/2 = ...', '["1", "1/4", "2/4", "2/2"]', 0, '1f', 'Breuken'),
('3/4 - 1/4 = ...', '["2/4", "1/2", "4/8", "2/8"]', 0, '1f', 'Breuken'),
('2/3 × 3 = ...', '["2", "6/9", "2/9", "6/3"]', 0, '1f', 'Breuken'),
('6 ÷ 1/2 = ...', '["12", "3", "6", "1/12"]', 0, '1f', 'Breuken'),
('Vereenvoudig 6/12', '["1/2", "3/6", "2/4", "12/6"]', 0, '1f', 'Breuken'),
('0,25 als breuk = ...', '["1/4", "25/100", "2/8", "3/12"]', 0, '1f', 'Breuken'),
('1/4 = ... %', '["25%", "4%", "14%", "40%"]', 0, '1f', 'Breuken'),
('30 minuten is welk deel van 1 uur?', '["1/2", "1/3", "1/4", "2/3"]', 0, '1f', 'Breuken'),
('3/5 van 100 = ...', '["60", "35", "53", "300"]', 0, '1f', 'Breuken'),
('2 1/2 als onvolledige breuk = ...', '["5/2", "21/2", "2/12", "3/2"]', 0, '1f', 'Breuken'),
('5/10 - 2/10 = ...', '["3/10", "3/20", "7/10", "3/0"]', 0, '1f', 'Breuken'),
('2/3 × 9 = ...', '["6", "18/3", "11/3", "2/27"]', 0, '1f', 'Breuken'),
('1/5 van 50 = ...', '["10", "5", "55", "250"]', 0, '1f', 'Breuken'),
('Pizza 8 stukken, 3 gegeten. Deel = ...', '["3/8", "5/8", "3/5", "8/3"]', 0, '1f', 'Breuken'),
('150% als breuk = ...', '["3/2", "15/10", "150/1", "1/150"]', 0, '1f', 'Breuken');