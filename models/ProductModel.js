import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    mainImage: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    // subcategoryId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Subcategory', // Make sure you have this model created
    // },
    
    specifications: [
      {
        specName: {
          type: String,
          trim: true,
        },
        specValue: {
          type: String,
          trim: true,
        },
      },
    ],
    fullDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [
      {
        featureName: {
          type: String,
          trim: true,
        },
        featureValue: {
          type: String,
          trim: true,
        },
      },
    ],
    additionalImages: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;