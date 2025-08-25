import Product from '../models/ProductModel.js';

// Create Product
// export const createProduct = async (req, res) => {
//   try {s
//     console.log("Adding product")
//     const { name, shortDescription, mainImage, specifications, fullDescription, price, features, additionalImages, categoryId, subcategoryId } = req.body;
//     let parsedSpecifications = [];
//     let parsedFeatures = [];

//     try {
//       parsedSpecifications = JSON.parse(specifications);
//       parsedFeatures = JSON.parse(features);
//     } catch (error) {
//       console.error("Error parsing JSON:", error);
//       return res.status(400).json({ message: "Invalid specifications or features format" });
//     }


//     let mainImagePath = mainImage;
//     console.log("req.file : " , req.file)
//     console.log("req.body : " , req.body)
    
//     // Check if files were uploaded
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: 'No images uploaded' });
//     }
    
//     const product = new Product({
//       name,
//       shortDescription,
//       mainImage: mainImagePath,
//       parsedSpecifications,
//       fullDescription,
//       price,
//       parsedFeatures,
//       additionalImages,
//       categoryId,
//       subcategoryId
//     });
    
//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct);
//   } catch (error) {
//     console.error('Create product error:', error);
//     res.status(400).json({ message: error.message });
//   }
// }; 

export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { 
      name, 
      shortDescription, 
      specifications, 
      fullDescription, 
      price, 
      features, 
      categoryId, 
      subcategoryId 
    } = req.body;

    // Validate required fields
    if (!name || !price) {
      console.warn("Validation failed: Name and price are required");
      return res.status(400).json({ message: 'Name and price are required fields' });
    }

    // Parse JSON fields with error handling
    let parsedSpecifications = [];
    let parsedFeatures = [];

    
    try {
      if (specifications) {
        parsedSpecifications = typeof specifications === 'string' 
          ? JSON.parse(specifications) 
          : specifications;
      }
      
      if (features) {
        parsedFeatures = typeof features === 'string' 
          ? JSON.parse(features) 
          : features;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res.status(400).json({ 
        message: "Invalid specifications or features format",
        error: error.message 
      });
    }

    // Handle file uploads
    // let mainImagePath = '';
    // let additionalImagesPaths = [];

    // if (req.files) {
    //   if (req.files['mainImage'] && req.files['mainImage'][0]) {
    //     mainImagePath = req.files['mainImage'][0].path.replace(/\\/g, '/');
    //   }

    //   if (req.files['additionalImages']) {
    //     additionalImagesPaths = req.files['additionalImages'].map(file => 
    //       file.path.replace(/\\/g, '/')
    //     );
    //   }
    // }

    let mainImageFilename = '';
    let additionalImagesFilenames = [];

    if (req.files) {
      if (req.files['mainImage'] && req.files['mainImage'][0]) {
        mainImageFilename = req.files['mainImage'][0].filename;
        mainImageFilename = req.files['mainImage'][0].filename;

      }

      if (req.files['additionalImages']) {
        additionalImagesFilenames = req.files['additionalImages'].map(file => file.filename);
      }
    } 
    console.log("Parsed specifications:", parsedSpecifications);
    console.log("Parsed features:", parsedFeatures);
    console.log("Main image filename:", mainImageFilename);
    console.log("Additional images filenames:", additionalImagesFilenames);
    // Create product
    // const product = new Product({
    //   name,
    //   shortDescription,
    //   mainImage: mainImagePath,
    //   specifications: parsedSpecifications,
    //   fullDescription,
    //   price: Number(price),
    //   features: parsedFeatures,
    //   additionalImages: additionalImagesPaths,
    //   categoryId,
    //   subcategoryId
    // });
        // Create product with just filenames
        const product = new Product({
          name,
          shortDescription,
          mainImage: mainImageFilename, // Now storing just filename
          specifications: parsedSpecifications,
          fullDescription,
          price: Number(price),
          features: parsedFeatures,
          additionalImages: additionalImagesFilenames, // Array of filenames
          categoryId,
          subcategoryId
        }); 

    // const product = new Product({
    //   name,
    //   shortDescription,
    //   mainImage: mainImageFilename,
    //   specifications: parsedSpecifications,

    const createdProduct = await product.save();
     res.status(201).json({
      success: true,
      product:createdProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating product',
      error: error.message 
    });
  }
};

// Get All Products 
// export const getProducts = async (req, res) => {
//   try {
//     const { categoryId, subcategoryId } = req.query;
//     let query = {};
    
//     // Add filters if provided
//     if (categoryId) {
//       query.categoryId = categoryId;
//     }
    
//     if (subcategoryId) {
//       query.subcategoryId = subcategoryId;
//     }
    
//     const products = await Product.find(query).populate('CategoryId').populate('SubcategoryId');
//     res.json({
//       success: true,
//       data: products  // Make sure to wrap in data property
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: error.message 
//     });
//   }
// };

// Get All Products 
export const getProducts = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.query;
    let query = {};
    
    // Add filters if provided
    if (categoryId) {
      query.categoryId = categoryId;
    }
    
    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }
    
    const products = await Product.find(query)
      .populate('categoryId') // ✅ Correct field name as per schema
      // .populate('subcategoryId'); // ✅ Only if subcategoryId is defined in schema and model

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


// Get Single Product
export const getProductById = async (req, res) => {
  console.log("req.params.id : " , req.params.id)
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
// export const updateProduct = async (req, res) => {
//   try {
//     const { name, shortDescription, mainImage, specifications, fullDescription, price, features, additionalImages, categoryId, subcategoryId } = req.body;
    
//     // Find the product first
//     const product = await Product.findById(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     // Update fields with new values or keep existing ones
//     product.name = name || product.name;
//     product.shortDescription = shortDescription || product.shortDescription;
//     product.specifications = specifications || product.specifications;
//     product.fullDescription = fullDescription || product.fullDescription;
//     product.price = price || product.price;
//     product.features = features || product.features;
//     product.categoryId = categoryId || product.categoryId;
//     product.subcategoryId = subcategoryId || product.subcategoryId;
    
//     // Handle main image update
//     if (req.file) {
//       product.mainImage = req.file.path;
//     } else if (mainImage && mainImage !== product.mainImage) {
//       product.mainImage = mainImage;
//     }
    
//     // Handle additional images update
//     if (additionalImages && additionalImages.length > 0) {
//       // This might need adjustment based on how you handle multiple file uploads
//       if (Array.isArray(additionalImages)) {
//         product.additionalImages = [...product.additionalImages, ...additionalImages];
//       } else {
//         product.additionalImages = [...product.additionalImages, additionalImages];
//       }
//     }
    
//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } catch (error) {
//     console.error('Update product error:', error);
//     res.status(400).json({ message: error.message });
//   }
// };
export const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      shortDescription, 
      specifications, 
      fullDescription, 
      price, 
      features, 
      categoryId, 
      subcategoryId,
      // These fields might come from req.body if not updating files
      existingMainImage,
      existingAdditionalImages
    } = req.body;

    // Find the product first
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Parse JSON fields if they're strings
    let parsedSpecifications = product.specifications;
    let parsedFeatures = product.features;

    try {
      if (specifications) {
        parsedSpecifications = typeof specifications === 'string' 
          ? JSON.parse(specifications) 
          : specifications;
      }
      
      if (features) {
        parsedFeatures = typeof features === 'string' 
          ? JSON.parse(features) 
          : features;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res.status(400).json({ 
        success: false,
        message: "Invalid specifications or features format",
        error: error.message 
      });
    }

    // Update fields
    product.name = name || product.name;
    product.shortDescription = shortDescription || product.shortDescription;
    product.specifications = parsedSpecifications;
    product.fullDescription = fullDescription || product.fullDescription;
    product.price = Number(price) || product.price;
    product.features = parsedFeatures;
    product.categoryId = categoryId || product.categoryId;
    product.subcategoryId = subcategoryId || product.subcategoryId;

    // Handle file uploads
    // Main image - use new file if uploaded, otherwise keep existing or use from body
    if (req.files && req.files['mainImage'] && req.files['mainImage'][0]) {
      product.mainImage = req.files['mainImage'][0].filename;
    } else if (existingMainImage && existingMainImage !== product.mainImage) {
      product.mainImage = existingMainImage;
    }

    // Additional images - combine existing with new uploads
    let updatedAdditionalImages = product.additionalImages || [];
    
    // If we have existing images from the form (when not replacing all)
    if (existingAdditionalImages) {
      if (typeof existingAdditionalImages === 'string') {
        try {
          updatedAdditionalImages = JSON.parse(existingAdditionalImages);
        } catch (e) {
          console.error("Couldn't parse existingAdditionalImages", e);
        }
      } else if (Array.isArray(existingAdditionalImages)) {
        updatedAdditionalImages = existingAdditionalImages;
      }
    }

    // Add any newly uploaded additional images
    if (req.files && req.files['additionalImages']) {
      const newAdditionalImages = req.files['additionalImages'].map(file => file.filename);
      updatedAdditionalImages = [...updatedAdditionalImages, ...newAdditionalImages];
    }

    product.additionalImages = updatedAdditionalImages;

    const updatedProduct = await product.save();
    
    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating product',
      error: error.message 
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Use findByIdAndDelete instead of remove()
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
};