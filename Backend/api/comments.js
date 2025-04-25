const express = require("express")
const router=express.Router()
router.use(express.json())

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
    try {
        const comments = await prisma.comment.findMany();
        res.json(comments)
    } catch (error) {
        
        next()
    }
})



module.exports = router;