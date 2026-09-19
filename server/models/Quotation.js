const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, required: true, unique: true },
  quotationType: { type: String, enum: ['DCR', 'NON-DCR'], required: true },
  date: { type: Date, required: true },
  
  customer: {
    name: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    mobile: { type: String },
    email: { type: String },
    gstin: { type: String }
  },

  solar: {
    capacity: { type: Number, required: true },
    capacityUnit: { type: String, default: 'KW' },
    panelWattage: { type: Number, default: 530 },
    quantity: { type: String, default: '1set' },
    description: { type: String }
  },

  pricing: {
    amount: { type: Number, required: true },
    gstPercentage: { type: Number, default: 0 },
    gstAmount: { type: String, default: 'Included' },
    total: { type: Number, required: true }
  },

  notes: {
    specialPriceNote: { type: String, default: '' },
    submittedBy: { type: String, default: 'Maasolar Energy Solutions' },
    phone: { type: String, default: '8019182249' },
    email: { type: String, default: 'info@maasolar.in' }
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional temporarily so old data doesn't break, will be required for new ones
  }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
