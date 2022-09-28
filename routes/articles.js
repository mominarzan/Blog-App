const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', {
    article: new Article()
  })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', {
    article: article
  })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug
  })
  if (article == null) res.redirect('/')
  res.render('articles/show', {
    article: article
  })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  const articles = await Article.find().sort({
    createdAt: 'desc'
  })
  res.render('articles/index', {
    articles: articles
  })
})

router.post('/:id/like', async (req, res) => {
  let blogid = req.params.id;
  console.log(blogid);
  const adduserlike = await Article.updateOne({
    _id: blogid
  }, {
    $inc: {
      likes: 1
    }
  })
  const userlike = await Article.findOne({
    _id: blogid
  });
  console.log(userlike.likes);
  const articles = await Article.find().sort({
    createdAt: 'desc'
  })
  res.render('landpage', {
    articles: articles
  })
})

router.post('/:id/comment', async (req, res) => {
  let blogid = req.params.id;
  const value = JSON.parse(JSON.stringify(req.body));
  console.log(blogid);
  console.log(value.comments);
  const addusercomment = await Article.updateOne({
    _id: blogid
  }, {
    $push: {
      comment: value.comments
    }
  })
  const userlike = await Article.findOne({
    _id: blogid
  });
  console.log(userlike.comment);
  const articles = await Article.find().sort({
    createdAt: 'desc'
  })
  res.render('landpage', {
    articles: articles
  })
})



function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, {
        article: article
      })
    }
  }
}

module.exports = router