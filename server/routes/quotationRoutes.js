const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, quotationController.createQuotation);
router.get('/', protect, quotationController.getQuotations);
router.get('/:id', protect, quotationController.getQuotationById);
router.put('/:id', protect, quotationController.updateQuotation);
router.delete('/:id', protect, quotationController.deleteQuotation);
router.post('/:id/duplicate', protect, quotationController.duplicateQuotation);
router.get('/:id/pdf', protect, quotationController.generatePDF);

module.exports = router;
