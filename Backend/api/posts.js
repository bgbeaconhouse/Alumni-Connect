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


// Route to get comments for a specific post
router.get("/:postId/comments", async (req, res, next) => {
  try {
    const postId = +req.params.postId; // Get the post ID from the URL

    // 1.  Find all comments for the given postId
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      // Optional: Include the user data if you need it
      include: {
        user: {
          select: {
            id: true,
            username: true,
            // Add any other user fields you want to include
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Or 'asc' for oldest first
      },
    });

    // 2. Check if comments were found
    if (!comments || comments.length === 0) {
      return res.status(200).json({  //  No comments is not an error, so a 200 is appropriate
        message: "No comments found for this post.",
        comments: [], //  Important:  Return an empty array, NOT null
      });
    }

    // 3. Respond with the comments
    res.status(200).json(comments);

  } catch (error) {
    // 4. Handle errors
    console.error("Error getting comments:", error);
    next(error); // Pass error to your error handling middleware
  }
});




  // Create new comment for post 
  router.post("/:postId/comments", verifyToken, async (req, res, next) => {
  
    try {
      const postId = +req.params.postId;
      const { textContent } = req.body;
   
  
      console.log(req.body);
      
  
      
      if (!textContent) {
    
        const error = {
          status: 400,
          message: "Comment must have text.",
        };
  
       
        return next(error);
      }
     
    
      const comment = await prisma.comment.create({ data: { textContent, postId: postId, userId: req.userId},  });
     
      res.status(201).json(comment);
    } catch {
      next();
    }
  });

// Route to delete a comment
router.delete("/:postId/comments/:commentId", verifyToken, async (req, res, next) => {
  try {
    const postId = +req.params.postId;       // Get the post ID from the URL
    const commentId = +req.params.commentId; // Get the comment ID from the URL
    const userId = req.userId;             // Get the user ID from the verified token

    // 1. Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 2. Authorization: Check if the user is allowed to delete this comment
    //    -  Is the user the owner of the comment?
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own comments." });
    }

    // 3. Delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    // 4. Respond with success
    res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    // 5. Handle errors
    console.error("Error deleting comment:", error);
    next(error); // Pass error to your error handling middleware
  }
});

// Route to get the number of comments for a specific post
router.get("/:postId/comments/count", async (req, res, next) => {
  try {
    const postId = +req.params.postId; // Get the post ID from the URL

    // 1. Count the comments for the given postId
    const commentCount = await prisma.comment.count({
      where: {
        postId: postId,
      },
    });

    // 2. Respond with the comment count
    res.status(200).json({
      postId: postId,
      commentCount: commentCount,
    });

  } catch (error) {
    // 3. Handle errors
    console.error("Error getting comment count:", error);
    next(error); // Pass error to your error handling middleware
  }
});



  // Create new like for post 
  router.post("/:postId/likes", verifyToken, async (req, res, next) => {
  
    try {
      const postId = +req.params.postId;
      const userId = req.userId;
   
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
     
      if (existingLike) {
        return res.status(400).json({ message: "You have already liked this post." }); // Or 200 with message.
      }
  
      
     // Create the like record
     const like = await prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });

    res.status(201).json({ message: "Post liked successfully!", like: like }); // Send a 201 Created status
  } catch (error) {
    console.error("Error liking post:", error);
    next(error); // Pass the error to the error handling middleware
  }
});


// Route to unlike a post
router.delete("/:postId/likes", verifyToken, async (req, res, next) => {
  try {
      const postId = +req.params.postId;
      const userId = req.userId;

      const existingLike = await prisma.like.findUnique({
          where: {
              userId_postId: {
                  userId: userId,
                  postId: postId,
              }
          }
      });

      if (!existingLike) {
          return res.status(400).json({message: "You have not liked this post."});
      }
      // Delete the like.
      await prisma.like.delete({
          where: {
              userId_postId: {
                  userId: userId,
                  postId: postId
              }
          }
      });
      res.status(200).json({message: "Post unliked successfully."});
  } catch (error) {
      console.error("Error unliking post", error);
      next(error);
  }
});

  

  router.get("/:id", verifyToken, async (req, res, next) => {
    try {
      const id = +req.params.id;
  
      const post = await prisma.post.findUnique({ 
        where: { id },
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
  
      if (!post) {
        return next({
          status: 404,
          message: `Could not find post with id ${id}.`,
        });
      }
  
      res.json(post);
    } catch {
      next();
    }
  });

  router.delete("/:id", verifyToken, async (req, res, next) => {
    
    try {
      const id = +req.params.id;
  
      const postExists = await prisma.post.findUnique({ where: { id } });
      if (!postExists) {
        return next({
          status: 404,
          message: `Could not find post with id ${id}.`,
        });
      }
  
      await prisma.post.delete({ where: { id } });
  
      res.sendStatus(204);
    } catch {
      next();
    }
  });


module.exports = router;