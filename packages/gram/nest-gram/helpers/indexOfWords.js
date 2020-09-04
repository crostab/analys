export const indexOfWords = (wordsList, words) => {
  return wordsList.findIndex(ve => ve.every((wd, i) => wd === words[i]))
}