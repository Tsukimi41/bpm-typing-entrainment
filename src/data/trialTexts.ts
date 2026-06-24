import rawTextPool from './texts.json';

type BuildOptions = {
  focus: string;
  cadence: string;
  analysis: string;
  detail: string;
  anchor: string;
};

export type TrialText = {
  id: number;
  text: string;
  source: 'generated' | 'json';
  sourceId: number;
};

const FOCUS_WORDS = [
  'alpha', 'vector', 'signal', 'timing', 'buffer', 'sequence', 'sample', 'protocol', 'module', 'stream',
];

const CADENCE_WORDS = [
  'steady', 'precise', 'measured', 'repeatable', 'consistent', 'structured', 'controlled', 'direct', 'clean', 'dense',
];

const ANALYSIS_WORDS = [
  'observation', 'comparison', 'notation', 'verification', 'logging', 'summation', 'alignment', 'correction', 'context', 'pattern',
];

const DETAIL_WORDS = [
  'value', 'field', 'range', 'token', 'digit', 'entry', 'phase', 'sample', 'pair', 'state',
];

const ANCHOR_WORDS = [
  'cursor', 'response', 'precision', 'rhythm', 'latency', 'measure', 'record', 'feedback', 'signal', 'offset',
];

function buildParagraph(options: BuildOptions, variant: number): string {
  const templates = [
    [
      `In ${options.focus} studies, the ${options.cadence} flow of input is tracked with ${options.analysis} notes and ${options.detail} checks.`,
      `Each ${options.anchor} is written beside a stable digit like 12, 24, or 48, so the sequence stays readable and calm.`,
      `The operator watches for commas, periods, and brackets while the wording remains exact, balanced, and practical for repeated trials.`,
    ],
    [
      `During a ${options.focus} review, the typist copies a ${options.cadence} instruction with ${options.detail} labels, quoted terms, and small numbers.`,
      `A ${options.analysis} marker follows the ${options.anchor}, making the passage feel closer to a log entry than ordinary prose.`,
      `The sentence mix changes rhythm with semicolons, short clauses, and careful spacing for a less predictable typing pattern.`,
    ],
    [
      `A technician checks the ${options.anchor} after a ${options.focus} run, then records whether the ${options.cadence} pace stayed within range.`,
      `The ${options.analysis} note includes code-like tokens such as id_${variant}, value:${variant % 9}, and pair[${variant % 4}].`,
      `This sample adds symbols and digits without turning the whole trial into source code.`,
    ],
    [
      `The ${options.focus} module receives a ${options.detail} update, compares it with the previous ${options.anchor}, and stores a compact result.`,
      `Because the ${options.analysis} step is ${options.cadence}, the line alternates between plain explanation and structured notation.`,
      `Participants must type commas, apostrophes, parentheses, and numbers in one continuous pass.`,
    ],
    [
      `Before the trial starts, the ${options.anchor} display shows a ${options.cadence} prompt about ${options.focus} timing and ${options.detail} order.`,
      `The ${options.analysis} field is intentionally written like a dashboard label rather than a narrative paragraph.`,
      `Short fragments, longer phrases, and exact punctuation keep the generated text from repeating one familiar cadence.`,
    ],
  ];

  return templates[variant % templates.length].join(' ');
}

function normalizeLength(text: string, targetLength = 200): string {
  if (text.length > targetLength) {
    return text.slice(0, targetLength - 1) + '.';
  }

  const paddingSource = ' Additional context keeps the line even and avoids abrupt punctuation shifts.';
  let result = text;
  while (result.length < targetLength) {
    const remaining = targetLength - result.length;
    result += paddingSource.slice(0, remaining);
  }
  return result;
}

function createGeneratedTrialTextPool(): TrialText[] {
  const pool: TrialText[] = [];
  for (let index = 1; index <= 100; index += 1) {
    const options: BuildOptions = {
      focus: FOCUS_WORDS[(index - 1) % FOCUS_WORDS.length],
      cadence: CADENCE_WORDS[(index * 2) % CADENCE_WORDS.length],
      analysis: ANALYSIS_WORDS[(index * 3) % ANALYSIS_WORDS.length],
      detail: DETAIL_WORDS[(index * 4) % DETAIL_WORDS.length],
      anchor: ANCHOR_WORDS[(index * 5) % ANCHOR_WORDS.length],
    };

    const suffix = ` Trial ${index}: code ${1000 + index}, ratios ${index % 9}, ${index % 7}, and notes (${index % 5}) are embedded for consistency.`;
    const text = normalizeLength(buildParagraph(options, index) + suffix, 200);
    pool.push({ id: index, text, source: 'generated', sourceId: index });
  }
  return pool;
}

function createJsonTrialTextPool(): TrialText[] {
  return rawTextPool.map((item) => ({
    id: 100 + item.id,
    text: item.text,
    source: 'json' as const,
    sourceId: item.id,
  }));
}

export function createTrialTextPool(): TrialText[] {
  return [...createGeneratedTrialTextPool(), ...createJsonTrialTextPool()];
}
