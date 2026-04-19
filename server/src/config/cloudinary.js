const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localFilePath, folderName = "buggedbrain") {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary not configured. Returning local mock URL.");
    return `http://mocked-url.com/${folderName}/${Date.now()}`;
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
      resource_type: "auto",
    });
    // Remove file from local server
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
}

module.exports = { cloudinary, uploadToCloudinary };
