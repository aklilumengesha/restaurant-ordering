"use client"
import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }, { role: 'assistant', content: '' }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      // Try streaming
      const contentType = res.headers.get('content-type') || ''
      if (res.body && (contentType.includes('text/') || contentType.includes('event-stream'))) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let assistantAccum = ''
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          assistantAccum += chunk
          setMessages((m) => {
            const copy = [...m]
            const lastIdx = copy.length - 1
            if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
              copy[lastIdx] = { role: 'assistant', content: assistantAccum }
            }
            return copy
          })
        }
      } else {
        // Fallback JSON
        const data = await res.json().catch(() => null)
        const reply = data?.reply || (await res.text()) || 'Sorry, I could not get a response.'
        setMessages((m) => {
          const copy = [...m]
          const lastIdx = copy.length - 1
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
            copy[lastIdx] = { role: 'assistant', content: reply }
          }
          return copy
        })
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m]
        const lastIdx = copy.length - 1
        if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
          copy[lastIdx] = { role: 'assistant', content: 'Assistant unavailable. Please try again later.' }
        }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center ${
          open 
            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rotate-0' 
            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105'
        }`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-40 w-[360px] max-h-[500px] flex flex-col rounded-2xl shadow-2xl shadow-gray-900/20 dark:shadow-black/40 overflow-hidden transition-all duration-300 origin-bottom-right ${
        open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">RestoNext Assistant</h3>
            <p className="text-xs text-white/80">Ask about menu, orders, or reservations</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-[280px] max-h-[320px]">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hi! How can I help you today?
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {m.role === 'user' 
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                }
              </div>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-br-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
              }`}>
                {m.content || (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 placeholder:text-gray-400"
            />
            <button 
              onClick={send} 
              disabled={loading || !input.trim()} 
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
