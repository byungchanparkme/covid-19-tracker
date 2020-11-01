export const sortData = (data) => {
  const sortedData = [...data]

  // 내림차순으로 정렬한다. 큰 요소에서 작은 요소 순서로
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1
    } else {
      return 1
    }
  })
  // sortedData.sort((a, b) => b.cases - a.cases)
  // sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1)

  return sortedData
}
