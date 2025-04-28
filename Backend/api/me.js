// In your api/index.js or a similar file
const express = require("express")
const router=express.Router()

router.use(express.json())

const prisma = require("../prisma");
const fs = require('fs').promises;
const verifyToken = require("../verify")

router.get("/", verifyToken, async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId }, // req.userId is set by verifyToken
        select: { id: true }, // Only select the ID if that's all you need
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id });
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;