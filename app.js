const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Url = require('./models/Url')
const shortenUrl = require('./utilities/generate_letters')
const app = express()
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const origUrl = req.body.origUrl
  if (!origUrl) {
    return res.status(400).render('reminder')
  }
  let shortUrl = shortenUrl(5)
  Url.findOne({ origUrl })
    .lean()
    .then((data) => {
      if (!data) {
        Url.exists({ shortUrl })
          .then((url) => {
            if (url) {
              shortUrl = shortenUrl(5)
            }
            Url.create({ origUrl, shortUrl })
              .then((data) => {
                console.log(req.headers)
                res.render('index', { origin: req.headers.origin, url: data })
              })
              .catch(error => console.log(error))
          })
      } else {
        res.render('index', { origin: req.headers.origin, url: data })
      }
    })
})


app.get('/:shortUrl', (req, res) => {
  console.log(req.params)
  const shortUrl = req.params.shortUrl
  Url.findOne({ shortUrl: shortUrl })
  .lean()
  .then((data) => {
    if(!data) {
      return res.render('error')
    } 
    res.redirect(data.origUrl)
  })
  .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})



