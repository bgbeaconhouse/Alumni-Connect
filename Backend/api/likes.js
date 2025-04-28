const express = require("express")
const router=express.Router()
router.use(express.json())

const prisma = require("../prisma");
const verifyToken = require("../verify")

router.get("/", async (req, res, next) => {
    try {
        const likes = await prisma.like.findMany();
        res.json(likes)
    } catch (error) {
        
        next()
    }
})




module.exports = router;