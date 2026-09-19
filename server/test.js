const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/maasolar').then(async () => {
  const Quotation = require('./models/Quotation');
  const req = { body: { quotationType: 'DCR', date: '2026-09-19', customer: { name: 'Test' }, solar: { capacity: 5 }, pricing: { amount: 1000, total: 1000 } } };
  
  const lastQuotation = await Quotation.findOne().sort({ createdAt: -1 });
  let nextNum = 132;
  if (lastQuotation && lastQuotation.quotationNumber) {
    const match = lastQuotation.quotationNumber.match(/(\d+)$/);
    if (match) {
      nextNum = parseInt(match[1]) + 1;
    }
  }
  const currentYear = new Date().getFullYear();
  const nextYearStr = (currentYear + 1).toString().slice(-2);
  const prefix = `QUOTE/${currentYear.toString().slice(-2)}-${nextYearStr}/MSES/`;
  
  req.body.quotationNumber = prefix + nextNum;
  
  console.log('Body is:', req.body);
  
  try {
    const quotation = new Quotation(req.body);
    await quotation.save();
    console.log('Success!', quotation.quotationNumber);
  } catch (err) {
    console.log('Error:', err.message);
  }
  process.exit(0);
});
