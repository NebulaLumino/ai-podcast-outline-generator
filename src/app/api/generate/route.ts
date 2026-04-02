import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { podcastName, episodeNumber, guestInfo, episodeTheme, format } = body;
  if (!podcastName || !episodeTheme) return NextResponse.json({ error: 'Podcast name and episode theme are required' }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

  const prompt = `You are a professional podcast producer and content strategist. Generate a complete podcast episode package based on:

**Podcast Name/Topic:** ${podcastName}
**Episode Number:** ${episodeNumber || 'Not specified'}
**Guest Info:** ${guestInfo || 'Not specified'}
**Episode Theme:** ${episodeTheme}
**Format:** ${format || 'Interview'}

Please generate:

1. **EPISODE OUTLINE** — Full episode structure with segments and timing:
   - Intro music + welcome (suggested length)
   - Host intro of episode theme
   - Segment 1: Guest introduction + background
   - Segment 2: Deep dive into theme (main conversation)
   - Segment 3: Tangent/discussion/ad-hoc
   - Segment 4: Key takeaways / lessons
   - Outro: Summary, guest CTA, teaser for next episode

2. **INTRO SCRIPT** — Written out opening script for the host (1-2 paragraphs). Include podcast name mention, episode number, guest name, and episode theme hook.

3. **OUTRO SCRIPT** — Written out closing script including: thank guest, recap of key points, call to action (subscribe, leave review, share), next episode preview.

4. **GUEST BIO** — Professional guest bio suitable for podcast show notes (2 versions: 50-word short version and 150-word long version). Include credentials, recent achievements, and social links format.

5. **SHOW NOTES** — Complete show notes including:
   - Episode summary (2-3 sentences)
   - Key timestamps with descriptions
   - Guest links and resources mentioned
   - 3-5 relevant hashtags for podcast directory
   - Episode transcript teaser

6. **SOCIAL MEDIA CLIPS** — Write 3 social media posts (Twitter/X, Instagram, LinkedIn) that could be posted to promote this episode. Include copy, suggested hashtags, and best time to post.`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 4000, temperature: 0.9 }),
    });
    if (!response.ok) return NextResponse.json({ error: `API error: ${response.status}` }, { status: 500 });
    const data = await response.json();
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || 'No output generated.' });
  } catch (error: unknown) {
    return NextResponse.json({ error: `Request failed: ${error instanceof Error ? error.message : 'Unknown'}` }, { status: 500 });
  }
}