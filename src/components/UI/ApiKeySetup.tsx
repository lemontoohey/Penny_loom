import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Button } from './Button';
import { GROQ_MODELS, DEFAULT_GROQ_MODEL, hasValidKey } from '../../lib/aiProvider';
import type { AIProvider } from '../../lib/aiProvider';

const PROVIDER_META: Record<AIProvider, {
  label: string;
  icon: string;
  keyPrefix: string;
  keyPlaceholder: string;
  keyHint: string;
  consoleUrl: string;
  consoleName: string;
  modelLine: string;
  tagline: string;
  tagColor: string;
}> = {
  anthropic: {
    label: 'Claude',
    icon: '🤖',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-...',
    keyHint: 'Key starts with sk-ant-',
    consoleUrl: 'console.anthropic.com',
    consoleName: 'console.anthropic.com',
    modelLine: 'Model: claude-sonnet-4-5',
    tagline: 'Smartest answers, best weaving expertise',
    tagColor: 'text-purple-400',
  },
  groq: {
    label: 'Groq',
    icon: '⚡',
    keyPrefix: 'gsk_',
    keyPlaceholder: 'gsk_...',
    keyHint: 'Key starts with gsk_',
    consoleUrl: 'console.groq.com',
    consoleName: 'console.groq.com',
    modelLine: 'Free tier available — very fast inference',
    tagline: 'Blazing fast responses, free tier available',
    tagColor: 'text-orange-400',
  },
};

export function ApiKeySetup() {
  const {
    showApiKeyModal,
    apiKey,
    groqApiKey,
    aiProvider,
    groqModel,
    setApiKey,
    setGroqApiKey,
    setGroqModel,
    setProvider,
    setShowApiKeyModal,
  } = useGameStore();

  const activeKeyExists = aiProvider === 'anthropic' ? !!apiKey : !!groqApiKey;
  const show = showApiKeyModal || !activeKeyExists;

  const [tab, setTab] = useState<AIProvider>(aiProvider);
  const [anthropicInput, setAnthropicInput] = useState('');
  const [groqInput, setGroqInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(groqModel || DEFAULT_GROQ_MODEL);
  const [error, setError] = useState('');

  const meta = PROVIDER_META[tab];

  function handleSave() {
    setError('');
    if (tab === 'anthropic') {
      const val = anthropicInput.trim();
      if (!val.startsWith('sk-ant-')) {
        setError('Anthropic keys start with "sk-ant-" — check your console.');
        return;
      }
      setApiKey(val);
      setProvider('anthropic');
    } else {
      const val = groqInput.trim();
      if (!val.startsWith('gsk_')) {
        setError('Groq keys start with "gsk_" — check your Groq console.');
        return;
      }
      setGroqApiKey(val);
      setGroqModel(selectedModel);
      setProvider('groq');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
  }

  function handleSwitchProvider(p: AIProvider) {
    setTab(p);
    setError('');
    // If switching to a provider that already has a key, allow saving immediately
  }

  const currentTabHasKey = tab === 'anthropic' ? !!apiKey : !!groqApiKey;
  const isActiveProvider = tab === aiProvider;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-loom-card border border-loom-border rounded-2xl p-7 max-w-md w-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-loom-gold/20 border border-loom-gold/40 flex items-center justify-center text-3xl">
                🐦
              </div>
            </div>
            <h2 className="text-lg font-semibold text-loom-cream text-center mb-1">
              Wake up Wren
            </h2>
            <p className="text-loom-muted text-xs text-center mb-5">
              Choose your AI provider — keys stay in your browser only.
            </p>

            {/* Provider tabs */}
            <div className="flex gap-2 mb-5 p-1 bg-loom-raised rounded-xl">
              {(['anthropic', 'groq'] as AIProvider[]).map((p) => {
                const m = PROVIDER_META[p];
                const hasKey = p === 'anthropic' ? !!apiKey : !!groqApiKey;
                return (
                  <button
                    key={p}
                    onClick={() => handleSwitchProvider(p)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150
                      ${tab === p
                        ? 'bg-loom-card border border-loom-gold/40 text-loom-cream shadow-sm'
                        : 'text-loom-muted hover:text-loom-cream'}
                    `}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                    {hasKey && (
                      <span className="w-1.5 h-1.5 rounded-full bg-loom-sage flex-shrink-0" title="Key saved" />
                    )}
                    {aiProvider === p && (
                      <span className="text-[9px] text-loom-gold font-semibold bg-loom-gold/10 rounded-full px-1.5 py-0.5 leading-none">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Provider detail */}
            <div className="mb-4">
              <div className={`text-xs font-medium mb-1 ${meta.tagColor}`}>
                {meta.icon} {meta.tagline}
              </div>
              <div className="text-loom-muted text-xs">{meta.modelLine}</div>
            </div>

            {/* Key input */}
            <div className="space-y-3">
              {tab === 'anthropic' ? (
                <input
                  key="anthropic-input"
                  type="password"
                  value={anthropicInput}
                  onChange={(e) => { setAnthropicInput(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder={currentTabHasKey ? '••••••••••••• (key saved)' : meta.keyPlaceholder}
                  className="w-full bg-loom-raised border border-loom-border rounded-lg px-4 py-2.5 text-loom-cream placeholder:text-loom-muted/50 text-sm font-mono focus:outline-none focus:border-loom-gold transition-colors"
                  autoFocus
                />
              ) : (
                <input
                  key="groq-input"
                  type="password"
                  value={groqInput}
                  onChange={(e) => { setGroqInput(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder={currentTabHasKey ? '••••••••••••• (key saved)' : meta.keyPlaceholder}
                  className="w-full bg-loom-raised border border-loom-border rounded-lg px-4 py-2.5 text-loom-cream placeholder:text-loom-muted/50 text-sm font-mono focus:outline-none focus:border-loom-gold transition-colors"
                  autoFocus
                />
              )}

              {/* Groq model picker */}
              {tab === 'groq' && (
                <div>
                  <label className="text-loom-muted text-xs mb-1.5 block">Model</label>
                  <div className="grid gap-1.5">
                    {GROQ_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={`
                          flex items-center justify-between px-3 py-2 rounded-lg border text-sm text-left transition-all duration-100
                          ${selectedModel === m.id
                            ? 'bg-loom-gold/15 border-loom-gold/40 text-loom-cream'
                            : 'bg-loom-raised border-loom-border text-loom-muted hover:border-loom-border/80 hover:text-loom-cream'}
                        `}
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedModel === m.id ? 'bg-loom-gold/20 text-loom-gold' : 'bg-loom-raised text-loom-muted'
                        }`}>
                          {m.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <Button
                onClick={handleSave}
                fullWidth
                size="lg"
                disabled={tab === 'anthropic' ? !anthropicInput.trim() : !groqInput.trim()}
              >
                {`Use ${meta.label} →`}
              </Button>

              {/* If already has a key for this provider, allow switching without re-entering */}
              {currentTabHasKey && !isActiveProvider && (
                <button
                  onClick={() => {
                    setProvider(tab);
                    if (tab === 'groq') setGroqModel(selectedModel);
                    setShowApiKeyModal(false);
                  }}
                  className="w-full text-loom-gold text-xs hover:underline text-center"
                >
                  Switch to {meta.label} (use saved key)
                </button>
              )}

              {currentTabHasKey && isActiveProvider && (
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="w-full text-loom-muted text-xs hover:text-loom-cream text-center"
                >
                  Cancel (keep current settings)
                </button>
              )}
            </div>

            <p className="text-loom-muted text-[11px] text-center mt-4">
              Get a free key at{' '}
              <span className="text-loom-gold">{meta.consoleName}</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
