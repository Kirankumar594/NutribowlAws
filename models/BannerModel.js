import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        trim: true
    },
    subtitle:{
        type:String,
        required: false,

    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    points:{
        type:[String],
        required:false
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;