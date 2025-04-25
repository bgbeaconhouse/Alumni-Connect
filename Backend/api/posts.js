const express = require("express")
const router=express.Router()

router.use(express.json())
const multer = require("multer");

const prisma = require("../prisma");
const fs = require('fs').promises;
const verifyToken = require("../verify")

// Configure Multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where you want to save the images
        cb(null, 'uploads/'); // Create an 'uploads' folder in your project directory
    },
    filename: function (req, file, cb) {
        // Define how the file should be named
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    }
  });
  
  const upload = multer({ storage: storage }).array('imageContents', 10); 
  const uploadSingle = multer({ storage: storage }).single('image');



router.get("/", verifyToken, async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                    },
                },
            },
        });
        res.json(posts)
    } catch (error) {
        
        next()
    }
})

router.post("/", verifyToken, upload, async (req, res, next) => {
    try {
        const { textContent } = req.body;
        const imageContents = req.files ? req.files.map(file => file.filename) : []; // Get the filename of the uploaded image
  
        console.log("request body:", req.body);
        console.log("uploaded files:", req.files); // Log the uploaded file information
       
  
        if (!textContent) {
            const error = {
                status: 400,
                message: "Post is missing essential information.",
            };
            return next(error);
        }
  
        const userId = req.userId

        const post = await prisma.post.create({
            data: { textContent, imageContents, userId:userId, },
            include: { // Include the user data in the response, if needed
                user: true,
              },
        });
        console.log(post);
        res.status(201).json(post);
    } catch (error) {
        console.error("Error creating post:", error);
        next(error); // Pass the error to the error handling middleware
    }
  });

module.exports = router;