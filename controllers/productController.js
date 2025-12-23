const { 
  createSingleProduct, 
  getAllProducts, 
  getProductById, 
  updateProductById, 
  deleteProductById 
} = require('../services/productService');
const Joi = require('joi');

// Validation schema for single product
const productSchema = Joi.object({
  name: Joi.string().required().trim(),
  productCode: Joi.string().required().trim().uppercase(),
  price: Joi.number().positive().required()
});

// Create single product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Use the authenticated user's email as sourceEmail
    const product = await createSingleProduct(value, req.user.email);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Get all products (Admin + Staff)
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getAllProducts(parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Get product by ID (Admin + Staff)
const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Update product by ID (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const product = await updateProductById(req.params.id, value);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Delete product by ID (Admin + Staff)
const deleteProduct = async (req, res) => {
  try {
    const product = await deleteProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};