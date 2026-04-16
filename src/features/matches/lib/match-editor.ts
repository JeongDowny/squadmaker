export const PLAYER_POSITION_OPTIONS = [
  "GK",
  "LB",
  "CB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LM",
  "RM",
  "LW",
  "RW",
  "ST",
] as const;

export type PlayerPosition = (typeof PLAYER_POSITION_OPTIONS)[number];
export type OptionalPlayerPosition = PlayerPosition | "";
export type QuarterId = string;

export type MatchPlayerDraft = {
  id: string;
  name: string;
  primaryPosition: OptionalPlayerPosition;
  secondaryPositions: [OptionalPlayerPosition, OptionalPlayerPosition];
  isIncluded: boolean;
};

export type TeamPlayerDraft = Omit<MatchPlayerDraft, "isIncluded">;

export type FormationSlot = {
  id: string;
  role: string;
  top: string;
  left: string;
};

export const FORMATION_TEMPLATES = {
  "4-4-2": [
    { id: "lst", role: "LST", top: "15%", left: "39%" },
    { id: "rst", role: "RST", top: "15%", left: "61%" },
    { id: "lm", role: "LM", top: "40%", left: "20%" },
    { id: "cm-left", role: "CM", top: "42%", left: "39%" },
    { id: "cm-right", role: "CM", top: "42%", left: "61%" },
    { id: "rm", role: "RM", top: "40%", left: "80%" },
    { id: "lb", role: "LB", top: "68%", left: "20%" },
    { id: "lcb", role: "LCB", top: "69%", left: "39%" },
    { id: "rcb", role: "RCB", top: "69%", left: "61%" },
    { id: "rb", role: "RB", top: "68%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "4-3-3": [
    { id: "lw", role: "LW", top: "17%", left: "24%" },
    { id: "st", role: "ST", top: "14%", left: "50%" },
    { id: "rw", role: "RW", top: "17%", left: "76%" },
    { id: "cm-left", role: "CM", top: "38%", left: "32%" },
    { id: "cdm", role: "CDM", top: "45%", left: "50%" },
    { id: "cm-right", role: "CM", top: "38%", left: "68%" },
    { id: "lb", role: "LB", top: "66%", left: "20%" },
    { id: "lcb", role: "LCB", top: "67%", left: "39%" },
    { id: "rcb", role: "RCB", top: "67%", left: "61%" },
    { id: "rb", role: "RB", top: "66%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "4-2-3-1": [
    { id: "st", role: "ST", top: "14%", left: "50%" },
    { id: "lw", role: "LW", top: "32%", left: "24%" },
    { id: "cam", role: "CAM", top: "29%", left: "50%" },
    { id: "rw", role: "RW", top: "32%", left: "76%" },
    { id: "cdm-left", role: "CDM", top: "50%", left: "39%" },
    { id: "cdm-right", role: "CDM", top: "50%", left: "61%" },
    { id: "lb", role: "LB", top: "68%", left: "20%" },
    { id: "lcb", role: "LCB", top: "69%", left: "39%" },
    { id: "rcb", role: "RCB", top: "69%", left: "61%" },
    { id: "rb", role: "RB", top: "68%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "3-5-2": [
    { id: "lst", role: "LST", top: "15%", left: "39%" },
    { id: "rst", role: "RST", top: "15%", left: "61%" },
    { id: "lm", role: "LM", top: "39%", left: "21%" },
    { id: "cm-left", role: "CM", top: "42%", left: "37%" },
    { id: "cdm", role: "CDM", top: "49%", left: "50%" },
    { id: "cm-right", role: "CM", top: "42%", left: "63%" },
    { id: "rm", role: "RM", top: "39%", left: "79%" },
    { id: "lcb", role: "LCB", top: "69%", left: "33%" },
    { id: "cb", role: "CB", top: "71%", left: "50%" },
    { id: "rcb", role: "RCB", top: "69%", left: "67%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "3-4-3": [
    { id: "lw", role: "LW", top: "17%", left: "25%" },
    { id: "st", role: "ST", top: "14%", left: "50%" },
    { id: "rw", role: "RW", top: "17%", left: "75%" },
    { id: "lm", role: "LM", top: "43%", left: "22%" },
    { id: "cm-left", role: "CM", top: "45%", left: "41%" },
    { id: "cm-right", role: "CM", top: "45%", left: "59%" },
    { id: "rm", role: "RM", top: "43%", left: "78%" },
    { id: "lcb", role: "LCB", top: "69%", left: "33%" },
    { id: "cb", role: "CB", top: "71%", left: "50%" },
    { id: "rcb", role: "RCB", top: "69%", left: "67%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "4-1-4-1": [
    { id: "st", role: "ST", top: "14%", left: "50%" },
    { id: "lm", role: "LM", top: "36%", left: "22%" },
    { id: "cm-left", role: "CM", top: "38%", left: "40%" },
    { id: "cm-right", role: "CM", top: "38%", left: "60%" },
    { id: "rm", role: "RM", top: "36%", left: "78%" },
    { id: "cdm", role: "CDM", top: "53%", left: "50%" },
    { id: "lb", role: "LB", top: "69%", left: "20%" },
    { id: "lcb", role: "LCB", top: "70%", left: "39%" },
    { id: "rcb", role: "RCB", top: "70%", left: "61%" },
    { id: "rb", role: "RB", top: "69%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "4-5-1": [
    { id: "st", role: "ST", top: "14%", left: "50%" },
    { id: "lm", role: "LM", top: "41%", left: "20%" },
    { id: "cm-left", role: "CM", top: "43%", left: "36%" },
    { id: "cdm", role: "CDM", top: "47%", left: "50%" },
    { id: "cm-right", role: "CM", top: "43%", left: "64%" },
    { id: "rm", role: "RM", top: "41%", left: "80%" },
    { id: "lb", role: "LB", top: "69%", left: "20%" },
    { id: "lcb", role: "LCB", top: "70%", left: "39%" },
    { id: "rcb", role: "RCB", top: "70%", left: "61%" },
    { id: "rb", role: "RB", top: "69%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "4-3-1-2": [
    { id: "lst", role: "LST", top: "15%", left: "39%" },
    { id: "rst", role: "RST", top: "15%", left: "61%" },
    { id: "cam", role: "CAM", top: "31%", left: "50%" },
    { id: "cm-left", role: "CM", top: "45%", left: "34%" },
    { id: "cdm", role: "CDM", top: "51%", left: "50%" },
    { id: "cm-right", role: "CM", top: "45%", left: "66%" },
    { id: "lb", role: "LB", top: "69%", left: "20%" },
    { id: "lcb", role: "LCB", top: "70%", left: "39%" },
    { id: "rcb", role: "RCB", top: "70%", left: "61%" },
    { id: "rb", role: "RB", top: "69%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "4-1-2-1-2": [
    { id: "lst", role: "LST", top: "15%", left: "39%" },
    { id: "rst", role: "RST", top: "15%", left: "61%" },
    { id: "cam", role: "CAM", top: "31%", left: "50%" },
    { id: "cm-left", role: "CM", top: "45%", left: "38%" },
    { id: "cm-right", role: "CM", top: "45%", left: "62%" },
    { id: "cdm", role: "CDM", top: "57%", left: "50%" },
    { id: "lb", role: "LB", top: "71%", left: "20%" },
    { id: "lcb", role: "LCB", top: "72%", left: "39%" },
    { id: "rcb", role: "RCB", top: "72%", left: "61%" },
    { id: "rb", role: "RB", top: "71%", left: "80%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
  "3-4-1-2": [
    { id: "lst", role: "LST", top: "15%", left: "39%" },
    { id: "rst", role: "RST", top: "15%", left: "61%" },
    { id: "cam", role: "CAM", top: "31%", left: "50%" },
    { id: "lm", role: "LM", top: "47%", left: "22%" },
    { id: "cm-left", role: "CM", top: "49%", left: "41%" },
    { id: "cm-right", role: "CM", top: "49%", left: "59%" },
    { id: "rm", role: "RM", top: "47%", left: "78%" },
    { id: "lcb", role: "LCB", top: "70%", left: "33%" },
    { id: "cb", role: "CB", top: "72%", left: "50%" },
    { id: "rcb", role: "RCB", top: "70%", left: "67%" },
    { id: "gk", role: "GK", top: "86%", left: "50%" },
  ],
} as const satisfies Record<string, FormationSlot[]>;

export type FormationName = keyof typeof FORMATION_TEMPLATES;

export const FORMATION_OPTIONS = Object.keys(FORMATION_TEMPLATES) as FormationName[];

export type MatchQuarterDraft = {
  id: QuarterId;
  formation: FormationName;
  slots: FormationSlot[];
};

export type MatchEditorDraft = {
  matchId: string;
  title: string;
  date: string;
  quarters: MatchQuarterDraft[];
  players: MatchPlayerDraft[];
  lineups: Record<string, Record<string, string>>;
};

const POSITION_ORDER: Record<PlayerPosition, number> = {
  GK: 0,
  LB: 1,
  CB: 2,
  RB: 3,
  CDM: 4,
  CM: 5,
  CAM: 6,
  LM: 7,
  RM: 8,
  LW: 9,
  RW: 10,
  ST: 11,
};

function getSeoulDateFormatter() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getTodayInSeoul(now = new Date()) {
  return getSeoulDateFormatter().format(now);
}

export function getDefaultMatchTitle(now = new Date()) {
  return `${getTodayInSeoul(now)} 경기`;
}

export function createMatchId(now = new Date()) {
  const dateToken = getTodayInSeoul(now).replaceAll("-", "");
  const timeToken = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(now)
    .replaceAll(":", "");

  return `match-${dateToken}-${timeToken}-${crypto.randomUUID().slice(0, 6)}`;
}

export function createEmptyPlayer(seed = 0): MatchPlayerDraft {
  return {
    ...createEmptyTeamPlayer(seed),
    isIncluded: true,
  };
}

export function createEmptyTeamPlayer(seed = 0): TeamPlayerDraft {
  return {
    id: `player-${seed}-${crypto.randomUUID().slice(0, 8)}`,
    name: "",
    primaryPosition: "",
    secondaryPositions: ["", ""],
  };
}

export function createMatchPlayerFromTeamPlayer(
  player: TeamPlayerDraft,
  isIncluded = true
): MatchPlayerDraft {
  return {
    ...player,
    isIncluded,
  };
}

export function createQuarterDraft(
  seed = 1,
  formation: FormationName = "4-3-3"
): MatchQuarterDraft {
  return {
    id: `${seed}Q`,
    formation,
    slots: FORMATION_TEMPLATES[formation],
  };
}

export function createQuarterWithFormation(
  quarter: Pick<MatchQuarterDraft, "id">,
  formation: FormationName
): MatchQuarterDraft {
  return {
    id: quarter.id,
    formation,
    slots: FORMATION_TEMPLATES[formation],
  };
}

export function comparePlayersByPosition(
  left: Pick<MatchPlayerDraft, "name" | "primaryPosition">,
  right: Pick<MatchPlayerDraft, "name" | "primaryPosition">
) {
  const leftPosition = left.primaryPosition && left.primaryPosition in POSITION_ORDER
    ? POSITION_ORDER[left.primaryPosition as PlayerPosition]
    : Number.MAX_SAFE_INTEGER;
  const rightPosition = right.primaryPosition && right.primaryPosition in POSITION_ORDER
    ? POSITION_ORDER[right.primaryPosition as PlayerPosition]
    : Number.MAX_SAFE_INTEGER;

  if (leftPosition !== rightPosition) {
    return leftPosition - rightPosition;
  }

  return left.name.localeCompare(right.name, "ko");
}

export function createInitialMatchDraft(matchId: string, now = new Date()): MatchEditorDraft {
  const defaultDate = getTodayInSeoul(now);

  return {
    matchId,
    title: getDefaultMatchTitle(now),
    date: defaultDate,
    quarters: [],
    players: [],
    lineups: {},
  };
}
