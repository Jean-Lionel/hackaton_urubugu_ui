export const POSITIONS_PALETTE = [15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7]

export const MAX_PIONS = 15

export const getIndexPosition = (position) => {
  return POSITIONS_PALETTE.indexOf(position)
}
