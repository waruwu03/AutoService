"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo! Ada yang bisa saya bantu terkait layanan AutoServis?", isUser: false }
  ])
  const [inputVal, setInputVal] = useState("")

  const handleSend = () => {
    if (!inputVal.trim()) return
    const newMsg = { id: Date.now(), text: inputVal, isUser: true }
    setMessages([...messages, newMsg])
    setInputVal("")

    // mock reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, text: "Terima kasih atas pesannya. Saat ini fitur Chat AI masih dalam tahap eksperimen. Segera hadir untuk Anda!", isUser: false }
      ])
    }, 1000)
  }

  return (
    <>
      {!isOpen && (
        <Button 
          className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 border-2 border-white dark:border-slate-900 z-50 p-0 flex items-center justify-center transition-transform hover:scale-110 duration-200"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="size-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl flex flex-col z-50 overflow-hidden border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-[#FFC107]" />
              <CardTitle className="text-md font-semibold">AutoServis AI</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800 size-8 rounded-full" onClick={() => setIsOpen(false)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 h-80 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col gap-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.isUser ? "bg-[#FFC107] text-slate-900 rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={e => { e.preventDefault(); handleSend() }} className="flex w-full items-center space-x-2">
              <Input 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Tanya sesuatu mengenai servis..." 
                className="flex-1 rounded-full border-slate-200 dark:border-slate-700 focus-visible:ring-[#FFC107] h-10"
              />
              <Button type="submit" size="icon" className="rounded-full bg-slate-900 hover:bg-slate-800 dark:hover:bg-slate-700 text-[#FFC107] shrink-0 size-10">
                <Send className="size-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
