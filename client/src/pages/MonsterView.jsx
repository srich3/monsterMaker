import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Edit, Download, Trash2 } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const MonsterView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [monster, setMonster] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMonster()
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
    } catch (err) {
      setError('Failed to load monster')
      console.error('Error fetching monster:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this monster?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      const response = await fetch(`/api/monsters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete monster')
      }

      navigate('/dashboard')
    } catch (err) {
      setError('Failed to delete monster')
      console.error('Error deleting monster:', err)
    }
  }

  const handleExport = async () => {
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

  if (error || !monster) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Monster not found</h2>
        <p className="text-gray-600 mb-4">{error || 'The monster you are looking for does not exist.'}</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900 text-fantasy">{monster.name}</h1>
            <p className="text-gray-600">
              Level {monster.level || 1} • {monster.size || 'Medium'} • {monster.rarity || 'Common'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <Link
            to={`/monster/${id}/edit`}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger inline-flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {monster.image_url && (
            <div className="card">
              <img
                src={monster.image_url}
                alt={monster.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Description */}
          {monster.description && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{monster.description}</p>
            </div>
          )}

          {/* Attacks */}
          {monster.attacks && monster.attacks.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Attacks</h2>
              <div className="space-y-3">
                {monster.attacks.map((attack, index) => (
                  <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{attack.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-1">
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
                      <p className="text-sm text-gray-600 mt-2">{attack.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Private Notes (GM only) */}
          {monster.private_notes && (
            <div className="card border-l-4 border-yellow-400 bg-yellow-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">GM Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{monster.private_notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Combat Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Combat Statistics</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Hit Points</span>
                  <p className="text-2xl font-bold text-gray-900">{monster.hp || 10}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Armor Class</span>
                  <p className="text-2xl font-bold text-gray-900">{monster.ac || 15}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Perception</span>
                <p className="text-lg font-semibold text-gray-900">{monster.perception || 0}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Fortitude</span>
                  <p className="text-lg font-semibold text-gray-900">{monster.fortitude || 0}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Reflex</span>
                  <p className="text-lg font-semibold text-gray-900">{monster.reflex || 0}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Will</span>
                  <p className="text-lg font-semibold text-gray-900">{monster.will || 0}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Speed</span>
                <p className="text-lg font-semibold text-gray-900">{monster.speed || 25} feet</p>
              </div>
            </div>
          </div>

          {/* Ability Scores - Only show if database has been migrated */}
          {(monster.strength || monster.dexterity || monster.constitution || 
            monster.intelligence || monster.wisdom || monster.charisma) && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ability Scores</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Strength</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {monster.strength || 10} ({Math.floor(((monster.strength || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((monster.strength || 10) - 10) / 2)})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Dexterity</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {monster.dexterity || 10} ({Math.floor(((monster.dexterity || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((monster.dexterity || 10) - 10) / 2)})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Constitution</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {monster.constitution || 10} ({Math.floor(((monster.constitution || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((monster.constitution || 10) - 10) / 2)})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Intelligence</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {monster.intelligence || 10} ({Math.floor(((monster.intelligence || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((monster.intelligence || 10) - 10) / 2)})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Wisdom</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {monster.wisdom || 10} ({Math.floor(((monster.wisdom || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((monster.wisdom || 10) - 10) / 2)})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Charisma</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {monster.charisma || 10} ({Math.floor(((monster.charisma || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((monster.charisma || 10) - 10) / 2)})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Level</span>
                <p className="font-semibold text-gray-900">{monster.level || 1}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Size</span>
                <p className="font-semibold text-gray-900 capitalize">{monster.size || 'medium'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Rarity</span>
                <p className="font-semibold text-gray-900 capitalize">{monster.rarity || 'common'}</p>
              </div>
              {monster.road_map && (
                <div>
                  <span className="text-sm text-gray-500">Road Map</span>
                  <p className="font-semibold text-gray-900 capitalize">{monster.road_map.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <span className="text-gray-500">Created:</span>
                <p>{new Date(monster.created_at).toLocaleDateString()}</p>
              </div>
              {monster.updated_at && (
                <div>
                  <span className="text-gray-500">Last updated:</span>
                  <p>{new Date(monster.updated_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonsterView 