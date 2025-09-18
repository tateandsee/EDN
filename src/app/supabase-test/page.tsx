import { createClient } from '@/lib/supabase-client'

export default function SupabaseTest() {
  const supabase = createClient()
  
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
      
      if (error) {
        console.error('Supabase connection error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('Supabase connection successful!')
      return { success: true, count: data?.count || 0 }
    } catch (err) {
      console.error('Unexpected error:', err)
      return { success: false, error: 'Unexpected error occurred' }
    }
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Connection
      </button>
      <div id="result" className="mt-4"></div>
    </div>
  )
}