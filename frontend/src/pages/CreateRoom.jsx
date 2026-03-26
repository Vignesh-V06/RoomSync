import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    room_type: '2-sharing',
    bed_type: 'Normal Bed',
    total_capacity: 2,
    additional_requirements: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        additional_requirements: `Bed Type: ${formData.bed_type}. ${formData.additional_requirements}`
      };
      await api.post('/rooms', payload);
      setMessage('Room created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="glass-panel p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent mb-6">Create a Room</h1>
        <p className="text-slate-600 mb-8">List your room so other compatible students can apply to be your roommate.</p>
        
        {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-sm">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hostel Block</label>
            <input 
              type="text" 
              required
              className="input-field" 
              value={formData.block} 
              onChange={e => setFormData({...formData, block: e.target.value})}
              placeholder="e.g. Block A, Block B"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Type</label>
              <select className="input-field" value={formData.room_type} onChange={e => setFormData({...formData, room_type: e.target.value})}>
                <option value="1-sharing">1-sharing</option>
                <option value="2-sharing">2-sharing</option>
                <option value="3-sharing">3-sharing</option>
                <option value="4-sharing">4-sharing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bed Type</label>
              <select className="input-field" value={formData.bed_type} onChange={e => setFormData({...formData, bed_type: e.target.value})}>
                <option value="Normal Bed">Normal Bed</option>
                <option value="Bunk Bed">Bunk Bed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Capacity</label>
              <input 
                type="number" 
                min="1" max="4" 
                required
                className="input-field" 
                value={formData.total_capacity} 
                onChange={e => setFormData({...formData, total_capacity: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Requirements (Optional)</label>
            <textarea 
              className="input-field min-h-[100px]" 
              value={formData.additional_requirements} 
              onChange={e => setFormData({...formData, additional_requirements: e.target.value})}
              placeholder="Any specific preferences you have for a roommate..."
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">List Your Room</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
