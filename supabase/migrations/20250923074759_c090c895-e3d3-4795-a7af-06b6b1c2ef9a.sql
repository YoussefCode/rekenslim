-- Remove excess questions from f2 level to have 15 questions per domain (75 total)
WITH questions_to_keep AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY domain ORDER BY created_at) as rn
  FROM questions 
  WHERE level = 'f2'
)
DELETE FROM questions 
WHERE level = 'f2' 
AND id IN (
  SELECT id FROM questions_to_keep WHERE rn > 15
);