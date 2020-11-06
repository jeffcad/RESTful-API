const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: {
        type: String,
        required: [true]
    },
    content: {
        type: String,
        required: [true]
    }
}
const Article = mongoose.model('Article', articleSchema)

const port = 3000
app.listen(port, () => console.log(`Server listening on port ${port}.`))

app.get('/articles', async (req, res) => {
    try {
        const foundArticles = await Article.find()
        res.send(foundArticles)
    } catch (err) {
        res.send(err)
    }
})

app.post('/articles', async (req, res) => {
    const { title, content } = req.body
    const newArticle = new Article({ title, content })
    try {
        await newArticle.save()
        res.send('Article received and added to the database!')
    } catch (err) {
        res.send(err)
    }
})

app.delete('/articles', async (req, res) => {
    try {
        await Article.deleteMany()
        res.send('All articles deleted!')
    } catch (err) {
        res.send(err)
    }
})
