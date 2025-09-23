-- First, delete existing basis level questions
DELETE FROM public.questions WHERE level = 'basis';

-- Insert new questions for Deel 1 - Verhoudingen
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Een pak melk kost €1,20. Hoeveel kosten 3 pakken melk?', '["€2,40", "€3,60", "€4,80", "€6,00"]', 1, 'basis', 'Verhoudingen'),
('In een klas zitten 12 jongens en 18 meisjes. Wat is de verhouding jongens : meisjes?', '["1:2", "2:3", "3:2", "2:1"]', 1, 'basis', 'Verhoudingen'),
('Voor 4 pizza''s betaal je €20. Hoeveel kost 1 pizza?', '["€4,00", "€5,00", "€6,00", "€8,00"]', 1, 'basis', 'Verhoudingen'),
('In een doos zitten 8 rode en 12 blauwe knikkers. Wat is de verhouding rood : blauw?', '["1:2", "2:3", "3:4", "4:3"]', 1, 'basis', 'Verhoudingen'),
('In een recept is 300 g bloem en 200 g suiker. Wat is de verhouding bloem : suiker?', '["2:3", "3:2", "1:2", "2:1"]', 1, 'basis', 'Verhoudingen'),
('Een bus heeft 40 zitplaatsen en 20 staanplaatsen. Wat is de verhouding zit : staan?', '["1:2", "2:1", "3:2", "2:3"]', 1, 'basis', 'Verhoudingen'),
('Voor 5 kilo appels betaal je €10. Wat kost 1 kilo?', '["€1,50", "€2,00", "€2,50", "€3,00"]', 1, 'basis', 'Verhoudingen'),
('6 liter limonade wordt verdeeld in 4 flessen. Hoeveel liter per fles?', '["1,2 liter", "1,5 liter", "1,8 liter", "2,0 liter"]', 1, 'basis', 'Verhoudingen'),
('Er zijn 15 meisjes en 5 jongens in een groep. Wat is de verhouding meisjes : jongens?', '["2:1", "3:1", "4:1", "5:1"]', 1, 'basis', 'Verhoudingen'),
('Een liter benzine kost €1,80. Hoeveel kosten 7 liter?', '["€11,40", "€12,60", "€13,80", "€15,00"]', 1, 'basis', 'Verhoudingen'),
('Een recept voor 2 personen vraagt 200 g rijst. Hoeveel voor 6 personen?', '["400 g", "500 g", "600 g", "800 g"]', 2, 'basis', 'Verhoudingen'),
('In een zak zitten 50 knikkers, waarvan 30 rood. Wat is de verhouding rood : totaal?', '["2:5", "3:5", "3:2", "5:3"]', 1, 'basis', 'Verhoudingen'),
('In de klas zitten 12 leerlingen, waarvan 9 meisjes. Wat is de verhouding jongens : totaal?', '["1:3", "1:4", "3:4", "4:3"]', 1, 'basis', 'Verhoudingen'),
('Voor 9 flesjes fris betaal je €13,50. Hoeveel kost 1 flesje?', '["€1,20", "€1,50", "€1,80", "€2,00"]', 1, 'basis', 'Verhoudingen'),
('4 pennen kosten €2,80. Hoeveel kosten 10 pennen?', '["€6,00", "€7,00", "€8,00", "€9,00"]', 1, 'basis', 'Verhoudingen');

-- Insert questions for Deel 2 - Procenten
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Een broek kost €50. Er is 20% korting. Hoeveel betaal je?', '["€30,00", "€40,00", "€45,00", "€48,00"]', 1, 'basis', 'Procenten'),
('Van de 200 leerlingen zijn er 50 afwezig. Welk percentage is dat?', '["20%", "25%", "30%", "35%"]', 1, 'basis', 'Procenten'),
('Een spaarrekening geeft 5% rente over €100. Hoeveel rente krijg je?', '["€4,00", "€5,00", "€6,00", "€10,00"]', 1, 'basis', 'Procenten'),
('Een jas kost €80. Hij wordt 25% goedkoper. Wat is de nieuwe prijs?', '["€55,00", "€60,00", "€65,00", "€70,00"]', 1, 'basis', 'Procenten'),
('Een trui kost €60. Er komt 10% bij. Hoeveel kost de trui nu?', '["€64,00", "€66,00", "€70,00", "€72,00"]', 1, 'basis', 'Procenten'),
('30% van 200 = ?', '["50", "60", "70", "80"]', 1, 'basis', 'Procenten'),
('15% van 400 = ?', '["50", "60", "70", "80"]', 1, 'basis', 'Procenten'),
('75% van 120 = ?', '["80", "85", "90", "95"]', 2, 'basis', 'Procenten'),
('In een klas van 24 leerlingen halen 18 een voldoende. Welk percentage is dat?', '["70%", "75%", "80%", "85%"]', 1, 'basis', 'Procenten'),
('Een telefoon kost €200. Je krijgt 15% korting. Hoeveel korting is dat?', '["€25,00", "€30,00", "€35,00", "€40,00"]', 1, 'basis', 'Procenten'),
('Een fiets kost €450. Hij wordt 10% duurder. Wat is de nieuwe prijs?', '["€480,00", "€490,00", "€495,00", "€500,00"]', 2, 'basis', 'Procenten'),
('Van 80 appels zijn er 20 rot. Welk percentage is rot?', '["20%", "25%", "30%", "35%"]', 1, 'basis', 'Procenten'),
('Een boek kost €30. Je betaalt 21% btw erbij. Wat is de totaalprijs?', '["€36,30", "€37,50", "€38,00", "€40,00"]', 0, 'basis', 'Procenten'),
('Een zak snoep van €4,00 wordt 50% goedkoper. Hoeveel kost hij?', '["€1,50", "€2,00", "€2,50", "€3,00"]', 1, 'basis', 'Procenten'),
('Een auto kost €10.000. Hij daalt 20% in waarde. Hoeveel is dat?', '["€1.500", "€2.000", "€2.500", "€3.000"]', 1, 'basis', 'Procenten');

-- Insert questions for Deel 4 - Kommagetallen  
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('3,4 + 2,7 = ?', '["5,9", "6,1", "6,3", "6,5"]', 1, 'basis', 'Kommagetallen'),
('7,2 × 0,5 = ?', '["3,4", "3,6", "3,8", "4,0"]', 1, 'basis', 'Kommagetallen'),
('12,6 - 4,8 = ?', '["7,6", "7,8", "8,0", "8,2"]', 1, 'basis', 'Kommagetallen'),
('1,25 + 2,35 = ?', '["3,50", "3,60", "3,70", "3,80"]', 1, 'basis', 'Kommagetallen'),
('9,8 - 7,4 = ?', '["2,2", "2,4", "2,6", "2,8"]', 1, 'basis', 'Kommagetallen'),
('6,5 × 2 = ?', '["12,0", "13,0", "14,0", "15,0"]', 1, 'basis', 'Kommagetallen'),
('4,5 ÷ 1,5 = ?', '["2,5", "3,0", "3,5", "4,0"]', 1, 'basis', 'Kommagetallen'),
('10,0 - 3,75 = ?', '["6,15", "6,25", "6,35", "6,45"]', 1, 'basis', 'Kommagetallen'),
('2,4 × 0,25 = ?', '["0,5", "0,6", "0,7", "0,8"]', 1, 'basis', 'Kommagetallen'),
('8,4 ÷ 0,2 = ?', '["40", "42", "44", "46"]', 1, 'basis', 'Kommagetallen'),
('0,5 + 0,75 = ?', '["1,15", "1,25", "1,35", "1,45"]', 1, 'basis', 'Kommagetallen'),
('2,5 × 0,4 = ?', '["0,8", "1,0", "1,2", "1,4"]', 1, 'basis', 'Kommagetallen'),
('6,3 - 2,9 = ?', '["3,2", "3,4", "3,6", "3,8"]', 1, 'basis', 'Kommagetallen'),
('1,2 + 1,8 = ?', '["2,8", "3,0", "3,2", "3,4"]', 1, 'basis', 'Kommagetallen'),
('9,9 ÷ 3 = ?', '["3,1", "3,3", "3,5", "3,7"]', 1, 'basis', 'Kommagetallen');

-- Insert questions for Deel 5 - Meten en Meetkunde
INSERT INTO public.questions (question_text, options, correct_answer, level, domain) VALUES
('Een rechthoek heeft een lengte van 8 cm en een breedte van 6 cm. Wat is de oppervlakte?', '["42 cm²", "48 cm²", "54 cm²", "60 cm²"]', 1, 'basis', 'Meten en Meetkunde'),
('Een vierkant heeft zijden van 5 cm. Wat is de omtrek?', '["15 cm", "20 cm", "25 cm", "30 cm"]', 1, 'basis', 'Meten en Meetkunde'),
('Een cirkel heeft een straal van 7 cm. Wat is ongeveer de diameter?', '["10 cm", "14 cm", "21 cm", "28 cm"]', 1, 'basis', 'Meten en Meetkunde'),
('Een rechthoek heeft een lengte van 10 cm en een breedte van 4 cm. Wat is de omtrek?', '["24 cm", "28 cm", "32 cm", "36 cm"]', 1, 'basis', 'Meten en Meetkunde'),
('Een driehoek heeft een basis van 6 cm en hoogte van 4 cm. Wat is de oppervlakte?', '["10 cm²", "12 cm²", "14 cm²", "16 cm²"]', 1, 'basis', 'Meten en Meetkunde'),
('Een kubus heeft ribben van 3 cm. Wat is de inhoud?', '["21 cm³", "24 cm³", "27 cm³", "30 cm³"]', 2, 'basis', 'Meten en Meetkunde'),
('Een kamer is 4 m breed en 5 m lang. Wat is de oppervlakte?', '["18 m²", "20 m²", "22 m²", "24 m²"]', 1, 'basis', 'Meten en Meetkunde'),
('Een rechthoek heeft een lengte van 12 cm en breedte van 3 cm. Wat is de oppervlakte?', '["30 cm²", "33 cm²", "36 cm²", "39 cm²"]', 2, 'basis', 'Meten en Meetkunde'),
('Een cirkel heeft een diameter van 10 cm. Wat is de straal?', '["3 cm", "5 cm", "7 cm", "10 cm"]', 1, 'basis', 'Meten en Meetkunde'),
('Een driehoek heeft een basis van 10 cm en hoogte van 5 cm. Wat is de oppervlakte?', '["20 cm²", "25 cm²", "30 cm²", "35 cm²"]', 1, 'basis', 'Meten en Meetkunde'),
('Een kubus heeft ribben van 4 cm. Wat is de oppervlakte van één vlak?', '["12 cm²", "14 cm²", "16 cm²", "18 cm²"]', 2, 'basis', 'Meten en Meetkunde'),
('Een balk is 2 m hoog, 3 m breed en 4 m lang. Wat is de inhoud?', '["20 m³", "22 m³", "24 m³", "26 m³"]', 2, 'basis', 'Meten en Meetkunde'),
('Een vierkant heeft zijden van 8 cm. Wat is de oppervlakte?', '["56 cm²", "60 cm²", "64 cm²", "68 cm²"]', 2, 'basis', 'Meten en Meetkunde'),
('Een cirkel heeft een straal van 5 cm. Wat is ongeveer de omtrek (π≈3,14)?', '["28,5 cm", "31,4 cm", "34,3 cm", "37,2 cm"]', 1, 'basis', 'Meten en Meetkunde'),
('Een driehoek heeft een basis van 8 cm en hoogte van 6 cm. Wat is de oppervlakte?', '["20 cm²", "22 cm²", "24 cm²", "26 cm²"]', 2, 'basis', 'Meten en Meetkunde');