-- Migration to add road map and ability score fields to monsters table
-- Run this in your Supabase SQL editor

-- Add new columns to monsters table
ALTER TABLE monsters 
ADD COLUMN road_map TEXT,
ADD COLUMN strength INTEGER DEFAULT 10,
ADD COLUMN dexterity INTEGER DEFAULT 10,
ADD COLUMN constitution INTEGER DEFAULT 10,
ADD COLUMN intelligence INTEGER DEFAULT 10,
ADD COLUMN wisdom INTEGER DEFAULT 10,
ADD COLUMN charisma INTEGER DEFAULT 10,
ADD COLUMN speed INTEGER DEFAULT 25;

-- Add comments for documentation
COMMENT ON COLUMN monsters.road_map IS 'The Pathfinder 2e road map used for stat calculation (brute, magicalStriker, skillParagon, skirmisher, sniper, soldier, spellcaster)';
COMMENT ON COLUMN monsters.strength IS 'Strength ability score';
COMMENT ON COLUMN monsters.dexterity IS 'Dexterity ability score';
COMMENT ON COLUMN monsters.constitution IS 'Constitution ability score';
COMMENT ON COLUMN monsters.intelligence IS 'Intelligence ability score';
COMMENT ON COLUMN monsters.wisdom IS 'Wisdom ability score';
COMMENT ON COLUMN monsters.charisma IS 'Charisma ability score';
COMMENT ON COLUMN monsters.speed IS 'Base movement speed in feet';

-- Create index on road_map for potential filtering
CREATE INDEX idx_monsters_road_map ON monsters(road_map); 