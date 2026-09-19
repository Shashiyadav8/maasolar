const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const Settings = require('../models/Settings');

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount).replace('₹', '');
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

exports.generateQuotationPDF = async (quotation) => {
  const settings = await Settings.findOne() || new Settings();
  
  const typeDir = quotation.quotationType === 'DCR' ? 'dcr' : 'non-dcr';
  const templatePath = path.join(__dirname, '..', 'templates', 'quotations', typeDir, 'quotation.html');
  const cssPath = path.join(__dirname, '..', 'templates', 'quotations', typeDir, 'quotation.css');
  
  let html = await fs.readFile(templatePath, 'utf8');
  const css = await fs.readFile(cssPath, 'utf8');
  
  // Replace css placeholder
  html = html.replace('<!-- CSS_PLACEHOLDER -->', `<style>${css}</style>`);
  
  // Read Logo and Seal
  const logoPath = path.join(__dirname, '..', 'assets', 'logo.jpeg');
  const sealPath = path.join(__dirname, '..', 'assets', 'maa-solar-seal.png');
  
  let logoBase64 = '';
  let sealBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent 1x1 gif fallback
  
  try {
    const logoData = await fs.readFile(logoPath);
    logoBase64 = 'data:image/jpeg;base64,' + logoData.toString('base64');
  } catch(e) {
    console.error('Logo not found:', e.message);
  }

  try {
    const sealData = await fs.readFile(sealPath);
    // Determine mime type from extension, defaulting to png
    const sealExt = path.extname(sealPath).toLowerCase();
    const mimeType = sealExt === '.jpg' || sealExt === '.jpeg' ? 'image/jpeg' : 'image/png';
    sealBase64 = `data:${mimeType};base64,` + sealData.toString('base64');
  } catch(e) {
    console.error('Seal not found:', e.message);
  }

  
  // Inject values
  const data = {
    '{{LOGO_SRC}}': logoBase64,
    '{{SEAL_SRC}}': sealBase64,
    '{{COMPANY_NAME}}': settings.company.name,
    '{{COMPANY_ADDRESS}}': settings.company.address,
    '{{COMPANY_PHONE}}': settings.company.phone,
    '{{COMPANY_EMAIL}}': settings.company.email,
    '{{COMPANY_WEBSITE}}': settings.company.website,
    '{{COMPANY_GST}}': settings.company.gst,
    '{{COMPANY_ITAN}}': settings.company.itan,
    '{{COMPANY_LLPIN}}': settings.company.llpin,
    
    '{{QUOTE_NO}}': quotation.quotationNumber,
    '{{DATE}}': formatDate(quotation.date),
    
    '{{CUSTOMER_NAME}}': quotation.customer.name,
    
    '{{SYSTEM_CAPACITY}}': quotation.solar.capacity,
    '{{CAPACITY_UNIT}}': quotation.solar.capacityUnit,
    '{{DCR_TYPE_TEXT}}': quotation.quotationType === 'DCR' ? 'DCR Approved Rooftop Solar Power Plant' : 'NON DCR Approved Rooftop Solar Power Plant',
    
    '{{QTY}}': quotation.solar.quantity,
    '{{RATE}}': formatCurrency(quotation.pricing.amount),
    '{{TAXABLE}}': formatCurrency(quotation.pricing.amount),
    '{{GST_PERCENT}}': quotation.pricing.gstPercentage + '%',
    '{{GST_AMOUNT}}': quotation.pricing.gstAmount,
    '{{AMOUNT}}': formatCurrency(quotation.pricing.amount),
    '{{GRAND_TOTAL}}': formatCurrency(quotation.pricing.total),
    
    '{{DESCRIPTION}}': quotation.solar.description || `${quotation.solar.capacity}${quotation.solar.capacityUnit} On-Grid Solar Power Plant with ${quotation.solar.panelWattage}Wp (or Above) ${quotation.quotationType === 'DCR' ? 'DCR' : 'NON-Dcr'} Solar Panels, On-Grid Inverter, AC & DC Distribution Boxes, Mounting Structure, Polycab Cables, Earthing Kit, Lightning Arrestor, Installation & Commissioning`,
    
    '{{BANK_NAME}}': settings.bank.name,
    '{{BANK_ACCOUNT}}': settings.bank.accountNumber,
    '{{BANK_IFSC}}': settings.bank.ifsc,
    '{{BANK_BRANCH}}': settings.bank.branch,
    
    '{{SPECIAL_PRICE_NOTE}}': quotation.notes.specialPriceNote || quotation.customer.name,
    '{{SUBMITTED_BY}}': quotation.notes.submittedBy,
    '{{PHONE_NOTE}}': quotation.notes.phone ? `Phone: ${quotation.notes.phone}<br>` : '',
    '{{EMAIL_NOTE}}': quotation.notes.email ? `Email: <a href="mailto:${quotation.notes.email}">${quotation.notes.email}</a>` : '',
    
    '{{REGISTRATION_OFFICE}}': settings.footer.registrationOffice.replace(/\n/g, '<br>')
  };
  
  // Format terms list
  const termsText = quotation.quotationType === 'DCR' ? settings.terms.dcr : settings.terms.nonDcr;
  const termsHtml = termsText.split('\n').map(t => `<div>${t}</div>`).join('');
  data['{{TERMS_CONDITIONS}}'] = termsHtml;
  
  for (const [key, value] of Object.entries(data)) {
    html = html.split(key).join(value);
  }
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  });
  
  await browser.close();
  return pdfBuffer;
};
