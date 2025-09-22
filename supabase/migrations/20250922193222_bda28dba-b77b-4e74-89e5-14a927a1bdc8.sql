-- Add all f2 questions with domains
-- Domain 1 - Getallen
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('347 + 289 = ?', '["636", "526", "537", "626"]', 0, 'f2', 'Getallen'),
('15 × 24 = ?', '["350", "360", "370", "340"]', 1, 'f2', 'Getallen'),
('872 − 459 = ?', '["413", "423", "403", "433"]', 0, 'f2', 'Getallen'),
('540 ÷ 9 = ?', '["50", "60", "70", "80"]', 1, 'f2', 'Getallen'),
('Rond 38,746 af op 1 decimaal.', '["38,7", "38,8", "39,0", "38,75"]', 0, 'f2', 'Getallen'),
('3,6 × 100 = ?', '["360", "36", "3600", "0,36"]', 0, 'f2', 'Getallen'),
('25% van 160 = ?', '["40", "35", "45", "50"]', 0, 'f2', 'Getallen'),
('1/5 van 350 = ?', '["60", "70", "80", "90"]', 1, 'f2', 'Getallen'),
('12² = ?', '["144", "124", "164", "134"]', 0, 'f2', 'Getallen'),
('3³ = ?', '["27", "9", "18", "24"]', 0, 'f2', 'Getallen'),
('Gemiddelde van 8, 12, 14 = ?', '["11,3", "11", "12", "10"]', 0, 'f2', 'Getallen'),
('4,5 + 2,75 = ?', '["7,25", "7,20", "6,25", "7,50"]', 0, 'f2', 'Getallen'),
('0,6 × 0,3 = ?', '["0,18", "0,9", "1,8", "0,03"]', 0, 'f2', 'Getallen'),
('6.400 ÷ 100 = ?', '["64", "640", "6,4", "0,64"]', 0, 'f2', 'Getallen'),
('Schrijf 0,75 als breuk.', '["3/4", "2/3", "4/5", "7/10"]', 0, 'f2', 'Getallen');

-- Domain 2 - Verhoudingen  
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('36 van 48 stoelen bezet. Hoeveel %?', '["75%", "65%", "80%", "70%"]', 0, 'f2', 'Verhoudingen'),
('Deel 180 in verhouding 2:3.', '["72 en 108", "60 en 120", "90 en 90", "75 en 105"]', 0, 'f2', 'Verhoudingen'),
('5 : 20 = ? : 100', '["25", "30", "20", "15"]', 0, 'f2', 'Verhoudingen'),
('1 op 8 mensen draagt bril. Hoeveel van 400?', '["50", "40", "60", "45"]', 0, 'f2', 'Verhoudingen'),
('3 kg appels = €6. Wat kosten 5 kg?', '["€10", "€12", "€8", "€15"]', 0, 'f2', 'Verhoudingen'),
('2:3 omzetten naar %.', '["66,7%", "60%", "70%", "65%"]', 0, 'f2', 'Verhoudingen'),
('45 leerlingen (2:3). Hoeveel meisjes?', '["27", "18", "20", "25"]', 0, 'f2', 'Verhoudingen'),
('Vergelijk 4/5 en 0,78.', '["4/5 > 0,78", "4/5 < 0,78", "4/5 = 0,78", "Niet te vergelijken"]', 0, 'f2', 'Verhoudingen'),
('Kaart schaal 1:100.000. Hoeveel cm is 5 km?', '["5 cm", "50 cm", "0,5 cm", "500 cm"]', 0, 'f2', 'Verhoudingen'),
('12 l limonade, 1:5 siroop:water. Hoeveel siroop?', '["2 liter", "1,5 liter", "2,5 liter", "3 liter"]', 0, 'f2', 'Verhoudingen'),
('18 snoepjes (2:3:1). Hoeveel groen?', '["9", "6", "3", "12"]', 2, 'f2', 'Verhoudingen'),
('€50 → €55. % stijging?', '["10%", "5%", "15%", "12%"]', 0, 'f2', 'Verhoudingen'),
('2/3 = ? %', '["66,7%", "67%", "60%", "70%"]', 0, 'f2', 'Verhoudingen'),
('Recept 4p. Hoeveel voor 10p?', '["2,5 × groter", "2 × groter", "3 × groter", "1,5 × groter"]', 0, 'f2', 'Verhoudingen'),
('25 km/u in m/s.', '["6,94 m/s", "7 m/s", "6 m/s", "8 m/s"]', 0, 'f2', 'Verhoudingen');

-- Domain 3 - Meten & Meetkunde
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Kamer 4,5 × 3,2 m. Oppervlakte?', '["14,4 m²", "15,36 m²", "13,8 m²", "16,2 m²"]', 0, 'f2', 'Meten & Meetkunde'),
('1,75 m = ? cm', '["175 cm", "17,5 cm", "1750 cm", "0,175 cm"]', 0, 'f2', 'Meten & Meetkunde'),
('Omtrek 5 × 7 m.', '["24 m", "23 m", "25 m", "26 m"]', 0, 'f2', 'Meten & Meetkunde'),
('Kubus ribbe 4 cm. Inhoud?', '["64 cm³", "48 cm³", "16 cm³", "32 cm³"]', 0, 'f2', 'Meten & Meetkunde'),
('250 ml = ? l', '["0,25 liter", "2,5 liter", "25 liter", "0,025 liter"]', 0, 'f2', 'Meten & Meetkunde'),
('Hoeveel minuten in 2,5 uur?', '["150 min", "125 min", "175 min", "200 min"]', 0, 'f2', 'Meten & Meetkunde'),
('Cirkel straal 7 cm. Omtrek?', '["44 cm", "22 cm", "88 cm", "14 cm"]', 0, 'f2', 'Meten & Meetkunde'),
('1,5 l = ? cl', '["150 cl", "15 cl", "1500 cl", "1,5 cl"]', 0, 'f2', 'Meten & Meetkunde'),
('4500 cm² = ? m²', '["0,45 m²", "45 m²", "450 m²", "4,5 m²"]', 0, 'f2', 'Meten & Meetkunde'),
('Driehoek 8 × 5 cm. Oppervlakte?', '["20 cm²", "40 cm²", "13 cm²", "30 cm²"]', 0, 'f2', 'Meten & Meetkunde'),
('2,5 km = ? m', '["2500 m", "250 m", "25000 m", "25 m"]', 0, 'f2', 'Meten & Meetkunde'),
('Doos 30×20×10 cm. Inhoud?', '["6000 cm³", "6 liter", "60 liter", "600 cm³"]', 0, 'f2', 'Meten & Meetkunde'),
('12 weken = ? dagen', '["84 dagen", "72 dagen", "96 dagen", "88 dagen"]', 0, 'f2', 'Meten & Meetkunde'),
('1000 g = ? kg', '["1 kg", "10 kg", "0,1 kg", "100 kg"]', 0, 'f2', 'Meten & Meetkunde'),
('90 km in 1,5 u. Snelheid?', '["60 km/u", "135 km/u", "45 km/u", "75 km/u"]', 0, 'f2', 'Meten & Meetkunde');

-- Domain 4 - Verbanden
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Taxi: €2,50 + €1,20/km. Kosten 10 km?', '["€14,50", "€12,00", "€15,00", "€13,50"]', 0, 'f2', 'Verbanden'),
('Tabel: y=2x+5, x=1,2,3,4.', '["7, 9, 11, 13", "6, 8, 10, 12", "5, 7, 9, 11", "8, 10, 12, 14"]', 0, 'f2', 'Verbanden'),
('x=3 → y=12 en x=6 → y=24. Helling?', '["4", "3", "6", "2"]', 0, 'f2', 'Verbanden'),
('Bus 9:15−11:05. Duur?', '["1 u 50 min", "1 u 45 min", "2 u 5 min", "1 u 55 min"]', 0, 'f2', 'Verbanden'),
('€600 in 24 termijnen. Bedrag/maand?', '["€25", "€30", "€20", "€35"]', 0, 'f2', 'Verbanden'),
('20 → 25 leerlingen. % toename?', '["25%", "20%", "30%", "15%"]', 0, 'f2', 'Verbanden'),
('y=3x, y bij x=7?', '["21", "24", "18", "27"]', 0, 'f2', 'Verbanden'),
('Temp. 18→7 °C. Verschil?', '["11 °C", "25 °C", "7 °C", "18 °C"]', 0, 'f2', 'Verbanden'),
('€50 excl. btw (21%). Incl.?', '["€60,50", "€71", "€55,50", "€65"]', 0, 'f2', 'Verbanden'),
('240 km in 3 u. Snelheid?', '["80 km/u", "70 km/u", "90 km/u", "75 km/u"]', 0, 'f2', 'Verbanden'),
('Tabel: x=0,1,2,3 → y=x²', '["0, 1, 4, 9", "1, 2, 3, 4", "0, 1, 2, 3", "1, 4, 8, 12"]', 0, 'f2', 'Verbanden'),
('4 broden €8. 7 broden?', '["€14", "€12", "€16", "€10"]', 0, 'f2', 'Verbanden'),
('Korting 15% op €120. Bedrag?', '["€102", "€105", "€108", "€100"]', 0, 'f2', 'Verbanden'),
('Omzet 400→460. % stijging?', '["15%", "12%", "18%", "10%"]', 0, 'f2', 'Verbanden'),
('y=10−x, y bij x=4?', '["6", "4", "14", "10"]', 0, 'f2', 'Verbanden');

-- Domain 5 - Breuken
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('1/2 + 1/4 = ?', '["3/4", "2/6", "1/3", "2/4"]', 0, 'f2', 'Breuken'),
('3/4 − 2/5 = ?', '["7/20", "1/1", "5/9", "1/20"]', 0, 'f2', 'Breuken'),
('2/3 × 3/7 = ?', '["2/7", "6/21", "5/10", "1/2"]', 0, 'f2', 'Breuken'),
('4/5 ÷ 2/3 = ?', '["6/5", "8/15", "2/5", "12/10"]', 0, 'f2', 'Breuken'),
('Vereenvoudig 12/18.', '["2/3", "6/9", "4/6", "1/2"]', 0, 'f2', 'Breuken'),
('0,6 als breuk in eenvoudige vorm.', '["3/5", "6/10", "12/20", "60/100"]', 0, 'f2', 'Breuken'),
('3/8 = ? %', '["37,5%", "38%", "35%", "40%"]', 0, 'f2', 'Breuken'),
('45 minuten is welk deel van een uur?', '["3/4", "1/2", "2/3", "4/5"]', 0, 'f2', 'Breuken'),
('2 1/4 als onvolledige breuk.', '["9/4", "7/4", "8/4", "10/4"]', 0, 'f2', 'Breuken'),
('Een taart wordt in 8 stukken gedeeld. Je eet 3 stukken.', '["5/8", "3/8", "3/5", "5/3"]', 0, 'f2', 'Breuken'),
('5/6 − 1/2 = ?', '["1/3", "4/4", "2/3", "1/6"]', 0, 'f2', 'Breuken'),
('7/9 × 27 = ?', '["21", "189", "243", "27"]', 0, 'f2', 'Breuken'),
('2/5 van 250 = ?', '["100", "125", "150", "200"]', 0, 'f2', 'Breuken'),
('Een klas heeft 30 leerlingen. 2/3 zijn meisjes. Hoeveel?', '["20", "10", "15", "25"]', 0, 'f2', 'Breuken'),
('Schrijf 125% als breuk.', '["5/4", "1/4", "4/5", "3/4"]', 0, 'f2', 'Breuken');