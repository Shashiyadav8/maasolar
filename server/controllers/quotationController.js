const Quotation = require('../models/Quotation');
const { generateQuotationPDF } = require('../services/pdfService');

exports.createQuotation = async (req, res, next) => {
  try {
    // Auto-generate quotation number
    const lastQuotation = await Quotation.findOne().sort({ createdAt: -1 });
    let nextNum = 132; // Default starting number
    if (lastQuotation && lastQuotation.quotationNumber) {
      // Extract number specifically after MSES/ to avoid issues with -COPY suffixes
      const match = lastQuotation.quotationNumber.match(/MSES\/(\d+)/);
      if (match) {
        nextNum = parseInt(match[1]) + 1;
      }
    }
    const currentYear = new Date().getFullYear();
    const nextYearStr = (currentYear + 1).toString().slice(-2);
    const prefix = `QUOTE/${currentYear.toString().slice(-2)}-${nextYearStr}/MSES/`;
    
    req.body.quotationNumber = prefix + nextNum;
    
    // Set createdBy from authenticated user
    if (req.user) {
      req.body.createdBy = req.user._id;
    }

    const quotation = new Quotation(req.body);
    await quotation.save();
    res.status(201).json(quotation);
  } catch (err) {
    next(err);
  }
};

exports.getQuotations = async (req, res, next) => {
  try {
    const quotations = await Quotation.find()
      .populate('createdBy', 'name username role')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    next(err);
  }
};

exports.getQuotationById = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('createdBy', 'name username role');
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    next(err);
  }
};

exports.updateQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json({ message: 'Quotation deleted' });
  } catch (err) {
    next(err);
  }
};

exports.duplicateQuotation = async (req, res, next) => {
  try {
    const original = await Quotation.findById(req.params.id);
    if (!original) return res.status(404).json({ error: 'Quotation not found' });
    
    const duplicateData = original.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    
    // Set a dummy duplicate number, client should ideally provide one or it auto-generates
    duplicateData.quotationNumber = `${duplicateData.quotationNumber}-COPY`;
    
    if (req.user) {
      duplicateData.createdBy = req.user._id;
    }
    
    const duplicate = new Quotation(duplicateData);
    await duplicate.save();
    res.status(201).json(duplicate);
  } catch (err) {
    next(err);
  }
};

exports.generatePDF = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    
    const pdfBuffer = await generateQuotationPDF(quotation);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${quotation.quotationNumber}.pdf"`
    });
    
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};
