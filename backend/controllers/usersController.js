const User = require('../models/User')
const Article = require('../models/Article')
const Card = require('../models/Card')
const Donation = require('../models/Donation')
const Spending = require('../models/Spending')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-pwd').lean();
    if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
    }
    res.json(users);
});

//@desc Create new users
//@route POST /users
//@access Private
const createNewUsers = asyncHandler(async(req,res) => {
    const{ username, pwd, roles, card } = req.body

    //confirm data
    if (!username || !pwd || !roles || !card ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicates

    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({messsage: 'Duplicate username'})
    }

    //Hash pwd
    const hashedPwd = await bcrypt.hash(pwd, 10) //salt rounds

    const userObject = { username, "pwd": hashedPwd, roles, card}

    //Create and store new user
    const user = await User.create(userObject)

    if(user){
        res.status(201).json({messsage: `New user ${username} created`})
    } else{
        res.status(400).json({messsage: 'Invalid user data received'})

    }
})

//@desc Update new users
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async(req,res) => {
    const{ id, username, roles, card } = req.body
    if (!id || !username || !roles || !card){
        return res.status(400).json({ message: 'All fields are required'})
    }
    const user = await User.findById(id).exec()

    if (!user){
        return res.status(400).json({message: 'user not found'} )
    }

    //check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    if  (duplicate && duplicate?._id.toString() !== id ){
        return res.status(409).json({mesage: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    user.card = card

    if (pwd){
        //Hash pwd
        user.pwd = await bcrypt.hash(pwd,10)
    }

    const updatedUser = await user.save()
    res.json({message: `${updatedUser.username} updated`})
})

//@desc Delete Users
//@route PATCH /users
//@access Private
const deleteUser = asyncHandler(async(req,res) => {
    const{ id  } = req.body
    if  (!id){
        return res.status(400).json({message: 'User ID required'})
    }
    const articles = await Article.findOne({user: id}).lean().exec()
    if (articles?.length){
        return res.status(400).json({message: 'User has written articles'})
    }
    const user = await User.findById(id).exec()
    if (!user){
        return res.status(400).json({message: 'User not found'})
    }
    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUsers,
    updateUser,
    deleteUser
}