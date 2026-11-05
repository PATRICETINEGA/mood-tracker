'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AddMood() {
  const [mood, setMood] = useState('happy')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/moods', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood, note }) })
    setNote(''); setLoading(false); r.refresh()
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <select value={mood} onChange={e=>setMood(e.target.value)} className="w-full border p-2 rounded text-sm">
        <option value="happy">Happy</option>
        <option value="okay">Okay</option>
        <option value="sad">Sad</option>
        <option value="anxious">Anxious</option>
        <option value="energetic">Energetic</option>
      </select>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note (optional)" className="w-full border p-2 rounded text-sm" />
      <button type="submit" disabled={loading} className="bg-pink-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50">Log</button>
    </form>
  )
}
