import { createContext, useContext, useState, useCallback } from 'react';

/* ──────────────────────────────────────────────
   TRANSLATION DICTIONARIES
   ────────────────────────────────────────────── */
export const translations = {
  so: {
    /* ── Navbar ── */
    nav_home: 'Bogga Hore',
    nav_packages: 'Xidhmooyinka Internet',
    nav_contact: 'Nala Soo Xidhiidh',
    nav_cta: 'Ku Xidhmow',

    /* ── Hero ── */
    hero_badge: 'Adeegga Internet',
    hero_heading_1: 'Soo dhawoow macmiil!',
    hero_heading_em: 'Waxaan kuu haynaa',
    hero_heading_2: 'dhammaan xidhmooyinka internet-ka.',
    hero_desc: 'Ka daalac xidhmooyinka internet-ka ee la heli karo oo nala soo xidhiidh si aad u dalbato adeegga.',
    hero_btn_packages: 'Daawo Xidhmooyinka',
    hero_btn_contact: 'Nala Soo Xidhiidh',
    hero_stat_types: 'Noocyo Xidhmo',
    hero_stat_support: 'Xiliwalba',
    hero_stat_quality: 'Tayo Sare',

    /* ── Packages ── */
    packages_label: 'Adeegyadayada',
    packages_title: 'Xidhmooyinka Internet-ka',
    packages_desc: 'Dooro xidhmada kugu habboon, nagalana soo xidhiidh si aad u hesho adeeg internet oo tayo leh.',

    /* Monthly */
    pkg_monthly_badge: 'Xidhmo Bille ah',
    pkg_monthly_title: 'BILE AAN XADIDNAYN',
    pkg_monthly_subtitle: 'Xidhmo bille ah',
    pkg_monthly_duration: '1 Bil',
    pkg_monthly_price: '2,750',
    pkg_monthly_currency: 'Birr',
    pkg_monthly_desc: 'Xidhmo internet oo ku habboon isticmaalka muddada bisha. Hel internet xawaare sare oo aan xad lahayn muddo bil ah.',
    pkg_monthly_feat1: 'Internet Xad la\'aan',
    pkg_monthly_feat2: 'Xawaare Sare',
    pkg_monthly_feat3: 'Xidhmo Aamin ah',
    pkg_monthly_feat4: 'Taageero 24/7',

    /* Weekly */
    pkg_weekly_badge: 'Xidhmo Toddobaadlaha',
    pkg_weekly_title: 'ISBUUCLE AAN XADIDNAYN',
    pkg_weekly_subtitle: 'Xidhmo isbuucle ah',
    pkg_weekly_duration: '1 Toddobaad',
    pkg_weekly_price: '850',
    pkg_weekly_currency: 'Birr',
    pkg_weekly_desc: 'Xidhmo internet oo ku habboon baahiyahaaga toddobaadlaha ah. Xawaare buuxa oo toddobaad oo dhan socda.',
    pkg_weekly_feat1: 'Internet Xad la\'aan',
    pkg_weekly_feat2: 'Xawaare Buuxa',
    pkg_weekly_feat3: 'Xidhmo Xasilan',
    pkg_weekly_feat4: 'Taageero Joogto ah',

    /* Daily */
    pkg_daily_badge: 'Xidhmo Maalinlaha',
    pkg_daily_title: 'MAALINLE AAN XADIDNAYN',
    pkg_daily_subtitle: 'Xidhmo maalinle ah',
    pkg_daily_duration: '1 Maalin',
    pkg_daily_price: '135',
    pkg_daily_currency: 'Birr',
    pkg_daily_desc: 'Xidhmo internet oo loogu talagalay isticmaalka maalinlaha ah. Ku habboon kuwa baahi degdeg ah u qaba.',
    pkg_daily_feat1: 'Internet Xad la\'aan',
    pkg_daily_feat2: 'Xawaare Degdeg ah',
    pkg_daily_feat3: 'Bilaab Isla Markiiba',
    pkg_daily_feat4: 'Lacag Jaban',

    pkg_cta: 'Nala Soo Xidhiidh',

    /* ── Provider Switcher ── */
    provider_safaricom: 'SafariCom',
    provider_ethiotelecom: 'Ethiopia Telecom',
    provider_select_label: 'Dooro Shirkadda Internet',

    /* ── EthioTelecom — Monthly ── */
    et_monthly_badge: 'Xidhmo Bille ah',
    et_monthly_title: 'PREMIUM XADIDNAYN',
    et_monthly_subtitle: 'Unlimited Premium: Unlimited Internet',
    et_monthly_duration: '1 Bil',
    et_monthly_price: '1,850',
    et_monthly_currency: 'ETB',
    et_monthly_bonus: 'Bonus: 300 Birr',
    et_monthly_desc: 'Xidhmo internet oo Premium ah oo aan xad lahayn. Hel internet xawaare buuxa muddo bil ah.',
    et_monthly_feat1: 'Internet Xad la\'aan',
    et_monthly_feat2: 'Xawaare Premium',
    et_monthly_feat3: 'Bonus 300 Birr',
    et_monthly_feat4: 'Bilaab Isla Markiiba',

    /* ── EthioTelecom — Weekly ── */
    et_weekly_badge: 'Xidhmo Toddobaadlaha',
    et_weekly_title: 'ISBUUCLE XADIDNAYN',
    et_weekly_subtitle: 'Weekly Unlimited Internet',
    et_weekly_duration: '1 Toddobaad',
    et_weekly_price: '550',
    et_weekly_currency: 'ETB',
    et_weekly_bonus: 'Bonus: 90 Birr',
    et_weekly_desc: 'Xidhmo internet oo aan xad lahayn toddobaadkiiba. Ku habboon isticmaalka toddobaadlaha ah.',
    et_weekly_feat1: 'Internet Xad la\'aan',
    et_weekly_feat2: 'Xawaare Buuxa',
    et_weekly_feat3: 'Bonus 90 Birr',
    et_weekly_feat4: 'Taageero Joogto ah',

    /* ── EthioTelecom — Voice + Internet + SMS ── */
    et_daily_badge: 'Xidhmo Bille ah',
    et_daily_title: 'PREMIUM CODKA + INTERNET',
    et_daily_subtitle: 'Monthly Unlimited Premium Voice + Internet + SMS',
    et_daily_duration: '1 Bil',
    et_daily_price: '2,450',
    et_daily_currency: 'ETB',
    et_daily_bonus: 'Bonus: 300 Birr',
    et_daily_desc: 'Xidhmo Premium ah oo ku jirta Codka, Internet, iyo SMS oo aan xad lahayn. Hel wax walba hal xidhmo.',
    et_daily_feat1: 'Internet Xad la\'aan',
    et_daily_feat2: 'Codka Xad la\'aan',
    et_daily_feat3: 'SMS Xad la\'aan',
    et_daily_feat4: 'Bonus 300 Birr',

    /* ── Contact ── */
    contact_label: 'Xiriirka',
    contact_title: 'Nala Soo Xidhiidh',
    contact_desc: "Su'aalo ma qabtaa ama ma doonaysaa inaad dalbato xidhmo internet? Nagala soo xidhiidh isla hadda!",
    contact_whatsapp_sub: 'Nagala soo xidhiidh',
    contact_phone_name: 'Wac Hadda',
    contact_not_configured: 'Ma diyaar galin',

    /* ── Footer ── */
    footer_desc: 'Adeeg internet oo tayo leh, qiimo jaban, iyo xawaare sare.',
    footer_quick_links: 'Xiriirrada Degdega',
    footer_services: 'Adeegyada',
    footer_svc_monthly: 'Xidhmo Bille ah',
    footer_svc_weekly: 'Xidhmo Isbuucle ah',
    footer_svc_daily: 'Xidhmo Maalinle ah',
    footer_copyright: '© 2026 Internetka Bilaaha. Dhammaan xuquuqda waa la ilaaliyay.',
    footer_tagline: 'Adeeg internet oo tayo leh 🌐',

    /* ── Lang Button ── */
    lang_btn_label: 'English',
    lang_btn_flag: '🇬🇧',
  },

  en: {
    /* ── Navbar ── */
    nav_home: 'Home',
    nav_packages: 'Internet Packages',
    nav_contact: 'Contact Us',
    nav_cta: 'Get Connected',

    /* ── Hero ── */
    hero_badge: 'Internet Service',
    hero_heading_1: 'Welcome, dear customer!',
    hero_heading_em: 'We have for you',
    hero_heading_2: 'all the internet packages you need.',
    hero_desc: 'Browse the available internet packages and contact us to order your service.',
    hero_btn_packages: 'View Packages',
    hero_btn_contact: 'Contact Us',
    hero_stat_types: 'Package Types',
    hero_stat_support: 'Always On',
    hero_stat_quality: 'Top Quality',

    /* ── Packages ── */
    packages_label: 'Our Services',
    packages_title: 'Internet Packages',
    packages_desc: 'Choose the package that suits you best, then contact us to get high-quality internet service.',

    /* Monthly */
    pkg_monthly_badge: 'Monthly Package',
    pkg_monthly_title: 'UNLIMITED MONTHLY',
    pkg_monthly_subtitle: 'Monthly plan',
    pkg_monthly_duration: '1 Month',
    pkg_monthly_price: '2,750',
    pkg_monthly_currency: 'Birr',
    pkg_monthly_desc: 'An internet package suited for monthly usage. Get high-speed unlimited internet for a full month.',
    pkg_monthly_feat1: 'Unlimited Internet',
    pkg_monthly_feat2: 'High Speed',
    pkg_monthly_feat3: 'Reliable Connection',
    pkg_monthly_feat4: '24/7 Support',

    /* Weekly */
    pkg_weekly_badge: 'Weekly Package',
    pkg_weekly_title: 'UNLIMITED WEEKLY',
    pkg_weekly_subtitle: 'Weekly plan',
    pkg_weekly_duration: '1 Week',
    pkg_weekly_price: '850',
    pkg_weekly_currency: 'Birr',
    pkg_weekly_desc: 'An internet package designed for your weekly needs. Full speed that lasts throughout the entire week.',
    pkg_weekly_feat1: 'Unlimited Internet',
    pkg_weekly_feat2: 'Full Speed',
    pkg_weekly_feat3: 'Stable Connection',
    pkg_weekly_feat4: 'Ongoing Support',

    /* Daily */
    pkg_daily_badge: 'Daily Package',
    pkg_daily_title: 'UNLIMITED DAILY',
    pkg_daily_subtitle: 'Daily plan',
    pkg_daily_duration: '1 Day',
    pkg_daily_price: '135',
    pkg_daily_currency: 'Birr',
    pkg_daily_desc: 'An internet package designed for daily usage. Perfect for those with an urgent short-term need.',
    pkg_daily_feat1: 'Unlimited Internet',
    pkg_daily_feat2: 'Fast Speed',
    pkg_daily_feat3: 'Instant Activation',
    pkg_daily_feat4: 'Affordable Price',

    pkg_cta: 'Contact Us',

    /* ── Provider Switcher ── */
    provider_safaricom: 'SafariCom',
    provider_ethiotelecom: 'Ethiopia Telecom',
    provider_select_label: 'Select Provider',

    /* ── EthioTelecom — Monthly ── */
    et_monthly_badge: 'Monthly Package',
    et_monthly_title: 'UNLIMITED PREMIUM',
    et_monthly_subtitle: 'Monthly Unlimited Premium: Unlimited Internet',
    et_monthly_duration: '1 Month',
    et_monthly_price: '1,850',
    et_monthly_currency: 'ETB',
    et_monthly_bonus: 'Bonus: 300 Birr',
    et_monthly_desc: 'Premium unlimited internet package. Enjoy full-speed unlimited internet for an entire month.',
    et_monthly_feat1: 'Unlimited Internet',
    et_monthly_feat2: 'Premium Speed',
    et_monthly_feat3: 'Bonus 300 Birr',
    et_monthly_feat4: 'Instant Activation',

    /* ── EthioTelecom — Weekly ── */
    et_weekly_badge: 'Weekly Package',
    et_weekly_title: 'UNLIMITED WEEKLY',
    et_weekly_subtitle: 'Weekly Unlimited Internet',
    et_weekly_duration: '1 Week',
    et_weekly_price: '550',
    et_weekly_currency: 'ETB',
    et_weekly_bonus: 'Bonus: 90 Birr',
    et_weekly_desc: 'Unlimited internet package for the full week. Ideal for weekly internet usage needs.',
    et_weekly_feat1: 'Unlimited Internet',
    et_weekly_feat2: 'Full Speed',
    et_weekly_feat3: 'Bonus 90 Birr',
    et_weekly_feat4: 'Ongoing Support',

    /* ── EthioTelecom — Voice + Internet + SMS ── */
    et_daily_badge: 'Monthly Package',
    et_daily_title: 'PREMIUM VOICE + INTERNET',
    et_daily_subtitle: 'Monthly Unlimited Premium Voice + Internet + SMS',
    et_daily_duration: '1 Month',
    et_daily_price: '2,450',
    et_daily_currency: 'ETB',
    et_daily_bonus: 'Bonus: 300 Birr',
    et_daily_desc: 'Premium unlimited package including Voice calls, Internet, and SMS. Get everything in one plan.',
    et_daily_feat1: 'Unlimited Internet',
    et_daily_feat2: 'Unlimited Voice Calls',
    et_daily_feat3: 'Unlimited SMS',
    et_daily_feat4: 'Bonus 300 Birr',

    /* ── Contact ── */
    contact_label: 'Contact',
    contact_title: 'Contact Us',
    contact_desc: 'Do you have questions or want to order an internet package? Contact us right now!',
    contact_whatsapp_sub: 'Contact us',
    contact_phone_name: 'Call Now',
    contact_not_configured: 'Not configured',

    /* ── Footer ── */
    footer_desc: 'Quality internet service, affordable prices, and high speed.',
    footer_quick_links: 'Quick Links',
    footer_services: 'Services',
    footer_svc_monthly: 'Monthly Package',
    footer_svc_weekly: 'Weekly Package',
    footer_svc_daily: 'Daily Package',
    footer_copyright: '© 2026 Internetka Bilaaha. All rights reserved.',
    footer_tagline: 'Quality internet service 🌐',

    /* ── Lang Button ── */
    lang_btn_label: 'Soomaali',
    lang_btn_flag: '🇸🇴',
  },
};

/* ──────────────────────────────────────────────
   CONTEXT
   ────────────────────────────────────────────── */
const LanguageContext = createContext(null);

const STORAGE_KEY = 'ib_lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'so' ? saved : 'so';
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'so' ? 'en' : 'so';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  /** t(key) — returns the translated string for the current language */
  const t = useCallback(
    (key) => translations[lang][key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
