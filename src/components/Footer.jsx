import {
  FaTelegram,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';
import '../styles/Footer.css';
import logoImg from '../assets/logo.jpg';
import { socialLinks, isConfigured } from '../config/socialLinks';
import { useLang } from '../context/LanguageContext.jsx';

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SOCIAL_ICONS = [
  { key: 'telegram',  Icon: FaTelegram,  label: 'Telegram'  },
  { key: 'whatsapp',  Icon: FaWhatsapp,  label: 'WhatsApp'  },
  { key: 'facebook',  Icon: FaFacebook,  label: 'Facebook'  },
  { key: 'instagram', Icon: FaInstagram, label: 'Instagram' },
];

export default function Footer() {
  const { t } = useLang();

  const QUICK_LINKS = [
    { label: t('nav_home'),     id: 'home' },
    { label: t('nav_packages'), id: 'packages' },
    { label: t('nav_contact'),  id: 'contact' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo-wrap">
              <img
                src={logoImg}
                alt="Internetka Bilaaha logo"
                className="footer__logo-img"
                width={48}
                height={48}
              />
              <span className="footer__logo-name">
                <span className="footer__logo-main">INTERNETKA</span>
                <span className="footer__logo-sub">BILAAHA</span>
              </span>
            </div>

            <p className="footer__desc">
              {t('footer_desc')}
            </p>

            {/* Social Icons Row */}
            <nav aria-label="Baraha bulshada" className="footer__socials">
              {SOCIAL_ICONS.map(({ key, Icon, label }) => {
                const url = socialLinks[key];
                const configured = isConfigured(url);
                return configured ? (
                  <a
                    key={key}
                    href={url}
                    className="footer__social-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    key={key}
                    className="footer__social-btn footer__social-btn--disabled"
                    aria-label={`${label} — weli lama habayn`}
                    title={`${label} — weli lama habayn`}
                    role="img"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </span>
                );
              })}
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer__col-title">{t('footer_quick_links')}</p>
            <nav aria-label="Quick links" className="footer__links">
              {QUICK_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  className="footer__link"
                  onClick={() => smoothScrollTo(id)}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <p className="footer__col-title">{t('footer_services')}</p>
            <nav aria-label="Services" className="footer__links">
              <button className="footer__link" onClick={() => smoothScrollTo('packages')}>
                {t('footer_svc_monthly')}
              </button>
              <button className="footer__link" onClick={() => smoothScrollTo('packages')}>
                {t('footer_svc_weekly')}
              </button>
              <button className="footer__link" onClick={() => smoothScrollTo('packages')}>
                {t('footer_svc_daily')}
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            {t('footer_copyright')}
          </p>
          <p className="footer__tagline">
            {t('footer_tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
