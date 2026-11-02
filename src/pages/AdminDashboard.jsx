import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Bell,
  Shield,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  Check,
  X,
  Search,
  Wifi,
  Gift,
  AlertTriangle,
  Sparkles,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Key,
  Power,
  RefreshCw,
  Database,
  Lock,
} from 'lucide-react';
import { packageService, notificationService, adminAuthService } from '../services/db';
import ChangePasswordModal from '../components/ChangePasswordModal';
import logoImg from '../assets/logo.jpg';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = adminAuthService.getSession();

  // Active Tab: 'packages' | 'notifications' | 'security'
  const [activeTab, setActiveTab] = useState('packages');

  // Packages state
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [providerFilter, setProviderFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  // Modals state
  const [editingPackage, setEditingPackage] = useState(null);
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);

  const [editingNotif, setEditingNotif] = useState(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Password modal state
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  // Form saving state
  const [modalSaving, setModalSaving] = useState(false);

  // ── Fetch Data ─────────────────────────────────────────────────────────────

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);
    try {
      const data = await packageService.getAll();
      setPackages(data || []);
    } catch (err) {
      toast.error('Failed to load packages: ' + err.message);
    } finally {
      setLoadingPackages(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoadingNotifs(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data || []);
    } catch (err) {
      toast.error('Failed to load announcements: ' + err.message);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
    fetchNotifications();

    const handleDbChange = () => {
      fetchPackages();
      fetchNotifications();
    };

    window.addEventListener('xirmo:db_change', handleDbChange);
    return () => window.removeEventListener('xirmo:db_change', handleDbChange);
  }, [fetchPackages, fetchNotifications]);

  // ── Logout ─────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    adminAuthService.logout();
    toast.success('You have successfully signed out.');
    navigate('/admin/login', { replace: true });
  };

  // ── Package Actions ────────────────────────────────────────────────────────

  const handleOpenAddPackage = () => {
    setEditingPackage({
      provider: 'safaricom',
      category: 'monthly',
      name: '',
      badge: 'Monthly Package',
      subtitle: '',
      data_amount: 'Unlimited',
      data_unit: 'Unlimited',
      duration: '1 Month',
      price: '',
      currency: 'Birr',
      bonus: '',
      description: '',
      features: 'Unlimited Internet, High Speed, 24/7 Support',
      is_active: true,
    });
    setIsPkgModalOpen(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage({
      ...pkg,
      features: Array.isArray(pkg.features)
        ? pkg.features.map((f) => (typeof f === 'string' ? f : f.label)).join(', ')
        : '',
    });
    setIsPkgModalOpen(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!editingPackage.name.trim() || !editingPackage.price.trim()) {
      toast.error('Please fill in both Package Name and Price.');
      return;
    }

    setModalSaving(true);
    try {
      const formattedFeatures = editingPackage.features
        ? editingPackage.features
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload = {
        ...editingPackage,
        name: editingPackage.name.trim(),
        price: editingPackage.price.trim(),
        features: formattedFeatures,
      };

      if (editingPackage.id) {
        await packageService.update(editingPackage.id, payload);
        toast.success(`Package "${payload.name}" updated successfully!`);
      } else {
        await packageService.create(payload);
        toast.success(`New package "${payload.name}" added successfully!`);
      }

      setIsPkgModalOpen(false);
      setEditingPackage(null);
      await fetchPackages();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    } finally {
      setModalSaving(false);
    }
  };

  const handleTogglePackageStatus = async (pkg) => {
    const updatedStatus = !pkg.is_active;
    try {
      await packageService.toggleAvailability(pkg.id, updatedStatus);
      toast.success(
        updatedStatus
          ? `Package "${pkg.name}" is now Active and visible on the website.`
          : `Package "${pkg.name}" is now Hidden from the website.`
      );
      await fetchPackages();
    } catch (err) {
      toast.error('Status update failed: ' + err.message);
    }
  };

  const handleDeletePackage = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'package') return;
    try {
      await packageService.delete(deleteConfirm.id);
      toast.success(`Package "${deleteConfirm.name}" has been deleted.`);
      setDeleteConfirm(null);
      await fetchPackages();
    } catch (err) {
      toast.error('Deletion failed: ' + err.message);
    }
  };

  // ── Notification Actions ───────────────────────────────────────────────────

  const handleOpenAddNotif = () => {
    setEditingNotif({
      title: '',
      description: '',
      type: 'announcement',
      is_active: true,
    });
    setIsNotifModalOpen(true);
  };

  const handleOpenEditNotif = (notif) => {
    setEditingNotif({ ...notif });
    setIsNotifModalOpen(true);
  };

  const handleSaveNotification = async (e) => {
    e.preventDefault();
    if (!editingNotif.title.trim() || !editingNotif.description.trim()) {
      toast.error('Please fill in both Announcement Title and Description.');
      return;
    }

    setModalSaving(true);
    try {
      if (editingNotif.id) {
        await notificationService.update(editingNotif.id, editingNotif);
        toast.success('Announcement updated successfully!');
      } else {
        await notificationService.create(editingNotif);
        toast.success('New announcement published successfully!');
      }

      setIsNotifModalOpen(false);
      setEditingNotif(null);
      await fetchNotifications();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    } finally {
      setModalSaving(false);
    }
  };

  const handleToggleNotifStatus = async (notif) => {
    const nextStatus = !notif.is_active;
    try {
      await notificationService.toggleStatus(notif.id, nextStatus);
      toast.success(
        nextStatus
          ? 'Announcement is now Published and live on the website.'
          : 'Announcement is now Deactivated (Draft).'
      );
      await fetchNotifications();
    } catch (err) {
      toast.error('Status update failed: ' + err.message);
    }
  };

  const handleDeleteNotif = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'notification') return;
    try {
      await notificationService.delete(deleteConfirm.id);
      toast.success('Announcement deleted successfully.');
      setDeleteConfirm(null);
      await fetchNotifications();
    } catch (err) {
      toast.error('Deletion failed: ' + err.message);
    }
  };

  // ── Filtered Packages ──────────────────────────────────────────────────────

  const filteredPackages = packages.filter((pkg) => {
    const matchesProvider =
      providerFilter === 'all' || (pkg.provider || '').toLowerCase() === providerFilter;
    const matchesCategory =
      categoryFilter === 'all' || (pkg.category || '').toLowerCase() === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (pkg.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.price || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProvider && matchesCategory && matchesSearch;
  });

  // Stats calculation
  const totalPkgs = packages.length;
  const activePkgs = packages.filter((p) => p.is_active).length;
  const safaricomCount = packages.filter((p) => (p.provider || '').toLowerCase() === 'safaricom').length;
  const ethioCount = packages.filter((p) => (p.provider || '').toLowerCase() === 'ethiotelecom').length;
  const activeNotifsCount = notifications.filter((n) => n.is_active).length;

  return (
    <div className="admin-app">
      <Toaster position="top-right" />

      {/* ── TOPBAR ── */}
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <div className="admin-topbar__brand">
            <img src={logoImg} alt="Xirmo Internet" className="admin-topbar__logo" />
            <div>
              <div className="admin-topbar__title">
                <span className="brand-primary">XIRMO</span>{' '}
                <span className="brand-accent">INTERNET</span>
              </div>
              <span className="admin-topbar__badge">Administration Dashboard</span>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <Link to="/" className="admin-btn admin-btn--outline admin-btn--sm" title="View Public Website">
              <ExternalLink size={15} />
              <span className="admin-btn__text-hide-mobile">View Public Site</span>
            </Link>

            {/* Password Change Button in Topbar */}
            <button
              onClick={() => setIsPwdModalOpen(true)}
              className="admin-btn admin-btn--outline admin-btn--sm"
              title="Change Administrator Password"
            >
              <Key size={14} className="text-blue" />
              <span className="admin-btn__text-hide-mobile">Change Password</span>
            </button>

            <div className="admin-user-pill" title={`Admin: ${session?.email || 'admin@xirmo.so'}`}>
              <Shield size={14} className="text-blue" />
              <span className="admin-user-pill__email">{session?.email || 'admin@xirmo.so'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="admin-btn admin-btn--danger-outline admin-btn--sm"
              title="Sign Out of Admin Portal"
            >
              <LogOut size={15} />
              <span className="admin-btn__text-hide-mobile">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="admin-content">
        <div className="admin-container">
          {/* Welcome Banner */}
          <div className="admin-header-banner">
            <div>
              <h1 className="admin-header-banner__title">Packages & Announcements Manager</h1>
              <p className="admin-header-banner__subtitle">
                Update internet package prices, MB/GB data values, daily, weekly, and monthly packages.
                All database modifications automatically appear live on the public website.
              </p>
            </div>
            <div className="admin-header-banner__quick-actions">
              {activeTab === 'packages' ? (
                <button onClick={handleOpenAddPackage} className="admin-btn admin-btn--primary">
                  <Plus size={16} />
                  <span>+ Add New Package</span>
                </button>
              ) : activeTab === 'notifications' ? (
                <button onClick={handleOpenAddNotif} className="admin-btn admin-btn--primary">
                  <Plus size={16} />
                  <span>+ Add Announcement</span>
                </button>
              ) : (
                <button onClick={() => setIsPwdModalOpen(true)} className="admin-btn admin-btn--primary">
                  <Key size={16} />
                  <span>Change Password Now</span>
                </button>
              )}
            </div>
          </div>

          {/* ── STATS METRICS ── */}
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <div className="admin-metric-card__icon admin-metric-card__icon--blue">
                <Package size={22} />
              </div>
              <div>
                <div className="admin-metric-card__value">{totalPkgs}</div>
                <div className="admin-metric-card__label">Total Packages</div>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-card__icon admin-metric-card__icon--green">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="admin-metric-card__value">{activePkgs}</div>
                <div className="admin-metric-card__label">Active Packages (Live)</div>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-card__icon admin-metric-card__icon--safaricom">
                <Wifi size={22} />
              </div>
              <div>
                <div className="admin-metric-card__value">{safaricomCount}</div>
                <div className="admin-metric-card__label">SafariCom Packages</div>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-card__icon admin-metric-card__icon--ethio">
                <Database size={22} />
              </div>
              <div>
                <div className="admin-metric-card__value">{ethioCount}</div>
                <div className="admin-metric-card__label">EthioTelecom Packages</div>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-card__icon admin-metric-card__icon--purple">
                <Bell size={22} />
              </div>
              <div>
                <div className="admin-metric-card__value">{activeNotifsCount}</div>
                <div className="admin-metric-card__label">Published Announcements</div>
              </div>
            </div>
          </div>

          {/* ── NAVIGATION TABS ── */}
          <div className="admin-tabs-nav" role="tablist">
            <button
              className={`admin-tab-btn ${activeTab === 'packages' ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('packages')}
              role="tab"
              aria-selected={activeTab === 'packages'}
            >
              <Package size={17} />
              <span>Internet Packages ({packages.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === 'notifications' ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('notifications')}
              role="tab"
              aria-selected={activeTab === 'notifications'}
            >
              <Bell size={17} />
              <span>Site Announcements ({notifications.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${activeTab === 'security' ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('security')}
              role="tab"
              aria-selected={activeTab === 'security'}
            >
              <Shield size={17} />
              <span>Security & Password</span>
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: PACKAGES MANAGEMENT
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'packages' && (
            <div className="admin-tab-pane">
              {/* Controls bar: Search & Filters */}
              <div className="admin-controls-card">
                <div className="admin-search-box">
                  <Search size={17} className="admin-search-icon" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search packages by name, price, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="admin-search-clear" onClick={() => setSearchQuery('')}>
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="admin-filter-group">
                  <div className="admin-filter-item">
                    <label className="admin-filter-label">Provider:</label>
                    <select
                      className="admin-select"
                      value={providerFilter}
                      onChange={(e) => setProviderFilter(e.target.value)}
                    >
                      <option value="all">All Providers</option>
                      <option value="safaricom">SafariCom 🟢</option>
                      <option value="ethiotelecom">EthioTelecom 🔵</option>
                    </select>
                  </div>

                  <div className="admin-filter-item">
                    <label className="admin-filter-label">Duration:</label>
                    <select
                      className="admin-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Durations</option>
                      <option value="daily">Daily Packages</option>
                      <option value="weekly">Weekly Packages</option>
                      <option value="monthly">Monthly Packages</option>
                    </select>
                  </div>

                  <button onClick={fetchPackages} className="admin-btn admin-btn--outline admin-btn--icon-only" title="Reload packages">
                    <RefreshCw size={16} className={loadingPackages ? 'admin-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* Packages List / Grid */}
              {loadingPackages ? (
                <div className="admin-empty-state">
                  <div className="admin-spinner admin-spinner--lg" />
                  <p>Loading internet packages...</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="admin-empty-state">
                  <Package size={48} className="text-gray-400" />
                  <h3>No packages match your criteria</h3>
                  <p>Try modifying your search or filters, or add a new package.</p>
                  <button onClick={handleOpenAddPackage} className="admin-btn admin-btn--primary">
                    <Plus size={16} />
                    <span>+ Add New Package</span>
                  </button>
                </div>
              ) : (
                <div className="admin-packages-grid">
                  {filteredPackages.map((pkg) => {
                    const isSafaricom = (pkg.provider || '').toLowerCase() === 'safaricom';
                    return (
                      <div
                        key={pkg.id}
                        className={`admin-pkg-card ${!pkg.is_active ? 'admin-pkg-card--inactive' : ''}`}
                      >
                        {/* Card Top Strip */}
                        <div className="admin-pkg-card__top">
                          <div className="admin-pkg-card__tags">
                            <span
                              className={`admin-tag admin-tag--provider ${
                                isSafaricom ? 'admin-tag--safaricom' : 'admin-tag--ethio'
                              }`}
                            >
                              {isSafaricom ? '🟢 SafariCom' : '🔵 EthioTelecom'}
                            </span>
                            <span className="admin-tag admin-tag--category">
                              {pkg.category === 'daily'
                                ? 'Daily'
                                : pkg.category === 'weekly'
                                ? 'Weekly'
                                : pkg.category === 'monthly'
                                ? 'Monthly'
                                : pkg.duration}
                            </span>
                          </div>

                          {/* Live Toggle */}
                          <button
                            type="button"
                            className={`admin-status-toggle ${
                              pkg.is_active ? 'admin-status-toggle--active' : 'admin-status-toggle--inactive'
                            }`}
                            onClick={() => handleTogglePackageStatus(pkg)}
                            title={pkg.is_active ? 'Click to deactivate (hide from site)' : 'Click to activate (make visible)'}
                          >
                            <span className="admin-status-toggle__dot" />
                            <span>{pkg.is_active ? 'Active (Live)' : 'Hidden (Inactive)'}</span>
                          </button>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="admin-pkg-card__main">
                          <h3 className="admin-pkg-card__name">{pkg.name}</h3>
                          {pkg.subtitle && <p className="admin-pkg-card__sub">{pkg.subtitle}</p>}
                        </div>

                        {/* Price & Data Metric Box */}
                        <div className="admin-pkg-card__metrics">
                          <div className="admin-metric-box">
                            <span className="admin-metric-box__label">Price:</span>
                            <span className="admin-metric-box__price">
                              {pkg.price}{' '}
                              <span className="admin-metric-box__currency">{pkg.currency || 'Birr'}</span>
                            </span>
                            <span className="admin-metric-box__duration">/ {pkg.duration}</span>
                          </div>

                          <div className="admin-metric-box">
                            <span className="admin-metric-box__label">Data Allowance:</span>
                            <span className="admin-metric-box__data">
                              <Wifi size={14} />
                              {pkg.data_amount} {pkg.data_unit !== 'Unlimited' ? pkg.data_unit : ''}
                            </span>
                          </div>
                        </div>

                        {/* Bonus if exists */}
                        {pkg.bonus && (
                          <div className="admin-pkg-card__bonus">
                            <Gift size={14} />
                            <span>{pkg.bonus}</span>
                          </div>
                        )}

                        {/* Description */}
                        <p className="admin-pkg-card__desc">{pkg.description}</p>

                        {/* Features bullet points */}
                        {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                          <div className="admin-pkg-card__features">
                            <span className="admin-pkg-card__feat-title">Included Features:</span>
                            <ul className="admin-pkg-card__feat-list">
                              {pkg.features.map((feat, idx) => (
                                <li key={idx} className="admin-pkg-card__feat-item">
                                  <Check size={13} className="text-green" />
                                  <span>{typeof feat === 'string' ? feat : feat.label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="admin-pkg-card__actions">
                          <button
                            onClick={() => handleOpenEditPackage(pkg)}
                            className="admin-btn admin-btn--outline admin-btn--sm admin-btn--full"
                          >
                            <Edit2 size={15} />
                            <span>Edit Package</span>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'package',
                                id: pkg.id,
                                name: pkg.name,
                              })
                            }
                            className="admin-btn admin-btn--danger-outline admin-btn--sm"
                            title="Delete this package"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: NOTIFICATIONS MANAGEMENT
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <div className="admin-tab-pane">
              <div className="admin-section-header">
                <div>
                  <h2 className="admin-section-title">Site Announcements & Notifications</h2>
                  <p className="admin-section-desc">
                    Active announcements appear as a top banner on the public website for all visitors.
                  </p>
                </div>
                <button onClick={handleOpenAddNotif} className="admin-btn admin-btn--primary">
                  <Plus size={16} />
                  <span>+ Add Announcement</span>
                </button>
              </div>

              {loadingNotifs ? (
                <div className="admin-empty-state">
                  <div className="admin-spinner admin-spinner--lg" />
                  <p>Loading announcements...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="admin-empty-state">
                  <Bell size={48} className="text-gray-400" />
                  <h3>No announcements created yet</h3>
                  <p>Click below to create an announcement to display on the public website.</p>
                  <button onClick={handleOpenAddNotif} className="admin-btn admin-btn--primary">
                    <Plus size={16} />
                    <span>+ Add Announcement</span>
                  </button>
                </div>
              ) : (
                <div className="admin-notifs-list">
                  {notifications.map((notif) => {
                    const isAlert = notif.type === 'alert';
                    const isPromo = notif.type === 'promotion';
                    const isMaint = notif.type === 'maintenance';

                    return (
                      <div
                        key={notif.id}
                        className={`admin-notif-card ${!notif.is_active ? 'admin-notif-card--inactive' : ''}`}
                      >
                        <div className="admin-notif-card__icon-wrap">
                          {isAlert ? (
                            <AlertTriangle className="text-red" size={24} />
                          ) : isPromo ? (
                            <Sparkles className="text-purple" size={24} />
                          ) : isMaint ? (
                            <Wrench className="text-amber" size={24} />
                          ) : (
                            <Bell className="text-blue" size={24} />
                          )}
                        </div>

                        <div className="admin-notif-card__body">
                          <div className="admin-notif-card__header-row">
                            <span
                              className={`admin-tag admin-tag--notif-${notif.type || 'announcement'}`}
                            >
                              {isAlert
                                ? 'Urgent Alert'
                                : isPromo
                                ? 'Special Offer'
                                : isMaint
                                ? 'Maintenance'
                                : 'General Announcement'}
                            </span>

                            <span className="admin-notif-card__date">
                              {new Date(notif.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <h4 className="admin-notif-card__title">{notif.title}</h4>
                          <p className="admin-notif-card__desc">{notif.description}</p>
                        </div>

                        <div className="admin-notif-card__actions">
                          {/* Publish / Deactivate Toggle */}
                          <button
                            type="button"
                            className={`admin-btn admin-btn--sm ${
                              notif.is_active ? 'admin-btn--success' : 'admin-btn--outline'
                            }`}
                            onClick={() => handleToggleNotifStatus(notif)}
                          >
                            {notif.is_active ? (
                              <>
                                <CheckCircle2 size={14} />
                                <span>Published (Live)</span>
                              </>
                            ) : (
                              <>
                                <Power size={14} />
                                <span>Draft (Hidden)</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenEditNotif(notif)}
                            className="admin-btn admin-btn--outline admin-btn--sm"
                            title="Edit Announcement"
                          >
                            <Edit2 size={15} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'notification',
                                id: notif.id,
                                name: notif.title,
                              })
                            }
                            className="admin-btn admin-btn--danger-outline admin-btn--sm"
                            title="Delete Announcement"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: SECURITY & ADMIN PASSWORD
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div className="admin-tab-pane">
              <div className="admin-security-grid">
                {/* Change Password Card */}
                <div className="admin-card">
                  <div className="admin-card__header">
                    <div className="admin-card__icon-badge">
                      <Key size={22} className="text-blue" />
                    </div>
                    <div>
                      <h3 className="admin-card__title">Administrator Password & Security</h3>
                      <p className="admin-card__subtitle">
                        Protect your administrator account with a strong, encrypted password.
                      </p>
                    </div>
                  </div>

                  <div style={{ background: '#F0F6FF', border: '1px solid #D0E4FF', borderRadius: 16, padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(23,105,255,0.15)' }}>
                      <Lock size={26} className="text-blue" />
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#071B3A', margin: '0 0 0.4rem' }}>
                      Change Your Admin Password
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#52627A', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                      Open the interactive password manager with a live strength meter, requirement checklist, and automatic secure password generator.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPwdModalOpen(true)}
                      className="admin-btn admin-btn--primary admin-btn--full"
                      style={{ padding: '0.85rem' }}
                    >
                      <Key size={18} />
                      <span>Open Password Manager</span>
                    </button>
                  </div>

                  <div className="admin-pwd-checklist">
                    <div className="admin-pwd-check-item checked">
                      <Check size={14} />
                      <span>Web Crypto SHA-256 Encryption</span>
                    </div>
                    <div className="admin-pwd-check-item checked">
                      <Check size={14} />
                      <span>Cryptographic Salt Protection</span>
                    </div>
                    <div className="admin-pwd-check-item checked">
                      <Check size={14} />
                      <span>Supabase Auth Cloud Sync</span>
                    </div>
                    <div className="admin-pwd-check-item checked">
                      <Check size={14} />
                      <span>Zero Plain-text Storage</span>
                    </div>
                  </div>
                </div>

                {/* Account & System Status Card */}
                <div className="admin-card">
                  <div className="admin-card__header">
                    <div className="admin-card__icon-badge">
                      <Shield size={20} className="text-green" />
                    </div>
                    <div>
                      <h3 className="admin-card__title">System & Database Status</h3>
                      <p className="admin-card__subtitle">Overview of authentication and storage configuration.</p>
                    </div>
                  </div>

                  <div className="admin-info-list">
                    <div className="admin-info-item">
                      <span className="admin-info-item__key">Current Administrator:</span>
                      <strong className="admin-info-item__value">{session?.email || 'admin@xirmo.so'}</strong>
                    </div>

                    <div className="admin-info-item">
                      <span className="admin-info-item__key">Access Level:</span>
                      <span className="admin-tag admin-tag--role">Super Administrator</span>
                    </div>

                    <div className="admin-info-item">
                      <span className="admin-info-item__key">Supabase Project:</span>
                      <span className="admin-tag admin-tag--blue">
                        pbzuqnvqtrsktradufdb
                      </span>
                    </div>

                    <div className="admin-info-item">
                      <span className="admin-info-item__key">Database Mode:</span>
                      <span className="admin-tag admin-tag--green">
                        <CheckCircle2 size={13} /> Supabase Cloud + Local Backup
                      </span>
                    </div>

                    <div className="admin-info-item">
                      <span className="admin-info-item__key">Password Hashing:</span>
                      <span className="admin-tag admin-tag--purple">
                        WebCrypto SHA-256 + Salt
                      </span>
                    </div>
                  </div>

                  <div className="admin-alert-box">
                    <AlertCircle size={16} className="text-blue" />
                    <p>
                      Public registration is disabled. System administration and package modifications are strictly restricted to authorized administrator sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT PACKAGE
          ════════════════════════════════════════════════════════════════════ */}
      {isPkgModalOpen && editingPackage && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal admin-modal--lg">
            <div className="admin-modal__header">
              <div>
                <h3 className="admin-modal__title">
                  {editingPackage.id ? 'Edit Internet Package' : 'Add New Internet Package'}
                </h3>
                <p className="admin-modal__subtitle">
                  Changes saved here will automatically appear on the public website.
                </p>
              </div>
              <button
                className="admin-modal__close-btn"
                onClick={() => setIsPkgModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="admin-modal__form">
              <div className="admin-form-grid">
                {/* Provider */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Service Provider</label>
                  <select
                    className="admin-select"
                    value={editingPackage.provider}
                    onChange={(e) => setEditingPackage({ ...editingPackage, provider: e.target.value })}
                    required
                  >
                    <option value="safaricom">SafariCom 🟢</option>
                    <option value="ethiotelecom">Ethiopia Telecom (EthioTelecom) 🔵</option>
                    <option value="other">Other Provider</option>
                  </select>
                </div>

                {/* Category */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Package Category</label>
                  <select
                    className="admin-select"
                    value={editingPackage.category}
                    onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                    required
                  >
                    <option value="daily">Daily Package</option>
                    <option value="weekly">Weekly Package</option>
                    <option value="monthly">Monthly Package</option>
                    <option value="custom">Custom Package</option>
                  </select>
                </div>

                {/* Package Name */}
                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-form-label">Package Name / Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., UNLIMITED MONTHLY or 20GB ULTRA"
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    required
                  />
                </div>

                {/* Badge */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Card Badge</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., Monthly Package, Best Value, Popular"
                    value={editingPackage.badge || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                  />
                </div>

                {/* Subtitle */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., High-speed monthly connection"
                    value={editingPackage.subtitle || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                  />
                </div>

                {/* Price */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Price</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., 2,750 or 850"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                    required
                  />
                </div>

                {/* Currency */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Currency</label>
                  <select
                    className="admin-select"
                    value={editingPackage.currency || 'Birr'}
                    onChange={(e) => setEditingPackage({ ...editingPackage, currency: e.target.value })}
                  >
                    <option value="Birr">Birr</option>
                    <option value="ETB">ETB</option>
                    <option value="$">USD ($)</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Duration</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., 1 Month, 1 Week, 1 Day"
                    value={editingPackage.duration}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    required
                  />
                </div>

                {/* Internet Data Value (MB / GB) */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Data Allowance (MB / GB / Unlimited)</label>
                  <div className="admin-input-group">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g., 10, 50, 500, or Unlimited"
                      value={editingPackage.data_amount}
                      onChange={(e) => setEditingPackage({ ...editingPackage, data_amount: e.target.value })}
                      required
                    />
                    <select
                      className="admin-select admin-select--sm"
                      value={editingPackage.data_unit || 'GB'}
                      onChange={(e) => setEditingPackage({ ...editingPackage, data_unit: e.target.value })}
                    >
                      <option value="Unlimited">Unlimited</option>
                      <option value="GB">GB</option>
                      <option value="MB">MB</option>
                      <option value="TB">TB</option>
                    </select>
                  </div>
                </div>

                {/* Bonus */}
                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-form-label">Bonus Offer (Optional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., Bonus: 300 Birr"
                    value={editingPackage.bonus || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, bonus: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    placeholder="Write a clear description of the package..."
                    value={editingPackage.description || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  />
                </div>

                {/* Features */}
                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-form-label">
                    Features (comma-separated list)
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., Unlimited Data, 4G/5G Speeds, 24/7 Priority Support"
                    value={editingPackage.features}
                    onChange={(e) => setEditingPackage({ ...editingPackage, features: e.target.value })}
                  />
                  <small className="admin-form-hint">
                    Separate each feature with a comma (e.g., Fast Download, No Throttling).
                  </small>
                </div>

                {/* Availability Toggle */}
                <div className="admin-form-group admin-form-group--full">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={editingPackage.is_active}
                      onChange={(e) => setEditingPackage({ ...editingPackage, is_active: e.target.checked })}
                    />
                    <span>Make this package active (Visible on the public website)</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setIsPkgModalOpen(false)}
                  disabled={modalSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={modalSaving}
                >
                  {modalSaving ? (
                    <>
                      <span className="admin-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{editingPackage.id ? 'Save Changes' : 'Create Package'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT NOTIFICATION
          ════════════════════════════════════════════════════════════════════ */}
      {isNotifModalOpen && editingNotif && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <div>
                <h3 className="admin-modal__title">
                  {editingNotif.id ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
                <p className="admin-modal__subtitle">
                  Published announcements appear on the top banner of the public website.
                </p>
              </div>
              <button
                className="admin-modal__close-btn"
                onClick={() => setIsNotifModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNotification} className="admin-modal__form">
              <div className="admin-form-group">
                <label className="admin-form-label">Announcement Type</label>
                <select
                  className="admin-select"
                  value={editingNotif.type}
                  onChange={(e) => setEditingNotif({ ...editingNotif, type: e.target.value })}
                >
                  <option value="announcement">General Announcement</option>
                  <option value="alert">Urgent Alert</option>
                  <option value="promotion">Special Promotion</option>
                  <option value="maintenance">Maintenance Notice</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Announcement Title</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g., Special promotion on all monthly packages!"
                  value={editingNotif.title}
                  onChange={(e) => setEditingNotif({ ...editingNotif, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  rows={4}
                  className="admin-textarea"
                  placeholder="Enter the announcement message to display on the banner..."
                  value={editingNotif.description}
                  onChange={(e) => setEditingNotif({ ...editingNotif, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingNotif.is_active}
                    onChange={(e) => setEditingNotif({ ...editingNotif, is_active: e.target.checked })}
                  />
                  <span>Publish this announcement immediately (Visible to website visitors)</span>
                </label>
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setIsNotifModalOpen(false)}
                  disabled={modalSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={modalSaving}
                >
                  {modalSaving ? (
                    <>
                      <span className="admin-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{editingNotif.id ? 'Save Changes' : 'Publish Announcement'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: DELETE CONFIRMATION
          ════════════════════════════════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal admin-modal--sm">
            <div className="admin-modal__header">
              <div className="admin-delete-warning-icon">
                <AlertTriangle size={24} className="text-red" />
              </div>
              <div>
                <h3 className="admin-modal__title">Confirm Deletion</h3>
                <p className="admin-modal__subtitle">
                  Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={deleteConfirm.type === 'package' ? handleDeletePackage : handleDeleteNotif}
              >
                <Trash2 size={16} />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: PASSWORD CHANGE MODAL
          ════════════════════════════════════════════════════════════════════ */}
      <ChangePasswordModal
        isOpen={isPwdModalOpen}
        onClose={() => setIsPwdModalOpen(false)}
      />
    </div>
  );
}
