import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminAuthService } from '../services/db';
import logoImg from '../assets/logo.jpg';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/AdminDashboard.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await adminAuthService.login(email, password);
      toast.success('Welcome to the Admin Portal!');
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <Toaster position="top-right" />

      {/* Background ambient accents */}
      <div className="admin-auth-bg-deco" aria-hidden="true">
        <div className="admin-auth-circle admin-auth-circle--1" />
        <div className="admin-auth-circle admin-auth-circle--2" />
      </div>

      <div className="admin-auth-container">
        {/* Top Back Link */}
        <div className="admin-auth-nav">
          <Link to="/" className="admin-auth-back-link">
            <ArrowLeft size={16} />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Card */}
        <div className="admin-auth-card">
          {/* Header */}
          <div className="admin-auth-header">
            <div className="admin-auth-logo-badge">
              <img src={logoImg} alt="Xirmo Internet Logo" className="admin-auth-logo-img" />
            </div>
            <div className="admin-auth-titles">
              <div className="admin-auth-brand-name">
                <span className="brand-primary">XIRMO</span>{' '}
                <span className="brand-accent">INTERNET</span>
              </div>
              <h1 className="admin-auth-heading">Administrator Portal</h1>
              <p className="admin-auth-subtext">
                Enter your credentials to manage internet packages, pricing, and site announcements.
              </p>
            </div>
            <div className="admin-auth-tag">
              <ShieldCheck size={14} />
              <span>Authorized Administrators Only</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="admin-auth-alert admin-auth-alert--error" role="alert">
              <AlertCircle size={18} className="admin-auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-auth-form" noValidate>
            <div className="admin-form-group">
              <label htmlFor="admin-email" className="admin-form-label">
                Administrator Email
              </label>
              <div className="admin-input-wrap">
                <Mail size={18} className="admin-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  className={`admin-input ${error ? 'admin-input--error' : ''}`}
                  placeholder="admin@xirmo.so"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <div className="admin-form-label-row">
                <label htmlFor="admin-password" className="admin-form-label">
                  Password
                </label>
              </div>
              <div className="admin-input-wrap">
                <Lock size={18} className="admin-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`admin-input admin-input--with-toggle ${error ? 'admin-input--error' : ''}`}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-input-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn--primary admin-btn--full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-spinner" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Access Note */}
          <div className="admin-auth-footer-notice">
            <div className="admin-auth-notice-item">
              <CheckCircle2 size={14} className="text-green" />
              <span>256-Bit Encrypted & Role-Protected Session</span>
            </div>
            <p className="admin-auth-warning">
              This portal is restricted to authorized personnel. Public account registration is disabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
