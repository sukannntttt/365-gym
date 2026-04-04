import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (userData: { email: string; password: string; name: string }) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
    });
    return await newUser.save();
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
};

export const getUserById = async (id: string) => {
    return await User.findById(id);
};