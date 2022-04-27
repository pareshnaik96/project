
const ObjectId = require("mongoose").Types.ObjectId;

let deleteBlogById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Not a valid blog id" })
        let deleteBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        if (!deleteBlog) return res.status(404).send({ status: false, msg: "Blog does not exist" })
        res.status(200).send({ status: true, data: deleteBlog })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

let deleteBlogByQuery = async function (req, res) {
    try {
        let data = req.query
        if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "No user input" })
        let filter = { isDeleted: false, ...data }
        let findDocsById = await blogModel.find(filter).select({ _id: 1 })
        if(!findDocsById.length) return res.status(400).send({ status: false, msg: "Document Not found" })
        let deleteBlog = await blogModel.updateMany({ _id: findDocsById, isDeleted:false}, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        res.status(200).send({ status: true, data: deleteBlog })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.msg })
    }
}

module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogByQuery = deleteBlogByQuery;

