const User = require('../models/User')
const Article = require('../models/Article')
const Card = require('../models/Card')
const Donation = require('../models/Donation')
const Spending = require('../models/Spending')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all cards
//@route GET /cards
//@access Private
const getAllCards = asyncHandler(async (req, res) => {
    const cards = await Card.find().lean();
    if (!cards || cards.length === 0) {
        return res.status(404).json({ message: 'No cards found' });
    }
    res.json(cards);
});

//@desc Create new card
//@route POST /cards
//@access Private
const createNewCard = asyncHandler(async (req, res) => {
    const { cardNumber, cardHolderName, expiryDate, cvc } = req.body;

    // Confirm data
    if (!cardNumber || !cardHolderName || !expiryDate || !cvc) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicates
    const duplicate = await Card.findOne({ cardNumber }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate card number' });
    }

    const cardObject = { cardNumber, cardHolderName, expiryDate, cvc };

    // Create and store new card
    const card = await Card.create(cardObject);

    if (card) {
        res.status(201).json({ message: 'New card created' });
    } else {
        res.status(400).json({ message: 'Invalid card data received' });
    }
});

//@desc Update card
//@route PATCH /cards
//@access Private
const updateCard = asyncHandler(async (req, res) => {
    const { id, cardNumber, cardHolderName, expiryDate, cvc } = req.body;
    if (!id || !cardNumber || !cardHolderName || !expiryDate || !cvc) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const card = await Card.findById(id).exec();

    if (!card) {
        return res.status(400).json({ message: 'Card not found' });
    }

    // Check for duplicate card number
    const duplicate = await Card.findOne({ cardNumber }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate card number' });
    }

    card.cardNumber = cardNumber;
    card.cardHolderName = cardHolderName;
    card.expiryDate = expiryDate;
    card.cvc = cvc;

    const updatedCard = await card.save();
    res.json({ message: 'Card updated' });
});

//@desc Delete card
//@route DELETE /cards
//@access Private
const deleteCard = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Card ID required' });
    }

    // Check if the card is associated with any users (you might need to adjust this based on your schema)
    const associatedUsers = await User.find({ card: id }).lean().exec();

    if (associatedUsers && associatedUsers.length > 0) {
        return res.status(400).json({ message: 'Card is associated with users' });
    }

    const card = await Card.findById(id).exec();
    if (!card) {
        return res.status(400).json({ message: 'Card not found' });
    }

    const result = await card.deleteOne();
    const reply = `Card with ID ${result._id} deleted`;
    res.json(reply);
});

module.exports = {
    getAllCards,
    createNewCard,
    updateCard,
    deleteCard
};
