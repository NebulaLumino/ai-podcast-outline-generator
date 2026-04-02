'use client';
import { useState } from 'react';
export default function Home() {
  const [form, setForm] = useState({ podcastName: '', episodeNumber: '', guestInfo: '', episodeTheme: '', format: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.podcastName || !form.episodeTheme) { setError('Podcast name and episode theme are required.'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🎙️</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">AI Podcast Episode Outline & Show Notes Generator</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Generate complete podcast episode packages with outlines, scripts, guest bios, show notes, and social clips.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Podcast Name/Topic *</label>
              <input type="text" name="podcastName" value={form.podcastName} onChange={handleChange} placeholder="Name of your podcast or topic focus"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Episode Number</label>
              <input type="text" name="episodeNumber" value={form.episodeNumber} onChange={handleChange} placeholder="e.g., Episode 42, Season 2 Ep 3"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Episode Theme *</label>
            <input type="text" name="episodeTheme" value={form.episodeTheme} onChange={handleChange} placeholder="Main topic or theme of this episode"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Guest Info</label>
            <textarea name="guestInfo" value={form.guestInfo} onChange={handleChange}
              placeholder="Name, title, background, recent projects, social media handles, topics they can speak on..."
              rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Episode Format</label>
            <select name="format" value={form.format} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
              <option value="">Select format...</option>
              <option value="Interview">Interview (host + guest)</option>
              <option value="Solo">Solo episode (host only)</option>
              <option value="Co-host">Co-host conversation</option>
              <option value="Panel">Panel discussion</option>
              <option value="Debate">Debate format</option>
              <option value="Roundtable">Roundtable discussion</option>
            </select>
          </div>

          {error && <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-900/30">
            {loading ? <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Generating podcast outline...
            </span> : 'Generate Podcast Package'}
          </button>
        </form>

        {result && (
          <div className="bg-gray-900/60 border border-amber-800/50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2"><span>🎧</span> Generated Podcast Package</h2>
            <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed bg-gray-950 rounded-xl p-6 overflow-x-auto">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}