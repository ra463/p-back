const User = require("../model/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

const isStrongPassword = (password) => {
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numericRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

  if (
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numericRegex.test(password) &&
    specialCharRegex.test(password)
  ) {
    return true;
  } else {
    return false;
  }
};

const sendData = async (res, statusCode, user, message) => {
  const token = await user.getJWTToken();
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    user,
    token,
    message,
  });
};

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobile,
    confirmPassword,
    role,
  } = req.body;

  if (!role && !password && !email && !firstName && !lastName) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  if (!isStrongPassword(password)) {
    return next(
      new ErrorHandler(
        "Password must contain one Uppercase, Lowercase, Numeric and Special Character",
        400
      )
    );
  }

  if (password !== confirmPassword)
    return next(new ErrorHandler("Confirm Password does not match", 400));

  if (mobile && mobile.length !== 10) {
    return next(new ErrorHandler("Mobile number must be of 10 digits", 400));
  }

  const user_exist = await User.findOne({
    email: { $regex: new RegExp(email, "i") },
  });

  if (user_exist) {
    return next(new ErrorHandler(`Email already exists`, 400));
  }

  let user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    mobile,
    role,
  });

  sendData(res, 201, user, "User Registered Successfully");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password!", 401));

  sendData(res, 200, user, "User Logged In Successfully");
});

exports.getProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return next(new ErrorHandler("User not found.", 400));

  res.status(200).json({
    user,
  });
});
