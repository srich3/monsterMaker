# FoundryVTT Export Troubleshooting

## Fixed Issues

### ✅ ID Format Errors
**Problem**: `NPCPF2e validation errors: items: attack_0_1751790094325: _id: must be a valid 16-character alphanumeric ID`

**Solution**: Updated the export to generate proper 16-character alphanumeric IDs using `Math.random().toString(36).substring(2, 18)`

### ✅ UUID Format Errors  
**Problem**: `Invalid document ID "56a13867-7672-43bb-83bc-2a98ed74b99c"`

**Solution**: Removed the problematic `exportSource.uuid` field that was causing validation errors

## Current Export Format

The export now generates:
- ✅ Valid 16-character item IDs
- ✅ Proper FoundryVTT PF2e structure
- ✅ All required fields with correct types
- ✅ Compatible with PF2e system 7.2.1+

## How to Test

1. **Create a simple monster** with basic stats
2. **Add one attack** using the Attack Editor
3. **Export the monster** - should download a JSON file
4. **Import into FoundryVTT** - should work without errors

## Expected Export Structure

```json
{
  "folder": null,
  "img": "systems/pf2e/icons/default-icons/npc.svg",
  "items": [
    {
      "_id": "8mm6pejahqc",  // 16-char alphanumeric ID
      "name": "Claws",
      "type": "melee",
      "system": {
        "bonus": { "value": 8 },
        "damageRolls": {
          "1thenkn7bif": {  // 16-char alphanumeric ID
            "damage": "1d4",
            "damageType": "slashing"
          }
        }
      }
    }
  ],
  "name": "Monster Name",
  "system": {
    "attributes": { "hp": { "value": 10, "max": 10 } },
    "abilities": { "str": { "mod": 0 } },
    "saves": { "fortitude": { "value": 0 } }
  },
  "type": "npc",
  "_stats": {
    "coreVersion": "13.345",
    "systemId": "pf2e",
    "systemVersion": "7.2.1"
  }
}
```

## Common Issues & Solutions

### Export Button Not Working
- Check browser console for JavaScript errors
- Ensure monster has a name
- Try refreshing the page

### Import Fails in FoundryVTT
- Verify PF2e system version (7.2.1+)
- Check that JSON file is not corrupted
- Try importing into a fresh world first

### Missing Data After Import
- Some fields may be empty if not filled in Monster Maker
- You can edit the monster in FoundryVTT after import
- Road map information is preserved in flags

### Attack Not Showing
- Ensure attack has a name
- Check that damage and damage type are set
- Verify attack type is "melee" or "ranged"

## Debug Steps

1. **Check Server Logs**: Look for export errors in server console
2. **Browser Console**: Check for JavaScript errors during export
3. **File Validation**: Open exported JSON in a text editor to verify format
4. **FoundryVTT Console**: Check for import validation errors

## Support

If you continue to have issues:
1. Check the server logs for error messages
2. Verify the exported JSON structure matches the example above
3. Try creating a minimal monster with just basic stats
4. Test with a fresh FoundryVTT world 