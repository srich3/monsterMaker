# FoundryVTT Export Feature

The Monster Maker now exports monsters in the correct FoundryVTT Pathfinder 2e format, based on the official PF2e system structure.

## What's Included in the Export

### Core Monster Data
- **Name**: Monster name
- **Level**: Monster level (1-25)
- **Size**: Tiny, Small, Medium, Large, Huge, Gargantuan
- **Rarity**: Common, Uncommon, Rare, Unique
- **Image**: Custom image URL or default PF2e NPC icon

### Combat Statistics
- **Hit Points**: Current and maximum HP
- **Armor Class**: Base AC value
- **Speed**: Movement speed in feet
- **Perception**: Perception modifier
- **Saving Throws**: Fortitude, Reflex, and Will saves

### Ability Scores
- **Strength, Dexterity, Constitution**: Physical abilities
- **Intelligence, Wisdom, Charisma**: Mental abilities
- **Modifiers**: Automatically calculated from ability scores

### Attacks
- **Attack Name**: Custom attack names (e.g., "Claws", "Bite")
- **Type**: Melee or Ranged
- **Attack Bonus**: Modifier to attack rolls
- **Damage**: Damage dice and formula (e.g., "1d6+3")
- **Damage Type**: Physical or energy damage types
- **Traits**: PF2e attack traits (e.g., "agile", "finesse", "reach")
- **Description**: Special effects or conditions

### Skills
- **Skill Bonuses**: Custom skill modifiers
- **Format**: Compatible with PF2e skill system

### Additional Features
- **Public Notes**: Description visible to players
- **Private Notes**: GM-only notes and tactics
- **Road Map**: Which creation template was used
- **Export Metadata**: Creation date and source information

## How to Use

### 1. Create a Monster
- Use the Monster Creator to design your monster
- Select a road map for automatic stat calculation
- Add custom attacks with the Attack Editor
- Fill in descriptions and notes

### 2. Export to FoundryVTT
- Click the "Export" button on any monster
- The file will download as a JSON file
- Import into FoundryVTT using the standard import process

### 3. Import into FoundryVTT
- In FoundryVTT, go to the Actors tab
- Click "Import" and select your exported JSON file
- The monster will appear in your Actors directory
- You can then place it on maps or in encounters

## Export Format

The export follows the official FoundryVTT PF2e system format:

```json
{
  "name": "Monster Name",
  "type": "npc",
  "system": {
    "attributes": {
      "hp": { "value": 25, "max": 25 },
      "ac": { "value": 18 },
      "speed": { "value": 30 }
    },
    "abilities": {
      "str": { "mod": 2 },
      "dex": { "mod": 1 },
      "con": { "mod": 3 }
    },
    "saves": {
      "fortitude": { "value": 8 },
      "reflex": { "value": 6 },
      "will": { "value": 7 }
    },
    "items": [
      {
        "name": "Claws",
        "type": "melee",
        "system": {
          "bonus": { "value": 8 },
          "damageRolls": {
            "damage_0": {
              "damage": "1d6+3",
              "damageType": "slashing"
            }
          }
        }
      }
    ]
  }
}
```

## Compatibility

- **FoundryVTT Version**: 13.x or higher
- **PF2e System**: 7.x or higher
- **Browser**: Modern browsers with JSON download support

## Troubleshooting

### Export Fails
- Ensure the monster has a name
- Check that all required fields are filled
- Try refreshing the page and exporting again

### Import Issues in FoundryVTT
- Verify you're using the correct PF2e system version
- Check that the JSON file is not corrupted
- Try importing into a fresh world first

### Missing Data
- Some fields may be empty if not filled in the Monster Maker
- You can edit the monster in FoundryVTT after import
- The road map information is preserved in the flags

## Road Map Integration

When you select a road map in the Monster Maker:
- All statistics are automatically calculated
- The road map type is saved in the export
- FoundryVTT will receive properly balanced monsters
- You can still customize stats after auto-calculation

## Future Enhancements

Planned improvements:
- Spell casting support
- Special abilities and actions
- Advanced skill systems
- Custom traits and immunities
- Bulk and treasure information 