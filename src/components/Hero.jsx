import { useEffect, useRef } from 'react';
import { FaTelegram, FaWhatsapp, FaPhone, FaInstagram } from 'react-icons/fa';
import '../styles/Hero.css';
import logoImg    from '../assets/logo.jpg';
import portraitImg from '../assets/portrait.jpg';
import { socialLinks, isConfigured } from '../config/socialLinks';
import { useLang } from '../context/LanguageContext.jsx';

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SOCIAL_ICONS = [
  {
    key: 'telegram',
    Icon: FaTelegram,
    label: 'Telegram',
    className: 'hero__social-icon--tg',
    style: { background: 'linear-gradient(135deg, #0088CC, #29B5E8)' },
    size: 26,
  },
  {
    key: 'whatsapp',
    Icon: FaWhatsapp,
    label: 'WhatsApp',
    className: 'hero__social-icon--wa',
    style: { background: 'linear-gradient(135deg, #128C7E, #25D366)' },
    size: 26,
  },
  {
    key: 'phone',
    Icon: FaPhone,
    label: 'Phone',
    className: 'hero__social-icon--fb',
    style: { background: 'linear-gradient(135deg, #1b7a3e, #27ae60)' },
    size: 24,
  },
  {
    key: 'instagram',
    Icon: FaInstagram,
    label: 'Instagram',
    className: 'hero__social-icon--ig',
    style: { background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' },
    size: 24,
  },
];

export default function Hero() {
  const visualRef = useRef(null);
  const { t } = useLang();

  // IntersectionObserver for visual entrance
  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      {/* Background decorations */}
      <div className="hero__bg-deco" aria-hidden="true">
        <div className="hero__wifi-ring" />
        <div className="hero__wifi-ring" />
        <div className="hero__wifi-ring" />
      </div>

      <div className="container hero__inner">
        {/* ── LEFT: Text Content ── */}
        <div className="hero__content">
          <span className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            {t('hero_badge')}
          </span>

          <h1 id="hero-heading" className="hero__heading">
            {t('hero_heading_1')}{' '}
            <em>{t('hero_heading_em')}</em>{' '}
            {t('hero_heading_2')}
          </h1>

          <p className="hero__desc">
            {t('hero_desc')}
          </p>

          <div className="hero__actions">
            <button
              className="btn btn-primary"
              onClick={() => smoothScrollTo('packages')}
              id="hero-packages-btn"
            >
              {t('hero_btn_packages')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => smoothScrollTo('contact')}
              id="hero-contact-btn"
            >
              {t('hero_btn_contact')}
            </button>
          </div>

          {/* Stats strip */}
          <div className="hero__stats" aria-label="Macluumaadka adeegga">
            <div className="hero__stat">
              <span className="hero__stat-value">3+</span>
              <span className="hero__stat-label">{t('hero_stat_types')}</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">24/7</span>
              <span className="hero__stat-label">{t('hero_stat_support')}</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">100%</span>
              <span className="hero__stat-label">{t('hero_stat_quality')}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Visual ── */}
        <div className="hero__visual" ref={visualRef} aria-hidden="true">
          {/* Company logo above portrait */}
          <div className="hero__logo-wrap">
            <img
              src={logoImg}
              alt=""
              className="hero__logo-img"
              aria-hidden="true"
            />
          </div>

          {/* Portrait */}
          <div className="hero__portrait-outer">
            <div className="hero__portrait-card">
              <img
                src={portraitImg}
                alt="Shaqaale Internetka Bilaaha"
                className="hero__portrait-img"
                draggable={false}
              />
            </div>
            <div className="hero__portrait-glow" />

            {/* Floating social icons — Telegram, WhatsApp, Phone, Instagram */}
            {SOCIAL_ICONS.map(({ key, Icon, label, className, style, size }) => {
              const url = socialLinks[key];
              const configured = isConfigured(url);
              return configured ? (
                <a
                  key={key}
                  href={url}
                  className={`hero__social-icon ${className}`}
                  style={{ ...style, color: '#fff' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={size} />
                </a>
              ) : (
                <span
                  key={key}
                  className={`hero__social-icon ${className} hero__social-icon--disabled`}
                  style={{ ...style, color: '#fff' }}
                  aria-label={`${label} — ma haboona`}
                  title={`${label} — ma haboona`}
                  role="img"
                >
                  <Icon size={size} />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
