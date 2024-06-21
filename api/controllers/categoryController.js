const Category = require("../models/CategoryModel");
const asyncHandler = require('express-async-handler');

const get_category = asyncHandler(
    async(req,res)=>{
        const categories = await Category.find()
        res.status(200).json({categories})
    }
)

module.exports = {get_category}