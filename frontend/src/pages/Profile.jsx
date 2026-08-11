import { User, Mail, Calendar, Hash, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { useRef, useState } from 'react';
import { authService } from '../services/authService';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={17} className="text-slate-500" />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await authService.uploadProfilePicture(formData);
      updateUser(response.data.data.user);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload picture. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';
    
  const getImageUrl = (path) => {
    if (!path) return null;
    return `http://localhost:5000${path}`;
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your account information</p>
      </div>

      <div className="card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center overflow-hidden border border-slate-200">
              {user?.profilePicture ? (
                <img 
                  src={getImageUrl(user.profilePicture)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-700">{initials}</span>
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-colors disabled:opacity-50"
              title="Upload Profile Picture"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Info rows */}
        <div>
          <InfoRow icon={Hash} label="User ID" value={user?.id || '—'} />
          <InfoRow icon={User} label="Full Name" value={user?.fullName || '—'} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email || '—'} />
          <InfoRow
            icon={Calendar}
            label="Member Since"
            value={user?.createdAt ? formatDate(user.createdAt) : '—'}
          />
        </div>
      </div>

      {/* Account note */}
      <div className="card p-4 bg-primary-50 border-primary-100">
        <p className="text-xs text-primary-700 font-medium">
          🔒 Your data is private and only accessible to you. All transactions and categories are securely isolated to your account.
        </p>
      </div>
    </div>
  );
};

export default Profile;
