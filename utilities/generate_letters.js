function sample(sources) {
  const index = Math.floor(Math.random() * sources.length)
  return sources[index]
}

function generateLetters(options) {
  const sources = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let letters = ''
  for (let i = 1; i <= Number(options); i++) {
    letters += sample(sources)
  }
  return letters
}

module.exports = generateLetters