import { useState, useEffect, useCallback } from 'react';
import '../styles/Navbar.css';
import logoImg from '../assets/logo.jpg';
import { useLang } from '../context/LanguageContext.jsx';

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const { t, toggleLang } = useLang();

  const NAV_LINKS = [
    { label: t('nav_home'),     id: 'home' },
    { label: t('nav_packages'), id: 'packages' },
    { label: t('nav_contact'),  id: 'contact' },
  ];

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = useCallback((id) => {
    setMenuOpen(false);
    setTimeout(() => smoothScrollTo(id), 60);
  }, []);

  return (
    <header role="banner">
      <nav
        className={`navbar${scrolled ? ' scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="container navbar__inner">
          {/* Brand */}
          <button
            className="navbar__brand"
            onClick={() => handleLink('home')}
            aria-label="Internetka Bilaaha — Home"
          >
            <img
              src={logoImg}
              alt="Internetka Bilaaha logo"
              className="navbar__logo"
              width={46}
              height={46}
            />
            <span className="navbar__name">
              <span className="navbar__name-main">INTERNETKA</span>
              <span className="navbar__name-sub">BILAAHA</span>
            </span>
          </button>

          {/* Desktop links */}
          <nav className="navbar__links" aria-label="Desktop navigation links">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                className="navbar__link"
                onClick={() => handleLink(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA + Lang toggle */}
          <div className="navbar__cta">
            <button
              className="navbar__lang-btn"
              onClick={toggleLang}
              aria-label="Switch language"
              title="Switch language"
              id="navbar-lang-toggle"
            >
              <span className="navbar__lang-flag">{t('lang_btn_flag')}</span>
              <span className="navbar__lang-label">{t('lang_btn_label')}</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleLink('contact')}
              id="navbar-get-connected"
            >
              {t('nav_cta')}
            </button>
          </div>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`navbar__mobile${menuOpen ? ' open' : ''}`}
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              className="navbar__mobile-link"
              onClick={() => handleLink(id)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {label}
            </button>
          ))}
          {/* Mobile lang toggle */}
          <button
            className="navbar__mobile-lang"
            onClick={() => { toggleLang(); setMenuOpen(false); }}
            tabIndex={menuOpen ? 0 : -1}
            id="mobile-lang-toggle"
          >
            {t('lang_btn_flag')} {t('lang_btn_label')}
          </button>
          <button
            className="btn btn-primary navbar__mobile-cta"
            onClick={() => handleLink('contact')}
            tabIndex={menuOpen ? 0 : -1}
          >
            {t('nav_cta')}
          </button>
        </div>
      </nav>
    </header>
  );
}
