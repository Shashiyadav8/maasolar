const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  company: {
    name: { type: String, default: 'MAASOLAR ENERGY SOLUTIONS LLP' },
    address: { type: String, default: '#19-25, CPRI Road, IICT Colony, Near Sub Station, Parvathapur, Hyderabad - 500098, Telangana' },
    phone: { type: String, default: 'M: +91 93982 11836, +91 80191 82249' },
    email: { type: String, default: 'info@maasolar.in' },
    website: { type: String, default: 'www.maasolar.in' },
    gst: { type: String, default: '36ACGPM4129E1ZD' },
    itan: { type: String, default: 'HYDM32416G' },
    llpin: { type: String, default: 'ACU-9243' }
  },
  bank: {
    name: { type: String, default: 'IDFC FIRST' },
    accountNumber: { type: String, default: '82223344959' },
    ifsc: { type: String, default: 'IDFB 0080 242' },
    branch: { type: String, default: 'HYDERABAD - UPPAL BRANCH' }
  },
  footer: {
    registrationOffice: { type: String, default: 'Registration Office:\nPlot No. 12 & 13, door number 203, Alkapur Township, Rajendra Nagar, Ranga Reddy District, Telangana-500089' }
  },
  terms: {
    dcr: { type: String, default: '1. Prices: FOR Hyderabad.\n2. Freight Extra.\n3. Payment Terms: 80% advance and balance 20% upon completion of installation.\n4. DISCOM Feasibility Charges: Rs 2350/-\n5. Govt Subsidy: Rs 78000/-\n6. MNRE Subsidy Application Charges: Rs 1770/-\n7. Warranty: For Panels 30 years, Inverter 8 years and complete system (Solar Power Plant) warranty will be 2 years.\n8. Offer Validity: 30 days' },
    nonDcr: { type: String, default: '1. Prices: FOR Hyderabad.\n2. Freight Extra.\n3. Payment Terms: 80% advance and balance 20% upon completion of installation.\n4. DISCOM Feasibility Charges: Rs 2350/-\n5. Warranty: For Panels 30 years, Inverter 8 years and complete system (Solar Power Plant) warranty will be 2 years.\n6. Offer Validity: 30 days' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
