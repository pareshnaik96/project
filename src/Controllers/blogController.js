const authorModel = require("../Models/authorModel")
const blogModel = require("../Models/blogModel")
const ObjectId = require("mongoose").Types.ObjectId;

// Blog Creation
const createBlog = async function (req, res) {
    try {
        let data = req.body;
        if (Object.entries(data).length != 0) {

            if (!data.title  || !data.title.trim() ) return res.status(400).send({ status: false, msg: "Please Fill the required field title!" }) //required filled can't be blank
            
            if (!data.body || !data.body.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field body!" }) 
           
            if (!data.authorId || !data.authorId.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field Author details!" })
            
            if (!data.category || !data.category.trim()) return res.status(400).send({ status: false, msg: "Please Fill the required field catergory!" })
            
            // Validation of ID format
            if (!ObjectId.isValid(data.authorId)) return res.status(400).send({ status: false, msg: "Not a valid author ID" })
            // Validation of id exist or not
            let id = req.body.authorId
            let findAuthorId = await authorModel.findById(id)
            if (!findAuthorId) return res.status(404).send({ status: false, msg: "Author Not found. Please enter a valid Author id." })
            // Adding Publish date if true
            if (data.isPublished)
                req.body['publishedAt'] = new Date()

            let saveData = await blogModel.create(data);
            return res.status(201).send({ status: true, data: saveData });
        } else {
            return res.status(400).send({ status: false, msg: "NO USER INPUT" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

// GET Blogs
const getBlogs = async function (req, res) {
    try {
        let userInput = req.query
        if (Object.entries(userInput).length === 0) {
            let findBLogs = await blogModel.find({ isDeleted: false, isPublished: true })
            // If both condition false 
            if (Object.entries(findBLogs).length === 0) return res.status(404).send({ status: false, msg: "Sorry!! No blogs found." })
           
            return res.status(200).send({ status: true, data: findBLogs })
        } else {
            let filter = { isDeleted: false, isPublished: true, ...userInput }

            const filterByInput = await blogModel.find(filter)
            if (Object.entries(filterByInput).length === 0) return res.status(404).send({ status: false, msg: "Sorry!! No blogs found by query." })
           
            return res.status(200).send({ status: true, data: filterByInput })
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message });
    }
}

// Update Blog 
const updateBlogById = async function (req, res) {
    try {
        let id = req.params.blogId
        // ID validation
        if (!ObjectId.isValid(id)) return res.status(400).send({ status: false, msg: "Not a valid BLOG ID" })
        // Id verification
        let blogDetails = await blogModel.findById(id)
        if (blogDetails.isDeleted) return res.status(404).send({ status: false, msg: "Blog not found." })

        let updatedData = req.body
        let updatedTitle = req.body.title
        let updatedBody = req.body.body
        let updatedTag = req.body.tags
        let updatedSubcategory = req.body.subcategory
        let updatedCategory = req.body.category
        
        if (Object.entries(updatedData).length === 0) return res.status(400).send({ status: false, msg: "NO INPUT BY USER" })//for update required filled can't be blank
       
        if (updatedTitle=="") {
            return res.status(400).send({ status: false, msg: "Title can not be empty" })
        }
        else if (updatedTitle) {
            if (!updatedTitle.trim()) return res.status(400).send({ status: false, msg: "Title can not be empty" })
        }
        if (updatedBody=="") {
            return res.status(400).send({ status: false, msg: "Body can not be empty" })
        }
        else if (updatedBody) {
            if (!updatedBody.trim()) return res.status(400).send({ status: false, msg: "Body can not be empty" })
        }
        if (updatedCategory=="") {
            return res.status(400).send({ status: false, msg: "Category can not be empty" })
        }
        else if (updatedCategory) {
            if (!updatedCategory.trim()) return res.status(400).send({ status: false, msg: "Category can not be empty" })
        }

        // if book is not published 
        if (!blogDetails.isPublished) {
            let updatedBlog = await blogModel.findOneAndUpdate({ _id: id },
                {
                    $set: { title: updatedTitle, body: updatedBody, category: updatedCategory, isPublished: true, publishedAt: new Date() },
                    $push: { tags: updatedTag, subcategory: updatedSubcategory }
                }, { new: true })
           
                return res.status(200).send({ status: true, data: updatedBlog })
        }
        // if book is already published
        else {
            let updatedBlog = await blogModel.findOneAndUpdate({ _id: id },
                {
                    $set: { title: updatedTitle, body: updatedBody, category: updatedCategory},
                    $push: { tags: updatedTag, subcategory: updatedSubcategory }
                }, { new: true })
          
                return res.status(200).send({ status: true, data: updatedBlog })
        }

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message });
    }
}

// Delete by Id
const deleteBlogById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
      
        if (!ObjectId.isValid(blogId))
            return res.status(400).send({ status: false, msg: "Not a valid blog id" })
      
            let deleteBlog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
       
            if (!deleteBlog) return res.status(404).send({ status: false, msg: "Blog does not exist" })
            return res.status(200).send({ status: true, data: deleteBlog })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

// Delete by Query
const deleteBlogByQuery = async function (req, res) {
    try {
        let data = req.query
        let filter = { isDeleted: false, ...data }

        let findDocsById = await blogModel.find(filter).select({ _id: 1 })
        if (!findDocsById.length) return res.status(404).send({ status: false, msg: "No Blogs found" })

        let deleteBlog = await blogModel.updateMany({ _id: findDocsById },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, data: deleteBlog })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.msg })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogById = updateBlogById
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogByQuery = deleteBlogByQuery;




