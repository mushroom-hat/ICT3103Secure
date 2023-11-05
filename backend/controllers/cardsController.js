const Card = require("../models/Card");
const User = require("../models/User"); // Import the User model
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
//@desc Get all cards
//@route GET /cards
//@access Private
const getAllCards = asyncHandler(async (req, res) => {
  const cards = await Card.find().lean();
  if (!cards || cards.length === 0) {
    return res.status(404).json({ message: "No cards found" });
  }
  res.json(cards);
});

//@desc Create a new card
//@route POST /cards
//@access Private
const createNewCard = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { cardNumber, cardHolderName, expiryDate, cvc } = req.body;

  // Confirm data
  if (!cardNumber || !cardHolderName || !expiryDate || !cvc) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Extract the user ID from the JWT token
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("Req header", authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  let userID;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    userID = decoded.UserInfo.id;
    console.log("UserID", userID);
  });

  // Create and store the new card
  const card = await Card.create({
    cardNumber,
    cardHolderName,
    expiryDate,
    cvc,
  });

  if (card) {
    // Update the user's card field with the newly created card's ID
    const user = await User.findById(userID);
    if (user) {
      user.card = card._id;
      await user.save();
      console.log("Before", user);
    }
    console.log("After", user);

    res.status(201).json({ message: "New card created" });
  } else {
    res.status(400).json({ message: "Invalid card data received" });
  }
});
//@desc Update a card
//@route PUT /cards/:id
//@access Private
const updateCard = asyncHandler(async (req, res) => {
  const { _id, cardNumber, cardHolderName, expiryDate, cvc } = req.body;

  // Check if the card exists
  const card = await Card.findById(_id).exec();

  if (!card) {
    return res.status(400).json({ message: "Card not found" });
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

  res.json({ message: "Card updated" });
});

//@desc Delete a card
//@route DELETE /cards/:id
//@access Private
const deleteCard = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const { id } = req.body;
  // Check if the card exists
  const card = await Card.findById(id).exec();
  console.log("card", card);

  if (!card) {
    console.log(card);
    return res.status(400).json({ message: "Card not found" });
  }

  // Check if the card is associated with any users (you might need to adjust this based on your schema)
  const associatedUsers = await User.find({ card: id }).lean().exec();

  if (associatedUsers && associatedUsers.length > 0) {
    for (const user of associatedUsers) {
      user.card = null;
      await User.findByIdAndUpdate(user._id, { card: null }); // Update the user using findByIdAndUpdate
    }
  }

  const result = await card.deleteOne();
  const reply = `Card with ID ${result._id} deleted`;
  res.json(reply);
});

const getCardInfoByUserId = async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cardId = user.card;

    if (!cardId) {
      return res.status(404).json({ message: "User has no associated card" });
    }

    const card = await Card.findById(cardId).exec();

    if (!card) {
      console.log("Card not found:", cardId); // Add this line for debugging
      return res.status(404).json({ message: "Card not found" });
    }

    console.log("Card found:", card); // Add this line for debugging

    return res.json(card);
  } catch (error) {
    console.error("Error while getting card information:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllCards,
  getCardInfoByUserId,
  createNewCard,
  updateCard,
  deleteCard,
};
