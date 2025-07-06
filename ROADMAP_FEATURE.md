# Pathfinder 2e Road Map Feature

The Monster Maker now includes official Pathfinder 2e monster creation road maps based on the [Archives of Nethys monster creation rules](https://2e.aonprd.com/Rules.aspx?ID=2874).

## What are Road Maps?

Road maps are templates that automatically calculate monster statistics based on their level and role. They ensure your monsters are balanced and follow official Pathfinder 2e guidelines.

## Available Road Maps

### 1. Brute
- **Role**: Big, tough creatures like ogres
- **Stats**: High HP, high damage, low AC
- **Best for**: Melee tanks, damage dealers

### 2. Magical Striker
- **Role**: Creatures that combine martial prowess with magical abilities
- **Stats**: High attack and damage, moderate to high spell DCs
- **Best for**: Spellcasting warriors, magical creatures

### 3. Skill Paragon
- **Role**: Creatures with exceptional skills and abilities
- **Stats**: High attribute modifiers matching their best skills
- **Best for**: Rogues, skill-focused creatures

### 4. Skirmisher
- **Role**: Fast, mobile creatures that dart in and out of combat
- **Stats**: High Dexterity, low Fortitude, high Reflex, higher Speed
- **Best for**: Mobile attackers, hit-and-run tactics

### 5. Sniper
- **Role**: Ranged attackers with high perception and accuracy
- **Stats**: High Perception, high Dexterity, low HP, high ranged attack/damage
- **Best for**: Archers, ranged spellcasters

### 6. Soldier
- **Role**: Well-trained combatants with high AC and tactical abilities
- **Stats**: High Strength, high to extreme AC, high Fortitude, high attack/damage
- **Best for**: Defensive fighters, guards, knights

### 7. Spellcaster
- **Role**: Creatures focused on magical abilities and spellcasting
- **Stats**: High spellcasting attribute, low HP, high spell DCs
- **Best for**: Wizards, sorcerers, magical creatures

## How to Use

1. **Create a new monster** or edit an existing one
2. **Select a road map** from the dropdown menu
3. **Set the monster's level** (1-25)
4. **All statistics will be automatically calculated** based on the road map and level
5. **Customize as needed** - you can still manually adjust any stats after auto-calculation

## Stat Calculation

The system automatically calculates:
- **Ability Scores**: Based on level and road map recommendations
- **Hit Points**: Using the appropriate HP per level for the road map
- **Armor Class**: Level + road map modifier
- **Saving Throws**: Level + road map modifier
- **Perception**: Level + road map modifier
- **Speed**: 25 feet (35 feet for Skirmishers)

## Database Migration

To use this feature, you need to run the database migration:

```sql
-- Run this in your Supabase SQL editor
-- See database/migration_add_roadmap_fields.sql for the complete migration
```

## Customization

After selecting a road map, you can:
- Manually adjust any calculated stats
- Add custom abilities, attacks, and spells
- Modify the description and notes
- The road map selection is saved for reference

## Benefits

- **Balanced monsters**: Follows official Pathfinder 2e guidelines
- **Time saving**: Automatic stat calculation
- **Consistency**: Ensures monsters are appropriate for their level
- **Flexibility**: Still allows full customization after auto-calculation

## FoundryVTT Export

The road map information and calculated ability scores are included in the FoundryVTT export, ensuring your monsters work properly in your virtual tabletop. 