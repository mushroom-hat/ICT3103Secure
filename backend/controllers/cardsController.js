const Card = require('../models/Card');
const User = require('../models/User'); // Import the User model
const asyncHandler = require('express-async-handler');

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

//@desc Create a new card
//@route POST /cards
//@access Private
const createNewCard = asyncHandler(async (req, res) => {
    const { cardNumber, cardHolderName, expiryDate, cvc } = req.body;

    // Confirm data
    if (!cardNumber || !cardHolderName || !expiryDate || !cvc) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Create and store the new card
    const card = await Card.create({ cardNumber, cardHolderName, expiryDate, cvc });

    if (card) {
        res.status(201).json({ message: 'New card created' });
    } else {
        res.status(400).json({ message: 'Invalid card data received' });
    }
});

//@desc Update a card
//@route PUT /cards/:id
//@access Private
const updateCard = asyncHandler(async (req, res) => {

    const { _id,cardNumber, cardHolderName, expiryDate, cvc } = req.body;

    // Check if the card exists
    const card = await Card.findById(_id).exec();

    if (!card) {
        return res.status(400).json({ message: 'Card not found' });
    }

    // Update card fields if provided in the request body
    if (cardNumber) {
        card.cardNumber = cardNumber;
    }
    if (cardHolderName) {
        card.cardHolderName = cardHolderName;
    }
    if (expiryDate) {
        card.expiryDate = expiryDate;
    }
    if (cvc) {
        card.cvc = cvc;
    }

    const updatedCard = await card.save();

    res.json({ message: 'Card updated' });
});

//@desc Delete a card
//@route DELETE /cards/:id
//@access Private
const deleteCard = asyncHandler(async (req, res) => {

    const { _id } = req.body;
    // Check if the card exists
    const card = await Card.findById(_id).exec();

    if (!card) {
        return res.status(400).json({ message: 'Card not found' });
    }

    // Check if the card is associated with any users (you might need to adjust this based on your schema)
    const associatedUsers = await User.find({ card: _id }).lean().exec();

    if (associatedUsers && associatedUsers.length > 0) {
        return res.status(400).json({ message: 'Card is associated with users' });
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
