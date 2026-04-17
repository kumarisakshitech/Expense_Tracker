import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Save, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleProfileSave = async () => {
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/user/profile', profileForm);
      if (data.success) {
        const updated = { ...user, name: data.user.name, email: data.user.email };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        setEditProfile(false);
        setMsg({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword.length < 8) {
      setMsg({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/user/password', passForm);
      if (data.success) {
        setShowPassModal(false);
        setPassForm({ currentPassword: '', newPassword: '' });
        setMsg({ type: 'success', text: 'Password changed successfully' });
      } else {
        setMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

      {msg.text && (
        <div className={`p-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
            <span className="text-3xl font-bold text-white">{initials}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-teal-100 text-sm mt-1">{user?.email}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Personal Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" /> Personal Information
              </h3>
              {!editProfile ? (
                <button onClick={() => setEditProfile(true)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium">Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleProfileSave} disabled={loading}
                    className="flex items-center gap-1 text-sm bg-teal-500 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 disabled:opacity-60">
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => { setEditProfile(false); setProfileForm({ name: user?.name, email: user?.email }); }}
                    className="flex items-center gap-1 text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Full Name</label>
                {editProfile ? (
                  <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                ) : (
                  <p className="text-gray-800 font-medium text-sm">{user?.name}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                {editProfile ? (
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                ) : (
                  <p className="text-gray-800 font-medium text-sm">{user?.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-teal-600" /> Security
            </h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <p className="text-xs text-gray-400">••••••••</p>
              </div>
              <button onClick={() => setShowPassModal(true)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium">Change</button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
              <button onClick={() => setShowPassModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} required
                    value={passForm.currentPassword}
                    onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} required
                    value={passForm.newPassword}
                    onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
