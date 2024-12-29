import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// user registration
export const register = async (req, res) => {
    try {
        // Hashing password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
        });

        await newUser.save();

        res.status(200).json({ success: true, message: 'Successfully created' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again', error: err.message });
    }
};

// user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the provided password with the stored password
        const checkCorrectPassword = await bcrypt.compare(password, user.password);

        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        const { password: _, role, ...rest } = user._doc;

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });

        // Set token in the response cookie
        res.cookie('accessToken', token, {
            httpOnly: true,  // Ensures the cookie cannot be accessed via JavaScript
            maxAge: 15 * 24 * 60 * 60 * 1000,  // Cookie expiration time (15 days in milliseconds)
        });

        // Send response with token and user data
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: { ...rest },
            role,
        });

    } catch (err) {
        console.error('Error in login:', err); // Log any error that occurs
        return res.status(500).json({ success: false, message: 'Failed to login. Try again', error: err.message });
    }
};
