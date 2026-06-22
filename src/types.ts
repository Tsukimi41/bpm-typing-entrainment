export type BpmCondition = 'Silence' | '60 BPM' | '140 BPM';

export type RecordRow = {
  timestamp: string;
  subjectId: string;
  bpmCondition: BpmCondition;
  textId: number;
  cpm: number;
  errorRate: number;
  elapsedSeconds: number;
  mistakes: number;
};
