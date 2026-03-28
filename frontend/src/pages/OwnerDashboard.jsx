import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const OwnerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchRequests();
  }, [user.id]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/rooms/requests/${user.id}`);
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await api.post(`/rooms/requests/${action}`, { request_id: requestId });
      fetchRequests(); // Refresh list after action
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} request`);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your board...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-4">
      <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Owner Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage incoming applications for your rooms.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 rounded-lg text-primary font-semibold border border-indigo-100">
          {requests.length} Pending {requests.length === 1 ? 'Request' : 'Requests'}
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : requests.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No pending applications</h3>
          <p className="text-slate-500">When students apply to your room, their requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.request_id} className="glass-panel flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="p-6 md:w-1/3 bg-slate-50/50 border-r border-slate-100 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applicant</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{req.applicant_name}</h3>
                  <a href={`mailto:${req.applicant_email}`} className="text-sm text-primary dark:text-indigo-400 hover:underline">{req.applicant_email}</a>
                </div>
                <div className="p-3 bg-white dark:bg-slate-700/50 rounded shadow-sm border border-slate-100 dark:border-slate-600 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Applying for</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{req.block} <span className="font-normal text-slate-500 dark:text-slate-400">• {req.room_type}</span></p>
                </div>
                <Link to="/chat" className="w-full inline-block text-center text-sm font-semibold text-primary dark:text-indigo-400 hover:text-indigo-600 border border-primary/20 dark:border-indigo-500/30 rounded py-2 bg-indigo-50/50 dark:bg-indigo-900/20">
                  💬 Go to Chat Dashboard
                </Link>
              </div>
              
              <div className="p-6 md:w-2/3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Applicant Profile Details</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-6">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Language</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{req.language || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Branch</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{req.branch || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">CGPA Range</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{req.cgpa_range || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Sleep Preference</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{req.sleep_pref || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Study Environment</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{req.study_pref || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Food Preference</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{req.food_pref || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex gap-4 border-t border-slate-100 pt-5">
                  <button 
                    onClick={() => handleAction(req.request_id, 'accept')}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg shadow shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    Accept Application
                  </button>
                  <button 
                    onClick={() => handleAction(req.request_id, 'reject')}
                    className="flex-1 py-2.5 px-4 bg-white text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
