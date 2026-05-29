import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { sendWrenMessage, buildSystemPrompt, providerLabel } from '../../lib/aiProvider';
import { STAGES } from '../../data/stages';
import type { ChatMessage } from '../../types';

function WrenAvatar({ typing = false }: { typing?: boolean }) {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-loom-gold/20 border border-loom-gold/40 flex items-center justify-center text-base">
      🐦
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-loom-muted"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

function MessageBubble({ role, content }: MessageBubbleProps) {
  if (role === 'assistant') {
    return (
      <div className="flex gap-2 items-start">
        <WrenAvatar />
        <div className="wren-message max-w-[85%] text-loom-cream">
          {content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < content.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start flex-row-reverse">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-loom-rust/30 border border-loom-rust/40 flex items-center justify-center text-sm">
        🧑
      </div>
      <div className="user-message max-w-[85%] text-loom-cream">
        {content}
      </div>
    </div>
  );
}

interface SuggestedPromptProps {
  text: string;
  onClick: () => void;
}

function SuggestedPrompt({ text, onClick }: SuggestedPromptProps) {
  return (
    <button
      onClick={onClick}
      className="text-left text-xs text-loom-muted hover:text-loom-gold border border-loom-border hover:border-loom-gold/50 rounded-lg px-3 py-1.5 transition-all duration-150 bg-loom-raised"
    >
      {text}
    </button>
  );
}

export function WrenChat() {
  const {
    messages,
    isChatOpen,
    isWrenTyping,
    apiKey,
    groqApiKey,
    groqModel,
    aiProvider,
    activeStage,
    stageProgress,
    addMessage,
    setChatOpen,
    setWrenTyping,
    updateLastMessage,
    setShowApiKeyModal,
  } = useGameStore();

  const activeKey = aiProvider === 'anthropic' ? apiKey : groqApiKey;

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const stage = STAGES.find((s) => s.id === activeStage);
  const progress = stageProgress[activeStage];
  const completedSteps = progress?.completedSteps ?? [];

  const suggestedPrompts = [
    "What should I do first?",
    "Explain the shed to me",
    "I'm confused about the heddles",
    "What's the difference between warp and weft?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWrenTyping]);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isChatOpen]);

  // Send welcome message on first open
  useEffect(() => {
    if (isChatOpen && messages.length === 0 && activeKey) {
      const welcome: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Hi! I'm Wren, your weaving guide 🐦 You're on Stage ${activeStage}: ${stage?.name ?? 'Getting Started'}. What can I help you with?`,
        timestamp: Date.now(),
      };
      addMessage(welcome);
    }
  }, [isChatOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isWrenTyping) return;

    if (!activeKey) {
      setShowApiKeyModal(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setWrenTyping(true);

    // Placeholder assistant message for streaming
    const assistantId = `wren-${Date.now()}`;
    const placeholderMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    addMessage(placeholderMessage);

    const systemPrompt = buildSystemPrompt(activeStage, completedSteps);
    const conversationHistory = [
      ...messages
        .filter((m) => m.content)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];

    await sendWrenMessage(
      { provider: aiProvider, anthropicKey: apiKey, groqKey: groqApiKey, groqModel },
      systemPrompt,
      conversationHistory,
    {
      onToken: (fullText) => {
        updateLastMessage(fullText);
      },
      onDone: () => {
        setWrenTyping(false);
      },
      onError: (error) => {
        updateLastMessage(`Sorry, I hit an error: ${error}. Check your API key in settings.`);
        setWrenTyping(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        className="fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full bg-loom-gold text-loom-bg flex items-center justify-center text-xl shadow-lg hover:bg-loom-gold2 transition-colors"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={isChatOpen ? {} : { boxShadow: ['0 0 0 0 rgba(201,162,39,0)', '0 0 0 8px rgba(201,162,39,0.15)', '0 0 0 0 rgba(201,162,39,0)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        title={isChatOpen ? 'Close chat' : 'Ask Wren'}
      >
        {isChatOpen ? '✕' : '🐦'}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-20 right-5 z-30 w-80 sm:w-96 h-[520px] bg-loom-card border border-loom-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 20px rgba(201,162,39,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-loom-border bg-loom-raised/50">
              <WrenAvatar />
              <div className="flex-1 min-w-0">
                <div className="text-loom-cream font-semibold text-sm">Wren</div>
                <div className="text-loom-muted text-xs truncate">
                  {isWrenTyping ? (
                    <span className="text-loom-gold">Thinking...</span>
                  ) : (
                    <span>
                      {aiProvider === 'groq' ? '⚡' : '🤖'}{' '}
                      {providerLabel({ provider: aiProvider, groqModel })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="text-loom-muted text-xs bg-loom-raised rounded-full px-2 py-0.5">
                  Stage {activeStage}
                </div>
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="text-loom-muted hover:text-loom-gold transition-colors text-sm"
                  title="Switch AI provider"
                >
                  ⚙️
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🐦</div>
                  <p className="text-loom-muted text-sm">
                    Hi! I'm Wren. Ask me anything about your loom.
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    {suggestedPrompts.map((p) => (
                      <SuggestedPrompt
                        key={p}
                        text={p}
                        onClick={() => {
                          setInput(p);
                          setTimeout(() => handleSend(), 50);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.content || (msg.role === 'assistant' && isWrenTyping) ? (
                        msg.content ? (
                          <MessageBubble role={msg.role} content={msg.content} />
                        ) : (
                          <div className="flex gap-2 items-start">
                            <WrenAvatar typing />
                            <div className="wren-message">
                              <TypingDots />
                            </div>
                          </div>
                        )
                      ) : null}
                    </div>
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-loom-border bg-loom-raised/30">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Wren anything..."
                  rows={1}
                  className="flex-1 bg-loom-raised border border-loom-border rounded-xl px-3 py-2.5 text-loom-cream placeholder:text-loom-muted/50 text-sm resize-none focus:outline-none focus:border-loom-gold transition-colors leading-snug"
                  style={{ maxHeight: 100, overflowY: 'auto' }}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isWrenTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-loom-gold text-loom-bg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  ↑
                </motion.button>
              </div>
              <p className="text-loom-muted text-[10px] mt-1.5 text-center">
                Enter to send · Shift+Enter for newline
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
