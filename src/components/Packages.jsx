import { useEffect, useRef } from 'react';
import { CalendarDays, Clock, Zap } from 'lucide-react';
import '../styles/Packages.css';

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const PACKAGES = [
  {
    id: 'bile',
    Icon: CalendarDays,
    badge: 'Xidhmo Bille ah',
    title: 'BILE AAN XADIDNAYN',
    subtitle: 'Xidhmo bille ah',
    desc: 'Xidhmo internet oo ku habboon isticmaalka muddada bisha. Hel internet xawaare sare oo aan xad lahayn muddo bil ah.',
  },
  {
    id: 'isbuucle',
    Icon: Clock,
    badge: 'Xidhmo Toddobaadlaha',
    title: 'ISBUUCLE AAN XADIDNAYN',
    subtitle: 'Xidhmo isbuucle ah',
    desc: 'Xidhmo internet oo ku habboon baahiyahaaga toddobaadlaha ah. Xawaare buuxa oo toddobaad oo dhan socda.',
  },
  {
    id: 'maalinle',
    Icon: Zap,
    badge: 'Xidhmo Maalinlaha',
    title: 'MAALINLE AAN XADIDNAYN',
    subtitle: 'Xidhmo maalinle ah',
    desc: 'Xidhmo internet oo loogu talagalay isticmaalka maalinlaha ah. Ku habboon kuwa baahi degdeg ah u qaba.',
  },
];

export default function Packages() {
  const sectionRef = useRef(null);

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
  }, []);

  return (
    <section id="packages" className="packages section" aria-labelledby="packages-heading">
      <div className="container" ref={sectionRef}>
        <header className="packages__header">
          <span className="section-label">Adeegyadayada</span>
          <h2 id="packages-heading" className="section-title">
            Xidhmooyinka Internet-ka
          </h2>
          <p className="section-desc">
            Dooro xidhmada kugu habboon, nagalana soo xidhiidh si aad u hesho adeeg
            internet oo tayo leh.
          </p>
        </header>

        <div className="packages__grid" role="list">
          {PACKAGES.map(({ id, Icon, badge, title, subtitle, desc }) => (
            <article key={id} className="package-card" role="listitem">
              <div className="package-card__icon-wrap" aria-hidden="true">
                <Icon size={30} strokeWidth={1.7} />
              </div>

              <span className="package-card__badge">{badge}</span>

              <h3 className="package-card__title">{title}</h3>
              <p className="package-card__subtitle">{subtitle}</p>

              <div className="package-card__divider" aria-hidden="true" />

              <p className="package-card__desc">{desc}</p>

              <button
                className="package-card__btn"
                onClick={() => smoothScrollTo('contact')}
                aria-label={`Nala soo xidhiidh xidhmada ${title}`}
              >
                Nala Soo Xidhiidh
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
