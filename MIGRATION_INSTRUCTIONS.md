# Database Migration Instructions

## Problem
You're getting "Failed to save monster" because the database doesn't have the new road map fields yet.

## Solution
Run the database migration in your Supabase dashboard.

## Steps

### 1. Open Supabase Dashboard
- Go to your Supabase project dashboard
- Navigate to the SQL Editor

### 2. Run the Migration
Copy and paste this SQL into the SQL Editor and run it:

```sql
-- Migration to add road map and ability score fields to monsters table

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
```

### 3. Verify the Migration
After running the migration, you should see:
- New columns added to the monsters table
- No errors in the SQL execution

### 4. Test the Application
- Try creating a new monster
- Select a road map from the dropdown
- The ability scores should auto-calculate
- Save the monster successfully

## What This Migration Does

1. **Adds road_map field**: Stores which road map was used (brute, magicalStriker, etc.)
2. **Adds ability score fields**: strength, dexterity, constitution, intelligence, wisdom, charisma
3. **Adds speed field**: Base movement speed
4. **Sets default values**: All ability scores default to 10, speed to 25
5. **Adds documentation**: Comments explaining each field
6. **Creates an index**: For efficient querying by road map

## After Migration

Once the migration is complete:
- The road map feature will work fully
- Ability scores will be saved to the database
- Monster creation and editing will work without errors
- The FoundryVTT export will include ability scores

## Troubleshooting

If you still get errors after the migration:
1. Check that all columns were added successfully
2. Restart your server if it's running
3. Clear your browser cache
4. Try creating a new monster to test 