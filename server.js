const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const Users = require('./models/user')
const Admin = require('./models/admin')
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const articleRouter = require('./routes/articles')


const methodOverride = require('method-override')
const { json } = require('express')
const article = require('./models/article')
const app = express()
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

mongoose.connect('mongodb://localhost:27017/blog1', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.json());


app.get('/', async (req, res) => {
  res.render('home')
  
})

app.get('/login', async (req, res) => {
 res.render('user/login')
});

app.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const userpassword = req.body.password;
    const useremail = await Users.findOne({ email: email });
    
    const ismatch = await bcrypt.compare(userpassword,useremail.passwordh); 
    if (!ismatch) {
      res.send("password are wrong !!!!");
    }
    else {
      const articles = await Article.find().sort({ createdAt: 'desc' })
      res.status(201).render('landpage', { articles: articles });
    }

  } catch (error) {
    res.status(400).send("Invalid Email")
  }

});


app.get('/register', async (req, res) => {
  res.render('user/register')
})

app.post('/register', async (req, res) => {

  const { email, password, password2 } = req.body;
  
  const passwordh = bcrypt.hashSync(password, salt);
 
  try {
    let response = await Users.create({
      email,passwordh
    })
    console.log("sucesssss", response);
    res.render('user/login')
  } catch (error) {
   if (error.code === 11000) {
     return res, json({ status: "error", error: "Email Already in existing in database " })
    }
    throw error
  }
});


app.get('/adminlogin', async (req, res) => {
  res.render('admin/adminlogin')
})

app.post('/adminlogin', async (req, res) => {
  try {
    const email = req.body.email;
    const userpassword = req.body.password;

    const useremail = await Admin.findOne({ email: email });

    const ismatch = await bcrypt.compare(userpassword,useremail.passwordh);
    if (ismatch) {
      const articles = await Article.find().sort({ createdAt: 'desc' })
      res.render('articles/index', { articles: articles })
    }
    else {
      res.send("password are wrong !!!!");
    }

  } catch (error) {
    res.status(400).send("Invalid Email")
  }
});


app.get('/adminregister', async (req, res) => {
  res.render('admin/adminregister')
})


app.post('/adminregister', async (req, res) => {

  const { email, password, password2, key } = req.body;
  const passwordh = bcrypt.hashSync(password, salt);

  try {
    if (key === "root") {
      let response = await Admin.create({
        email, passwordh
      })
      console.log("sucesssss", response);
      res.render('admin/adminlogin')
    }
    else {
      return res.json({ status: "error", error: "Enter a valid key for admin access!!! " })
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: "error", error: "Email Already in existing in database " })
    }
    throw error
  }
});

app.get('/index', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
});


app.use('/articles', articleRouter)

app.listen(5000)