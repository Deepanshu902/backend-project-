import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// didn't understand a bit
// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath,oldImagePublicId = null) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Auto-detect the file type (image, video, etc.)
        });


        if (oldImagePublicId) { // delete old file 
            const deleteResponse = await cloudinary.uploader.destroy(oldImagePublicId);
            console.log("Old image deleted:", deleteResponse);
        }

        // Check if the file exists before deleting it
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Delete the local file after a successful upload
        }
        
        
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        // Attempt to delete the file only if it exists
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath); // Clean up the local file
            } catch (deleteError) {
                console.error("Error deleting file:", deleteError);
            }
        }

        return null;
    }
};

export { uploadOnCloudinary };
