const express = require('express')
const { restart } = require('nodemon')
const controller = express.Router()

const productSchema = require('../schemes/productSchema')


//unsecured routes
controller.route('/details/:articleNumber').get( async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
     if (product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        })
     } else 
        res.status(404).json()
})

controller.route('/').get( async (req, res) => {
    const products = []
    const list = await productSchema.find()
     if (list)  {
        for(let product of list) {
            products .push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
     } else 
        res.status(400).json()
})

controller.route('/:tag').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({tag: req.params.tag })
     if (list)  {
        for(let product of list) {
            products .push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
     } else 
        res.status(400).json()
})


controller.route('/:tag/:take').get( async (req, res) => {
    const products = []
    const list = await productSchema.find({tag: req.params.tag }).limit(req.params.take)
    if (list)  {
        for(let product of list) {
            products .push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
     } else 
        res.status(400).json()
})




//secured routes
controller.route('/').post(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if (!name || !price)
        res.status(400).json({text: 'name and price is required.'})

    const item_exists = await productSchema.findOne({name})
    if (item_exists)
        res.status(409).json({text: 'a product with the same name already exists.'})
    else {
        const product = await productSchema.create({
            name, 
            description,
            price, 
            category,
            tag,
            imageName,
            rating
        })
        if (product)
             res.status(201).json({text:`a product with article number ${product._id} was created successfully`})
        else 
            res.status(400).json({text: 'something went wrong when we tried to create a product'})
    }
})


controller.route('/:articleNumber').delete(async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json('no article number was specified')
    else {
        const item = await productSchema.findById(req.params.articleNumber)
        if (item) {
            await productSchema.remove(item)
            res.status(200).json({text: `product with the article number ${req.params.articleNumber} was  deleted successfully.`})
        } else {
            res.status(404).json({text: `product with the article number ${req.params.articleNumber} was not found.`})
        }
    }
})

// update a product

controller.route('/patch/:articleNumber').put(async (req, res) => {
    if (!req.params.articleNumber) {
        res.status(400).json({text: `No article number was specified.`})
    } else {
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {name: req.body.name}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {description: req.body.description}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {rating: req.body.rating}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {price: req.body.price}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {category: req.body.category}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {tag: req.body.tag}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {oldPrice: req.body.oldPrice}
        });
        await productSchema.updateOne(
            { _id: req.params.articleNumber},
            { $set: {imageName: req.body.imageName}
        });
        res.status(200).json({text: `Updated name: ${req.body.name} ...`})    
    }
})
  
module.exports = controller 