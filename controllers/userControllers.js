import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Task from '../models/tasks.js'

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// @desc register a new user(signUp)
// @route POST api/v1/users/signup
export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if all required fields are provided
        if (!username || !email || !password) return res.status(400).json({ message: 'Username, Email and password are required!' });

        // check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: `User with the email ${email} already exists.` });

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, userId: newUser._id });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc login
// @route POST api/v1/users/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: `Invalid credentials.` });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: `Invalid password.` });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id });

    } catch (error) {
        res.status(500).json({ message: "Error logging in." });
    }
};


// @desc get details of logged in user
// @route GET api/v1/users/user-details
export const userDetail = async (req, res, next) => {
    try {
        const user = await User.findOne({ user: req.user });
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Error fetching user details." });
    }
};


// @desc update details of logged in user
// @route PUT api/v1/users/user-detail
export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { email, password, ...otherdetails } = req.body;

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email already in use.' });
            }
        }

        const currentUser = await User.findOne({ userId });
        if (!currentUser) return res.status(404).json({ message: "User not found." });

        //updating the fields
        if (email) currentUser.email = email;
        if (password) currentUser.password = password;
        Object.assign(currentUser, otherdetails);
        await currentUser.save();

        res.status(200).json({ message: "User details updated successfully.", currentUser });

    } catch (error) {
        res.status(500).json({ message: "Error updating user details." });
    }
};


// @desc delete logged in user
// @route DELETE api/v1/users/user-detail
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Delete associated tasks
        await Task.deleteMany({ userId });
        const user = await User.findOneAndDelete({ userId });

        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json({ message: "User deleted Successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting user." });
    }
};
