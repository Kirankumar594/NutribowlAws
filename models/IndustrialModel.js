import mongoose from 'mongoose';

const industrialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Industrial = mongoose.model('Industrial', industrialSchema);
export default Industrial;