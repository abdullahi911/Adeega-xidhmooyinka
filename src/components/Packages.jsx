import { useEffect, useRef, useState, useCallback } from 'react';
import {
  CalendarDays,
  Clock,
  Zap,
  Wifi,
  Gauge,
  ShieldCheck,
  HeadphonesIcon,
  Bolt,
  BadgeDollarSign,
  Database,
  Gift,
  Sparkles,
} from 'lucide-react';
import '../styles/Packages.css';
import { useLang } from '../context/LanguageContext.jsx';
import { packageService } from '../services/db';

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Provider IDs ── */
const SAFARICOM = 'safaricom';
const ETHIOTELECOM = 'ethiotelecom';

export default function Packages() {
  const sectionRef = useRef(null);
  const { t } = useLang();
  const [provider, setProvider] = useState(SAFARICOM);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages from database
  const loadPackages = useCallback(async () => {
    try {
      const allActive = await packageService.getAll({ onlyActive: true });
      setPackages(allActive || []);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();

    const handleDbChange = () => {
      loadPackages();
    };

    window.addEventListener('xirmo:db_change', handleDbChange);
    window.addEventListener('storage', handleDbChange);

    return () => {
      window.removeEventListener('xirmo:db_change', handleDbChange);
      window.removeEventListener('storage', handleDbChange);
    };
  }, [loadPackages]);

  // Filter packages for selected provider
  const currentPackages = packages.filter((pkg) => {
    const pkgProv = (pkg.provider || '').toLowerCase();
    return pkgProv === provider;
  });

  // Choose icon based on category or duration
  const getPackageIcon = (pkg) => {
    const cat = (pkg.category || '').toLowerCase();
    const dur = (pkg.duration || '').toLowerCase();
    if (cat === 'monthly' || dur.includes('bil') || dur.includes('month')) return CalendarDays;
    if (cat === 'weekly' || dur.includes('isbuuc') || dur.includes('toddobaad') || dur.includes('week')) return Clock;
    if (cat === 'daily' || dur.includes('maalin') || dur.includes('day')) return Zap;
    if (pkg.id?.includes('bundle') || pkg.name?.toLowerCase().includes('codka')) return Database;
    return Wifi;
  };

  // Feature icon picker
  const getFeatureIcon = (idx) => {
    const icons = [Wifi, Gauge, ShieldCheck, HeadphonesIcon, Bolt, BadgeDollarSign, Sparkles];
    return icons[idx % icons.length];
  };

  // Card reveal animation
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.package-card');
    if (!cards || cards.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      obs.observe(card);
    });

    return () => obs.disconnect();
  }, [provider, currentPackages]);

  return (
    <section id="packages" className="packages section" aria-labelledby="packages-heading">
      <div className="container" ref={sectionRef}>
        <header className="packages__header">
          <span className="section-label">{t('packages_label')}</span>
          <h2 id="packages-heading" className="section-title">
            {t('packages_title')}
          </h2>
          <p className="section-desc">
            {t('packages_desc')}
          </p>
        </header>

        {/* ── Provider Switcher ── */}
        <div className="provider-switcher" role="group" aria-label={t('provider_select_label')}>
          <button
            id="provider-btn-safaricom"
            className={`provider-btn provider-btn--safaricom${provider === SAFARICOM ? ' provider-btn--active' : ''}`}
            onClick={() => setProvider(SAFARICOM)}
            aria-pressed={provider === SAFARICOM}
          >
            <span className="provider-btn__logo" aria-hidden="true">🟢</span>
            <span className="provider-btn__name">{t('provider_safaricom')}</span>
          </button>

          <button
            id="provider-btn-ethiotelecom"
            className={`provider-btn provider-btn--ethiotelecom${provider === ETHIOTELECOM ? ' provider-btn--active' : ''}`}
            onClick={() => setProvider(ETHIOTELECOM)}
            aria-pressed={provider === ETHIOTELECOM}
          >
            <span className="provider-btn__logo" aria-hidden="true">🔵</span>
            <span className="provider-btn__name">{t('provider_ethiotelecom')}</span>
          </button>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text)' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 1rem', width: 28, height: 28, borderColor: '#1769FF', borderTopColor: 'transparent' }} />
            <p>Xirmooyinka ayaa la soo shubayaa...</p>
          </div>
        )}

        {/* ── Package Cards Grid ── */}
        {!loading && currentPackages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text)' }}>
            <p>Hadda ma jiraan xirmooyin firfircoon oo loogu talagalay bixiyahan.</p>
          </div>
        ) : (
          <div className="packages__grid" role="list">
            {currentPackages.map((pkg) => {
              const Icon = getPackageIcon(pkg);
              const featuresList = Array.isArray(pkg.features)
                ? pkg.features
                : [];

              const dataDisplay =
                pkg.data_amount && pkg.data_amount !== 'Unlimited'
                  ? `${pkg.data_amount} ${pkg.data_unit && pkg.data_unit !== 'Unlimited' ? pkg.data_unit : ''}`
                  : null;

              return (
                <article key={pkg.id} className="package-card" role="listitem">
                  <div className="package-card__icon-wrap" aria-hidden="true">
                    <Icon size={30} strokeWidth={1.7} />
                  </div>

                  <span className="package-card__badge">
                    {pkg.badge || (pkg.category ? `Xirmo ${pkg.category}` : 'Xirmo Internet')}
                  </span>

                  <h3 className="package-card__title">{pkg.name || pkg.title}</h3>
                  <p className="package-card__subtitle">{pkg.subtitle}</p>

                  {/* Data allowance pill if specific MB/GB */}
                  {dataDisplay && (
                    <span className="package-card__bonus" style={{ background: '#EAF3FF', color: '#1769FF', borderColor: '#D0E4FF' }}>
                      <Wifi size={13} aria-hidden="true" />
                      Xaddiga Xogta: {dataDisplay}
                    </span>
                  )}

                  {/* Bonus badge */}
                  {pkg.bonus && (
                    <span className="package-card__bonus">
                      <Gift size={13} aria-hidden="true" />
                      {pkg.bonus}
                    </span>
                  )}

                  {/* Price display */}
                  <div className="package-card__price-wrap">
                    <div className="package-card__price-inner">
                      <span className="package-card__price">{pkg.price}</span>
                      <span className="package-card__currency">{pkg.currency || 'Birr'}</span>
                    </div>
                    <span className="package-card__duration">/ {pkg.duration}</span>
                  </div>

                  <div className="package-card__divider" aria-hidden="true" />

                  <p className="package-card__desc">{pkg.description || pkg.desc}</p>

                  {/* Feature list */}
                  <ul className="package-card__features" aria-label="Xogta xirmada">
                    {featuresList.map((feat, idx) => {
                      const FIcon = getFeatureIcon(idx);
                      const label = typeof feat === 'string' ? feat : feat.label;
                      return (
                        <li key={`${pkg.id}-feat-${idx}`} className="package-card__feature">
                          <FIcon size={15} strokeWidth={2} aria-hidden="true" />
                          <span>{label}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    className="package-card__btn"
                    onClick={() => smoothScrollTo('contact')}
                    aria-label={`${t('pkg_cta')} — ${pkg.name || pkg.title}`}
                  >
                    {t('pkg_cta')}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
