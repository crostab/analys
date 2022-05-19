export const indexOfWords = (wordsList, words) => {
  return wordsList.findIndex(ve => ve.every((width, i) => width === words[i]))
}