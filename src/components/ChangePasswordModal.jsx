import { useState, useMemo } from 'react';
import {
  Key,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { adminAuthService } from '../services/db';
import toast from 'react-hot-toast';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCopied, setGeneratedCopied] = useState(false);

  // Password strength calculations
  const criteria = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const strengthScore = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (criteria.length) score += 1;
    if (criteria.hasUpper && criteria.hasLower) score += 1;
    if (criteria.hasNumber) score += 1;
    if (criteria.hasSpecial) score += 1;
    return score;
  }, [newPassword, criteria]);

  const strengthDetails = useMemo(() => {
    switch (strengthScore) {
      case 1:
        return { label: 'Very Weak', color: '#EF4444', percent: 25 };
      case 2:
        return { label: 'Moderate', color: '#F59E0B', percent: 50 };
      case 3:
        return { label: 'Good', color: '#3B82F6', percent: 75 };
      case 4:
        return { label: 'Very Strong', color: '#10B981', percent: 100 };
      default:
        return { label: 'Enter a strong password', color: '#CBD5E1', percent: 0 };
    }
  }, [strengthScore]);

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  // Generate strong secure random password
  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?';
    let generated = '';
    const array = new Uint8Array(14);
    crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      generated += chars[array[i] % chars.length];
    }

    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowNew(true);
    setShowConfirm(true);
    setError('');

    try {
      navigator.clipboard.writeText(generated);
      setGeneratedCopied(true);
      setTimeout(() => setGeneratedCopied(false), 3000);
      toast.success('Strong password generated and copied to clipboard!');
    } catch {
      toast.success('Strong password generated!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await adminAuthService.changePassword(currentPassword, newPassword);
      toast.success('Administrator password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update administrator password.');
      toast.error('Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <div className="admin-modal admin-modal--password">
        {/* Header */}
        <div className="admin-modal__header admin-modal__header--pwd">
          <div className="admin-modal__icon-wrap">
            <Key size={24} className="text-blue" />
          </div>
          <div className="admin-modal__header-content">
            <h3 className="admin-modal__title">Change Admin Password</h3>
            <p className="admin-modal__subtitle">
              Secure your administrator account with a strong password. Stored with SHA-256 encryption & cryptographic salt.
            </p>
          </div>
          <button
            type="button"
            className="admin-modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal__form">
          {/* Error Banner */}
          {error && (
            <div className="admin-auth-alert admin-auth-alert--error" role="alert">
              <AlertCircle size={18} className="admin-auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Current Password */}
          <div className="admin-form-group">
            <label className="admin-form-label">Current Password</label>
            <div className="admin-input-wrap">
              <Lock size={18} className="admin-input-icon" />
              <input
                type={showCurrent ? 'text' : 'password'}
                className="admin-input admin-input--with-toggle"
                placeholder="Enter your current password..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="admin-input-toggle-btn"
                onClick={() => setShowCurrent((p) => !p)}
                tabIndex={-1}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Generator Quick Action */}
          <div className="admin-pwd-generator-strip">
            <span className="admin-pwd-generator-hint">Need a secure, ready-to-use password?</span>
            <button
              type="button"
              className="admin-btn-generator"
              onClick={handleGeneratePassword}
              title="Generate a 14-character strong password"
            >
              <Sparkles size={14} />
              <span>{generatedCopied ? 'Copied!' : 'Generate Strong Password'}</span>
            </button>
          </div>

          {/* 2. New Password */}
          <div className="admin-form-group">
            <label className="admin-form-label">New Password</label>
            <div className="admin-input-wrap">
              <Key size={18} className="admin-input-icon" />
              <input
                type={showNew ? 'text' : 'password'}
                className="admin-input admin-input--with-toggle"
                placeholder="At least 8 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
              />
              <button
                type="button"
                className="admin-input-toggle-btn"
                onClick={() => setShowNew((p) => !p)}
                tabIndex={-1}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="admin-pwd-strength-container">
                <div className="admin-pwd-strength-header">
                  <span className="admin-pwd-strength-text">Strength:</span>
                  <span
                    className="admin-pwd-strength-badge"
                    style={{ color: strengthDetails.color }}
                  >
                    {strengthDetails.label}
                  </span>
                </div>
                <div className="admin-pwd-strength-bar">
                  <div
                    className="admin-pwd-strength-fill"
                    style={{
                      width: `${strengthDetails.percent}%`,
                      backgroundColor: strengthDetails.color,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Requirement checklist */}
          <div className="admin-pwd-checklist">
            <div className={`admin-pwd-check-item ${criteria.length ? 'checked' : ''}`}>
              {criteria.length ? <Check size={14} /> : <div className="dot" />}
              <span>At least 8 characters</span>
            </div>
            <div className={`admin-pwd-check-item ${criteria.hasUpper && criteria.hasLower ? 'checked' : ''}`}>
              {criteria.hasUpper && criteria.hasLower ? <Check size={14} /> : <div className="dot" />}
              <span>Uppercase & lowercase</span>
            </div>
            <div className={`admin-pwd-check-item ${criteria.hasNumber ? 'checked' : ''}`}>
              {criteria.hasNumber ? <Check size={14} /> : <div className="dot" />}
              <span>Number (0-9)</span>
            </div>
            <div className={`admin-pwd-check-item ${criteria.hasSpecial ? 'checked' : ''}`}>
              {criteria.hasSpecial ? <Check size={14} /> : <div className="dot" />}
              <span>Special symbol (!@#$)</span>
            </div>
          </div>

          {/* 3. Confirm Password */}
          <div className="admin-form-group">
            <label className="admin-form-label">Confirm New Password</label>
            <div className="admin-input-wrap">
              <ShieldCheck size={18} className="admin-input-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                className={`admin-input admin-input--with-toggle ${
                  confirmPassword && !passwordsMatch ? 'admin-input--error' : ''
                }`}
                placeholder="Repeat new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="admin-input-toggle-btn"
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Match feedback */}
            {confirmPassword && (
              <div
                className={`admin-pwd-match-msg ${
                  passwordsMatch ? 'text-green' : 'text-red'
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <Check size={14} />
                    <span>Passwords match!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} />
                    <span>Passwords do not match!</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="admin-modal__footer">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={loading || (confirmPassword && !passwordsMatch)}
            >
              {loading ? (
                <>
                  <span className="admin-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Key size={16} />
                  <span>Save New Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
