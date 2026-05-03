import { useEffect, useState } from 'react'

type Entry = { date: string; mood: number; note: string }

const STORAGE_KEY = 'wellness-checkin-v1'

const RESOURCES = [
  { label: '988 Suicide & Crisis Lifeline (US)', href: 'https://988lifeline.org/' },
  { label: 'Crisis Text Line — Text HOME to 741741', href: 'https://www.crisistextline.org/' },
  { label: 'FindTreatment.gov (SAMHSA)', href: 'https://findtreatment.gov/' },
]

const PROMPTS = [
  'Name one small win from today (even tiny counts).',
  'What is one thing you are looking forward to this week?',
  'Who is one person you could text a honest “hey” to?',
]

export default function App() {
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [history, setHistory] = useState<Entry[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  function save() {
    const entry: Entry = {
      date: new Date().toISOString(),
      mood,
      note: note.trim(),
    }
    const next = [entry, ...history].slice(0, 60)
    setHistory(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setNote('')
  }

  const streak = (() => {
    if (history.length === 0) return 0
    const days = new Set(history.map((h) => h.date.slice(0, 10)))
    let c = 0
    const d = new Date()
    for (;;) {
      const key = d.toISOString().slice(0, 10)
      if (days.has(key)) {
        c += 1
        d.setDate(d.getDate() - 1)
      } else break
    }
    return c
  })()

  return (
    <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
      <div
        style={{
          background: '#4338ca',
          color: '#eef2ff',
          padding: '12px 14px',
          borderRadius: 12,
          marginBottom: '1rem',
          lineHeight: 1.5,
          fontSize: 14,
        }}
      >
        <strong>Not medical care.</strong> This app is a private journal + reflection prompts. It does{' '}
        <strong>not</strong> diagnose or treat anything. If you might hurt yourself or someone else, use the
        crisis resources below now.
      </div>

      <h1 style={{ marginTop: 0 }}>Daily check-in</h1>
      <p style={{ color: '#c7d2fe' }}>Mood 1–5, optional note. Data stays in <strong>your browser</strong> only.</p>

      <section style={{ background: 'rgba(15,23,42,0.55)', padding: '1rem', borderRadius: 12, marginBottom: '1rem' }}>
        <p style={{ marginTop: 0, color: '#a5b4fc' }}>Streak: {streak} day(s) with at least one entry</p>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Mood: {mood}
          <input type="range" min={1} max={5} value={mood} onChange={(e) => setMood(Number(e.target.value))} style={{ width: '100%' }} />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Note (optional)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            style={{ width: '100%', borderRadius: 8, padding: 8, border: '1px solid #6366f1', background: '#1e1b4b', color: '#e0e7ff' }}
          />
        </label>
        <button
          type="button"
          onClick={save}
          style={{
            padding: '12px 20px',
            minHeight: 44,
            borderRadius: 8,
            border: 'none',
            background: '#818cf8',
            color: '#1e1b4b',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          Save check-in
        </button>
      </section>

      <section style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem' }}>Reflect</h2>
        <ul style={{ color: '#c7d2fe' }}>
          {PROMPTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem' }}>Crisis & professional help</h2>
        <ul style={{ paddingLeft: '1.2rem' }}>
          {RESOURCES.map((r) => (
            <li key={r.href} style={{ marginBottom: 6 }}>
              <a href={r.href} target="_blank" rel="noreferrer" style={{ color: '#fde68a' }}>
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1rem' }}>Recent entries</h2>
        {history.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No entries yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.slice(0, 14).map((e) => (
              <li
                key={e.date}
                style={{
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(99,102,241,0.35)',
                  fontSize: 14,
                }}
              >
                <strong>{e.date.slice(0, 10)}</strong> — mood {e.mood}
                {e.note ? (
                  <>
                    : <span style={{ color: '#c7d2fe' }}>{e.note}</span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
