'use client';

import DialogueOverlay from '@/components/word-island/DialogueOverlay';
import GameHud from '@/components/word-island/GameHud';
import PauseOverlay from '@/components/word-island/PauseOverlay';
import QuizOverlay from '@/components/word-island/QuizOverlay';
import TopBar from '@/components/word-island/TopBar';
import VictoryOverlay from '@/components/word-island/VictoryOverlay';
import { useWordIsland } from '@/hooks/useWordIsland';

export default function WordIsland() {
  const {
    canvasRef,
    canvasWidth,
    canvasHeight,
    questStage,
    resources,
    isPaused,
    setIsPaused,
    dialogue,
    activeQuiz,
    setActiveQuiz,
    handleRestart,
    handleInteract,
    getObjectiveText,
  } = useWordIsland();

  return (
    <div className="h-dvh w-full bg-[#0b0f19] text-amber-50 flex flex-col p-2 sm:p-3 overflow-hidden select-none font-mono">
      {/* Navigation Header */}
      <TopBar
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        onRestart={handleRestart}
      />

      {/* Responsive Viewport Wrapper */}
      <main className="flex-1 w-full min-h-0 flex items-center justify-center relative p-1">
        {/* Aspect-ratio preserving scaled canvas viewport */}
        <div className="relative aspect-[20/14] w-full max-w-[calc((100dvh-4.5rem)*20/14)] max-h-full border-3 sm:border-4 border-[#78350f] rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden bg-[#1d4e68] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-full block"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Interactive HUD Elements */}
          <GameHud
            resources={resources}
            objectiveText={getObjectiveText()}
            onInteract={handleInteract}
          />

          {/* Pause Menu Modal */}
          {isPaused && !dialogue && !activeQuiz && questStage !== 'VICTORY' && (
            <PauseOverlay
              onResume={() => setIsPaused(false)}
              onRestart={handleRestart}
            />
          )}

          {/* RPG Dialogue Modal */}
          {dialogue && <DialogueOverlay dialogue={dialogue} />}

          {/* Vocabulary Challenge Modal */}
          {activeQuiz && (
            <QuizOverlay
              activeQuiz={activeQuiz}
              setActiveQuiz={setActiveQuiz}
            />
          )}

          {/* Victory Modal */}
          {questStage === 'VICTORY' && (
            <VictoryOverlay onRestart={handleRestart} />
          )}
        </div>
      </main>
    </div>
  );
}

