const express = require('express');
const router = express.Router();
const blogController=require("../Controllers/blogController")
//--------------------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My server is running awesome!")
})
//--------------------------------------------------------//

router.delete("/blogs/:blogId", blogController.deleteBlogById)
router.delete("/blog" ,blogController.deleteBlogByQuery)


module.exports = router;