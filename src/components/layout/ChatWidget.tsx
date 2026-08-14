'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Search, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface ChatContact {
  id: number;
  name: string;
  role: string;
  online: boolean;
  avatarColor: string;
  messages: ChatMessage[];
}

const mockContacts: ChatContact[] = [
  {
    id: 1,
    name: 'Mr. John Smith',
    role: 'Teacher',
    online: true,
    avatarColor: 'from-sky-500 to-blue-600',
    messages: [
      { id: 1, sender: 'them', text: 'Good morning! Have you reviewed the assignment grades?', time: '09:12' },
      { id: 2, sender: 'me', text: 'Yes, I just finished. All looks good.', time: '09:15' },
      { id: 3, sender: 'them', text: 'Perfect. The new timetable is also live now.', time: '09:16' },
    ],
  },
  {
    id: 2,
    name: 'System Admin',
    role: 'Administrator',
    online: true,
    avatarColor: 'from-violet-500 to-indigo-600',
    messages: [
      { id: 1, sender: 'them', text: 'Scheduled maintenance this Sunday from 2 AM - 4 AM.', time: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Thanks for the heads up!', time: 'Yesterday' },
    ],
  },
  {
    id: 3,
    name: 'Mrs. Jane Doe',
    role: 'Teacher',
    online: false,
    avatarColor: 'from-emerald-500 to-teal-600',
    messages: [
      { id: 1, sender: 'them', text: 'Can we discuss the parent-teacher meeting schedule?', time: 'Mon' },
      { id: 2, sender: 'them', text: 'I am available after 3 PM tomorrow.', time: 'Mon' },
    ],
  },
];

function timeNow() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnread, setIsUnread] = useState(true);
  const [contacts, setContacts] = useState<ChatContact[]>(mockContacts);
  const [activeId, setActiveId] = useState<number>(1);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showContacts, setShowContacts] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = contacts.find((c) => c.id === activeId) ?? contacts[0];

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
    if (isOpen && showContacts) inputRef.current?.focus();
  }, [activeId, isOpen, showContacts, active?.messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !active) return;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), sender: 'me', text, time: timeNow() },
              ],
            }
          : c
      )
    );
    setInput('');
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => {
          setIsOpen((open) => {
            if (!open) setIsUnread(false);
            return !open;
          });
        }}
        aria-label="Toggle chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#5b51ef] text-white shadow-lg shadow-indigo-400/40 flex items-center justify-center hover:bg-[#4b41e0] hover:scale-105 transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && isUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-500 ring-2 ring-white" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 flex flex-col overflow-hidden animate-slide-in-up">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-br from-[#5b51ef] to-[#4338ca] text-white flex items-center justify-between shrink-0">
            <div>
              <p className="text-sm font-bold">Messages</p>
              <p className="text-[11px] text-indigo-100/90">
                {contacts.filter((c) => c.online).length} online · {contacts.length} conversations
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation selector */}
          <div className="px-3 pt-3 pb-2 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowContacts((v) => !v)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 hover:text-[#5b51ef] transition-colors"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showContacts ? '' : '-rotate-90'}`} />
                {showContacts ? 'Conversations' : active?.name}
              </button>
            </div>
            {showContacts && (
              <div className="relative mb-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search contacts…"
                  className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-lg border border-slate-200 bg-slate-50/60 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef] transition-colors"
                />
              </div>
            )}
          </div>

          {/* Contacts / messages area */}
          {showContacts ? (
            <div className="flex-1 overflow-y-auto py-1.5">
              {filteredContacts.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-slate-400">No contacts found.</p>
              ) : (
                filteredContacts.map((c) => {
                  const last = c.messages[c.messages.length - 1];
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveId(c.id);
                        setShowContacts(false);
                        setSearch('');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left ${activeId === c.id ? 'bg-[#5b51ef]/5' : ''}`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                          {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${c.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-slate-800 truncate">{c.name}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{last?.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          <span className="text-[#5b51ef] font-medium mr-1">{last?.sender === 'me' ? 'You:' : ''}</span>
                          {last?.text}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Active contact bar */}
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-slate-50/50">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${active.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {active.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 truncate">{active.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {active.online ? <span className="text-emerald-600">Online</span> : 'Offline'} · {active.role}
                  </p>
                </div>
                <button onClick={() => setShowContacts(true)} className="text-[11px] font-semibold text-[#5b51ef] hover:text-[#4338ca] transition-colors">
                  Back
                </button>
              </div>

              {/* Messages */}
              <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                        m.sender === 'me'
                          ? 'bg-[#5b51ef] text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className={`mt-1 text-[9px] ${m.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compose */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-100 shrink-0 flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${active.name.split(' ')[0]}…`}
                  className="flex-1 px-3 py-2 text-[12px] rounded-lg border border-slate-200 bg-slate-50/60 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef] transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-lg bg-[#5b51ef] text-white flex items-center justify-center hover:bg-[#4b41e0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
