import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Save, ArrowLeft, Download, Zap } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import AttackEditor from '../components/AttackEditor'

// Pathfinder 2e Monster Creation Road Maps
const ROAD_MAPS = {
  brute: {
    name: 'Brute',
    description: 'Big, tough creatures like ogres. High HP, high damage, low AC.',
    stats: {
      perception: 'low',
      strength: 'high',
      dexterity: 'low',
      constitution: 'high',
      intelligence: 'low',
      wisdom: 'low',
      charisma: 'low',
      ac: 'low',
      fortitude: 'high',
      reflex: 'low',
      will: 'low',
      hp: 'high',
      attack: 'high',
      damage: 'high'
    }
  },
  magicalStriker: {
    name: 'Magical Striker',
    description: 'Creatures that combine martial prowess with magical abilities.',
    stats: {
      perception: 'moderate',
      strength: 'moderate',
      dexterity: 'moderate',
      constitution: 'moderate',
      intelligence: 'high',
      wisdom: 'moderate',
      charisma: 'high',
      ac: 'moderate',
      fortitude: 'moderate',
      reflex: 'moderate',
      will: 'high',
      hp: 'moderate',
      attack: 'high',
      damage: 'high'
    }
  },
  skillParagon: {
    name: 'Skill Paragon',
    description: 'Creatures with exceptional skills and abilities.',
    stats: {
      perception: 'high',
      strength: 'moderate',
      dexterity: 'high',
      constitution: 'moderate',
      intelligence: 'high',
      wisdom: 'high',
      charisma: 'high',
      ac: 'moderate',
      fortitude: 'low',
      reflex: 'high',
      will: 'high',
      hp: 'moderate',
      attack: 'moderate',
      damage: 'moderate'
    }
  },
  skirmisher: {
    name: 'Skirmisher',
    description: 'Fast, mobile creatures that dart in and out of combat.',
    stats: {
      perception: 'moderate',
      strength: 'moderate',
      dexterity: 'high',
      constitution: 'moderate',
      intelligence: 'moderate',
      wisdom: 'moderate',
      charisma: 'moderate',
      ac: 'moderate',
      fortitude: 'low',
      reflex: 'high',
      will: 'moderate',
      hp: 'moderate',
      attack: 'moderate',
      damage: 'moderate'
    }
  },
  sniper: {
    name: 'Sniper',
    description: 'Ranged attackers with high perception and accuracy.',
    stats: {
      perception: 'high',
      strength: 'low',
      dexterity: 'high',
      constitution: 'low',
      intelligence: 'moderate',
      wisdom: 'high',
      charisma: 'moderate',
      ac: 'low',
      fortitude: 'low',
      reflex: 'high',
      will: 'moderate',
      hp: 'low',
      attack: 'high',
      damage: 'high'
    }
  },
  soldier: {
    name: 'Soldier',
    description: 'Well-trained combatants with high AC and tactical abilities.',
    stats: {
      perception: 'moderate',
      strength: 'high',
      dexterity: 'moderate',
      constitution: 'high',
      intelligence: 'moderate',
      wisdom: 'moderate',
      charisma: 'moderate',
      ac: 'high',
      fortitude: 'high',
      reflex: 'moderate',
      will: 'moderate',
      hp: 'high',
      attack: 'high',
      damage: 'high'
    }
  },
  spellcaster: {
    name: 'Spellcaster',
    description: 'Creatures focused on magical abilities and spellcasting.',
    stats: {
      perception: 'moderate',
      strength: 'low',
      dexterity: 'moderate',
      constitution: 'low',
      intelligence: 'high',
      wisdom: 'high',
      charisma: 'high',
      ac: 'low',
      fortitude: 'low',
      reflex: 'moderate',
      will: 'high',
      hp: 'low',
      attack: 'low',
      damage: 'low'
    }
  }
}

// Stat calculation based on level and road map
const calculateStats = (level, roadMap) => {
  if (!roadMap || !ROAD_MAPS[roadMap]) return {}
  
  const baseStats = ROAD_MAPS[roadMap].stats
  const stats = {}
  
  // Calculate ability modifiers based on level and road map
  const abilityModifiers = {
    low: Math.floor(level / 3) - 1,
    moderate: Math.floor(level / 3),
    high: Math.floor(level / 3) + 1,
    extreme: Math.floor(level / 3) + 2
  }
  
  // Set ability scores (10 + modifier * 2)
  stats.strength = 10 + (abilityModifiers[baseStats.strength] || 0) * 2
  stats.dexterity = 10 + (abilityModifiers[baseStats.dexterity] || 0) * 2
  stats.constitution = 10 + (abilityModifiers[baseStats.constitution] || 0) * 2
  stats.intelligence = 10 + (abilityModifiers[baseStats.intelligence] || 0) * 2
  stats.wisdom = 10 + (abilityModifiers[baseStats.wisdom] || 0) * 2
  stats.charisma = 10 + (abilityModifiers[baseStats.charisma] || 0) * 2
  
  // Calculate HP based on level and road map
  const hpPerLevel = {
    low: 6,
    moderate: 8,
    high: 10,
    extreme: 12
  }
  stats.hp = hpPerLevel[baseStats.hp] * level
  
  // Calculate AC based on level and road map
  const acModifiers = {
    low: -2,
    moderate: 0,
    high: 2,
    extreme: 4
  }
  stats.ac = 10 + level + acModifiers[baseStats.ac]
  
  // Calculate saves based on level and road map
  const saveModifiers = {
    low: -2,
    moderate: 0,
    high: 2,
    extreme: 4
  }
  stats.fortitude = level + saveModifiers[baseStats.fortitude]
  stats.reflex = level + saveModifiers[baseStats.reflex]
  stats.will = level + saveModifiers[baseStats.will]
  
  // Calculate perception based on level and road map
  const perceptionModifiers = {
    low: -2,
    moderate: 0,
    high: 2,
    extreme: 4
  }
  stats.perception = level + perceptionModifiers[baseStats.perception]
  
  // Set speed based on road map
  stats.speed = roadMap === 'skirmisher' ? 35 : 25
  
  return stats
}

const MonsterCreator = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [monster, setMonster] = useState({
    name: '',
    level: 1,
    size: 'medium',
    rarity: 'common',
    roadMap: '',
    hp: 10,
    ac: 15,
    perception: 0,
    fortitude: 0,
    reflex: 0,
    will: 0,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    speed: 25,
    description: '',
    private_notes: '',
    image_url: '',
    skills: {},
    attacks: [],
    items: [],
    spells: {}
  })

  // Local state for ability scores (not saved to DB yet)
  const [localAbilityScores, setLocalAbilityScores] = useState({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    speed: 25
  })

  useEffect(() => {
    if (id) {
      fetchMonster()
    }
  }, [id])

  const fetchMonster = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      const response = await fetch(`/api/monsters/${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch monster')
      }

      const data = await response.json()
      setMonster(data)
      
      // Load ability scores into local state
      setLocalAbilityScores({
        strength: data.strength || 10,
        dexterity: data.dexterity || 10,
        constitution: data.constitution || 10,
        intelligence: data.intelligence || 10,
        wisdom: data.wisdom || 10,
        charisma: data.charisma || 10,
        speed: data.speed || 25
      })
    } catch (err) {
      setError('Failed to load monster')
      console.error('Error fetching monster:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      // Combine monster data with local ability scores
      // Remove roadMap from monster object to avoid duplication
      const { roadMap, ...monsterWithoutRoadMap } = monster
      
      const monsterData = {
        ...monsterWithoutRoadMap,
        ...localAbilityScores,
        road_map: roadMap // Map roadMap to road_map for database
      }
      
      console.log('Sending monster data:', monsterData)
      
      const url = id ? `/api/monsters/${id}` : '/api/monsters'
      const method = id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(monsterData),
      })

      if (!response.ok) {
        throw new Error('Failed to save monster')
      }

      const savedMonster = await response.json()
      setSuccess(id ? 'Monster updated successfully!' : 'Monster created successfully!')
      
      setTimeout(() => {
        navigate(`/monster/${savedMonster.id}`)
      }, 1500)
    } catch (err) {
      setError('Failed to save monster')
      console.error('Error saving monster:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setMonster(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRoadMapChange = (roadMap) => {
    if (!roadMap) return
    
    const calculatedStats = calculateStats(monster.level, roadMap)
    
    // Update monster with all calculated stats
    setMonster(prev => ({
      ...prev,
      roadMap,
      ...calculatedStats
    }))
    
    // Update local ability scores
    setLocalAbilityScores(prev => ({
      ...prev,
      ...calculatedStats
    }))
  }

  const handleLevelChange = (level) => {
    // Recalculate all stats if road map is selected
    if (monster.roadMap) {
      const calculatedStats = calculateStats(level, monster.roadMap)
      
      // Update monster with all calculated stats
      setMonster(prev => ({
        ...prev,
        level,
        ...calculatedStats
      }))
      
      // Update local ability scores
      setLocalAbilityScores(prev => ({
        ...prev,
        ...calculatedStats
      }))
    } else {
      // Just update level if no road map selected
      handleInputChange('level', level)
    }
  }

  const handleExport = async () => {
    if (!id) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      const response = await fetch(`/api/monsters/${id}/export`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to export monster')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${monster.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting monster:', error)
      alert('Failed to export monster')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-fantasy">
              {id ? 'Edit Monster' : 'Create Monster'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update your monster details' : 'Design your custom monster for FoundryVTT'}
            </p>
          </div>
        </div>
        
        {id && (
          <button
            onClick={handleExport}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  type="text"
                  value={monster.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="level" className="form-label">Level</label>
                  <input
                    id="level"
                    type="number"
                    min="1"
                    max="25"
                    value={monster.level}
                    onChange={(e) => handleLevelChange(parseInt(e.target.value) || 1)}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="size" className="form-label">Size</label>
                  <select
                    id="size"
                    value={monster.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="input"
                  >
                    <option value="tiny">Tiny</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="huge">Huge</option>
                    <option value="gargantuan">Gargantuan</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="roadMap" className="form-label">Road Map</label>
                <select
                  id="roadMap"
                  value={monster.roadMap}
                  onChange={(e) => handleRoadMapChange(e.target.value)}
                  className="input"
                >
                  <option value="">Select a road map...</option>
                  {Object.entries(ROAD_MAPS).map(([key, roadMap]) => (
                    <option key={key} value={key}>
                      {roadMap.name}
                    </option>
                  ))}
                </select>
                {monster.roadMap && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ROAD_MAPS[monster.roadMap].description}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rarity" className="form-label">Rarity</label>
                <select
                  id="rarity"
                  value={monster.rarity}
                  onChange={(e) => handleInputChange('rarity', e.target.value)}
                  className="input"
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="unique">Unique</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image_url" className="form-label">Image URL (optional)</label>
                <input
                  id="image_url"
                  type="url"
                  value={monster.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Combat Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Combat Statistics</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="hp" className="form-label">Hit Points</label>
                  <input
                    id="hp"
                    type="number"
                    min="1"
                    value={monster.hp}
                    onChange={(e) => handleInputChange('hp', parseInt(e.target.value))}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ac" className="form-label">Armor Class</label>
                  <input
                    id="ac"
                    type="number"
                    min="1"
                    value={monster.ac}
                    onChange={(e) => handleInputChange('ac', parseInt(e.target.value))}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="perception" className="form-label">Perception</label>
                <input
                  id="perception"
                  type="number"
                  value={monster.perception}
                  onChange={(e) => handleInputChange('perception', parseInt(e.target.value))}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label htmlFor="fortitude" className="form-label">Fortitude</label>
                  <input
                    id="fortitude"
                    type="number"
                    value={monster.fortitude}
                    onChange={(e) => handleInputChange('fortitude', parseInt(e.target.value))}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reflex" className="form-label">Reflex</label>
                  <input
                    id="reflex"
                    type="number"
                    value={monster.reflex}
                    onChange={(e) => handleInputChange('reflex', parseInt(e.target.value))}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="will" className="form-label">Will</label>
                  <input
                    id="will"
                    type="number"
                    value={monster.will}
                    onChange={(e) => handleInputChange('will', parseInt(e.target.value))}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

                  {/* Ability Scores */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ability Scores</h2>
              {monster.roadMap && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Zap className="w-4 h-4" />
                  <span>Auto-calculated from {ROAD_MAPS[monster.roadMap].name}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label htmlFor="strength" className="form-label">Strength</label>
                <input
                  id="strength"
                  type="number"
                  min="1"
                  max="30"
                  value={localAbilityScores.strength}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, strength: parseInt(e.target.value) || 10 }))}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifier: {Math.floor((localAbilityScores.strength - 10) / 2)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="dexterity" className="form-label">Dexterity</label>
                <input
                  id="dexterity"
                  type="number"
                  min="1"
                  max="30"
                  value={localAbilityScores.dexterity}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, dexterity: parseInt(e.target.value) || 10 }))}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifier: {Math.floor((localAbilityScores.dexterity - 10) / 2)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="constitution" className="form-label">Constitution</label>
                <input
                  id="constitution"
                  type="number"
                  min="1"
                  max="30"
                  value={localAbilityScores.constitution}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, constitution: parseInt(e.target.value) || 10 }))}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifier: {Math.floor((localAbilityScores.constitution - 10) / 2)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="intelligence" className="form-label">Intelligence</label>
                <input
                  id="intelligence"
                  type="number"
                  min="1"
                  max="30"
                  value={localAbilityScores.intelligence}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, intelligence: parseInt(e.target.value) || 10 }))}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifier: {Math.floor((localAbilityScores.intelligence - 10) / 2)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="wisdom" className="form-label">Wisdom</label>
                <input
                  id="wisdom"
                  type="number"
                  min="1"
                  max="30"
                  value={localAbilityScores.wisdom}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, wisdom: parseInt(e.target.value) || 10 }))}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifier: {Math.floor((localAbilityScores.wisdom - 10) / 2)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="charisma" className="form-label">Charisma</label>
                <input
                  id="charisma"
                  type="number"
                  min="1"
                  max="30"
                  value={localAbilityScores.charisma}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, charisma: parseInt(e.target.value) || 10 }))}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Modifier: {Math.floor((localAbilityScores.charisma - 10) / 2)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="form-group">
                <label htmlFor="speed" className="form-label">Speed</label>
                <input
                  id="speed"
                  type="number"
                  min="5"
                  value={localAbilityScores.speed}
                  onChange={(e) => setLocalAbilityScores(prev => ({ ...prev, speed: parseInt(e.target.value) || 25 }))}
                  className="input"
                />
              </div>
            </div>
          </div>

        {/* Attacks */}
        <AttackEditor 
          attacks={monster.attacks}
          onChange={(attacks) => handleInputChange('attacks', attacks)}
          monsterLevel={monster.level}
          roadMap={monster.roadMap}
        />

        {/* Description */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="description" className="form-label">Public Description</label>
              <textarea
                id="description"
                rows="4"
                value={monster.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input"
                placeholder="Describe your monster..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="private_notes" className="form-label">Private Notes (GM only)</label>
              <textarea
                id="private_notes"
                rows="3"
                value={monster.private_notes}
                onChange={(e) => handleInputChange('private_notes', e.target.value)}
                className="input"
                placeholder="GM notes, tactics, etc..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : (id ? 'Update Monster' : 'Create Monster')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default MonsterCreator 