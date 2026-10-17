import {
  FaTelegram,
  FaWhatsapp,
  FaPhone,
  FaInstagram,
} from 'react-icons/fa';
import '../styles/ContactSection.css';
import { socialLinks, isConfigured } from '../config/socialLinks';

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
    subtext: 'Nagala soo xidhiidh',
    className: 'social-btn--whatsapp',
    iconSize: 28,
    external: true,
  },
  {
    key: 'phone',
    Icon: FaPhone,
    name: 'Wac Hadda',
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

export default function ContactSection() {
  return (
    <section id="contact" className="contact section" aria-labelledby="contact-heading">
      <div className="container">
        <header className="contact__header">
          <span className="section-label">Xiriirka</span>
          <h2 id="contact-heading" className="section-title">
            Nala Soo Xidhiidh
          </h2>
          <p className="section-desc">
            Su&apos;aalo ma qabtaa ama ma doonaysaa inaad dalbato xidhmo internet?
            Nagala soo xidhiidh isla hadda!
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
                aria-label={`${name} — weli lama habayn`}
                role="listitem"
              >
                <span className="social-btn__icon" aria-hidden="true">
                  <Icon size={iconSize} />
                </span>
                <span className="social-btn__label">
                  <span className="social-btn__name">{name}</span>
                  <span className="social-btn__status">Ma diyaar galin</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
