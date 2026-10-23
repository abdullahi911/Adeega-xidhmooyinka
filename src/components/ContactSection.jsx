import {
  FaTelegram,
  FaWhatsapp,
  FaPhone,
  FaInstagram,
} from 'react-icons/fa';
import '../styles/ContactSection.css';
import { socialLinks, isConfigured } from '../config/socialLinks';
import { useLang } from '../context/LanguageContext.jsx';

export default function ContactSection() {
  const { t } = useLang();

  const PLATFORMS = [
    {
      key: 'telegram',
      Icon: FaTelegram,
      name: 'Telegram',
      subtext: '@Farhan_ilyas',
      className: 'social-btn--telegram',
      iconSize: 28,
      external: true,
    },
    {
      key: 'whatsapp',
      Icon: FaWhatsapp,
      name: 'WhatsApp',
      subtext: t('contact_whatsapp_sub'),
      className: 'social-btn--whatsapp',
      iconSize: 28,
      external: true,
    },
    {
      key: 'phone',
      Icon: FaPhone,
      name: t('contact_phone_name'),
      subtext: '+251 977 923 572',
      className: 'social-btn--phone',
      iconSize: 26,
      external: false,
    },
    {
      key: 'instagram',
      Icon: FaInstagram,
      name: 'Instagram',
      subtext: '@farahan_ilyas_ahmed',
      className: 'social-btn--instagram',
      iconSize: 28,
      external: true,
    },
  ];

  return (
    <section id="contact" className="contact section" aria-labelledby="contact-heading">
      <div className="container">
        <header className="contact__header">
          <span className="section-label">{t('contact_label')}</span>
          <h2 id="contact-heading" className="section-title">
            {t('contact_title')}
          </h2>
          <p className="section-desc">
            {t('contact_desc')}
          </p>
        </header>

        <div className="social-buttons" role="list">
          {PLATFORMS.map(({ key, Icon, name, subtext, className, iconSize, external }) => {
            const url = socialLinks[key];
            const configured = isConfigured(url);

            return configured ? (
              <a
                key={key}
                href={url}
                className={`social-btn ${className}`}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={`${name} — ${subtext}`}
                role="listitem"
              >
                <span className="social-btn__icon" aria-hidden="true">
                  <Icon size={iconSize} />
                </span>
                <span className="social-btn__label">
                  <span className="social-btn__name">{name}</span>
                  <span className="social-btn__status">{subtext}</span>
                </span>
              </a>
            ) : (
              <div
                key={key}
                className={`social-btn ${className} social-btn--disabled`}
                aria-disabled="true"
                aria-label={`${name} — ${t('contact_not_configured')}`}
                role="listitem"
              >
                <span className="social-btn__icon" aria-hidden="true">
                  <Icon size={iconSize} />
                </span>
                <span className="social-btn__label">
                  <span className="social-btn__name">{name}</span>
                  <span className="social-btn__status">{t('contact_not_configured')}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
