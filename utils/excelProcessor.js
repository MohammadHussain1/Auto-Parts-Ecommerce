const XLSX = require('xlsx');
const csv = require('csv-parser');
const { Readable } = require('stream');

const processExcelFile = (buffer) => {
  try {
    // Read the Excel file from buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Validate and transform the data to match our product structure
    const products = jsonData
      .map((row, index) => {
        // Handle different possible column names for better flexibility
        const name = row.name || row.Name || row.productName || row['Product Name'] || row['Product name'] || row['product name'];
        const productCode = row.productCode || row['Product Code'] || row['Product code'] || row['product code'] || row.code || row.Code;
        const price = row.price || row.Price || row['Unit Price'] || row['unit price'] || row['Unit price'];
        
        // Only create product object if all required fields exist
        if (name && productCode && price !== undefined && price !== null) {
          return {
            name: String(name).trim(),
            productCode: String(productCode).trim(),
            price: parseFloat(price)
          };
        }
        return null; // Skip rows with missing data
      })
      .filter(product => product !== null); // Remove null entries
    
    // Validate required fields are present
    if (products.length > 0) {
      const requiredFields = ['name', 'productCode', 'price'];
      for (const product of products) {
        for (const field of requiredFields) {
          if (!product[field]) {
            throw new Error(`Missing required field '${field}' in row data`);
          }
        }
        
        // Validate field types
        if (typeof product.name !== 'string' || typeof product.productCode !== 'string') {
          throw new Error(`Invalid data type for name or productCode. Expected strings.`);
        }
        
        // Validate price is a number
        if (isNaN(product.price) || product.price <= 0) {
          throw new Error(`Invalid price value: ${product.price}. Price must be a positive number.`);
        }
      }
    }
    
    return products;
  } catch (error) {
    throw new Error(`Error processing Excel file: ${error.message}`);
  }
};

const processCsvFile = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const readableStream = Readable.from(buffer);

    readableStream
      .pipe(csv())
      .on('data', (row) => {
        // Handle different possible column names for better flexibility
        const name = row.name || row.Name || row.productName || row['Product Name'] || row['Product name'] || row['product name'];
        const productCode = row.productCode || row['Product Code'] || row['Product code'] || row['product code'] || row.code || row.Code;
        const price = row.price || row.Price || row['Unit Price'] || row['unit price'] || row['Unit price'];
        
        // Only add to results if all required fields exist
        if (name && productCode && price !== undefined && price !== null) {
          results.push({
            name: String(name).trim(),
            productCode: String(productCode).trim(),
            price: parseFloat(price)
          });
        }
      })
      .on('end', () => {
        // Validate required fields are present
        if (results.length > 0) {
          const requiredFields = ['name', 'productCode', 'price'];
          for (const product of results) {
            for (const field of requiredFields) {
              if (!product[field]) {
                return reject(new Error(`Missing required field '${field}' in row data`));
              }
            }
            
            // Validate field types
            if (typeof product.name !== 'string' || typeof product.productCode !== 'string') {
              return reject(new Error(`Invalid data type for name or productCode. Expected strings.`));
            }
            
            // Validate price is a number
            if (isNaN(product.price) || product.price <= 0) {
              return reject(new Error(`Invalid price value: ${product.price}. Price must be a positive number.`));
            }
          }
        }
        
        resolve(results);
      })
      .on('error', (error) => {
        reject(new Error(`Error processing CSV file: ${error.message}`));
      });
  });
};

module.exports = { processExcelFile, processCsvFile };