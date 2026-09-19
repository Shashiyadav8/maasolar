import React, { useState, useEffect } from 'react';
import api from '../api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    company: { name: '', address: '', phone: '', email: '', website: '', gst: '', itan: '', llpin: '' },
    bank: { name: '', accountNumber: '', ifsc: '', branch: '' },
    footer: { registrationOffice: '' },
    terms: { dcr: '', nonDcr: '' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, section, field) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: e.target.value
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="container-main" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Company Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure default values for all generated quotations.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Company Details</h3>
        
        <div className="premium-input-group">
          <label>Company Name</label>
          <input type="text" className="premium-input" value={settings.company.name || ''} onChange={(e) => handleChange(e, 'company', 'name')} />
        </div>
        
        <div className="premium-input-group">
          <label>Address</label>
          <textarea className="premium-input" rows="2" value={settings.company.address || ''} onChange={(e) => handleChange(e, 'company', 'address')}></textarea>
        </div>
        
        <div className="flex-row">
          <div className="premium-input-group flex-1">
            <label>Phone / Contact</label>
            <input type="text" className="premium-input" value={settings.company.phone || ''} onChange={(e) => handleChange(e, 'company', 'phone')} />
          </div>
          <div className="premium-input-group flex-1">
            <label>Email</label>
            <input type="email" className="premium-input" value={settings.company.email || ''} onChange={(e) => handleChange(e, 'company', 'email')} />
          </div>
        </div>
        
        <div className="premium-input-group">
          <label>Website</label>
          <input type="text" className="premium-input" value={settings.company.website || ''} onChange={(e) => handleChange(e, 'company', 'website')} />
        </div>
        
        <div className="flex-row">
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>GST</label>
            <input type="text" className="premium-input" value={settings.company.gst || ''} onChange={(e) => handleChange(e, 'company', 'gst')} />
          </div>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>ITAN</label>
            <input type="text" className="premium-input" value={settings.company.itan || ''} onChange={(e) => handleChange(e, 'company', 'itan')} />
          </div>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>LLPIN</label>
            <input type="text" className="premium-input" value={settings.company.llpin || ''} onChange={(e) => handleChange(e, 'company', 'llpin')} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Bank Details</h3>
        
        <div className="flex-row">
          <div className="premium-input-group flex-1">
            <label>Bank Name</label>
            <input type="text" className="premium-input" value={settings.bank.name || ''} onChange={(e) => handleChange(e, 'bank', 'name')} />
          </div>
          <div className="premium-input-group flex-1">
            <label>Account Number</label>
            <input type="text" className="premium-input" value={settings.bank.accountNumber || ''} onChange={(e) => handleChange(e, 'bank', 'accountNumber')} />
          </div>
        </div>
        
        <div className="flex-row">
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>IFSC Code</label>
            <input type="text" className="premium-input" value={settings.bank.ifsc || ''} onChange={(e) => handleChange(e, 'bank', 'ifsc')} />
          </div>
          <div className="premium-input-group flex-1" style={{ marginBottom: 0 }}>
            <label>Branch Name</label>
            <input type="text" className="premium-input" value={settings.bank.branch || ''} onChange={(e) => handleChange(e, 'bank', 'branch')} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Terms & Conditions</h3>
        
        <div className="premium-input-group">
          <label>DCR Terms (One point per line)</label>
          <textarea className="premium-input" rows="8" value={settings.terms.dcr || ''} onChange={(e) => handleChange(e, 'terms', 'dcr')} style={{ minHeight: '150px' }}></textarea>
        </div>
        
        <div className="premium-input-group" style={{ marginBottom: 0 }}>
          <label>Non-DCR Terms (One point per line)</label>
          <textarea className="premium-input" rows="8" value={settings.terms.nonDcr || ''} onChange={(e) => handleChange(e, 'terms', 'nonDcr')} style={{ minHeight: '150px' }}></textarea>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Footer Settings</h3>
        
        <div className="premium-input-group" style={{ marginBottom: 0 }}>
          <label>Registration Office Details</label>
          <textarea className="premium-input" rows="3" value={settings.footer.registrationOffice || ''} onChange={(e) => handleChange(e, 'footer', 'registrationOffice')} style={{ minHeight: '80px' }}></textarea>
        </div>
      </div>

      <div className="mobile-action-bar">
        <button type="submit" className="btn-premium btn-primary" disabled={loading}>
          {loading ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>
    </form>
  );
};

export default Settings;
