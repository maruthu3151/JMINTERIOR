import React, { useState } from 'react';
import { ShieldCheck, KeyRound, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateAdminUsername, updateAdminPassword } from '../../services/authService';
import { Button } from '../../components/ui/Button';

export const AdminSecurityPage: React.FC = () => {
  const { adminProfile, refreshProfile } = useAuth();
  const toast = useToast();

  // Username form
  const [newUsername, setNewUsername] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || newUsername.trim().length < 3) {
      toast.error('Username must contain at least 3 characters.');
      return;
    }

    try {
      setUpdatingUsername(true);
      await updateAdminUsername(newUsername.trim());
      await refreshProfile();
      toast.success(`Admin username updated to "${newUsername.trim()}".`);
      setNewUsername('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update username.');
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    try {
      setUpdatingPassword(true);
      await updateAdminPassword(currentPassword, newPassword);
      toast.success('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Admin Security & Credentials
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage your login credentials safely. Passwords are encrypted through Firebase Authentication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Change Username */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-wood-100 text-wood-800 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Change Admin Username
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Updates the administrative identifier used during login.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <span className="text-stone-500 block">Current active username:</span>
              <strong className="text-stone-900 font-mono text-sm">
                {adminProfile?.username || 'SELVAM'}
              </strong>
            </div>

            <form onSubmit={handleUpdateUsername} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  New Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. SELVAM_ADMIN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={updatingUsername}
                className="w-full"
              >
                Update Username
              </Button>
            </form>
          </div>
        </div>

        {/* Section 2: Change Password */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-wood-100 text-wood-800 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Change Admin Password
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Secured via Firebase Authentication re-authentication flow.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter existing password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  New Password (min 8 chars) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={updatingPassword}
                className="w-full"
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
