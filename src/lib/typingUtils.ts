import type { RecordRow } from '../types';

export function clampHistory(history: number[], limit: number): number[] {
  return history.length > limit ? history.slice(history.length - limit) : history;
}

export function formatTimestamp(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    ' ',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
    ':',
    pad(date.getSeconds()),
  ].join('');
}

export function isBlockedDevice(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const narrowScreen = window.innerWidth < 900 || window.innerHeight < 600;
  const mobileUa = /android|iphone|ipad|ipod|mobile|tablet/.test(ua);
  return mobileUa || narrowScreen;
}

export function isControlKey(key: string): boolean {
  return [
    'Backspace',
    'Delete',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Enter',
    'Escape',
    'Meta',
    'Alt',
    'Control',
  ].includes(key);
}

export function buildCsv(records: RecordRow[]): string {
  const header = ['timestamp', 'subjectId', 'bpmCondition', 'textId', 'cpm', 'errorRate', 'elapsedSeconds', 'mistakes'];
  const rows = records.map((record) => [
    record.timestamp,
    record.subjectId,
    record.bpmCondition,
    String(record.textId),
    record.cpm.toFixed(3),
    record.errorRate.toFixed(3),
    record.elapsedSeconds.toFixed(3),
    String(record.mistakes),
  ]);
  const escapeCsvValue = (value: string) => `"${value.split('"').join('""')}"`;
  return [header, ...rows].map((row) => row.map((value) => escapeCsvValue(value)).join(',')).join('\n');
}
