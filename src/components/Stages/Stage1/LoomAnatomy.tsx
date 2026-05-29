import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOOM_PARTS } from '../../../data/loomParts';
import type { LoomPart } from '../../../types';
import { useGameStore } from '../../../store/gameStore';

const SHAFT_COLORS = ['#c9a227', '#b8891a', '#a87810', '#987008'];
const WOOD_DARK = '#3d2410';
const WOOD_MID = '#5c3a18';
const WOOD_LIGHT = '#8a5a30';
const METAL = '#9a9a8a';
const METAL_DARK = '#6a6a5a';
const WARP = 'rgba(245,240,232,0.75)';
const GOLD = '#c9a227';
const GOLD_LIGHT = '#e0bc45';

function LoomSVG({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const isSelected = (id: string) => selected === id;
  const partStroke = (id: string) => (isSelected(id) ? GOLD_LIGHT : 'transparent');

  return (
    <svg
      viewBox="0 0 780 420"
      className="w-full h-auto max-h-[380px]"
      style={{ display: 'block' }}
      aria-label="4-shaft table loom diagram"
    >
      {/* Background */}
      <rect width="780" height="420" fill="#0e1628" rx="12" />

      {/* Floor line */}
      <line x1="20" y1="360" x2="760" y2="360" stroke="#243050" strokeWidth="2" />

      {/* ── LOOM FRAME (side rails) ── */}
      <rect x="80" y="340" width="620" height="20" fill={WOOD_DARK} rx="4" />
      <rect x="80" y="340" width="620" height="6" fill={WOOD_LIGHT} rx="4" />

      {/* ── WARP BEAM ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('warp-beam')}
        opacity={selected && !isSelected('warp-beam') ? 0.7 : 1}
      >
        <ellipse cx="72" cy="220" rx="52" ry="52" fill={WOOD_DARK} stroke={isSelected('warp-beam') ? GOLD_LIGHT : WOOD_LIGHT} strokeWidth="2" />
        <ellipse cx="72" cy="220" rx="36" ry="36" fill="#2a1408" stroke={WOOD_MID} strokeWidth="1" />
        <line x1="72" y1="184" x2="72" y2="256" stroke={WOOD_MID} strokeWidth="3" />
        <line x1="36" y1="220" x2="108" y2="220" stroke={WOOD_MID} strokeWidth="3" />
        {isSelected('warp-beam') && <ellipse cx="72" cy="220" rx="52" ry="52" fill="none" stroke={GOLD_LIGHT} strokeWidth="2.5" />}
        {/* hitbox */}
        <ellipse cx="72" cy="220" rx="56" ry="56" fill="transparent" />
      </g>

      {/* Warp thread axle */}
      <line x1="124" y1="220" x2="156" y2="220" stroke={WOOD_MID} strokeWidth="6" strokeLinecap="round" />

      {/* ── BACK BEAM ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('back-beam')}
        opacity={selected && !isSelected('back-beam') ? 0.7 : 1}
      >
        <rect x="152" y="200" width="18" height="40" fill={WOOD_MID} rx="3" stroke={isSelected('back-beam') ? GOLD_LIGHT : 'transparent'} strokeWidth="2" />
        <rect x="152" y="200" width="18" height="6" fill={WOOD_LIGHT} rx="2" />
        {/* hitbox */}
        <rect x="142" y="190" width="38" height="60" fill="transparent" />
      </g>

      {/* ── WARP THREADS ── */}
      {/* Upper warp (lifted by shaft 1 → forms top of shed) */}
      {[0, 1].map((i) => (
        <line key={`wu${i}`} x1="170" y1={205 + i * 4} x2={412} y2={185 + i * 3} stroke={WARP} strokeWidth="1.2" />
      ))}
      {/* Lower warp (through shafts 2–4 → forms bottom of shed) */}
      {[0, 1].map((i) => (
        <line key={`wl${i}`} x1="170" y1={222 + i * 4} x2={412} y2={222 + i * 3} stroke={WARP} strokeWidth="1.2" />
      ))}
      {/* Shed triangle */}
      <polygon
        points="230,198 412,182 412,228 230,228"
        fill="rgba(201,162,39,0.06)"
        stroke="rgba(201,162,39,0.12)"
        strokeWidth="0.5"
      />

      {/* ── CASTLE FRAME ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('castle')}
        opacity={selected && !isSelected('castle') ? 0.7 : 1}
      >
        {/* Left post */}
        <rect x="190" y="76" width="10" height="264" fill={WOOD_MID} rx="2" stroke={isSelected('castle') ? GOLD_LIGHT : 'transparent'} strokeWidth="1.5" />
        {/* Right post */}
        <rect x="372" y="76" width="10" height="264" fill={WOOD_MID} rx="2" stroke={isSelected('castle') ? GOLD_LIGHT : 'transparent'} strokeWidth="1.5" />
        {/* Top beam */}
        <rect x="190" y="76" width="192" height="10" fill={WOOD_LIGHT} rx="2" stroke={isSelected('castle') ? GOLD_LIGHT : 'transparent'} strokeWidth="1.5" />
        {/* Bottom rail */}
        <rect x="190" y="330" width="192" height="10" fill={WOOD_DARK} rx="2" />
        {/* hitbox for posts */}
        <rect x="185" y="70" width="200" height="20" fill="transparent" />
      </g>

      {/* ── SHAFTS 1-4 ── */}
      {[0, 1, 2, 3].map((i) => {
        const x = 200 + i * 44;
        const id = `shaft-${i + 1}`;
        const color = SHAFT_COLORS[i];
        const sel = isSelected(id);
        return (
          <g
            key={id}
            className="cursor-pointer"
            onClick={() => onSelect(id)}
            opacity={selected && !sel ? 0.65 : 1}
          >
            {/* Shaft frame */}
            <rect x={x} y="104" width="28" height="192" fill="none" stroke={sel ? GOLD_LIGHT : color} strokeWidth={sel ? 2.5 : 1.8} rx="3" />
            {/* Top and bottom shaft bars */}
            <rect x={x} y="104" width="28" height="8" fill={color} rx="2" />
            <rect x={x} y="288" width="28" height="8" fill={color} rx="2" />
            {/* Center heddle line */}
            <line x1={x + 14} y1="112" x2={x + 14} y2="196" stroke={color} strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            {/* Heddle eye */}
            <ellipse cx={x + 14} cy="206" rx="5" ry="6.5" fill="none" stroke={sel ? GOLD_LIGHT : METAL} strokeWidth={sel ? 2 : 1.5} />
            <circle cx={x + 14} cy="206" r="2" fill={sel ? GOLD : METAL_DARK} />
            {/* Center line below eye */}
            <line x1={x + 14} y1="213" x2={x + 14} y2="288" stroke={color} strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            {/* Shaft label */}
            <text x={x + 14} y="98" textAnchor="middle" fill={sel ? GOLD_LIGHT : '#9a8f84'} fontSize="9" fontWeight="600">
              S{i + 1}
            </text>
            {/* hitbox */}
            <rect x={x - 2} y="100" width="32" height="200" fill="transparent" />
          </g>
        );
      })}

      {/* ── HEDDLES indicator ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('heddles')}
        opacity={selected && !isSelected('heddles') ? 0.7 : 1}
      >
        <rect x="196" y="196" width="188" height="20" fill="transparent" />
        {/* invisible hitbox over all heddle eyes */}
      </g>

      {/* ── BEATER ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('beater')}
        opacity={selected && !isSelected('beater') ? 0.7 : 1}
      >
        {/* Left beater arm */}
        <line x1="420" y1="340" x2="424" y2="88" stroke={WOOD_MID} strokeWidth="10" strokeLinecap="round" />
        {/* Right beater arm */}
        <line x1="452" y1="340" x2="448" y2="88" stroke={WOOD_MID} strokeWidth="10" strokeLinecap="round" />
        {/* Top bar */}
        <rect x="414" y="84" width="44" height="10" fill={WOOD_LIGHT} rx="3" />
        {/* Bottom pivot bar */}
        <rect x="414" y="330" width="44" height="12" fill={WOOD_DARK} rx="3" />
        {/* Hitbox */}
        {isSelected('beater') && (
          <rect x="410" y="80" width="52" height="270" fill="none" stroke={GOLD_LIGHT} strokeWidth="2" strokeDasharray="4 3" rx="4" />
        )}
        <rect x="408" y="78" width="56" height="274" fill="transparent" />
      </g>

      {/* ── REED ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('reed')}
        opacity={selected && !isSelected('reed') ? 0.7 : 1}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={i}
            x1={427 + i * 1.2}
            y1="96"
            x2={427 + i * 1.2}
            y2="332"
            stroke={isSelected('reed') ? GOLD_LIGHT : METAL}
            strokeWidth="0.9"
            opacity="0.8"
          />
        ))}
        {/* Reed frame */}
        <rect x="422" y="90" width="28" height="8" fill={METAL_DARK} />
        <rect x="422" y="332" width="28" height="8" fill={METAL_DARK} />
        {/* hitbox */}
        <rect x="416" y="88" width="40" height="254" fill="transparent" />
      </g>

      {/* ── SHUTTLE (in shed) ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('shuttle')}
        opacity={selected && !isSelected('shuttle') ? 0.7 : 1}
      >
        <ellipse cx="470" cy="204" rx="38" ry="11" fill="#6b3a18" stroke={isSelected('shuttle') ? GOLD_LIGHT : WOOD_LIGHT} strokeWidth={isSelected('shuttle') ? 2 : 1} />
        <ellipse cx="470" cy="204" rx="26" ry="7" fill="#8a4c20" />
        {/* Bobbin visible inside */}
        <ellipse cx="470" cy="204" rx="8" ry="5" fill={GOLD} opacity="0.6" />
        {/* hitbox */}
        <ellipse cx="470" cy="204" rx="42" ry="16" fill="transparent" />
      </g>

      {/* ── BREAST BEAM ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('breast-beam')}
        opacity={selected && !isSelected('breast-beam') ? 0.7 : 1}
      >
        <rect x="502" y="194" width="20" height="46" fill={WOOD_MID} rx="3" stroke={isSelected('breast-beam') ? GOLD_LIGHT : 'transparent'} strokeWidth="2" />
        <rect x="502" y="194" width="20" height="7" fill={WOOD_LIGHT} rx="2" />
        {/* hitbox */}
        <rect x="492" y="184" width="40" height="66" fill="transparent" />
      </g>

      {/* Woven cloth going over breast beam to cloth beam */}
      <path d="M 522 210 Q 560 215 620 235" fill="none" stroke={GOLD} strokeWidth="5" opacity="0.3" strokeLinecap="round" />
      <path d="M 522 218 Q 562 224 622 244" fill="none" stroke="#8a6a40" strokeWidth="4" opacity="0.25" strokeLinecap="round" />

      {/* ── CLOTH BEAM ── */}
      <g
        className="cursor-pointer"
        onClick={() => onSelect('cloth-beam')}
        opacity={selected && !isSelected('cloth-beam') ? 0.7 : 1}
      >
        <ellipse cx="660" cy="270" rx="50" ry="50" fill={WOOD_DARK} stroke={isSelected('cloth-beam') ? GOLD_LIGHT : WOOD_LIGHT} strokeWidth="2" />
        <ellipse cx="660" cy="270" rx="34" ry="34" fill="#2a1408" stroke={WOOD_MID} strokeWidth="1" />
        {/* Cloth wound on beam */}
        <ellipse cx="660" cy="270" rx="42" ry="42" fill="none" stroke={GOLD} strokeWidth="3" opacity="0.25" />
        <ellipse cx="660" cy="270" rx="38" ry="38" fill="none" stroke="#8a6a40" strokeWidth="3" opacity="0.2" />
        <line x1="660" y1="236" x2="660" y2="304" stroke={WOOD_MID} strokeWidth="3" />
        <line x1="626" y1="270" x2="694" y2="270" stroke={WOOD_MID} strokeWidth="3" />
        {isSelected('cloth-beam') && <ellipse cx="660" cy="270" rx="50" ry="50" fill="none" stroke={GOLD_LIGHT} strokeWidth="2.5" />}
        {/* hitbox */}
        <ellipse cx="660" cy="270" rx="54" ry="54" fill="transparent" />
      </g>

      {/* Shed label */}
      <text x="390" y="178" textAnchor="middle" fill="rgba(201,162,39,0.5)" fontSize="9" fontStyle="italic">shed</text>
      <line x1="390" y1="183" x2="390" y2="220" stroke="rgba(201,162,39,0.25)" strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  );
}

const EXPLORE_GOALS = ['warp-beam', 'heddles', 'beater', 'reed', 'cloth-beam'];

interface LoomAnatomyProps {
  onComplete: () => void;
}

export function LoomAnatomy({ onComplete }: LoomAnatomyProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const { setChatOpen } = useGameStore();

  const selectedPart = LOOM_PARTS.find((p) => p.id === selected);

  const progress = EXPLORE_GOALS.filter((g) => explored.has(g)).length;
  const allExplored = progress >= EXPLORE_GOALS.length;

  function handleSelect(id: string) {
    setSelected(id === selected ? null : id);
    setExplored((prev) => new Set([...prev, id]));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-loom-cream mb-1">Loom Anatomy</h2>
        <p className="text-loom-muted text-sm">
          Click each part of the loom to learn what it does. Explore all the key parts to continue.
        </p>
      </div>

      {/* Exploration progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {EXPLORE_GOALS.map((id) => (
            <div
              key={id}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                explored.has(id) ? 'bg-loom-gold' : 'bg-loom-border'
              }`}
            />
          ))}
        </div>
        <span className="text-loom-muted text-xs">
          {progress}/{EXPLORE_GOALS.length} key parts explored
        </span>
      </div>

      {/* SVG diagram */}
      <div className="bg-[#0e1628] rounded-2xl p-3 border border-loom-border">
        <LoomSVG selected={selected} onSelect={handleSelect} />
      </div>

      {/* Part info panel */}
      <AnimatePresence mode="wait">
        {selectedPart ? (
          <motion.div
            key={selectedPart.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-loom-raised border border-loom-gold/30 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-loom-gold font-semibold">{selectedPart.name}</h3>
                <p className="text-loom-muted text-xs">{selectedPart.shortDesc}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-loom-muted hover:text-loom-cream text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <p className="text-loom-cream text-sm leading-relaxed">{selectedPart.fullDesc}</p>
            {selectedPart.tip && (
              <div className="flex gap-2 bg-loom-gold/10 border border-loom-gold/20 rounded-lg p-2.5 mt-1">
                <span className="text-sm flex-shrink-0">💡</span>
                <p className="text-loom-cream/80 text-xs leading-relaxed">{selectedPart.tip}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-loom-raised border border-loom-border rounded-xl p-4 text-center"
          >
            <p className="text-loom-muted text-sm">
              👆 Click any part of the loom diagram above to learn about it
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parts list (small chips) */}
      <div>
        <p className="text-loom-muted text-xs mb-2 uppercase tracking-wider">All parts</p>
        <div className="flex flex-wrap gap-2">
          {LOOM_PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => handleSelect(part.id)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150 ${
                selected === part.id
                  ? 'bg-loom-gold text-loom-bg border-loom-gold font-semibold'
                  : explored.has(part.id)
                  ? 'bg-loom-raised border-loom-sage/40 text-loom-cream'
                  : 'bg-loom-raised border-loom-border text-loom-muted hover:border-loom-gold/50 hover:text-loom-cream'
              }`}
            >
              {explored.has(part.id) ? '✓ ' : ''}{part.name}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => setChatOpen(true)}
          className="text-loom-muted text-sm hover:text-loom-gold transition-colors flex items-center gap-1.5"
        >
          🐦 <span className="underline underline-offset-2">Ask Wren a question</span>
        </button>

        {allExplored ? (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={onComplete}
            className="btn-gold text-sm px-6 py-2.5 rounded-lg font-semibold"
          >
            Take the Quiz →
          </motion.button>
        ) : (
          <span className="text-loom-muted text-xs">
            Explore {EXPLORE_GOALS.length - progress} more part{EXPLORE_GOALS.length - progress !== 1 ? 's' : ''} to unlock quiz
          </span>
        )}
      </div>
    </div>
  );
}
