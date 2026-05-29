import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';

const PRESETS = [
  { name: 'Table runner', width: 35, length: 150, sett: 8, waste: 60 },
  { name: 'Scarf', width: 22, length: 200, sett: 10, waste: 65 },
  { name: 'Tea towel', width: 40, length: 65, sett: 12, waste: 60 },
  { name: 'Placemats ×4', width: 38, length: 160, sett: 10, waste: 65 },
];

const YARN_WEIGHTS = [
  { label: 'Lace (30+ EPI)', defaultSett: 30 },
  { label: 'Fingering (24 EPI)', defaultSett: 24 },
  { label: 'Sport (18 EPI)', defaultSett: 18 },
  { label: 'DK (14 EPI)', defaultSett: 14 },
  { label: 'Worsted (10 EPI)', defaultSett: 10 },
  { label: 'Bulky (8 EPI)', defaultSett: 8 },
  { label: 'Super bulky (6 EPI)', defaultSett: 6 },
];

interface WarpPlannerProps {
  onComplete: () => void;
}

export function WarpPlanner({ onComplete }: WarpPlannerProps) {
  const { setChatOpen } = useGameStore();

  const [width, setWidth] = useState(30);
  const [length, setLength] = useState(150);
  const [sett, setSett] = useState(10);
  const [waste, setWaste] = useState(65);
  const [takeup, setTakeup] = useState(10);
  const [yarnGpm, setYarnGpm] = useState('');
  const [saved, setSaved] = useState(false);

  const ends = Math.ceil(width * sett);
  const totalWarpLength = length + waste + Math.round(length * (takeup / 100));
  const totalMetres = (ends * totalWarpLength) / 100; // cm → m
  const weightGrams = yarnGpm ? Math.ceil(totalMetres * parseFloat(yarnGpm)) : null;

  function applyPreset(p: typeof PRESETS[0]) {
    setWidth(p.width);
    setLength(p.length);
    setSett(p.sett);
    setWaste(p.waste);
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(onComplete, 600);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-loom-cream mb-1">Warp Planner</h2>
        <p className="text-loom-muted text-sm leading-relaxed">
          Before you touch the warping board, you need to know exactly how many threads to wind and how long to make them.
          This calculator does the maths for you.
        </p>
      </div>

      {/* Preset buttons */}
      <div>
        <p className="text-loom-muted text-xs uppercase tracking-wider mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-full border border-loom-border bg-loom-raised text-loom-muted hover:border-loom-gold/50 hover:text-loom-cream transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="space-y-3">
          <h3 className="text-loom-muted text-xs uppercase tracking-wider">Project specs</h3>

          {[
            { label: 'Weaving width (cm)', val: width, set: setWidth, min: 5, max: 120, step: 1 },
            { label: 'Woven length (cm)', val: length, set: setLength, min: 20, max: 2000, step: 10 },
            { label: 'Sett (ends per cm)', val: sett, set: setSett, min: 2, max: 40, step: 1 },
          ].map(({ label, val, set, min, max, step }) => (
            <div key={label}>
              <label className="text-loom-cream text-xs font-medium block mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) => { set(Number(e.target.value)); setSaved(false); }}
                  className="flex-1 accent-loom-gold"
                />
                <span className="text-loom-gold font-mono font-semibold text-sm w-10 text-right">{val}</span>
              </div>
            </div>
          ))}

          <div>
            <label className="text-loom-cream text-xs font-medium block mb-1">
              Yarn weight
            </label>
            <select
              className="w-full bg-loom-raised border border-loom-border rounded-lg px-3 py-2 text-loom-cream text-xs focus:outline-none focus:border-loom-gold"
              onChange={(e) => {
                const w = YARN_WEIGHTS.find((y) => y.label === e.target.value);
                if (w) { setSett(w.defaultSett); setSaved(false); }
              }}
            >
              <option value="">— pick to auto-set sett —</option>
              {YARN_WEIGHTS.map((y) => (
                <option key={y.label} value={y.label}>{y.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced inputs */}
        <div className="space-y-3">
          <h3 className="text-loom-muted text-xs uppercase tracking-wider">Allowances</h3>

          <div>
            <label className="text-loom-cream text-xs font-medium block mb-1">
              Loom waste (cm)
              <span className="text-loom-muted font-normal ml-1">— usually 50–75 cm</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={30} max={120} step={5} value={waste}
                onChange={(e) => { setWaste(Number(e.target.value)); setSaved(false); }}
                className="flex-1 accent-loom-gold"
              />
              <span className="text-loom-gold font-mono font-semibold text-sm w-10 text-right">{waste}</span>
            </div>
          </div>

          <div>
            <label className="text-loom-cream text-xs font-medium block mb-1">
              Take-up & draw-in (%)
              <span className="text-loom-muted font-normal ml-1">— usually 10–15%</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range" min={5} max={25} step={1} value={takeup}
                onChange={(e) => { setTakeup(Number(e.target.value)); setSaved(false); }}
                className="flex-1 accent-loom-gold"
              />
              <span className="text-loom-gold font-mono font-semibold text-sm w-10 text-right">{takeup}%</span>
            </div>
          </div>

          <div>
            <label className="text-loom-cream text-xs font-medium block mb-1">
              Yarn weight (g per metre) <span className="text-loom-muted font-normal">— optional</span>
            </label>
            <input
              type="number"
              min={0.01}
              max={20}
              step={0.01}
              value={yarnGpm}
              onChange={(e) => { setYarnGpm(e.target.value); setSaved(false); }}
              placeholder="e.g. 0.3"
              className="w-full bg-loom-raised border border-loom-border rounded-lg px-3 py-2 text-loom-cream text-sm font-mono focus:outline-none focus:border-loom-gold placeholder:text-loom-muted/40"
            />
          </div>
        </div>
      </div>

      {/* Results card */}
      <motion.div
        layout
        className="bg-loom-gold/8 border border-loom-gold/30 rounded-xl p-5"
        style={{ background: 'rgba(201,162,39,0.06)' }}
      >
        <h3 className="text-loom-gold font-semibold text-sm mb-4 uppercase tracking-wider">
          Your warp plan
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Warp ends', value: ends.toString(), unit: 'threads', highlight: true },
            { label: 'Length per thread', value: totalWarpLength.toString(), unit: 'cm' },
            { label: 'Total yarn', value: totalMetres.toFixed(1), unit: 'metres' },
            { label: 'Yarn weight', value: weightGrams ? weightGrams.toString() : '—', unit: weightGrams ? 'grams' : 'enter g/m' },
          ].map(({ label, value, unit, highlight }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold font-mono ${highlight ? 'text-loom-gold' : 'text-loom-cream'}`}>
                {value}
              </div>
              <div className="text-loom-muted text-[10px] uppercase tracking-wider mt-0.5">{unit}</div>
              <div className="text-loom-muted/70 text-[10px] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-loom-gold/20 text-loom-muted text-xs">
          <span className="font-medium text-loom-cream">Summary: </span>
          Wind <span className="text-loom-gold font-semibold">{ends} threads</span> each{' '}
          <span className="text-loom-gold font-semibold">{totalWarpLength} cm</span> long
          {weightGrams && (
            <> · buy at least <span className="text-loom-gold font-semibold">{Math.ceil(weightGrams * 1.1)} g</span> of yarn (10% buffer)</>
          )}
        </div>
      </motion.div>

      {/* Tip from Wren */}
      <div className="bg-loom-raised border border-loom-border rounded-xl p-4 flex gap-3">
        <span className="text-xl flex-shrink-0">🐦</span>
        <p className="text-loom-cream/80 text-sm leading-relaxed italic">
          "Always wind a few extra ends — I usually add 4–6 threads to the total as insurance against broken threads.
          It's much easier to cut them off at the end than to add new threads mid-project."
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => setChatOpen(true)}
          className="text-loom-muted text-sm hover:text-loom-gold transition-colors flex items-center gap-1.5"
        >
          🐦 <span className="underline underline-offset-2">Ask Wren about sett</span>
        </button>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold px-6 py-2.5 rounded-lg font-semibold text-sm"
        >
          {saved ? '✓ Saved!' : 'Save my warp plan →'}
        </motion.button>
      </div>
    </div>
  );
}
