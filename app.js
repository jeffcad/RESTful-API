const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

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

app.route('/articles')
    .get(async (req, res) => {
        try {
            const foundArticles = await Article.find()
            res.send(foundArticles)
        } catch (err) {
            res.send(err)
        }
    })
    .post(async (req, res) => {
        const { title, content } = req.body
        const newArticle = new Article({ title, content })
        try {
            await newArticle.save()
            res.send('Article received and added to the database!')
        } catch (err) {
            res.send(err)
        }
    })
    .delete(async (req, res) => {
        try {
            await Article.deleteMany()
            res.send('All articles deleted!')
        } catch (err) {
            res.send(err)
        }
    })

app.route('/articles/:articleTitle')
    .get(async (req, res) => {
        try {
            const foundArticle = await Article.findOne(
                { title: req.params.articleTitle }
            )
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send(`Sorry, no article matching the title "${req.params.articleTitle}" was found.`)
            }
        } catch (err) {
            res.send(err)
        }
    })
    .put(async (req, res) => {
        const { title, content } = req.body
        try {
            await Article.replaceOne({ title: req.params.articleTitle },
                { title, content }
            )
            res.send('Article updated in the database!')
        } catch (err) {
            res.send(err)
        }
    })
    .patch(async (req, res) => {
        try {
            await Article.updateOne({ title: req.params.articleTitle },
                { $set: req.body }
            )
            res.send('Article updated in the database!')
        } catch (err) {
            res.send(err)
        }
    })
    .delete(async (req, res) => {
        try {
            await Article.deleteOne({ title: req.params.articleTitle })
            res.send('Article deleted!')
        } catch (err) {
            res.send(err)
        }
    })