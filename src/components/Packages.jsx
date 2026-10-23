import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays, Clock, Zap,
  Wifi, Gauge, ShieldCheck, HeadphonesIcon,
  Bolt, BadgeDollarSign, Database, Gift,
} from 'lucide-react';
import '../styles/Packages.css';
import { useLang } from '../context/LanguageContext.jsx';

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Provider IDs ── */
const SAFARICOM    = 'safaricom';
const ETHIOTELECOM = 'ethiotelecom';

export default function Packages() {
  const sectionRef                    = useRef(null);
  const { t }                         = useLang();
  const [provider, setProvider]       = useState(SAFARICOM);

  /* ── SafariCom packages (existing, unchanged) ── */
  const safaricomPackages = [
    {
      id: 'bile',
      Icon: CalendarDays,
      badge: t('pkg_monthly_badge'),
      title: t('pkg_monthly_title'),
      subtitle: t('pkg_monthly_subtitle'),
      duration: t('pkg_monthly_duration'),
      price: t('pkg_monthly_price'),
      currency: t('pkg_monthly_currency'),
      bonus: null,
      desc: t('pkg_monthly_desc'),
      features: [
        { Icon: Wifi,           label: t('pkg_monthly_feat1') },
        { Icon: Gauge,          label: t('pkg_monthly_feat2') },
        { Icon: ShieldCheck,    label: t('pkg_monthly_feat3') },
        { Icon: HeadphonesIcon, label: t('pkg_monthly_feat4') },
      ],
    },
    {
      id: 'isbuucle',
      Icon: Clock,
      badge: t('pkg_weekly_badge'),
      title: t('pkg_weekly_title'),
      subtitle: t('pkg_weekly_subtitle'),
      duration: t('pkg_weekly_duration'),
      price: t('pkg_weekly_price'),
      currency: t('pkg_weekly_currency'),
      bonus: null,
      desc: t('pkg_weekly_desc'),
      features: [
        { Icon: Wifi,        label: t('pkg_weekly_feat1') },
        { Icon: Gauge,       label: t('pkg_weekly_feat2') },
        { Icon: ShieldCheck, label: t('pkg_weekly_feat3') },
        { Icon: Wifi,        label: t('pkg_weekly_feat4') },
      ],
    },
    {
      id: 'maalinle',
      Icon: Zap,
      badge: t('pkg_daily_badge'),
      title: t('pkg_daily_title'),
      subtitle: t('pkg_daily_subtitle'),
      duration: t('pkg_daily_duration'),
      price: t('pkg_daily_price'),
      currency: t('pkg_daily_currency'),
      bonus: null,
      desc: t('pkg_daily_desc'),
      features: [
        { Icon: Wifi,            label: t('pkg_daily_feat1') },
        { Icon: Bolt,            label: t('pkg_daily_feat2') },
        { Icon: Zap,             label: t('pkg_daily_feat3') },
        { Icon: BadgeDollarSign, label: t('pkg_daily_feat4') },
      ],
    },
  ];

  /* ── EthioTelecom packages (from supplied image) ── */
  const ethiotelecomPackages = [
    {
      id: 'et-monthly',
      Icon: CalendarDays,
      badge: t('et_monthly_badge'),
      title: t('et_monthly_title'),
      subtitle: t('et_monthly_subtitle'),
      duration: t('et_monthly_duration'),
      price: t('et_monthly_price'),
      currency: t('et_monthly_currency'),
      bonus: t('et_monthly_bonus'),
      desc: t('et_monthly_desc'),
      features: [
        { Icon: Wifi,        label: t('et_monthly_feat1') },
        { Icon: Gauge,       label: t('et_monthly_feat2') },
        { Icon: Gift,        label: t('et_monthly_feat3') },
        { Icon: Zap,         label: t('et_monthly_feat4') },
      ],
    },
    {
      id: 'et-weekly',
      Icon: Clock,
      badge: t('et_weekly_badge'),
      title: t('et_weekly_title'),
      subtitle: t('et_weekly_subtitle'),
      duration: t('et_weekly_duration'),
      price: t('et_weekly_price'),
      currency: t('et_weekly_currency'),
      bonus: t('et_weekly_bonus'),
      desc: t('et_weekly_desc'),
      features: [
        { Icon: Wifi,        label: t('et_weekly_feat1') },
        { Icon: Gauge,       label: t('et_weekly_feat2') },
        { Icon: Gift,        label: t('et_weekly_feat3') },
        { Icon: ShieldCheck, label: t('et_weekly_feat4') },
      ],
    },
    {
      id: 'et-bundle',
      Icon: Database,
      badge: t('et_daily_badge'),
      title: t('et_daily_title'),
      subtitle: t('et_daily_subtitle'),
      duration: t('et_daily_duration'),
      price: t('et_daily_price'),
      currency: t('et_daily_currency'),
      bonus: t('et_daily_bonus'),
      desc: t('et_daily_desc'),
      features: [
        { Icon: Database,        label: t('et_daily_feat1') },
        { Icon: Gauge,           label: t('et_daily_feat2') },
        { Icon: CalendarDays,    label: t('et_daily_feat3') },
        { Icon: BadgeDollarSign, label: t('et_daily_feat4') },
      ],
    },
  ];

  const PACKAGES = provider === SAFARICOM ? safaricomPackages : ethiotelecomPackages;

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.package-card');
    if (!cards) return;

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
  }, [provider]); // re-run animation when provider changes

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

        {/* ── Package Cards ── */}
        <div className="packages__grid" role="list">
          {PACKAGES.map(({ id, Icon, badge, title, subtitle, duration, price, currency, bonus, desc, features }) => (
            <article key={id} className="package-card" role="listitem">
              <div className="package-card__icon-wrap" aria-hidden="true">
                <Icon size={30} strokeWidth={1.7} />
              </div>

              <span className="package-card__badge">{badge}</span>

              <h3 className="package-card__title">{title}</h3>
              <p className="package-card__subtitle">{subtitle}</p>

              {/* Bonus badge — EthioTelecom only */}
              {bonus && (
                <span className="package-card__bonus">
                  <Gift size={13} aria-hidden="true" />
                  {bonus}
                </span>
              )}

              {/* Price display */}
              <div className="package-card__price-wrap">
                <div className="package-card__price-inner">
                  <span className="package-card__price">{price}</span>
                  <span className="package-card__currency">{currency}</span>
                </div>
                <span className="package-card__duration">/ {duration}</span>
              </div>

              <div className="package-card__divider" aria-hidden="true" />

              <p className="package-card__desc">{desc}</p>

              {/* Feature list */}
              <ul className="package-card__features" aria-label="Package features">
                {features.map(({ Icon: FIcon, label }) => (
                  <li key={label} className="package-card__feature">
                    <FIcon size={15} strokeWidth={2} aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              <button
                className="package-card__btn"
                onClick={() => smoothScrollTo('contact')}
                aria-label={`${t('pkg_cta')} — ${title}`}
              >
                {t('pkg_cta')}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
