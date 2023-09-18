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
    const{ userId, username, pwd, roles, card } = req.body

    //confirm data
    if (!userId || !username || !pwd || !roles || !card ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicates

    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({messsage: 'Duplicate username'})
    }

    //Hash pwd
    const hashedPwd = await bcrypt.hash(pwd, 10) //salt rounds

    const userObject = { userId,username, "pwd": hashedPwd, roles, card}

    //Create and store new user
    const user = await User.create(userObject)

    if(user){
        res.status(201).json({messsage: `New user ${username} created`})
    } else{
        res.status(400).json({messsage: 'Invalid user data received'})

    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { id, userId, username, roles, pwd, card } = req.body; // Use 'pwd' instead of 'password'

    // Confirm data 
    if (!id || !userId || !username || !roles || !card) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(userId).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.userId = userId
    user.username = username
    user.roles = roles
    user.card = card

    if (pwd) {
        // Hash password 
        user.pwd = await bcrypt.hash(pwd, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})


//@desc Delete Users
//@route PATCH /users
//@access Private
const deleteUser = asyncHandler(async(req,res) => {
    const{ userId  } = req.body
    if  (!userId){
        return res.status(400).json({message: 'User ID required'})
    }
    const articles = await Article.findOne({user: userId}).lean().exec()
    if (articles?.length){
        return res.status(400).json({message: 'User has written articles'})
    }
    const user = await User.findById(userId).exec()
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