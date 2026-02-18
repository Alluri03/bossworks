import { useState, useRef, useEffect } from 'react';
import { FUNDING_CHAT } from '../data/appData';
import { Icons } from './Icons';

/* ─── Embedded radio question card ──────────────────────────── */
function EmbeddedQuestion({ question, selectedOption, onSelect, onContinue }) {
  return (
    <div className="mt-3 bg-white rounded-xl border border-gray-200 p-3">
      <div className="text-sm font-semibold text-gray-800 mb-2">{question.prompt}</div>
      <div className="space-y-2">
        {question.options.map(opt => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all text-left ${
                isSelected
                  ? 'border-brand-orange bg-orange-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'border-brand-orange' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-brand-orange"/>}
              </div>
              <span className={`text-sm ${isSelected ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      {selectedOption && (
        <button
          onClick={onContinue}
          className="btn-primary w-full mt-3"
        >
          Continue
        </button>
      )}
    </div>
  );
}

/* ─── Date separator ─────────────────────────────────────────── */
function DateSeparator({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-100"/>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-gray-100"/>
    </div>
  );
}

/* ─── Assistant message bubble ───────────────────────────────── */
function AssistantMessage({ msg, selectedOption, onSelect, onContinue }) {
  return (
    <div className="flex items-start gap-2.5">
      {/* Bot avatar */}
      <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icons.Sparkle size={14} className="text-white"/>
      </div>
      {/* Bubble */}
      <div className="flex-1 max-w-[85%]">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
          <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
          {msg.contextNote && (
            <p className="text-xs italic text-gray-400 mt-1">{msg.contextNote}</p>
          )}
          {msg.question && (
            <EmbeddedQuestion
              question={msg.question}
              selectedOption={selectedOption}
              onSelect={onSelect}
              onContinue={onContinue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── User message bubble ────────────────────────────────────── */
function UserMessage({ text }) {
  return (
    <div className="flex justify-end">
      <div className="bg-brand-orange text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[80%] leading-relaxed shadow-sm">
        {text}
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function FundingSection() {
  const [messages,        setMessages]        = useState(FUNDING_CHAT);
  const [input,           setInput]           = useState('');
  const [selectedOption,  setSelectedOption]  = useState(null);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleContinue() {
    if (!selectedOption) return;
    // Append user reply
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: selectedOption },
      {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: `Great choice! Let me find the best ${selectedOption.toLowerCase()} opportunities for your Ramen Shop in South Austin. I'll look at your business profile and match you with the most relevant options.`,
        contextNote: null,
        question: null,
      },
    ]);
    setQuestionAnswered(true);
    setSelectedOption(null);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text },
      {
        id: `asst-reply-${Date.now()}`,
        role: 'assistant',
        text: "Thanks for that! I'm researching funding options tailored to your profile. I'll have some recommendations for you shortly.",
        contextNote: null,
        question: null,
      },
    ]);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4">
        {/* Date separator for first message */}
        {messages.length > 0 && messages[0].dateLabel && (
          <DateSeparator label="Today" />
        )}

        {messages.map((msg, idx) => {
          if (msg.role === 'assistant') {
            // Show question only on the first assistant message that has one
            const isFirstQ = msg.question && !questionAnswered;
            return (
              <AssistantMessage
                key={msg.id}
                msg={msg}
                selectedOption={isFirstQ ? selectedOption : null}
                onSelect={isFirstQ ? setSelectedOption : null}
                onContinue={isFirstQ ? handleContinue : null}
              />
            );
          }
          if (msg.role === 'user') {
            return <UserMessage key={msg.id} text={msg.text} />;
          }
          return null;
        })}
        <div ref={messagesEndRef}/>
      </div>

      {/* ── Chat input bar ── */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Text input */}
          <div className={`flex-1 flex items-center gap-2 bg-gray-50 border rounded-2xl px-3 py-2.5 transition-all ${input ? 'border-brand-orange ring-2 ring-orange-100' : 'border-gray-200'}`}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about grants, loans, investors…"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            {/* Mic button */}
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-all">
              <Icons.Mic size={15} className="text-gray-400"/>
            </button>
          </div>
          {/* Send button */}
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 hover:bg-orange-600 active:scale-90 transition-all shadow-sm"
          >
            <Icons.Send size={15} className="text-white"/>
          </button>
        </div>
      </div>
    </div>
  );
}
