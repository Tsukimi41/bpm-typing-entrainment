import { useEffect, useMemo, useRef, useState } from 'react';
import { createTrialTextPool, type TrialText } from './data/trialTexts';
import type { BpmCondition, RecordRow } from './types';
import { buildCsv, clampHistory, formatTimestamp, isBlockedDevice, isControlKey } from './lib/typingUtils';

const BPM_OPTIONS: BpmCondition[] = ['Silence', '60 BPM', '140 BPM'];
const RECENT_HISTORY_LIMIT = 5;

function pickTrialText(pool: TrialText[], history: number[]): TrialText {
  const recent = new Set(history.slice(-RECENT_HISTORY_LIMIT));
  const candidates = pool.filter((item) => !recent.has(item.id));
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function formatElapsed(seconds: number): string {
  return seconds.toFixed(3);
}

export default function App() {
  const trialTextPool = useMemo(() => createTrialTextPool(), []);
  const [blocked, setBlocked] = useState(false);
  const [screen, setScreen] = useState<'setup' | 'trial' | 'finished'>('setup');
  const [subjectId, setSubjectId] = useState('User_01');
  const [bpmCondition, setBpmCondition] = useState<BpmCondition>('Silence');
  const [recentTextIds, setRecentTextIds] = useState<number[]>([]);
  const [currentTrial, setCurrentTrial] = useState<TrialText | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [clipboardStatus, setClipboardStatus] = useState('');
  const startedAtRef = useRef<number | null>(null);
  const endedAtRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const mistakesRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setBlocked(isBlockedDevice());

    const handleResize = () => setBlocked(isBlockedDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (blocked || screen !== 'trial' || !currentTrial || endedAtRef.current !== null) {
        return;
      }

      if (isControlKey(event.key)) {
        event.preventDefault();
        return;
      }

      const expected = currentTrial.text[progressRef.current];
      if (!expected) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      if (event.key === expected) {
        const nextProgress = progressRef.current + 1;
        if (startedAtRef.current === null) {
          startedAtRef.current = performance.now();
        }

        progressRef.current = nextProgress;
        setProgress(nextProgress);

        if (nextProgress >= currentTrial.text.length) {
          endedAtRef.current = performance.now();
          const elapsedSeconds = Math.max((endedAtRef.current - (startedAtRef.current ?? endedAtRef.current)) / 1000, 0.001);
          const totalMistakes = mistakesRef.current;
          const cpm = currentTrial.text.length / (elapsedSeconds / 60);
          const errorRate = (totalMistakes / (currentTrial.text.length + totalMistakes)) * 100;
          const record: RecordRow = {
            timestamp: formatTimestamp(new Date()),
            subjectId,
            bpmCondition,
            textId: currentTrial.id,
            cpm,
            errorRate,
            elapsedSeconds,
            mistakes: totalMistakes,
          };

          setRecords((previous) => [...previous, record]);
          setScreen('finished');
        }
      } else {
        mistakesRef.current += 1;
        setMistakes(mistakesRef.current);
        setIsShaking(true);
        if (shakeTimerRef.current !== null) {
          window.clearTimeout(shakeTimerRef.current);
        }
        shakeTimerRef.current = window.setTimeout(() => setIsShaking(false), 180);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [blocked, bpmCondition, currentTrial, screen, subjectId]);

  const shakeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current !== null) {
        window.clearTimeout(shakeTimerRef.current);
      }
    };
  }, []);

  const startTrial = () => {
    const nextTrial = pickTrialText(trialTextPool, recentTextIds);
    setCurrentTrial(nextTrial);
    setRecentTextIds((previous) => clampHistory([...previous, nextTrial.id], RECENT_HISTORY_LIMIT));
    setProgress(0);
    progressRef.current = 0;
    setMistakes(0);
    mistakesRef.current = 0;
    startedAtRef.current = null;
    endedAtRef.current = null;
    setIsShaking(false);
    setClipboardStatus('');
    setScreen('trial');
  };

  const copyCsv = async () => {
    const csv = buildCsv(records);
    try {
      await navigator.clipboard.writeText(csv);
      setClipboardStatus('CSVをコピーしました');
    } catch {
      setClipboardStatus('クリップボードへのコピーに失敗しました');
    }
  };

  if (blocked) {
    return (
      <main className="app-shell blocked-screen">
        <p>本実験はPCのハードウェアキーボードでのみ実施可能です</p>
      </main>
    );
  }

  const activeText = currentTrial?.text ?? '';
  const completedText = activeText.slice(0, progress);
  const nextText = activeText.slice(progress);
  const elapsedSeconds = startedAtRef.current !== null
    ? ((endedAtRef.current ?? performance.now()) - startedAtRef.current) / 1000
    : 0;

  return (
    <main className="app-shell">
      {screen === 'setup' && (
        <section className="setup-screen">
          <div className="form-row">
            <label htmlFor="subjectId">被験者ID</label>
            <input
              id="subjectId"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className="form-row">
            <label htmlFor="bpmCondition">BPM条件</label>
            <select id="bpmCondition" value={bpmCondition} onChange={(event) => setBpmCondition(event.target.value as BpmCondition)}>
              {BPM_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <button type="button" onClick={startTrial}>開始</button>
        </section>
      )}

      {screen === 'trial' && currentTrial && (
        <section className="trial-screen" aria-live="polite">
          <div className={`typing-line ${isShaking ? 'shaking' : ''}`}>
            <span className="completed">{completedText}</span>
            <span className="current">{nextText[0] ?? ''}</span>
            <span>{nextText.slice(1)}</span>
          </div>
          <div className="metrics">
            <span>Subject {subjectId}</span>
            <span>{bpmCondition}</span>
            <span>Text {currentTrial.id}</span>
            <span>Errors {mistakes}</span>
            <span>{formatElapsed(elapsedSeconds)}s</span>
          </div>
        </section>
      )}

      {screen === 'finished' && (
        <section className="results-screen">
          <div className="result-banner">完了</div>
          <button type="button" onClick={() => setScreen('setup')}>設定へ戻る</button>
        </section>
      )}

      <section className="records-panel">
        <div className="records-header">
          <button type="button" onClick={copyCsv} disabled={records.length === 0}>CSVコピー</button>
          <span>{clipboardStatus}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>timestamp</th>
              <th>subject</th>
              <th>bpm</th>
              <th>text</th>
              <th>cpm</th>
              <th>error%</th>
              <th>seconds</th>
              <th>mistakes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${record.timestamp}-${record.textId}-${record.subjectId}`}>
                <td>{record.timestamp}</td>
                <td>{record.subjectId}</td>
                <td>{record.bpmCondition}</td>
                <td>{record.textId}</td>
                <td>{record.cpm.toFixed(2)}</td>
                <td>{record.errorRate.toFixed(2)}</td>
                <td>{record.elapsedSeconds.toFixed(3)}</td>
                <td>{record.mistakes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
