-- Remove the overly permissive policy that exposes correct answers
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;

-- Create policy for admins to see all question data including correct answers
CREATE POLICY "Admins can view all question data"
ON public.questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- Create a function that returns questions without correct answers for non-admins
CREATE OR REPLACE FUNCTION public.get_quiz_questions()
RETURNS TABLE (
  id uuid,
  question_text text,
  options jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  correct_answer integer
) 
LANGUAGE SQL 
SECURITY DEFINER
AS $$
  -- If user is admin, return all data including correct answers
  SELECT 
    q.id,
    q.question_text,
    q.options,
    q.created_at,
    q.updated_at,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
          AND profiles.role = 'admin'
      ) THEN q.correct_answer
      ELSE NULL
    END as correct_answer
  FROM public.questions q;
$$;

-- Clear existing questions to add the new ones
DELETE FROM public.questions;

-- Add new questions from the uploaded images
-- Deel 1 - Verhoudingen
INSERT INTO public.questions (question_text, options, correct_answer) VALUES
('Een pak melk kost €1,20. Hoeveel kosten 3 pakken melk?', '["€2,40", "€3,60", "€4,80", "€5,20"]', 1),
('In een klas zitten 12 jongens en 18 meisjes. Wat is de verhouding jongens : meisjes?', '["2:3", "3:2", "12:18", "6:9"]', 0),
('Voor 4 pizza''s betaal je €20. Hoeveel kost 1 pizza?', '["€4", "€5", "€6", "€8"]', 1),
('In een doos zitten 8 rode en 12 blauwe knikkers. Wat is de verhouding rood : blauw?', '["2:3", "3:2", "8:12", "4:6"]', 0),
('In een recept is 300 g bloem en 200 g suiker. Wat is de verhouding bloem : suiker?', '["2:3", "3:2", "300:200", "150:100"]', 1),
('Een bus heeft 40 zitplaatsen en 20 staanplaatsen. Wat is de verhouding zit : staan?', '["2:1", "1:2", "40:20", "20:10"]', 0),
('Voor 5 kilo appels betaal je €10. Wat kost 1 kilo?', '["€1", "€2", "€3", "€5"]', 1),
('6 liter benzine wordt weggedeeld in 4 flessen. Hoeveel liter per fles?', '["1 liter", "1,5 liter", "2 liter", "2,5 liter"]', 1),
('Er zijn 15 meisjes en 5 jongens in een groep. Wat is de verhouding meisjes : jongens?', '["3:1", "1:3", "15:5", "5:15"]', 0),
('Een liter benzine kost €1,80. Hoeveel kosten 7 liter?', '["€10,60", "€12,60", "€14,40", "€16,20"]', 1),
('Een recept voor 2 personen vraagt 200 g rijst. Hoeveel voor 6 personen?', '["400g", "500g", "600g", "800g"]', 2),
('In een zak zitten 50 knikkers, waarvan 30 rood. Wat is de verhouding rood : totaal?', '["3:5", "5:3", "30:50", "20:30"]', 0),
('In de klas zitten 12 leerlingen, waarvan 9 meisjes. Wat is de verhouding jongens : totaal?', '["1:4", "3:12", "9:12", "3:4"]', 0),
('Voor 9 flesjes fris betaal je €13,50. Hoeveel kost 1 flesje?', '["€1,25", "€1,50", "€1,75", "€2,00"]', 1),
('4 pennen kosten €2,80. Hoeveel kosten 10 pennen?', '["€6", "€7", "€8", "€9"]', 1);

-- Deel 2 - Procenten  
INSERT INTO public.questions (question_text, options, correct_answer) VALUES
('Een broek kost €50. Er is 20% korting. Hoeveel betaal je?', '["€30", "€35", "€40", "€45"]', 2),
('Van de 200 leerlingen zijn er 50 afwezig. Welk percentage is dat?', '["20%", "25%", "30%", "40%"]', 1),
('Een spaarrekening geeft 5% rente over €100. Hoeveel rente krijg je?', '["€3", "€4", "€5", "€6"]', 2),
('Een jas kost €80. Hij wordt 25% goedkoper. Wat is de nieuwe prijs?', '["€55", "€60", "€65", "€70"]', 1),
('Een trui kost €60. Er komt 10% bij. Hoeveel kost de trui nu?', '["€63", "€66", "€69", "€72"]', 1),
('30% van 200 = ?', '["50", "60", "70", "80"]', 1),
('15% van 400 = ?', '["50", "60", "70", "80"]', 1),
('75% van 120 = ?', '["80", "85", "90", "95"]', 2),
('In een klas van 24 leerlingen halen 18 een voldoende. Welk percentage is dat?', '["70%", "75%", "80%", "85%"]', 1),
('Een telefoon kost €200. Je krijgt 15% korting. Hoeveel korting is dat?', '["€25", "€30", "€35", "€40"]', 1),
('Een fiets kost €150. Hij wordt 10% duurder. Wat is de nieuwe prijs?', '["€160", "€165", "€170", "€175"]', 1),
('Van 80 appels zijn er 20 rot. Welk percentage is rot?', '["20%", "25%", "30%", "35%"]', 1),
('Een boek kost €30. Je betaalt 21% btw erbij. Wat is de totaalprijs?', '["€33,30", "€35,50", "€36,30", "€38,50"]', 2),
('Een zak snoep van €4,00 wordt 50% goedkoper. Hoeveel kost hij?', '["€1,50", "€2,00", "€2,50", "€3,00"]', 1),
('Een auto kost €10.000. Hij daalt 20% in waarde. Hoeveel is dat?', '["€6.000", "€7.000", "€8.000", "€9.000"]', 2);

-- Deel 4 - Kommagetallen
INSERT INTO public.questions (question_text, options, correct_answer) VALUES
('3,4 + 2,7 = ?', '["5,1", "6,1", "6,7", "7,1"]', 1),
('7,2 × 0,5 = ?', '["3,2", "3,6", "4,1", "4,5"]', 1),
('12,6 − 4,8 = ?', '["7,2", "7,8", "8,2", "8,8"]', 1),
('1,25 + 2,35 = ?', '["3,5", "3,6", "4,1", "4,5"]', 1),
('9,8 − 7,4 = ?', '["2,2", "2,4", "2,6", "2,8"]', 1),
('6,5 × 2 = ?', '["12", "12,5", "13", "13,5"]', 2),
('4,5 ÷ 1,5 = ?', '["2", "2,5", "3", "3,5"]', 2),
('10,0 − 3,75 = ?', '["6,25", "6,5", "6,75", "7,25"]', 0),
('2,4 × 0,25 = ?', '["0,5", "0,6", "0,7", "0,8"]', 1),
('8,4 ÷ 0,2 = ?', '["40", "41", "42", "43"]', 2),
('0,5 + 0,75 = ?', '["1,15", "1,20", "1,25", "1,30"]', 2),
('2,5 × 0,4 = ?', '["0,8", "1,0", "1,2", "1,4"]', 1),
('6,3 − 2,9 = ?', '["3,2", "3,4", "3,6", "3,8"]', 1),
('1,2 + 1,8 = ?', '["2,8", "3,0", "3,2", "3,4"]', 1),
('9,9 ÷ 3 = ?', '["3,1", "3,2", "3,3", "3,4"]', 2);

-- Deel 5 - Meten en Meetkunde  
INSERT INTO public.questions (question_text, options, correct_answer) VALUES
('Een rechthoek heeft een lengte van 8 cm en een breedte van 6 cm. Wat is de oppervlakte?', '["42 cm²", "48 cm²", "54 cm²", "60 cm²"]', 1),
('Een vierkant heeft zijden van 5 cm. Wat is de omtrek?', '["15 cm", "20 cm", "25 cm", "30 cm"]', 1),
('Een rechthoek heeft een lengte van 7 cm. Wat is ongeveer de diameter?', '["6 cm", "7 cm", "8 cm", "9 cm"]', 1),
('Een rechthoek heeft een lengte van 10 cm en een breedte van 4 cm. Wat is de omtrek?', '["24 cm", "26 cm", "28 cm", "30 cm"]', 2),
('Een driehoek heeft een basis van 6 cm en hoogte van 4 cm. Wat is de oppervlakte?', '["10 cm²", "12 cm²", "14 cm²", "16 cm²"]', 1),
('Een kubus heeft ribben van 3 cm. Wat is de inhoud?', '["18 cm³", "21 cm³", "24 cm³", "27 cm³"]', 3),
('Een kubus is 4 m breed en 5 m lang. Wat is de oppervlakte?', '["16 m²", "18 m²", "20 m²", "22 m²"]', 2),
('Een rechthoek heeft een lengte van 12 cm en breedte van 3 cm. Wat is de oppervlakte?', '["30 cm²", "33 cm²", "36 cm²", "39 cm²"]', 2),
('Een cirkel heeft een diameter van 10 cm. Wat is de straal?', '["4 cm", "5 cm", "6 cm", "7 cm"]', 1),
('Een driehoek heeft een basis van 10 cm en hoogte van 5 cm. Wat is de oppervlakte?', '["20 cm²", "22 cm²", "25 cm²", "28 cm²"]', 2),
('Een kubus heeft ribben van 4 cm. Wat is de oppervlakte van één vlak?', '["12 cm²", "14 cm²", "16 cm²", "18 cm²"]', 2),
('Een balk is 2 m hoog, 3 m breed en 4 m lang. Wat is de inhoud?', '["20 m³", "22 m³", "24 m³", "26 m³"]', 2),
('Een vierkant heeft zijden van 8 cm. Wat is de oppervlakte?', '["56 cm²", "60 cm²", "64 cm²", "68 cm²"]', 2),
('Een cirkel heeft een straal van 5 cm. Wat is ongeveer de omtrek (π≈3,14)?', '["28,4 cm", "30,4 cm", "31,4 cm", "32,4 cm"]', 2),
('Een driehoek heeft een basis van 8 cm en hoogte van 6 cm. Wat is de oppervlakte?', '["20 cm²", "22 cm²", "24 cm²", "26 cm²"]', 2);