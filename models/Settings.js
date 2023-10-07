const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    banners: {
      images: [String],
    },
    banner: String,
    footer: {
      address: String,
      phone: String,
      email: String,
      workTime: String,
    },
    social: {
      facebook: String,
      twitter: String,
      youtube: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
