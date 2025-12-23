const Product = require('../models/Product');
const User = require('../models/User');

// Service to handle duplicate filtering and product creation
const createProducts = async (products, sourceEmail) => {
  // Get all existing product codes to filter duplicates
  const existingProducts = await Product.find({}, 'productCode name');
  const existingCodes = new Set(existingProducts.map(p => {
    return p.productCode ? p.productCode.toUpperCase() : '';
  }));
  const existingNames = new Set(existingProducts.map(p => {
    return p.name ? p.name.toLowerCase() : '';
  }));

  // Filter out duplicates and invalid products
  const filteredProducts = products.filter(product => {
    // Check if product has required fields
    if (!product || !product.name || !product.productCode || typeof product.name !== 'string' || typeof product.productCode !== 'string') {
      return false; // Skip invalid products
    }
    
    const productCode = product.productCode.toUpperCase();
    const productName = product.name.toLowerCase();
    
    const codeExists = existingCodes.has(productCode);
    const nameExists = existingNames.has(productName);
    return !codeExists && !nameExists;
  });

  // Prepare products with sourceEmail
  const productsToInsert = filteredProducts.map(product => ({
    ...product,
    productCode: product.productCode.toUpperCase(),
    sourceEmail
  }));

  // Insert products in bulk
  if (productsToInsert.length > 0) {
    try {
      const insertedProducts = await Product.insertMany(productsToInsert);
      return insertedProducts;
    } catch (err) {
      // Handle duplicate key errors
      if (err.code === 11000) {
        const successfulInsertions = [];
        for (const product of productsToInsert) {
          try {
            const insertedProduct = await Product.create(product);
            successfulInsertions.push(insertedProduct);
          } catch (indivError) {
            if (indivError.code !== 11000) {
              console.error('Error inserting product:', indivError);
            }
            // Skip duplicate products
          }
        }
        return successfulInsertions;
      }
      throw err;
    }
  }

  return [];
};

// Service to check if email is registered
const isEmailRegistered = async (email) => {
  if (!email) {
    return false;
  }
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
  return !!user;
};

// Service to create a single product
const createSingleProduct = async (productData, sourceEmail) => {
  // Check if product code or name already exists
  if (!productData || !productData.name || !productData.productCode) {
    throw new Error('Product name and productCode are required');
  }
  
  const existingProduct = await Product.findOne({
    $or: [
      { productCode: productData.productCode.toUpperCase() },
      { name: productData.name.toLowerCase() }
    ]
  });

  if (existingProduct) {
    throw new Error('Product with this code or name already exists');
  }

  const product = new Product({
    ...productData,
    productCode: productData.productCode.toUpperCase(),
    sourceEmail
  });

  return await product.save();
};

// Service to get all products
const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Product.countDocuments();
  
  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  };
};

// Service to get product by ID
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Service to update product by ID
const updateProductById = async (id, updateData) => {
  // Check for duplicate name or productCode (excluding current product)
  if (!updateData || !updateData.name || !updateData.productCode) {
    throw new Error('Product name and productCode are required');
  }
  
  const existingProduct = await Product.findOne({
    $and: [
      { _id: { $ne: id } },
      {
        $or: [
          { productCode: updateData.productCode.toUpperCase() },
          { name: updateData.name.toLowerCase() }
        ]
      }
    ]
  });

  if (existingProduct) {
    throw new Error('Product with this code or name already exists');
  }

  return await Product.findByIdAndUpdate(
    id,
    { 
      ...updateData,
      productCode: updateData.productCode.toUpperCase() 
    },
    { new: true, runValidators: true }
  );
};

// Service to delete product by ID
const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProducts,
  isEmailRegistered,
  createSingleProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
};