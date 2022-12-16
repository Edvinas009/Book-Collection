import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface UserInterface extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  isAdmin: string;
  userId: string;
}

const UserSchema: mongoose.Schema<UserInterface> = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
  },
}).pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model<UserInterface>("User", UserSchema);
