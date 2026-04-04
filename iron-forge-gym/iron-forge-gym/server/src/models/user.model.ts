import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    height: number; // in cm
    weight: number; // in kg
    goals: string[];
    membershipType: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    goals: { type: [String], default: [] },
    membershipType: { type: String, required: true },
}, {
    timestamps: true,
});

const User = model<IUser>('User', userSchema);

export default User;