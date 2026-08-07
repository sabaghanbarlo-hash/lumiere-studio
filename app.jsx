const { useState, useEffect, useRef, useCallback } = React;

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const HAIR_SERVICES = [
  { name: "Signature Haircut", price: "€65", desc: "A precision cut tailored to your face shape and how you actually wear your hair day to day." },
  { name: "Blow Dry", price: "€40", desc: "Volume and movement, styled to hold — no product residue, no stiffness." },
  { name: "Balayage", price: "€140+", desc: "Hand-painted colour for soft, sun-warmed dimension that grows out gracefully." },
  { name: "Full Colour", price: "€110+", desc: "Single-process colour applied root to end, matched to your natural undertone." },
  { name: "Hair Treatment", price: "€55", desc: "A deep, protein-rich repair for hair that has been through a lot lately." },
];

const HAIR_SERVICES_MORE = [
  { name: "Root Touch-Up", price: "€70", desc: "Colour refreshed at the root only, between full appointments." },
  { name: "Gloss Treatment", price: "€45", desc: "A clear or tinted gloss for shine and tone correction." },
  { name: "Men's Cut", price: "€55", desc: "Precision cutting and styling, tailored to texture and growth pattern." },
];

const BEAUTY_SERVICES = [
  { name: "Signature Facial", price: "€85", desc: "A tailored facial built around cold-pressed, plant-based actives." },
  { name: "Brow Design", price: "€30", desc: "Shape and tint mapped to your natural bone structure." },
  { name: "Lash Lift", price: "€65", desc: "A natural, lifted curl that holds for six to eight weeks." },
];

const BEAUTY_SERVICES_MORE = [
  { name: "Express Facial", price: "€55", desc: "A shorter facial for when your skin needs a reset before an event." },
  { name: "Makeup Application", price: "€90", desc: "Day or evening makeup, suited to your features and the occasion." },
];

const GALLERY_ITEMS = [
  {
    type: "image",
    size: "wide",
    src: "https://images.unsplash.com/photo-1746723375184-5f537d2e6f31?auto=format&fit=crop&w=1600&q=80",
    alt: "The bright, minimal interior of LUMIÈRE Studio, with salon chairs and soft natural light",
    caption: "The studio, mid-morning light.",
  },
  {
    type: "image",
    size: "tall",
    src: "https://images.unsplash.com/photo-1760862652442-e8ff7ebdd2f8?auto=format&fit=crop&w=1200&q=80",
    alt: "Shelves of skincare and hair products arranged neatly in warm, neutral tones",
    caption: "The details we choose carefully.",
  },
  {
    type: "quote",
    size: "small",
    text: "We don't rush transformation. We refine it.",
    attribution: "— The LUMIÈRE philosophy",
  },
  {
    type: "image",
    size: "wide",
    src: "https://images.unsplash.com/photo-1731514771613-991a02407132?auto=format&fit=crop&w=1600&q=80",
    alt: "A client relaxing during a facial treatment at the studio",
    caption: "Beauty treatments, unhurried.",
  },
  {
    type: "image",
    size: "small",
    src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80",
    alt: "A stylist washing a client's hair, mid-conversation, at LUMIÈRE Studio",
    caption: "In good hands.",
  },
  {
    type: "address",
    size: "tall",
    eyebrow: "L'ATELIER",
    text: "27 Rue du Bac, 75007 Paris — established 2016.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I've had colour done all over Paris and this was different — the stylist actually listened before touching my hair. My balayage has never grown out this well.",
    name: "Élise",
    detail: "Client since 2022",
  },
  {
    quote: "The consultation alone was worth the visit. They didn't just ask what I wanted, they asked why — and gently talked me out of a cut that wouldn't have suited me.",
    name: "Nora",
    detail: "Signature Haircut",
  },
  {
    quote: "No phones ringing, no rushing, just quiet and good coffee. I left with a great haircut and an hour to myself I didn't know I needed.",
    name: "Salomé",
    detail: "Blow Dry & Treatment",
  },
];

const HOURS = [
  ["Monday", "9:00 – 18:00"],
  ["Tuesday", "9:00 – 19:00"],
  ["Wednesday", "9:00 – 19:00"],
  ["Thursday", "9:00 – 20:00"],
  ["Friday", "9:00 – 20:00"],
  ["Saturday", "9:00 – 18:00"],
  ["Sunday", "Closed"],
];

const ALL_SERVICE_NAMES = [
  ...HAIR_SERVICES,
  ...HAIR_SERVICES_MORE,
  ...BEAUTY_SERVICES,
  ...BEAUTY_SERVICES_MORE,
].map((s) => s.name);

/* ------------------------------------------------------------------ */
/*  HOOKS                                                              */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

function Reveal({ children, className = "", as: Tag = "div", delay = 0, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: reduced ? "0ms" : `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL COMPONENTS                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}

function PrimaryButton({ children, onClick, href, ...rest }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag className="btn btn-primary" href={href} onClick={onClick} {...rest}>
      <span>{children}</span>
    </Tag>
  );
}

function SecondaryButton({ children, onClick, href, ...rest }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag className="btn btn-secondary" href={href} onClick={onClick} {...rest}>
      <span>{children}</span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */

function Header({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-inner">
        <a href="#home" className="logo" onClick={() => setMenuOpen(false)}>
          LUMIÈRE
        </a>

        <nav className="primary-nav" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <PrimaryButton onClick={onBook} className="header-cta">
            Book an Appointment
          </PrimaryButton>
          <button
            className={`hamburger ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav className="mobile-nav" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="mobile-nav-link"
              style={{ transitionDelay: `${i * 40}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <PrimaryButton
          onClick={() => {
            setMenuOpen(false);
            onBook();
          }}
        >
          Book an Appointment
        </PrimaryButton>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                                */
/* ------------------------------------------------------------------ */

function Hero({ onBook }) {
  return (
    <section id="home" className="hero">
      <div className="hero-media">
        <img
          src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=2000&q=80"
          alt="A hairstylist washing and caring for a client's hair inside LUMIÈRE Studio in Paris"
          loading="eager"
        />
        <div className="hero-scrim" />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Paris — Rue du Bac</p>
        <h1 className="hero-title">
          Beauty, <em>refined.</em>
        </h1>
        <p className="hero-copy">
          A modern beauty studio in the heart of Paris, creating effortless hair and beauty
          looks designed around you.
        </p>
        <div className="hero-actions">
          <PrimaryButton onClick={onBook}>Book an Appointment</PrimaryButton>
          <SecondaryButton href="#services">Explore Services</SecondaryButton>
        </div>
      </div>

      <div className="hero-spine" aria-hidden="true">
        <span>LUMIÈRE STUDIO — ÉTABLI 2016</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  INTRO                                                              */
/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <section className="section intro">
      <div className="container intro-grid">
        <Reveal as="div" className="intro-heading">
          <Eyebrow>Our Approach</Eyebrow>
          <h2>
            Where confidence <br className="lg-only" />
            meets craftsmanship.
          </h2>
        </Reveal>
        <Reveal as="div" className="intro-copy" delay={80}>
          <p>
            LUMIÈRE was built on a simple idea: beauty should feel effortless, not performed.
            Every visit begins with an unhurried conversation — about your hair's history, your
            daily rhythm, the version of yourself you're growing into — before a single tool is
            picked up.
          </p>
          <p>
            Our stylists and colourists trained across some of Paris's most respected maisons,
            and they bring that precision here, tempered by a calmer, more personal pace. We
            don't chase trends. We study your features, your texture, your life, and build
            outward from there.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICES                                                            */
/* ------------------------------------------------------------------ */

function ServiceRow({ item }) {
  return (
    <li className="service-row">
      <div className="service-row-top">
        <span className="service-name">{item.name}</span>
        <span className="service-rule" aria-hidden="true" />
        <span className="service-price">{item.price}</span>
      </div>
      <p className="service-desc">{item.desc}</p>
    </li>
  );
}

function Services({ onBook }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="services" className="section services">
      <div className="container">
        <Reveal as="div" className="section-heading">
          <Eyebrow>Services</Eyebrow>
          <h2>Considered, not rushed.</h2>
        </Reveal>

        <div className="services-grid">
          <Reveal as="div" className="service-column">
            <h3 className="service-col-title">Hair</h3>
            <ul>
              {HAIR_SERVICES.map((s) => (
                <ServiceRow key={s.name} item={s} />
              ))}
              <div className={`service-more ${showMore ? "is-open" : ""}`}>
                <ul>
                  {HAIR_SERVICES_MORE.map((s) => (
                    <ServiceRow key={s.name} item={s} />
                  ))}
                </ul>
              </div>
            </ul>
          </Reveal>

          <Reveal as="div" className="service-column" delay={100}>
            <h3 className="service-col-title">Beauty</h3>
            <ul>
              {BEAUTY_SERVICES.map((s) => (
                <ServiceRow key={s.name} item={s} />
              ))}
              <div className={`service-more ${showMore ? "is-open" : ""}`}>
                <ul>
                  {BEAUTY_SERVICES_MORE.map((s) => (
                    <ServiceRow key={s.name} item={s} />
                  ))}
                </ul>
              </div>
            </ul>
          </Reveal>
        </div>

        <div className="services-footer">
          <button
            className="text-link"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
          >
            {showMore ? "Show Fewer Services" : "View All Services"}
            <span className={`chevron ${showMore ? "is-open" : ""}`} aria-hidden="true" />
          </button>
          <PrimaryButton onClick={onBook}>Book an Appointment</PrimaryButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURED SERVICE                                                    */
/* ------------------------------------------------------------------ */

function Featured({ onBook }) {
  return (
    <section className="section featured">
      <div className="container featured-grid">
        <Reveal as="div" className="featured-media">
          <img
            src="https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?auto=format&fit=crop&w=1400&q=80"
            alt="A stylist cutting a client's hair with scissors during a Signature appointment"
            loading="lazy"
          />
        </Reveal>
        <Reveal as="div" className="featured-content" delay={100}>
          <Eyebrow>The Signature</Eyebrow>
          <h2>The Lumière Signature</h2>
          <p>
            A personalised cut, styling consultation, and finishing ritual designed to
            complement your natural features — not override them.
          </p>
          <dl className="featured-meta">
            <div>
              <dt>Duration</dt>
              <dd>90 minutes</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>€120</dd>
            </div>
          </dl>
          <PrimaryButton onClick={onBook}>Reserve the Signature</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT                                                               */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <Reveal as="div" className="about-media">
          <img
            src="https://images.unsplash.com/photo-1712213396688-c6f2d536671f?auto=format&fit=crop&w=1400&q=80"
            alt="A colourist working on a client's hair inside the warm-toned LUMIÈRE studio"
            loading="lazy"
          />
        </Reveal>
        <Reveal as="div" className="about-content" delay={100}>
          <Eyebrow>The Studio</Eyebrow>
          <h2>Designed around you.</h2>
          <p>
            Every appointment at LUMIÈRE begins with a proper consultation — never a rushed
            five-minute chat while a cape is fastened. We ask what's working, what isn't, and
            what you've been afraid to ask for. Only then do we recommend a direction.
          </p>
          <p>
            We follow technique, not trend. A style that photographs well but takes forty
            minutes to recreate at home isn't a good result in our eyes — it's a missed
            consultation. Our focus stays on results you can actually live with.
          </p>
          <ul className="about-facts">
            <li>Consultation included with every appointment</li>
            <li>Senior colourists trained across Paris's leading maisons</li>
            <li>Independently owned on Rue du Bac since 2016</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  GALLERY                                                             */
/* ------------------------------------------------------------------ */

function GalleryTile({ item }) {
  if (item.type === "image") {
    return (
      <figure className={`gallery-tile gallery-${item.size}`}>
        <div className="gallery-tile-media">
          <img src={item.src} alt={item.alt} loading="lazy" />
        </div>
        <figcaption>{item.caption}</figcaption>
      </figure>
    );
  }
  if (item.type === "quote") {
    return (
      <div className={`gallery-tile gallery-${item.size} gallery-panel gallery-quote`}>
        <p>{item.text}</p>
        <span>{item.attribution}</span>
      </div>
    );
  }
  return (
    <div className={`gallery-tile gallery-${item.size} gallery-panel gallery-address`}>
      <span className="gallery-panel-eyebrow">{item.eyebrow}</span>
      <p>{item.text}</p>
    </div>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <Reveal as="div" className="section-heading">
          <Eyebrow>Gallery</Eyebrow>
          <h2>Inside the studio.</h2>
        </Reveal>
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item, i) => (
            <Reveal as="div" key={i} delay={(i % 3) * 80} className="gallery-reveal">
              <GalleryTile item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                        */
/* ------------------------------------------------------------------ */

function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <Reveal as="div" className="section-heading center">
          <Eyebrow>In Their Words</Eyebrow>
          <h2>What clients notice first.</h2>
        </Reveal>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="blockquote" className="testimonial-card" key={t.name} delay={i * 90}>
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <p>{t.quote}</p>
              <footer>
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-detail">{t.detail}</span>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  BOOKING CTA                                                         */
/* ------------------------------------------------------------------ */

function BookingCta({ onBook }) {
  return (
    <section className="section booking-cta">
      <div className="container booking-cta-inner">
        <Reveal as="div">
          <h2>
            Your appointment <br className="lg-only" />
            starts here.
          </h2>
          <p>Tell us what you're looking for and we'll help you find the right service.</p>
          <PrimaryButton onClick={onBook}>Book an Appointment</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT                                                             */
/* ------------------------------------------------------------------ */

function MapVisual() {
  return (
    <svg
      className="map-visual"
      viewBox="0 0 400 320"
      role="img"
      aria-label="Stylised map illustration showing the studio location near Rue du Bac, Paris"
    >
      <rect width="400" height="320" fill="var(--ivory-deep)" />
      {[40, 90, 140, 190, 240, 290, 340].map((x) => (
        <line key={"v" + x} x1={x} y1="0" x2={x} y2="320" stroke="var(--taupe-line)" strokeWidth="1" />
      ))}
      {[30, 80, 130, 180, 230, 280].map((y) => (
        <line key={"h" + y} x1="0" y1={y} x2="400" y2={y} stroke="var(--taupe-line)" strokeWidth="1" />
      ))}
      <line x1="0" y1="150" x2="400" y2="170" stroke="var(--taupe)" strokeWidth="3" />
      <line x1="180" y1="0" x2="210" y2="320" stroke="var(--taupe)" strokeWidth="3" />
      <circle cx="196" cy="160" r="7" fill="var(--gold)" />
      <circle cx="196" cy="160" r="14" fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.6" />
      <text x="206" y="150" className="map-label">
        LUMIÈRE
      </text>
      <text x="206" y="167" className="map-label-sub">
        27 Rue du Bac
      </text>
    </svg>
  );
}

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact-grid">
        <Reveal as="div" className="contact-info">
          <Eyebrow>Visit</Eyebrow>
          <h2>LUMIÈRE Studio</h2>
          <address>
            27 Rue du Bac
            <br />
            75007 Paris, France
          </address>

          <div className="contact-line">
            <span>Phone</span>
            <a href="tel:+33184000000">+33 1 84 00 00 00</a>
          </div>
          <div className="contact-line">
            <span>Email</span>
            <a href="mailto:hello@lumierestudio.example">hello@lumierestudio.example</a>
          </div>

          <h3 className="hours-title">Opening Hours</h3>
          <ul className="hours-list">
            {HOURS.map(([day, time]) => (
              <li key={day}>
                <span>{day}</span>
                <span className="hours-time">{time}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" className="contact-map" delay={100}>
          <MapVisual />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="logo footer-logo">LUMIÈRE</span>
          <p>Paris, France</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="footer-social">
          <span className="footer-col-title">Follow</span>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>

        <form className="footer-newsletter" onSubmit={handleSubmit}>
          <span className="footer-col-title">Newsletter</span>
          {submitted ? (
            <p className="newsletter-thanks">You're on the list — thank you.</p>
          ) : (
            <div className="newsletter-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" aria-label="Subscribe">
                →
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 LUMIÈRE Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  BOOKING MODAL                                                       */
/* ------------------------------------------------------------------ */

function BookingModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: "", date: "", message: "" });
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setForm({ name: "", email: "", service: "", date: "", message: "" });
      const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open) return null;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close booking form">
          ×
        </button>

        {submitted ? (
          <div className="modal-success">
            <p className="eyebrow">Request Received</p>
            <h3>Thank you, {form.name.split(" ")[0] || "there"}.</h3>
            <p>
              We've received your request and will confirm your appointment by email within one
              business day.
            </p>
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          </div>
        ) : (
          <>
            <p className="eyebrow">Book an Appointment</p>
            <h3 id="modal-title">Let's find your time.</h3>
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="bf-name">Full name</label>
                <input
                  id="bf-name"
                  ref={firstFieldRef}
                  required
                  value={form.name}
                  onChange={update("name")}
                />
              </div>
              <div className="form-row">
                <label htmlFor="bf-email">Email</label>
                <input
                  id="bf-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                />
              </div>
              <div className="form-row">
                <label htmlFor="bf-service">Service</label>
                <select id="bf-service" required value={form.service} onChange={update("service")}>
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {ALL_SERVICE_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="bf-date">Preferred date</label>
                <input id="bf-date" type="date" value={form.date} onChange={update("date")} />
              </div>
              <div className="form-row">
                <label htmlFor="bf-message">Anything we should know?</label>
                <textarea
                  id="bf-message"
                  rows={3}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Hair history, allergies, inspiration — optional"
                />
              </div>
              <PrimaryButton type="submit">Request Appointment</PrimaryButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL STYLES                                                       */
/* ------------------------------------------------------------------ */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap');

    :root{
      --ivory:#F7F2EA;
      --ivory-deep:#EFE6D6;
      --white:#FFFDFA;
      --charcoal:#241F1A;
      --charcoal-soft:#59524A;
      --taupe:#9C8B76;
      --taupe-line:rgba(36,31,26,0.14);
      --gold:#AC8A4E;
      --display: 'Fraunces', Georgia, serif;
      --body: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --container: 1240px;
      --radius: 2px;
    }

    *,*::before,*::after{ box-sizing:border-box; }
    html{ scroll-behavior:smooth; }
    body{ margin:0; }

    .lumiere-app{
      font-family: var(--body);
      color: var(--charcoal);
      background: var(--ivory);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    .lumiere-app h1, .lumiere-app h2, .lumiere-app h3{
      font-family: var(--display);
      font-weight: 500;
      line-height: 1.08;
      margin: 0 0 0.5em;
      letter-spacing: -0.01em;
      color: var(--charcoal);
    }
    .lumiere-app h2{ font-size: clamp(2rem, 3.6vw, 3rem); }
    .lumiere-app h3{ font-size: clamp(1.3rem, 2vw, 1.7rem); font-weight: 500; }
    .lumiere-app p{ margin: 0 0 1em; line-height: 1.7; color: var(--charcoal-soft); }
    .lumiere-app em{ font-style: italic; font-family: var(--display); }
    .lumiere-app a{ color: inherit; text-decoration: none; }
    .lumiere-app ul{ list-style:none; margin:0; padding:0; }
    .lumiere-app img{ display:block; max-width:100%; }

    .sr-only{
      position:absolute; width:1px; height:1px; padding:0; margin:-1px;
      overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
    }

    .container{ max-width: var(--container); margin: 0 auto; padding: 0 clamp(20px, 5vw, 48px); }
    .section{ padding: clamp(64px, 10vw, 128px) 0; }
    .lg-only{ display:none; }
    @media (min-width: 900px){ .lg-only{ display:inline; } }

    .eyebrow{
      font-family: var(--body);
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--gold);
      margin: 0 0 14px;
    }

    .section-heading{ max-width: 640px; margin-bottom: 48px; }
    .section-heading.center{ margin-left:auto; margin-right:auto; text-align:center; }

    /* ---------- Reveal animation ---------- */
    .reveal{
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.8s cubic-bezier(.22,.61,.36,1), transform 0.8s cubic-bezier(.22,.61,.36,1);
    }
    .reveal.is-visible{ opacity: 1; transform: translateY(0); }
    @media (prefers-reduced-motion: reduce){
      .reveal{ opacity:1 !important; transform:none !important; transition:none !important; }
    }

    /* ---------- Buttons ---------- */
    .btn{
      display:inline-flex; align-items:center; justify-content:center;
      font-family: var(--body); font-weight: 600; font-size: 0.86rem;
      letter-spacing: 0.03em;
      padding: 15px 30px;
      border-radius: var(--radius);
      cursor: pointer;
      border: 1px solid transparent;
      transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease, transform 0.25s ease;
      white-space: nowrap;
    }
    .btn:active{ transform: translateY(1px); }
    .btn-primary{
      background: var(--charcoal); color: var(--ivory); border-color: var(--charcoal);
    }
    .btn-primary:hover{ background: var(--gold); border-color: var(--gold); color: var(--white); }
    .btn-secondary{
      background: transparent; color: var(--charcoal); border-color: var(--taupe-line);
    }
    .btn-secondary:hover{ border-color: var(--charcoal); }

    .text-link{
      background:none; border:none; cursor:pointer;
      font-family: var(--body); font-weight:600; font-size:0.86rem;
      color: var(--charcoal); letter-spacing:0.02em;
      display:inline-flex; align-items:center; gap:8px;
      padding: 8px 0; border-bottom: 1px solid var(--charcoal);
    }
    .chevron{
      width:7px; height:7px; border-right:1.5px solid currentColor; border-bottom:1.5px solid currentColor;
      transform: rotate(45deg); transition: transform 0.3s ease; margin-top:-3px;
    }
    .chevron.is-open{ transform: rotate(-135deg); margin-top:3px; }

    /* ---------- Header ---------- */
    .site-header{
      position: fixed; top:0; left:0; right:0; z-index: 60;
      background: transparent;
      transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
      padding: 22px 0;
    }
    .site-header.is-scrolled{
      background: rgba(247,242,234,0.92);
      backdrop-filter: blur(10px);
      box-shadow: 0 1px 0 var(--taupe-line);
      padding: 14px 0;
    }
    .site-header-inner{
      max-width: var(--container); margin:0 auto; padding: 0 clamp(20px,5vw,48px);
      display:flex; align-items:center; justify-content:space-between;
    }
    .logo{
      font-family: var(--display); font-size: 1.35rem; letter-spacing: 0.06em;
      font-weight: 500; color: var(--charcoal);
    }
    .primary-nav{ display:none; gap: 36px; }
    @media (min-width: 900px){ .primary-nav{ display:flex; } }
    .nav-link{
      font-size: 0.86rem; font-weight: 600; letter-spacing: 0.02em;
      position: relative; padding: 4px 0; color: var(--charcoal);
    }
    .nav-link::after{
      content:""; position:absolute; left:0; right:100%; bottom:-2px; height:1px;
      background: var(--gold); transition: right 0.35s ease;
    }
    .nav-link:hover::after{ right:0; }

    .header-actions{ display:flex; align-items:center; gap: 20px; }
    .header-cta{ display:none; }
    @media (min-width: 900px){ .header-cta{ display:inline-flex; } }

    .hamburger{
      display:flex; flex-direction:column; justify-content:center; gap:5px;
      width:36px; height:36px; background:none; border:none; cursor:pointer; padding:0;
    }
    @media (min-width: 900px){ .hamburger{ display:none; } }
    .hamburger span{ height:1.5px; background:var(--charcoal); transition: transform 0.3s ease, opacity 0.3s ease; }
    .hamburger span:nth-child(1){ width:100%; }
    .hamburger span:nth-child(2){ width:70%; align-self:flex-end; }
    .hamburger span:nth-child(3){ width:100%; }
    .hamburger.is-open span:nth-child(1){ transform: translateY(6.5px) rotate(45deg); width:100%; }
    .hamburger.is-open span:nth-child(2){ opacity:0; }
    .hamburger.is-open span:nth-child(3){ transform: translateY(-6.5px) rotate(-45deg); width:100%; }

    .mobile-menu{
      position: fixed; inset:0; top:0; background: var(--ivory);
      display:flex; flex-direction:column; align-items:flex-start; justify-content:center;
      gap: 28px; padding: 0 clamp(24px,8vw,64px);
      transform: translateY(-8px); opacity:0; pointer-events:none;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .mobile-menu.is-open{ opacity:1; transform:none; pointer-events:auto; }
    .mobile-nav{ display:flex; flex-direction:column; gap: 18px; margin-bottom: 12px; }
    .mobile-nav-link{
      font-family: var(--display); font-size: 2.1rem; font-weight:400;
      opacity:0; transform: translateY(14px);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .mobile-menu.is-open .mobile-nav-link{ opacity:1; transform:none; }

    /* ---------- Hero ---------- */
    .hero{
      position: relative; min-height: 100svh; display:flex; align-items:flex-end;
      overflow:hidden; color: var(--white);
    }
    .hero-media{ position:absolute; inset:0; }
    .hero-media img{ width:100%; height:100%; object-fit:cover; }
    .hero-scrim{
      position:absolute; inset:0;
      background: linear-gradient(180deg, rgba(24,20,16,0.35) 0%, rgba(24,20,16,0.18) 38%, rgba(24,20,16,0.72) 100%);
    }
    .hero-content{
      position: relative; z-index:2; max-width: 760px;
      padding: 0 clamp(20px,6vw,80px) clamp(72px,10vw,120px);
    }
    .hero-eyebrow{
      text-transform:uppercase; letter-spacing:0.2em; font-size:0.74rem; font-weight:700;
      color: var(--gold); margin-bottom:18px;
    }
    .hero-title{
      font-size: clamp(2.8rem, 8vw, 6.2rem); color:#fff; margin-bottom: 0.28em;
      letter-spacing: -0.02em;
    }
    .hero-title em{ color: #F1E6CE; }
    .hero-copy{ color: rgba(255,255,255,0.86); max-width: 480px; font-size: 1.05rem; margin-bottom: 34px; }
    .hero-actions{ display:flex; flex-wrap:wrap; gap: 16px; }
    .hero .btn-secondary{ color:#fff; border-color: rgba(255,255,255,0.5); }
    .hero .btn-secondary:hover{ border-color:#fff; }

    .hero-spine{
      position:absolute; top:0; right:28px; height:100%; display:none;
      align-items:center; z-index:2;
    }
    @media (min-width:1100px){ .hero-spine{ display:flex; } }
    .hero-spine span{
      writing-mode: vertical-rl; transform: rotate(180deg);
      font-size:0.7rem; letter-spacing:0.3em; color: rgba(255,255,255,0.65);
      text-transform: uppercase;
    }

    /* ---------- Intro ---------- */
    .intro-grid{
      display:grid; grid-template-columns: 1fr; gap: 32px;
    }
    @media (min-width: 860px){
      .intro-grid{ grid-template-columns: 0.9fr 1.1fr; gap: 80px; align-items:start; }
    }
    .intro-heading h2{ max-width: 380px; }
    .intro-copy p:last-child{ margin-bottom:0; }

    /* ---------- Services ---------- */
    .services{ background: var(--ivory-deep); }
    .services-grid{
      display:grid; grid-template-columns: 1fr; gap: 56px;
    }
    @media (min-width: 780px){
      .services-grid{ grid-template-columns: 1fr 1fr; gap: 90px; }
    }
    .service-col-title{
      font-size: 1rem; text-transform:uppercase; letter-spacing:0.14em;
      padding-bottom: 16px; margin-bottom: 8px; border-bottom: 1px solid var(--taupe-line);
      font-family: var(--body); font-weight:700; color: var(--charcoal-soft);
    }
    .service-row{ padding: 20px 0; border-bottom: 1px solid var(--taupe-line); transition: padding-left 0.3s ease; }
    .service-row:hover{ padding-left: 8px; }
    .service-row-top{ display:flex; align-items:baseline; gap:10px; }
    .service-name{ font-family: var(--display); font-size:1.18rem; white-space:nowrap; }
    .service-rule{ flex:1; border-bottom: 1px dotted var(--taupe-line); transform: translateY(-4px); }
    .service-price{ font-weight:700; font-size:0.95rem; color: var(--gold); white-space:nowrap; }
    .service-desc{ margin: 6px 0 0; font-size:0.92rem; max-width: 420px; }
    .service-more{ max-height:0; overflow:hidden; transition: max-height 0.5s ease; }
    .service-more.is-open{ max-height: 700px; }
    .services-footer{
      margin-top: 56px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:24px;
    }

    /* ---------- Featured ---------- */
    .featured-grid{
      display:grid; grid-template-columns:1fr; gap: 40px; align-items:center;
    }
    @media (min-width: 860px){
      .featured-grid{ grid-template-columns: 1.05fr 0.95fr; gap: 80px; }
    }
    .featured-media img{ width:100%; height: clamp(320px, 42vw, 560px); object-fit:cover; border-radius: var(--radius); }
    .featured-content h2{ max-width: 420px; }
    .featured-content p{ max-width: 420px; }
    .featured-meta{
      display:flex; gap: 40px; margin: 28px 0 34px; padding: 20px 0;
      border-top: 1px solid var(--taupe-line); border-bottom: 1px solid var(--taupe-line);
    }
    .featured-meta dt{ font-size:0.72rem; text-transform:uppercase; letter-spacing:0.12em; color: var(--taupe); margin-bottom:6px; }
    .featured-meta dd{ margin:0; font-family: var(--display); font-size:1.3rem; }

    /* ---------- About ---------- */
    .about-grid{
      display:grid; grid-template-columns:1fr; gap: 40px; align-items:center;
    }
    @media (min-width: 860px){
      .about-grid{ grid-template-columns: 0.95fr 1.05fr; gap: 80px; }
      .about .about-media{ order:2; }
      .about .about-content{ order:1; }
    }
    .about-media img{ width:100%; height: clamp(320px, 42vw, 560px); object-fit:cover; border-radius: var(--radius); }
    .about-content p{ max-width: 460px; }
    .about-facts{ margin-top: 26px; display:flex; flex-direction:column; gap:12px; }
    .about-facts li{
      position:relative; padding-left:22px; font-size:0.92rem; color: var(--charcoal-soft);
    }
    .about-facts li::before{
      content:""; position:absolute; left:0; top:8px; width:11px; height:1px; background: var(--gold);
    }

    /* ---------- Gallery ---------- */
    .gallery-grid{
      display:grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 130px;
      gap: 18px;
    }
    @media (max-width: 720px){
      .gallery-grid{ grid-template-columns: repeat(2, 1fr); grid-auto-rows: 150px; }
    }
    .gallery-reveal{ display:contents; }
    .gallery-tile{ position:relative; overflow:hidden; border-radius: var(--radius); }
    .gallery-wide{ grid-column: span 4; grid-row: span 3; }
    .gallery-tall{ grid-column: span 2; grid-row: span 3; }
    .gallery-small{ grid-column: span 2; grid-row: span 2; }
    @media (max-width: 720px){
      .gallery-wide{ grid-column: span 2; grid-row: span 3; }
      .gallery-tall{ grid-column: span 2; grid-row: span 3; }
      .gallery-small{ grid-column: span 1; grid-row: span 2; }
    }
    .gallery-tile-media{ position:absolute; inset:0; overflow:hidden; }
    .gallery-tile-media img{
      width:100%; height:100%; object-fit:cover;
      transition: transform 0.8s cubic-bezier(.22,.61,.36,1);
    }
    .gallery-tile:hover .gallery-tile-media img{ transform: scale(1.06); }
    figure.gallery-tile{ margin:0; }
    figure.gallery-tile figcaption{
      position:absolute; left:0; right:0; bottom:0; padding: 16px 18px;
      font-size:0.82rem; color:#fff; z-index:2;
      background: linear-gradient(0deg, rgba(20,17,14,0.62), rgba(20,17,14,0));
    }
    .gallery-panel{
      display:flex; flex-direction:column; justify-content:center;
      padding: 26px; background: var(--charcoal); color: var(--ivory);
    }
    .gallery-quote p{ font-family: var(--display); font-style:italic; font-size:1.2rem; color:#fff; margin:0 0 10px; line-height:1.3; }
    .gallery-quote span{ font-size:0.74rem; letter-spacing:0.08em; color: var(--gold); }
    .gallery-address{ background: var(--gold); color: var(--charcoal); }
    .gallery-panel-eyebrow{ text-transform:uppercase; letter-spacing:0.18em; font-size:0.7rem; font-weight:700; margin-bottom:10px; display:block; }
    .gallery-address p{ margin:0; font-family: var(--display); font-size:1.15rem; color: var(--charcoal); }

    /* ---------- Testimonials ---------- */
    .testimonial-grid{
      display:grid; grid-template-columns:1fr; gap: 28px;
    }
    @media (min-width: 780px){ .testimonial-grid{ grid-template-columns: repeat(3,1fr); } }
    .testimonial-card{
      margin:0; background: var(--white); border: 1px solid var(--taupe-line);
      padding: 34px 28px; border-radius: var(--radius); position:relative;
    }
    .quote-mark{
      font-family: var(--display); font-size: 3.4rem; color: var(--gold);
      line-height:1; display:block; margin-bottom: 6px; opacity:0.85;
    }
    .testimonial-card p{ font-size:0.98rem; color: var(--charcoal-soft); }
    .testimonial-card footer{ display:flex; flex-direction:column; margin-top:18px; }
    .testimonial-name{ font-family: var(--display); font-size:1.05rem; color: var(--charcoal); }
    .testimonial-detail{ font-size:0.78rem; color: var(--taupe); letter-spacing:0.03em; }

    /* ---------- Booking CTA ---------- */
    .booking-cta{ background: var(--charcoal); color: var(--ivory); text-align:center; }
    .booking-cta h2{ color: var(--ivory); font-size: clamp(2.2rem, 5vw, 3.6rem); }
    .booking-cta-inner{ display:flex; flex-direction:column; align-items:center; }
    .booking-cta p{ color: rgba(247,242,234,0.72); max-width: 440px; margin: 0 auto 32px; }
    .booking-cta .btn-primary{ background: var(--gold); border-color: var(--gold); color: var(--charcoal); }
    .booking-cta .btn-primary:hover{ background: var(--ivory); border-color: var(--ivory); }

    /* ---------- Contact ---------- */
    .contact-grid{
      display:grid; grid-template-columns:1fr; gap: 48px;
    }
    @media (min-width: 860px){ .contact-grid{ grid-template-columns: 0.9fr 1.1fr; gap: 90px; } }
    .contact-info address{ font-style:normal; font-family: var(--display); font-size:1.15rem; margin-bottom: 26px; color: var(--charcoal-soft); }
    .contact-line{ display:flex; gap:10px; font-size:0.94rem; margin-bottom:10px; }
    .contact-line span:first-child{ color: var(--taupe); min-width: 56px; }
    .contact-line a{ font-weight:600; border-bottom: 1px solid var(--taupe-line); }
    .hours-title{ margin-top: 34px; font-size: 1rem; text-transform:uppercase; letter-spacing:0.12em; }
    .hours-list{ display:flex; flex-direction:column; gap:8px; margin-top:14px; }
    .hours-list li{ display:flex; justify-content:space-between; font-size:0.92rem; padding-bottom:8px; border-bottom: 1px solid var(--taupe-line); max-width: 340px; }
    .hours-time{ color: var(--charcoal-soft); }
    .contact-map{ display:flex; align-items:stretch; }
    .map-visual{ width:100%; height:100%; min-height: 320px; border-radius: var(--radius); }
    .map-label{ font-family:'Fraunces', serif; font-size:15px; fill: var(--charcoal); font-weight:600; }
    .map-label-sub{ font-family:'Manrope', sans-serif; font-size:11px; fill: var(--charcoal-soft); }

    /* ---------- Footer ---------- */
    .site-footer{ background: var(--ivory-deep); padding-top: 72px; }
    .footer-grid{
      display:grid; grid-template-columns: 1fr; gap: 40px; padding-bottom: 56px;
    }
    @media (min-width: 780px){
      .footer-grid{ grid-template-columns: 1.2fr 1fr 0.8fr 1.2fr; gap: 32px; }
    }
    .footer-logo{ font-size:1.5rem; }
    .footer-brand p{ margin-top:8px; font-size:0.86rem; }
    .footer-nav{ display:flex; flex-direction:column; gap:12px; font-size:0.9rem; }
    .footer-social{ display:flex; flex-direction:column; gap:12px; font-size:0.9rem; }
    .footer-col-title{
      font-size:0.72rem; text-transform:uppercase; letter-spacing:0.14em; color: var(--taupe); margin-bottom:4px; display:block;
    }
    .newsletter-row{ display:flex; border-bottom:1px solid var(--charcoal); max-width:280px; }
    .newsletter-row input{
      flex:1; border:none; background:transparent; padding: 10px 0; font-family: var(--body); font-size:0.92rem; outline:none; color: var(--charcoal);
    }
    .newsletter-row button{
      background:none; border:none; font-size:1.1rem; cursor:pointer; padding: 0 4px; color: var(--charcoal);
    }
    .newsletter-thanks{ font-size:0.88rem; color: var(--gold); font-weight:600; }
    .footer-bottom{ border-top: 1px solid var(--taupe-line); padding: 22px 0; }
    .footer-bottom p{ margin:0; font-size:0.78rem; color: var(--taupe); }

    /* ---------- Modal ---------- */
    .modal-backdrop{
      position: fixed; inset:0; background: rgba(24,20,16,0.55); backdrop-filter: blur(3px);
      display:flex; align-items:center; justify-content:center; z-index: 100; padding: 20px;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn{ from{ opacity:0; } to{ opacity:1; } }
    .modal{
      background: var(--ivory); width: min(480px, 100%); max-height: 90vh; overflow-y:auto;
      padding: clamp(28px, 5vw, 44px); position:relative; border-radius: var(--radius);
      box-shadow: 0 30px 70px rgba(24,20,16,0.35);
    }
    .modal-close{
      position:absolute; top:18px; right:18px; background:none; border:none; font-size:1.6rem;
      line-height:1; cursor:pointer; color: var(--charcoal-soft); width:32px; height:32px;
    }
    .modal h3{ margin-bottom: 22px; }
    .booking-form{ display:flex; flex-direction:column; gap:18px; }
    .form-row{ display:flex; flex-direction:column; gap:6px; }
    .form-row label{ font-size:0.78rem; font-weight:600; color: var(--charcoal-soft); }
    .form-row input, .form-row select, .form-row textarea{
      font-family: var(--body); font-size:0.94rem; padding: 12px 14px;
      border: 1px solid var(--taupe-line); border-radius: var(--radius); background: var(--white);
      color: var(--charcoal); outline: none; transition: border-color 0.25s ease;
    }
    .form-row input:focus, .form-row select:focus, .form-row textarea:focus{ border-color: var(--gold); }
    .booking-form .btn{ margin-top: 6px; }
    .modal-success{ padding-top: 8px; }
    .modal-success .btn{ margin-top: 18px; }

    /* focus visibility */
    .lumiere-app a:focus-visible,
    .lumiere-app button:focus-visible,
    .lumiere-app input:focus-visible,
    .lumiere-app select:focus-visible,
    .lumiere-app textarea:focus-visible{
      outline: 2px solid var(--gold); outline-offset: 3px;
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = "LUMIÈRE Studio — Luxury Hair & Beauty in Paris";
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="lumiere-app">
      <GlobalStyle />
      <Header onBook={openModal} />
      <main>
        <Hero onBook={openModal} />
        <Intro />
        <Services onBook={openModal} />
        <Featured onBook={openModal} />
        <About />
        <Gallery />
        <Testimonials />
        <BookingCta onBook={openModal} />
        <Contact />
      </main>
      <Footer />
      <BookingModal open={modalOpen} onClose={closeModal} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
