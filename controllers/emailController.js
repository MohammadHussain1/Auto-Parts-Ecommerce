const { createProducts, isEmailRegistered } = require('../services/productService');
const { processExcelFile, processCsvFile } = require('../utils/excelProcessor');
const Joi = require('joi');

// Validation schema for products
const productSchema = Joi.object({
  name: Joi.string().required().trim(),
  productCode: Joi.string().required().trim().uppercase(),
  price: Joi.number().positive().required()
});

const emailProducts = async (req, res) => {
  try {
    let sourceEmail, products = [];

    // Check if request contains file (Excel/CSV upload) or JSON data
    if (req && req.file) {
      // Process file upload (Excel or CSV)
      sourceEmail = req.body.sourceEmail || req.query.sourceEmail;
      
      if (!sourceEmail) {
        return res.status(400).json({
          success: false,
          message: 'sourceEmail is required when uploading a file'
        });
      }

      if (!req.file.originalname) {
        return res.status(400).json({
          success: false,
          message: 'File name is required to determine file type'
        });
      }

      let fileExtension = 'unknown';
      try {
        fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file name format'
        });
      }
      
      if (fileExtension === 'csv') {
        products = await processCsvFile(req.file.buffer);
      } else {
        products = processExcelFile(req.file.buffer);
      }
    } else {
      // Process JSON data from request body
      const { sourceEmail: emailFromBody, products: productsFromBody } = req.body;

      if (!emailFromBody || !Array.isArray(productsFromBody) || productsFromBody.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'sourceEmail and products array are required'
        });
      }

      sourceEmail = emailFromBody;
      products = productsFromBody;
    }

    // Check if email is registered
    const isRegistered = await isEmailRegistered(sourceEmail);
    if (!isRegistered) {
      return res.status(403).json({
        success: false,
        message: 'Email not registered. Only registered emails are allowed to submit products.'
      });
    }

    // Validate each product
    for (const product of products) {
      const { error } = productSchema.validate(product);
      if (error) {
        return res.status(400).json({
          success: false,
          message: `Invalid product data: ${error.details[0].message}`
        });
      }
    }

    // Process products
    const insertedProducts = await createProducts(products, sourceEmail);

    res.status(201).json({
      success: true,
      message: `${insertedProducts.length} products successfully ingested from ${sourceEmail}`,
      data: {
        totalReceived: products.length,
        totalProcessed: insertedProducts.length,
        duplicatesFiltered: products.length - insertedProducts.length
      }
    });
  } catch (err) {
    console.error('Error processing email products:', err);
    res.status(500).json({
      success: false,
      message: 'Error processing products'
    });
  }
};

module.exports = {
  emailProducts
};