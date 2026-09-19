import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const QuotationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  
  const [formData, setFormData] = useState({
    quotationType: 'DCR',
    date: new Date().toISOString().split('T')[0],
    customer: { name: '', companyName: '', address: '', mobile: '', email: '', gstin: '' },
    solar: { capacity: '', capacityUnit: 'KW', panelWattage: 530, quantity: '1set', description: '' },
    pricing: { amount: '', gstPercentage: 0, gstAmount: 'Included' },
    notes: { specialPriceNote: '', submittedBy: 'Maasolar Energy Solutions', phone: '8019182249', email: 'info@maasolar.in' }
  });

  useEffect(() => {
    if (id) {
      api.get(`/quotations/${id}`).then(res => {
        const data = res.data;
        data.date = data.date.split('T')[0];
        setFormData(data);
        setCurrentQuotation(data);
      });
    }
  }, [id]);

  const handleChange = (e, section, field) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: value
      });
    }
  };

  const handleGeneratePreview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        pricing: {
          ...formData.pricing,
          total: formData.pricing.amount
        }
      };
      
      let res;
      if (id) {
        res = await api.put(`/quotations/${id}`, payload);
      } else {
        res = await api.post('/quotations', payload);
      }
      
      const savedQuotation = res.data;
      setCurrentQuotation(savedQuotation);
      
      const pdfRes = await api.get(`/quotations/${savedQuotation._id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([pdfRes.data], { type: 'application/pdf' }));
      
      setPreviewUrl(url);
    } catch (err) {
      alert('Error generating quotation');
      console.error(err);
    }
    setLoading(false);
  };

  const handleShareWhatsApp = async () => {
    if (!previewUrl || !currentQuotation) return;
    
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `${currentQuotation.quotationNumber}.pdf`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Quotation ${currentQuotation.quotationNumber}`,
          text: `Here is the quotation for ${currentQuotation.customer.name}`,
          files: [file]
        });
      } else {
        alert("Direct file sharing is not supported on this browser. The file will be downloaded.");
        const link = document.createElement('a');
        link.href = previewUrl;
        link.setAttribute('download', `${currentQuotation.quotationNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error('Error sharing', error);
      alert('Failed to share the document.');
    }
  };

  if (previewUrl) {
    return (
      <div className="container-main" style={{ maxWidth: '1000px', paddingBottom: '20px' }}>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Quotation Preview</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-premium btn-secondary" onClick={() => setPreviewUrl(null)} style={{ padding: '8px 16px', width: 'auto' }}>
                Back to Edit
              </button>
              <button className="btn-premium btn-primary" onClick={handleShareWhatsApp} style={{ padding: '8px 16px', width: 'auto' }}>
                Share PDF
              </button>
            </div>
          </div>
          <div className="preview-container">
            <iframe src={previewUrl} title="PDF Preview"></iframe>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleGeneratePreview} className="container-main">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
          {id ? 'Edit Quotation' : 'New Quotation'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill in the details below to generate a professional PDF.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Quotation Details</h3>
        
        <div className="premium-input-group">
          <label>Quotation Type</label>
          <div className="segmented-control">
            <input type="radio" name="quotationType" id="typeDCR" value="DCR" checked={formData.quotationType === 'DCR'} onChange={(e) => handleChange(e, null, null)} />
            <label htmlFor="typeDCR">DCR</label>

            <input type="radio" name="quotationType" id="typeNONDCR" value="NON-DCR" checked={formData.quotationType === 'NON-DCR'} onChange={(e) => handleChange(e, null, null)} />
            <label htmlFor="typeNONDCR">NON-DCR</label>
          </div>
        </div>

        {id && (
          <div className="premium-input-group">
            <label>Quote Number (Auto-generated)</label>
            <input type="text" className="premium-input" value={formData.quotationNumber || ''} readOnly style={{ opacity: 0.7 }} />
          </div>
        )}

        <div className="premium-input-group" style={{ marginBottom: 0 }}>
          <label>Date</label>
          <input type="date" className="premium-input" name="date" value={formData.date} onChange={(e) => handleChange(e, null, null)} required />
        </div>
      </div>
      
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Customer Information</h3>
        
        <div className="premium-input-group">
          <input type="text" className="premium-input" placeholder="Customer Name *" value={formData.customer.name} onChange={(e) => handleChange(e, 'customer', 'name')} required />
        </div>
        <div className="premium-input-group">
          <input type="text" className="premium-input" placeholder="Company Name (Optional)" value={formData.customer.companyName} onChange={(e) => handleChange(e, 'customer', 'companyName')} />
        </div>
        <div className="premium-input-group">
          <textarea className="premium-input" placeholder="Full Address" value={formData.customer.address} onChange={(e) => handleChange(e, 'customer', 'address')} style={{ minHeight: '80px' }}></textarea>
        </div>
        <div className="flex-row">
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <input type="text" className="premium-input" placeholder="Mobile Number" value={formData.customer.mobile} onChange={(e) => handleChange(e, 'customer', 'mobile')} />
          </div>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <input type="email" className="premium-input" placeholder="Email Address" value={formData.customer.email} onChange={(e) => handleChange(e, 'customer', 'email')} />
          </div>
        </div>
        <div className="premium-input-group" style={{ marginTop: '20px', marginBottom: 0 }}>
          <input type="text" className="premium-input" placeholder="GSTIN (Optional)" value={formData.customer.gstin} onChange={(e) => handleChange(e, 'customer', 'gstin')} />
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Solar System Details</h3>
        
        <div className="flex-row" style={{ marginBottom: '20px' }}>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>Capacity</label>
            <input type="number" className="premium-input" placeholder="e.g. 5" value={formData.solar.capacity} onChange={(e) => handleChange(e, 'solar', 'capacity')} required />
          </div>
          <div className="premium-input-group" style={{ width: '100px', marginBottom: 0 }}>
            <label>Unit</label>
            <select className="premium-input" value={formData.solar.capacityUnit} onChange={(e) => handleChange(e, 'solar', 'capacityUnit')} style={{ padding: '11px' }}>
              <option value="KW">KW</option>
              <option value="MW">MW</option>
            </select>
          </div>
        </div>

        <div className="flex-row">
          <div className="premium-input-group flex-1">
            <input type="number" className="premium-input" placeholder="Panel Wattage (e.g. 530)" value={formData.solar.panelWattage} onChange={(e) => handleChange(e, 'solar', 'panelWattage')} />
          </div>
          <div className="premium-input-group flex-1">
            <input type="text" className="premium-input" placeholder="Quantity (e.g. 1set)" value={formData.solar.quantity} onChange={(e) => handleChange(e, 'solar', 'quantity')} />
          </div>
        </div>

        <div className="premium-input-group" style={{ marginBottom: 0 }}>
          <textarea className="premium-input" placeholder="Custom System Description (Optional)" value={formData.solar.description} onChange={(e) => handleChange(e, 'solar', 'description')} style={{ minHeight: '80px' }}></textarea>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Pricing</h3>
        
        <div className="premium-input-group">
          <label>Total Amount (₹)</label>
          <input type="number" className="premium-input" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-primary)' }} placeholder="0.00" value={formData.pricing.amount} onChange={(e) => handleChange(e, 'pricing', 'amount')} required />
        </div>
        
        <div className="flex-row">
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>GST %</label>
            <input type="number" className="premium-input" placeholder="0" value={formData.pricing.gstPercentage} onChange={(e) => handleChange(e, 'pricing', 'gstPercentage')} />
          </div>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>GST Amount Text</label>
            <input type="text" className="premium-input" placeholder="e.g. Included" value={formData.pricing.gstAmount} onChange={(e) => handleChange(e, 'pricing', 'gstAmount')} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Additional Notes</h3>
        
        <div className="premium-input-group">
          <label>Special Price Note Overwrite</label>
          <input type="text" className="premium-input" placeholder={`Defaults to: ${formData.customer.name || 'Customer Name'}`} value={formData.notes.specialPriceNote} onChange={(e) => handleChange(e, 'notes', 'specialPriceNote')} />
        </div>
        <div className="premium-input-group">
          <label>Submitted By</label>
          <input type="text" className="premium-input" placeholder="Maasolar Energy Solutions" value={formData.notes.submittedBy} onChange={(e) => handleChange(e, 'notes', 'submittedBy')} />
        </div>
        <div className="flex-row">
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>Contact Phone</label>
            <input type="text" className="premium-input" placeholder="8019182249" value={formData.notes.phone} onChange={(e) => handleChange(e, 'notes', 'phone')} />
          </div>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>Contact Email</label>
            <input type="email" className="premium-input" placeholder="info@maasolar.in" value={formData.notes.email} onChange={(e) => handleChange(e, 'notes', 'email')} />
          </div>
        </div>
      </div>

      <div className="mobile-action-bar">
        <button type="submit" className="btn-premium btn-primary" disabled={loading}>
          {loading ? 'GENERATING PDF...' : 'PREVIEW QUOTATION'}
        </button>
      </div>
    </form>
  );
};

export default QuotationForm;
