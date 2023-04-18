// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Url Model
const Url = require('../../models/Url')
const shortenUrl = require('../../utilities/generate_letters')
// 定義首頁路由 : 根目錄
router.get('/', (req, res) => {
  res.render('index')
})
//設定路由 : 縮短網址按鈕
router.post('/', (req, res) => {
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
//設定路由 : 按下短網址導回原網址
router.get('/:shortUrl', (req, res) => {
  console.log(req.params)
  const shortUrl = req.params.shortUrl
  Url.findOne({ shortUrl: shortUrl })
    .lean()
    .then((data) => {
      if (!data) {
        return res.render('error')
      }
      res.redirect(data.origUrl)
    })
    .catch(error => console.log(error))
})
// 匯出路由器
module.exports = router