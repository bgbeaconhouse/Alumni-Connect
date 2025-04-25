const router = require("express").Router();


router.use("/posts", require("./posts"));
router.use("/likes", require("./likes"));
router.use("/comments", require("./comments"));


module.exports = router;