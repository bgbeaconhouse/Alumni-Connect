const router = require("express").Router();


router.use("/posts", require("./posts"));
router.use("/likes", require("./likes"));
router.use("/comments", require("./comments"));
router.use("/profiles", require("./profiles"));
router.use("/me", require("./me"));

module.exports = router;