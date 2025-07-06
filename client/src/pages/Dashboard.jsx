import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Plus, Search, Download, Edit, Trash2, Eye } from 'lucide-react'
import MonsterCard from '../components/MonsterCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const [monsters, setMonsters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMonsters()
  }, [])

  const fetchMonsters = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      const response = await fetch('/api/monsters', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch monsters')
      }
      
      const data = await response.json()
      setMonsters(data)
    } catch (err) {
      setError('Failed to load monsters')
      console.error('Error fetching monsters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMonster = async (monsterId) => {
    if (!confirm('Are you sure you want to delete this monster?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      const response = await fetch(`/api/monsters/${monsterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete monster')
      }

      setMonsters(monsters.filter(monster => monster.id !== monsterId))
    } catch (err) {
      setError('Failed to delete monster')
      console.error('Error deleting monster:', err)
    }
  }

  const filteredMonsters = monsters.filter(monster =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-fantasy">Your Monsters</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your custom monsters for FoundryVTT
          </p>
        </div>
        <Link
          to="/create"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Monster</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search monsters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Monsters grid */}
      {filteredMonsters.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No monsters yet</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No monsters match your search.' : 'Create your first monster to get started.'}
          </p>
          {!searchTerm && (
            <Link to="/create" className="btn-primary">
              Create your first monster
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonsters.map((monster) => (
            <MonsterCard
              key={monster.id}
              monster={monster}
              onDelete={handleDeleteMonster}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard 