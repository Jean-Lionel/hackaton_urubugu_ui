const Urubugu = (cases) => {
  const positions = [15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7]

  // const cases = cases ?? Array.from({ length: positions.length }, () => 0)

  const placePion = (index, nbrPions) => {
    if (!nbrPions) return
    let pos = getPositionByIndex(index)

    console.log('PLACEMENT DEBUT A  ', pos, 'index', index)
    for (let i = 0; i < nbrPions; i++) {
      let p = nextPosition(pos)

      console.log('PLACEMENT AJOUTER A  ', p)
      addPion(p)
      pos = p
    }
  }

  const getPositionByIndex = (index) => {
    return positions[index] || null
  }
  const getIndexByPosition = (position) => {
    return positions.indexOf(position)
  }

  const getCase = (position) => {
    return cases[getIndexByPosition(position)]
  }
  const addPion = (position) => {
    cases[getIndexByPosition(position)]++
  }
  const nextPosition = (position) => {
    return position > 14 ? 0 : position + 1
  }

  return { placePion, cases, getCase, addPion, nextPosition }
}

export default Urubugu
