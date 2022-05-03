const express = require('express');
const router = express.Router();
const blogController = require("../Controllers/blogController")
const authorController = require("../Controllers/authorController")
const middleware = require("../Middlewares/middleware")
//--------------------------------------------------------//

router.get("/test-me", function (req, res) {
    res.status(200).send("My server is running awesome!")
})
//--------------------------------------------------------//

router.post("/authors", authorController.createAuthor)
router.post("/login", authorController.loginUser)
router.post("/blogs", middleware.authentication, blogController.createBlog)
router.get("/blogs", middleware.authentication, blogController.getBlogs)
router.put("/blogs/:blogId", middleware.authentication, middleware.authorization1, blogController.updateBlogById)
router.delete("/blogs/:blogId", middleware.authentication, middleware.authorization1, blogController.deleteBlogById)
router.delete("/blogs", middleware.authentication, middleware.authorization2, blogController.deleteBlogByQuery) 

module.exports = router;