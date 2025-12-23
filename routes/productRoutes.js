const express = require('express');
const multer = require('multer');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/roleAuth');
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { emailProducts } = require('../controllers/emailController');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow Excel and CSV files
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'text/csv' ||
        file.mimetype === 'application/csv' ||
        fileExtension === 'xlsx' ||
        fileExtension === 'xls' ||
        fileExtension === 'csv') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed!'), false);
    }
  }
});

// Email ingestion route (no authentication required, but email validation is done in controller)
// Supports both JSON data and Excel/CSV file uploads
router.post('/email/products', upload.single('file'), emailProducts);

// Product routes
router.route('/products')
  .post(authenticate, authorizeRoles('Admin'), createProduct)
  .get(authenticate, getProducts);

router.route('/products/:id')
  .get(authenticate, getProduct)
  .put(authenticate, authorizeRoles('Admin'), updateProduct)
  .delete(authenticate, authorizeRoles('Admin', 'Staff'), deleteProduct);

module.exports = router;