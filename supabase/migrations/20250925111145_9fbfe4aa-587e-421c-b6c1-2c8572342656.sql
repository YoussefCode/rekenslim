-- Update the level naming to be consistent - change 'f2' to '2f'
UPDATE questions 
SET level = '2f' 
WHERE level = 'f2';