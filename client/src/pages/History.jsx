import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './History.css';

const History = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await api.get('/quotations');
      setQuotations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/quotations/${id}/duplicate`);
      fetchQuotations();
    } catch (err) {
      console.error('Error duplicating', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await api.delete(`/quotations/${id}`);
        fetchQuotations();
      } catch (err) {
        console.error('Error deleting', err);
      }
    }
  };

  const downloadPDF = async (id, quoteNo) => {
    try {
      const res = await api.get(`/quotations/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${quoteNo}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading PDF', err);
    }
  };

  return (
    <div className="container-main" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Quotation History</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your previously generated quotations.</p>
      </div>

      <div className="history-list">
        {quotations.map(q => (
          <div key={q._id} className="glass-card history-card">
            <div className="history-header">
              <span className="quote-number">{q.quotationNumber}</span>
              <span className={`badge-type ${q.quotationType === 'DCR' ? 'dcr' : 'non-dcr'}`}>
                {q.quotationType}
              </span>
            </div>
            
            <div className="history-body">
              <div className="history-detail">
                <span className="detail-label">Customer</span>
                <span className="detail-value">{q.customer.name}</span>
              </div>
              <div className="history-detail">
                <span className="detail-label">Date</span>
                <span className="detail-value">{new Date(q.date).toLocaleDateString()}</span>
              </div>
              <div className="history-detail">
                <span className="detail-label">Amount</span>
                <span className="detail-value text-accent">₹{q.pricing.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="history-detail">
                <span className="detail-label">Created By</span>
                <span className="detail-value" style={{ color: 'var(--text-secondary)' }}>
                  {q.createdBy ? q.createdBy.name : 'System'}
                </span>
              </div>
            </div>

            <div className="history-actions">
              <button className="btn-action outline" onClick={() => downloadPDF(q._id, q.quotationNumber)}>PDF</button>
              <Link className="btn-action outline" to={`/edit/${q._id}`}>Edit</Link>
              <button className="btn-action outline" onClick={() => handleDuplicate(q._id)}>Copy</button>
              <button className="btn-action danger" onClick={() => handleDelete(q._id)}>Delete</button>
            </div>
          </div>
        ))}

        {quotations.length === 0 && (
          <div className="glass-card text-center" style={{ padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No quotations found. Create one to get started.</p>
            <Link to="/new" className="btn-premium btn-primary" style={{ marginTop: '20px', width: 'auto' }}>Create Quotation</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
