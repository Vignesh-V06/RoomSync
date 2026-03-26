import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const [formData, setFormData] = useState({
    language: 'English',
    branch: 'Computer Science',
    cgpa_range: '8-9',
    bed_pref: 'lower',
    expected_members: 2,
    sleep_pref: 'Night Owl',
    study_pref: 'Total Silence',
    food_pref: 'Vegetarian',
    cleanliness: 'Moderate'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/profiles/${user.id}`);
        setFormData(data);
      } catch (err) {
        console.log('No profile found, please create one');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profiles', formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/find-rooms'), 1500);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="glass-panel p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent mb-6">Build Your Profile</h1>
        <p className="text-slate-600 mb-8">Tell us about your preferences to find the best roommate match.</p>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.language} 
              onChange={e => setFormData({...formData, language: e.target.value})}
              placeholder="e.g., English, Spanish"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
            <select className="input-field" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CGPA Range</label>
            <select className="input-field" value={formData.cgpa_range} onChange={e => setFormData({...formData, cgpa_range: e.target.value})}>
              <option value="9-10">9-10</option>
              <option value="8-9">8-9</option>
              <option value="7-8">7-8</option>
              <option value="Below 7">Below 7</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bed Preference</label>
            <select className="input-field" value={formData.bed_pref} onChange={e => setFormData({...formData, bed_pref: e.target.value})}>
              <option value="lower">Lower Bed</option>
              <option value="upper">Upper Bed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Members in Room</label>
            <input 
              type="number" 
              min="1" max="4" 
              className="input-field" 
              value={formData.expected_members} 
              onChange={e => setFormData({...formData, expected_members: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sleep Preference</label>
            <select className="input-field" value={formData.sleep_pref} onChange={e => setFormData({...formData, sleep_pref: e.target.value})}>
              <option value="Early Bird">Early Bird</option>
              <option value="Night Owl">Night Owl</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Study Preference</label>
            <select className="input-field" value={formData.study_pref} onChange={e => setFormData({...formData, study_pref: e.target.value})}>
              <option value="Total Silence">Total Silence</option>
              <option value="Background Music">Background Music</option>
              <option value="Group Study">Group Study</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Food Preference</label>
            <select className="input-field" value={formData.food_pref} onChange={e => setFormData({...formData, food_pref: e.target.value})}>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Any">Any</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Cleanliness</label>
            <select className="input-field" value={formData.cleanliness} onChange={e => setFormData({...formData, cleanliness: e.target.value})}>
              <option value="Neat Freak">Neat Freak</option>
              <option value="Moderate">Moderate</option>
              <option value="Messy">Messy</option>
            </select>
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="btn-primary w-full">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
