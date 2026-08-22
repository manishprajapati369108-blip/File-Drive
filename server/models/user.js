import mongoose from "mongoose";
import bcrypt from 'bcrypt'


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
    type: String,
    default: null
  },
  resetOTPExpires: {
    type: Date,
    default: null
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpires: {
    type:Date,
    default: null
  },
}, {timestamps: true});

userSchema.pre('save', async function() {
  // ✅ 'this' refers to the document being saved
  if (!this.isModified('password')) return ;
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (error) {
    throw error;
  }
});

export default mongoose.model('User', userSchema);