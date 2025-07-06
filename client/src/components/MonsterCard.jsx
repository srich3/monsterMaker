import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Download, Edit, Trash2, Eye } from 'lucide-react'

const MonsterCard = ({ monster, onDelete }) => {
  const handleExport = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      const response = await fetch(`/api/monsters/${monster.id}/export`, {
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

  return (
    <div className="monster-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{monster.name}</h3>
          <p className="text-sm text-gray-500">
            Level {monster.level || 1} • {monster.size || 'Medium'} • {monster.rarity || 'Common'}
            {monster.road_map && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {monster.road_map.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleExport}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Export for FoundryVTT"
          >
            <Download className="w-4 h-4" />
          </button>
          <Link
            to={`/monster/${monster.id}`}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View monster"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/monster/${monster.id}/edit`}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit monster"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(monster.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete monster"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">HP</span>
            <p className="font-medium">{monster.hp || 10}</p>
          </div>
          <div>
            <span className="text-gray-500">AC</span>
            <p className="font-medium">{monster.ac || 15}</p>
          </div>
          <div>
            <span className="text-gray-500">Perception</span>
            <p className="font-medium">{monster.perception || 0}</p>
          </div>
        </div>

        {monster.description && (
          <div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {monster.description}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-400">
          Created {new Date(monster.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default MonsterCard 