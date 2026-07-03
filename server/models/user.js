import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import { string } from "zod";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },
  resetOTP: {
    type: string,
    default: null
  },
  resetOTPExpires: {
    type: Date,
    default: null
  },
  resetToken: {
    type: string,
    default: null
  },
  resetTokenExpires: {
    type:Date,
    default: null
  },
}, {timestamps: true});

 userSchema.pre("save", async(next) => {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();

})

const User = mongoose.model("User", userSchema)

export default User;