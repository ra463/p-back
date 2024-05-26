const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your First Name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please enter your Last Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Please enter valid email address"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password must be atleast 8 characters"],
      trim: true,
      select: false,
    },
    mobile: {
      type: Number,
      required: [true, "Please enter your mobile number"],
      maxLength: [10, "Mobile number must be of 10 digits"],
      minLength: [10, "Mobile number must be of 10 digits"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Please enter your role"],
      enum: ["seller", "buyer"],
    },
    temp_code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getJWTToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", schema);
