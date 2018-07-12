export interface Stat {
  score: number
  lines: number
}

export interface Color {
  current: string
  next: string
}

export interface Block {
  current: number[][]
  next: number[][]
  process: [number, number][]
}

export interface Score {
  listScore: Stat[],
  indexScore: number
}
