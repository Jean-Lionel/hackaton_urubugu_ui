export const POSITIONS_PALETTE = [15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7]

export const MAX_PIONS = 15

export const getIndexPosition = (position) => {
  return POSITIONS_PALETTE.indexOf(position)
}

export const COMPLEMENTARIES_POSITIONS = {
  15: [15, 8, 7],
  14: [14, 6, 9],
  13: [13, 5, 10],
  12: [12, 4, 11],
  11: [11, 3, 12],
  10: [10, 2, 13],
  9: [9, 1, 14],
  8: [8],
  7: [7],
  6: [6],
  5: [5],
  4: [4],
  3: [3],
  2: [2],
  1: [1],
  0: [0],
}
