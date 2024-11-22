const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const User = require('../models/User');


router.get('/', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, '-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: error.message });
    }
});


router.put('/', authenticateJWT, async (req, res) => {
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true, runValidators: true, select: '-password' }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
