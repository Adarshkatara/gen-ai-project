import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const FeedbackPanel = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!subject || !feedback) return;
    
    try {
      setStatus('loading');
      await axios.post('/api/dashboard/feedback', { subject, feedback });
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Academic Feedback</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
             <X size={20} className="text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={submitFeedback} className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
              <h4 className="font-bold text-slate-800">Feedback Submitted</h4>
              <p className="text-sm text-slate-500 mt-2">Thank you for your valuable input.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Subject / Module</label>
                 <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Data Structures (CS201)" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Your Feedback</label>
                 <textarea value={feedback} onChange={e => setFeedback(e.target.value)} required rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Please provide constructive feedback..."></textarea>
              </div>
              <button disabled={status === 'loading'} className="w-full btn-primary py-3 disabled:opacity-70">
                 {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackPanel;
