import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { Header } from './components/Layout/Header';
import { StageMap } from './components/Stages/StageMap';
import { Stage1 } from './components/Stages/Stage1';
import { WrenChat } from './components/Chat/WrenChat';
import { ApiKeySetup } from './components/UI/ApiKeySetup';
import { StageUnlockCelebration } from './components/GameLayer/StageUnlockCelebration';

function ComingSoon({ stageId, stageName, icon }: { stageId: number; stageName: string; icon: string }) {
  const { goToMap, setChatOpen } = useGameStore();
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">{icon}</div>
      <h2 className="text-2xl font-bold text-loom-cream mb-2">Stage {stageId}: {stageName}</h2>
      <p className="text-loom-muted text-base mb-8">
        This stage is coming soon! In the meantime, you can ask Wren anything about this topic.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={goToMap}
          className="btn-ghost text-sm px-5 py-2.5 rounded-lg"
        >
          ← Back to Map
        </button>
        <button
          onClick={() => setChatOpen(true)}
          className="btn-gold text-sm px-5 py-2.5 rounded-lg font-semibold"
        >
          Ask Wren 🐦
        </button>
      </div>
    </div>
  );
}

function StageRouter({ stageId }: { stageId: number }) {
  switch (stageId) {
    case 1:
      return <Stage1 />;
    case 2:
      return <ComingSoon stageId={2} stageName="Wind Your First Warp" icon="🧵" />;
    case 3:
      return <ComingSoon stageId={3} stageName="Thread the Heddles" icon="🪡" />;
    case 4:
      return <ComingSoon stageId={4} stageName="Sley the Reed & Tie On" icon="⚙️" />;
    case 5:
      return <ComingSoon stageId={5} stageName="Your First Pick" icon="🚀" />;
    case 6:
      return <ComingSoon stageId={6} stageName="The Rhythm" icon="🎵" />;
    case 7:
      return <ComingSoon stageId={7} stageName="Pattern Explorer" icon="🎨" />;
    case 8:
      return <ComingSoon stageId={8} stageName="Troubleshooting Lab" icon="🔧" />;
    case 9:
      return <ComingSoon stageId={9} stageName="Finish Like a Pro" icon="✨" />;
    default:
      return null;
  }
}

export default function App() {
  const { activeView, activeStage, updateStreak, apiKey } = useGameStore();

  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div className="min-h-screen bg-loom-bg bg-weave text-loom-cream">
      <Header />

      <main className="pb-24">
        {activeView === 'map' ? (
          <StageMap />
        ) : (
          <StageRouter stageId={activeStage} />
        )}
      </main>

      <WrenChat />
      <ApiKeySetup />
      <StageUnlockCelebration />
    </div>
  );
}
