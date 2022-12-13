let products = require('../data/database')
const express = require('express')
const controller = express.Router()


controller.route('/').get((req, res) => {
    res.status(200).json(products)
})


module.exports = controller 