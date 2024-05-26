const User = require("../model/User");
const Property = require("../model/Property");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { getDataUri } = require("../utils/dataUri");
const cloudinary = require("cloudinary");
const { sendBuyerDetails, sendSellerDetails } = require("../utils/sendEmail");

exports.registerProperty = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  if (user.role !== "seller") {
    return next(new ErrorHandler("Only seller can register property", 400));
  }

  const {
    title,
    address,
    city,
    state,
    pincode,
    price,
    totalRooms,
    noOfBedrooms,
    area,
    description,
  } = req.body;

  const files = req.files;
  if (!files)
    return next(new ErrorHandler("Please add atleast one image", 400));

  let imagesInfo = [];

  for (let i = 0; i < files.length; i++) {
    const newPath = await getDataUri(files[i]);
    const result = await cloudinary.v2.uploader.upload(newPath.content, {
      folder: "Persido",
    });
    imagesInfo.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  await Property.create({
    seller: user._id,
    title,
    address,
    city,
    state,
    pincode,
    price,
    totalRooms,
    noOfBedrooms,
    area,
    description,
    images: imagesInfo,
  });

  res.status(201).json({
    success: true,
    message: "Property registered successfully",
  });
});

exports.getAllProperties = catchAsyncError(async (req, res, next) => {
  const { city, state, pincode, totalRooms, resultPerPage, currentPage } =
    req.query;
  const query = {};

  if (city) {
    const cityExp = new RegExp(city, "i");
    query.city = { $regex: cityExp };
  }
  if (state) {
    const stateExp = new RegExp(state, "i");
    query.state = { $regex: stateExp };
  }
  if (pincode) {
    query.pincode = Number(pincode);
  }
  if (totalRooms) {
    query.totalRooms = Number(totalRooms);
  }

  const propertiesCount = await Property.countDocuments(query);

  const limit = Number(resultPerPage);
  const page = Number(currentPage);
  const skip = (page - 1) * limit;

  const properties = await Property.find(query).skip(skip).limit(limit).lean();

  const filteredPropertiesCount = properties.length;

  res.status(200).json({
    success: true,
    properties,
    propertiesCount,
    filteredPropertiesCount,
  });
});

exports.getAllSellerProperties = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  if (user.role !== "seller") {
    return next(new ErrorHandler("Only seller can register property", 400));
  }

  const sellerProperties = await Property.find({ seller: user._id }).lean();

  res.status(200).json({
    success: true,
    sellerProperties,
  });
});

exports.getProperty = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  const property = await Property.findById(req.params.id);
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  res.status(200).json({
    success: true,
    property,
  });
});

exports.updateProperty = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  if (user.role !== "seller") {
    return next(new ErrorHandler("Only seller can update their property", 400));
  }

  const {
    title,
    address,
    city,
    state,
    pincode,
    price,
    totalRooms,
    noOfBedrooms,
    area,
    description,
  } = req.body;

  const property = await Property.findOne({
    _id: req.params.id,
    seller: user._id,
  });
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  if (title) property.title = title;
  if (address) property.address = address;
  if (city) property.city = city;
  if (state) property.state = state;
  if (pincode) property.pincode = pincode;
  if (price) property.price = price;
  if (totalRooms) property.totalRooms = totalRooms;
  if (noOfBedrooms) property.noOfBedrooms = noOfBedrooms;
  if (area) property.area = area;
  if (description) property.description = description;

  await property.save();
  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    property,
  });
});

exports.addMoreImages = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  if (user.role !== "seller") {
    return next(new ErrorHandler("Only seller can register property", 400));
  }

  const files = req.files;
  if (!files)
    return next(new ErrorHandler("Please add atleast one image", 400));

  const property = await Property.findOne({
    _id: req.params.id,
    seller: user._id,
  });
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  let imagesInfo = property.images;
  for (let i = 0; i < files.length; i++) {
    const newPath = await getDataUri(files[i]);
    const result = await cloudinary.v2.uploader.upload(newPath.content, {
      folder: "Persido",
    });
    imagesInfo.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  property.images = imagesInfo;

  await property.save();
  res.status(200).json({
    success: true,
    message: "Images added successfully",
  });
});

exports.deleteImage = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  if (user.role !== "seller") {
    return next(new ErrorHandler("Only seller can register property", 400));
  }

  const { public_id } = req.body;
  if (!public_id) return next(new ErrorHandler("Image not found.", 400));

  const property = await Property.findById(req.params.id);
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  if (property.seller.toString() !== user._id.toString()) {
    return next(new ErrorHandler("Only seller can delete image", 400));
  }

  const imageInfo = property.images.find((image) => {
    return image.public_id === public_id;
  });
  if (!imageInfo) return next(new ErrorHandler("Image not found.", 400));
  await cloudinary.v2.uploader.destroy(imageInfo.public_id);

  property.images = property.images.filter((image) => {
    return image.public_id !== public_id;
  });

  await property.save();
  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
  });
});

exports.deleteProperty = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  if (user.role !== "seller") {
    return next(
      new ErrorHandler("Only seller can register/delete property", 400)
    );
  }

  const property = await Property.findOne({
    _id: req.params.id,
    seller: user._id,
  });
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  for (let i = 0; i < property.images.length; i++) {
    const imageInfo = property.images[i];
    await cloudinary.v2.uploader.destroy(imageInfo.public_id);
  }

  await property.deleteOne();
  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
});

exports.likeandUnlikeProperty = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  const property = await Property.findById(req.params.id);
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  if (property.likes.includes(user._id)) {
    property.likes = property.likes.filter((like) => {
      return like.toString() !== user._id.toString();
    });

    await property.save();
    return res.status(200).json({
      success: true,
      message: "You unliked this property",
    });
  } else {
    property.likes.push(user._id);

    await property.save();
    return res.status(200).json({
      success: true,
      message: "You liked this property",
    });
  }
});

exports.sendDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found.", 400));

  const property = await Property.findById(req.params.id).populate(
    "seller",
    "firstName lastName email mobile"
  );
  if (!property) return next(new ErrorHandler("Property not found.", 400));

  await sendSellerDetails(user, property);
  await sendBuyerDetails(user, property);

  const data = {
    name: property.seller.firstName + " " + property.seller.lastName,
    email: property.seller.email,
    mobile: property.seller.mobile,
  };

  res.status(200).json({
    success: true,
    message:
      "Seller details are sent to your email and your details are also sent to seller",
    data,
  });
});
