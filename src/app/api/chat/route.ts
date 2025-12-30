import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `You are a helpful assistant for a restaurant. You help customers browse the menu, place orders, and make reservations. If asked to create a reservation, gather: name, email, date (YYYY-MM-DD), time (HH:mm), party size. If tools are unavailable, provide clear instructions or links.`

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  if (!message || typeof message !== 'string') return new Response('Bad Request', { status: 400 })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // Stream a simple static reply
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const reply = 'How can I help you with menu, orders, or reservations today? Visit /reservations to book.'
        controller.enqueue(encoder.encode(reply))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  // Stream from OpenAI Chat Completions SSE
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    }),
  })

  if (!r.ok || !r.body) {
    return new Response('Assistant unavailable', { status: 500 })
  }

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const reader = r.body!.getReader()
      let done = false
      let acc = ''
      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          const chunk = decoder.decode(value)
          acc += chunk
          const lines = acc.split('\n')
          acc = lines.pop() || ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            if (trimmed.startsWith('data:')) {
              const data = trimmed.replace(/^data:\s*/, '')
              if (data === '[DONE]') {
                controller.close()
                return
              }
              try {
                const json = JSON.parse(data)
                const delta = json.choices?.[0]?.delta?.content
                if (delta) controller.enqueue(encoder.encode(delta))
              } catch {
                // ignore parse errors
              }
            }
          }
        }
      }
      controller.close()
    },
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
