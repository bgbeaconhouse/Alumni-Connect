const express = require("express")
const router=express.Router()
router.use(express.json())

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
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

module.exports = router;