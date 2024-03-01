import mongoose from "mongoose";

const publicationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

//pre mongoose

export default mongoose.model('publication', publicationSchema)