const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

let blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true,"Title is require"],
        },
        body: {
            type: String,
            required: [true,"Body is required"],
        },
        authorId: {
            type: objectId,
            refs: 'Author',
            required: [true,"Author Id is required"],
        },
        tags: [String],
        category: {
            type: String,
            required: [true, "Category is required"],
     
        },
        subcategory: [String],
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date
        }
    },
    { timestamps: true }
)


module.exports = mongoose.model('Blog', blogSchema);