import { POSITIONS_PALETTE } from '../localstorage/localstorage.js'

const Urubugu = (cases) => {
  const casesPosition = cases.map((e, i) => {
    return { position: POSITIONS_PALETTE[i], value: e }
  })

  const positionnerPion = (position, nbrPion) => {
    let p = nextPosition(position)
    for (let i = 0; i < nbrPion; i++) {
      addPion(p)
      p = nextPosition(p)
    }
  }

  const addPion = (position, nbrPion = 1) => {
    const indexI = casesPosition.findIndex((e) => e.position === position)

    casesPosition[indexI].value += nbrPion
  }

  const removePion = (position, nbrPion) => {
    const indexI = casesPosition.findIndex((e) => e.position === position)
    casesPosition[indexI].value -= nbrPion
  }

  const getCaseValue = (position) => {
    const indexI = casesPosition.findIndex((e) => e.position === position)
    return casesPosition[indexI].value
  }

  const nextPosition = (position) => {
    return position <= 14 ? position + 1 : position - 15
  }

  const casesValues = () => {
    return casesPosition.map((e) => e.value)
  }

  return { positionnerPion, getCaseValue, casesValues }
}

export default Urubugu
