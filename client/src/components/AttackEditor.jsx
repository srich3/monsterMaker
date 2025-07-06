import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const AttackEditor = ({ attacks = [], onChange, monsterLevel = 1, roadMap = '' }) => {
  const [newAttack, setNewAttack] = useState({
    name: '',
    type: 'melee',
    bonus: 0,
    damage: '1d4',
    damageType: 'bludgeoning',
    traits: [],
    description: ''
  })

  // Calculate attack bonus based on level and road map
  const calculateAttackBonus = () => {
    if (!roadMap) return monsterLevel + 2 // Default moderate attack
    
    const roadMapStats = {
      brute: { attack: 'high', damage: 'high' },
      magicalStriker: { attack: 'high', damage: 'high' },
      skillParagon: { attack: 'moderate', damage: 'moderate' },
      skirmisher: { attack: 'moderate', damage: 'moderate' },
      sniper: { attack: 'high', damage: 'high' },
      soldier: { attack: 'high', damage: 'high' },
      spellcaster: { attack: 'low', damage: 'low' }
    }
    
    const attackLevel = roadMapStats[roadMap]?.attack || 'moderate'
    
    switch (attackLevel) {
      case 'low': return monsterLevel
      case 'moderate': return monsterLevel + 2
      case 'high': return monsterLevel + 4
      case 'extreme': return monsterLevel + 6
      default: return monsterLevel + 2
    }
  }

  const addAttack = () => {
    if (!newAttack.name.trim()) return
    
    const attack = {
      ...newAttack,
      bonus: calculateAttackBonus(), // Auto-calculate bonus
      id: Date.now().toString()
    }
    
    onChange([...attacks, attack])
    setNewAttack({
      name: '',
      type: 'melee',
      bonus: 0,
      damage: '1d4',
      damageType: 'bludgeoning',
      traits: [],
      description: ''
    })
  }

  const removeAttack = (index) => {
    const updatedAttacks = attacks.filter((_, i) => i !== index)
    onChange(updatedAttacks)
  }

  const updateAttack = (index, field, value) => {
    const updatedAttacks = [...attacks]
    updatedAttacks[index] = { ...updatedAttacks[index], [field]: value }
    onChange(updatedAttacks)
  }

  // Recalculate attack bonuses when level or road map changes
  useEffect(() => {
    if (monsterLevel && roadMap && attacks.length > 0) {
      const updatedAttacks = attacks.map(attack => ({
        ...attack,
        bonus: calculateAttackBonus()
      }))
      onChange(updatedAttacks)
    }
  }, [monsterLevel, roadMap])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Attacks</h3>
      
      {/* Add new attack */}
      <div className="card">
        <h4 className="text-md font-medium text-gray-900 mb-3">Add New Attack</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={newAttack.name}
                onChange={(e) => setNewAttack(prev => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="e.g., Claws, Bite, Sword"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                value={newAttack.type}
                onChange={(e) => setNewAttack(prev => ({ ...prev, type: e.target.value }))}
                className="input"
              >
                <option value="melee">Melee</option>
                <option value="ranged">Ranged</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Attack Bonus</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={calculateAttackBonus()}
                  className="input bg-gray-50"
                  readOnly
                />
                <span className="text-sm text-gray-500">
                  (Auto-calculated from {roadMap ? `${roadMap} road map` : 'level'})
                </span>
              </div>
            </div>
          
          <div className="form-group">
            <label className="form-label">Damage</label>
            <input
              type="text"
              value={newAttack.damage}
              onChange={(e) => setNewAttack(prev => ({ ...prev, damage: e.target.value }))}
              className="input"
              placeholder="e.g., 1d6, 2d4+3"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Damage Type</label>
            <select
              value={newAttack.damageType}
              onChange={(e) => setNewAttack(prev => ({ ...prev, damageType: e.target.value }))}
              className="input"
            >
              <option value="bludgeoning">Bludgeoning</option>
              <option value="piercing">Piercing</option>
              <option value="slashing">Slashing</option>
              <option value="fire">Fire</option>
              <option value="cold">Cold</option>
              <option value="electricity">Electricity</option>
              <option value="acid">Acid</option>
              <option value="poison">Poison</option>
              <option value="mental">Mental</option>
              <option value="force">Force</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Traits</label>
            <input
              type="text"
              value={newAttack.traits.join(', ')}
              onChange={(e) => setNewAttack(prev => ({ 
                ...prev, 
                traits: e.target.value.split(',').map(t => t.trim()).filter(t => t)
              }))}
              className="input"
              placeholder="e.g., agile, finesse, reach"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={newAttack.description}
            onChange={(e) => setNewAttack(prev => ({ ...prev, description: e.target.value }))}
            className="input"
            rows="2"
            placeholder="Special effects, conditions, etc."
          />
        </div>
        
          <button
            type="button"
            onClick={addAttack}
            className="btn-primary inline-flex items-center space-x-2 mt-3"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attack</span>
          </button>
        </div>
      </div>
      
      {/* List existing attacks */}
      {attacks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">Current Attacks</h4>
          {attacks.map((attack, index) => (
            <div key={attack.id || index} className="card">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{attack.name}</h5>
                <button
                  onClick={() => removeAttack(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-1 capitalize">{attack.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Bonus:</span>
                  <span className="ml-1">{attack.bonus >= 0 ? '+' : ''}{attack.bonus}</span>
                </div>
                <div>
                  <span className="text-gray-500">Damage:</span>
                  <span className="ml-1">{attack.damage} {attack.damageType}</span>
                </div>
                <div>
                  <span className="text-gray-500">Traits:</span>
                  <span className="ml-1">{attack.traits?.join(', ') || 'None'}</span>
                </div>
              </div>
              
              {attack.description && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-gray-500">Description:</span>
                  <span className="ml-1">{attack.description}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AttackEditor 