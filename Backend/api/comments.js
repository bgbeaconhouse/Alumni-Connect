const express = require("express")
const router=express.Router()
router.use(express.json())

const prisma = require("../prisma");
const verifyToken = require("../verify")

router.get("/", async (req, res, next) => {
    try {
        const comments = await prisma.comment.findMany();
        res.json(comments)
    } catch (error) {
        
        next()
    }
})

router.delete("/:id", verifyToken, async (req, res, next) => {
    
    try {
      const id = +req.params.id;
  
      const commentExists = await prisma.comment.findUnique({ where: { id } });
      if (!commentExists) {
        return next({
          status: 404,
          message: `Could not find comment with id ${id}.`,
        });
      }
  
      await prisma.comment.delete({ where: { id } });
  
      res.sendStatus(204);
    } catch {
      next();
    }
  });


module.exports = router;