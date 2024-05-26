const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter the title"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please enter the address"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Please enter the city"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "Please enter the state"],
      trim: true,
    },
    pincode: {
      type: Number,
      required: [true, "Please enter the pincode"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter the price"],
      trim: true,
    },
    totalRooms: {
      type: Number,
      required: [true, "Please enter the total rooms"],
      trim: true,
    },
    noOfBedrooms: {
      type: Number,
      required: [true, "Please enter the number of bedrooms"],
      trim: true,
    },
    area: {
      type: Number,
      // required: [true, "Please enter the total area in sqft"],
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      required: [true, "Please enter the description"],
      trim: true,
    },
    images: [
      {
        public_id: { type: String },
        url: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", schema);
