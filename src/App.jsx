import { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'

const featureData = [
  { icon: 'wave', number: '01', title: 'Sounds like your best rep', body: 'Natural interruptions, warmth, and context-aware pacing make every call feel genuinely human.', accent: 'lime' },
  { icon: 'spark', number: '02', title: 'Thinks on its feet', body: 'vyce follows intent, not scripts—handling curveballs without losing the thread.', accent: 'violet' },
  { icon: 'bolt', number: '03', title: 'Moves work forward', body: 'Book the meeting, update the CRM, or route a hot lead before the call ends.', accent: 'coral' },
  { icon: 'globe', number: '04', title: 'Ready wherever you are', body: 'Launch across 32 languages with local nuance and the same brand voice.', accent: 'blue' },
]

const logos = ['arcade', 'Morrow', 'Lattice', 'rayban', 'northstar']

const useCases = [
  { label: 'Sales', title: 'Turn “maybe later” into a next step.', body: 'Qualify inbound interest, revive quiet leads, and set meetings while intent is still warm.', tag: '2.4× more meetings', tone: 'lime' },
  { label: 'Support', title: 'Make “hold please” a thing of the past.', body: 'Resolve the routine fast, then bring in a human with the complete context already in hand.', tag: '82% resolved by AI', tone: 'violet' },
  { label: 'Operations', title: 'Give every workflow a voice.', body: 'Confirm appointments, collect details, and keep your back office moving around the clock.', tag: '41 hrs saved / week', tone: 'coral' },
]

const plans = [
  { name: 'Starter', price: 49, description: 'For teams testing a better way to talk to customers.', features: ['1 voice agent', '500 minutes / month', 'Standard voices', 'Call transcripts'], cta: 'Start for free' },
  { name: 'Scale', price: 199, description: 'For ambitious teams ready to put conversations to work.', features: ['5 voice agents', '3,000 minutes / month', 'Custom voice & tone', 'CRM + calendar actions', 'Priority support'], cta: 'Choose Scale', popular: true },
  { name: 'Custom', price: null, description: 'For complex call flows, high volume, and enterprise control.', features: ['Unlimited agents', 'Custom minutes', 'Dedicated success team', 'SLA + security review', 'On-premise options'], cta: 'Talk to sales' },
]

const faqs = [
  ['Will my customers know they are talking to AI?', 'You decide how transparent vyce is. Every agent can introduce itself as an AI assistant, and we make it easy to hand the conversation to a human at any point.'],
  ['How long does it take to launch?', 'Most teams go from first prompt to a live pilot in under a day. Connect your knowledge base, choose a voice, and start tuning with real call transcripts.'],
  ['Can it take actions in our tools?', 'Yes. vyce can call your APIs or use native integrations to book meetings, update a CRM, check order status, and trigger follow-up workflows.'],
  ['What languages and accents are supported?', 'vyce supports 32 languages and a growing library of regional accents. You can also build a custom voice profile for your brand.'],
]

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowUp: <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>,
    wave: <><path d="M3 12c1.7-6.5 3.3 6.5 5 0s3.3-6.5 5 0 3.3 6.5 5 0 3.3-6.5 5 0" /></>,
    spark: <><path d="m12 3-1.6 5.4L5 10l5.4 1.6L12 17l1.6-5.4L19 10l-5.4-1.6L12 3Z" /><path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z" /></>,
    play: <path d="m9 6 9 6-9 6V6Z" fill="currentColor" stroke="none" />,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    command: <><path d="M18 8a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V5a3 3 0 1 0-3 3h12Z" /></>,
    quote: <><path d="M10 11H6a3 3 0 0 0-3 3v4h7v-7a8 8 0 0 0-4-7" /><path d="M21 11h-4a3 3 0 0 0-3 3v4h7v-7a8 8 0 0 0-4-7" /></>,
  }
  return <svg {...common}>{paths[name] || paths.spark}</svg>
}

function VoiceVisualizer({ compact = false }) {
  const bars = useMemo(() => Array.from({ length: compact ? 18 : 32 }, (_, index) => ((index * 17) % 23) + 9), [compact])
  return <div className={`voice-bars ${compact ? 'voice-bars--compact' : ''}`} aria-label="Live voice visualization">
    {bars.map((height, index) => <span key={index} style={{ '--bar-height': `${height + (index % 5) * 3}px`, '--bar-delay': `${index * 45}ms` }} />)}
  </div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroMode, setHeroMode] = useState('listen')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)
  const [isDemoLive, setIsDemoLive] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMove = (event) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      heroRef.current.style.setProperty('--mouse-x', `${x}`)
      heroRef.current.style.setProperty('--mouse-y', `${y}`)
    }
    const node = heroRef.current
    node?.addEventListener('pointermove', handleMove)
    return () => node?.removeEventListener('pointermove', handleMove)
  }, [])

  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    const cleanups = []
    cards.forEach((card) => {
      const move = (event) => {
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        card.style.setProperty('--tilt-x', `${x * 8}deg`)
        card.style.setProperty('--tilt-y', `${y * -8}deg`)
        card.style.setProperty('--lift', '-9px')
      }
      const leave = () => {
        card.style.setProperty('--tilt-x', '0deg')
        card.style.setProperty('--tilt-y', '0deg')
        card.style.setProperty('--lift', '0px')
      }
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
      })
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  useEffect(() => {
    const parallax = document.querySelector('.parallax-section')
    if (!parallax) return
    let frame = 0
    const updateParallax = () => {
      const rect = parallax.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = Math.max(-1, Math.min(1, (viewport * 0.5 - (rect.top + rect.height * 0.5)) / (viewport + rect.height)))
      parallax.style.setProperty('--story-back', `${progress * -125}px`)
      parallax.style.setProperty('--story-front', `${progress * 95}px`)
      parallax.style.setProperty('--story-orb-one', `${progress * 55}px`)
      parallax.style.setProperty('--story-orb-two', `${progress * -70}px`)
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax)
    }
    updateParallax()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const chapters = Array.from(document.querySelectorAll('[data-story]'))
    let frame = 0
    const updateStory = () => {
      const viewport = window.innerHeight
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewport)
      const progress = window.scrollY / maxScroll
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
      chapters.forEach((chapter) => {
        const rect = chapter.getBoundingClientRect()
        const center = rect.top + rect.height * 0.5
        const distance = (viewport * 0.5 - center) / (viewport + rect.height * 0.5)
        const bounded = Math.max(-1, Math.min(1, distance))
        chapter.style.setProperty('--chapter-shift', `${bounded * 72}px`)
        chapter.style.setProperty('--chapter-drift', `${bounded * 42}px`)
        chapter.style.setProperty('--chapter-scale', `${1 - Math.abs(bounded) * 0.035}`)
        chapter.classList.toggle('story-active', Math.abs(bounded) < 0.55)
      })
      frame = 0
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateStory) }
    updateStory()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])

  const handleAnchor = (event, id) => {
    event.preventDefault()
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true"><span /></div>
      <div className="noise" />
      <header className="topbar">
        <a className="brand" href="#top" onClick={(event) => handleAnchor(event, '#top')} aria-label="vyce home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>vyce</span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
          <a href="#product" onClick={(event) => handleAnchor(event, '#product')}>Product</a>
          <a href="#solutions" onClick={(event) => handleAnchor(event, '#solutions')}>Solutions</a>
          <a href="#pricing" onClick={(event) => handleAnchor(event, '#pricing')}>Pricing</a>
          <a href="#resources" onClick={(event) => handleAnchor(event, '#resources')}>Resources</a>
          <div className="nav-mobile-actions"><a href="#login">Log in</a><a className="button button--small button--dark" href="#demo" onClick={(event) => handleAnchor(event, '#demo')}>Book a demo <Icon name="arrow" size={15} /></a></div>
        </nav>
        <div className="topbar-actions"><a className="login-link" href="#login">Log in</a><a className="button button--small button--dark" href="#demo" onClick={(event) => handleAnchor(event, '#demo')}>Book a demo <Icon name="arrow" size={15} /></a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><Icon name={menuOpen ? 'close' : 'menu'} size={22} /></button>
      </header>

      <main id="top">
        <section className="hero story-section" ref={heroRef} data-story="opening" data-chapter="00">
          <div className="hero-glow hero-glow--one" />
          <div className="hero-glow hero-glow--two" />
          <div className="hero-grid" />
          <div className="hero-copy reveal is-visible">
            <div className="eyebrow"><span className="eyebrow-dot" /> Meet vyce / the voice of what’s next</div>
            <h1>Your team,<br /><em>with a voice.</em></h1>
            <p className="hero-lede">vyce turns the calls your team cannot get to into conversations that listen, think, and move the work forward.</p>
            <div className="hero-actions"><a className="button button--lime" href="#demo" onClick={(event) => handleAnchor(event, '#demo')}>Hear vyce speak <Icon name="arrow" size={17} /></a><a className="text-link" href="#product" onClick={(event) => handleAnchor(event, '#product')}>Explore the idea <Icon name="arrow" size={16} /></a></div>
            <div className="hero-proof"><div className="avatar-stack"><span>AM</span><span>JL</span><span>SK</span><span>+</span></div><span>Built for the conversations that matter</span></div>
          </div>
          <div className="hero-demo vyce-hero-stage reveal is-visible" style={{ '--delay': '140ms' }}>
            <div className="stage-label"><span className="stage-live"><i /> LIVE WITH VYCE</span><span>CONVERSATION / 001</span></div>
            <div className="stage-arc stage-arc--one" /><div className="stage-arc stage-arc--two" />
            <div className="vyce-core"><div className="core-halo" /><div className="core-letter">V</div><VoiceVisualizer compact /></div>
            <div className="transcript-card transcript-card--one"><span className="transcript-avatar transcript-avatar--lime">C</span><div><small>Customer</small><p>“I need this sorted today.”</p></div></div>
            <div className="transcript-card transcript-card--two"><span className="transcript-avatar transcript-avatar--blue"><Icon name="spark" size={13} /></span><div><small>vyce understood</small><p>“On it. I found the fastest route.”</p></div></div>
            <div className="stage-bottom"><div><span className="stage-caption">Listening for the thing<br /><strong>behind the words.</strong></span><VoiceVisualizer compact /></div><div className="stage-controls"><button className={`stage-chip ${heroMode === 'listen' ? 'stage-chip--active' : ''}`} onClick={() => setHeroMode('listen')}><Icon name="mic" size={14} /> Listen</button><button className={`stage-chip ${heroMode === 'act' ? 'stage-chip--active' : ''}`} onClick={() => setHeroMode('act')}><Icon name="bolt" size={14} /> Act</button><button className={`stage-record ${isDemoLive ? 'stage-record--active' : ''}`} onClick={() => setIsDemoLive(!isDemoLive)} aria-label={isDemoLive ? 'Stop vyce demo' : 'Start vyce demo'}><span /></button></div></div>
          </div>
          <div className="scroll-cue"><span className="scroll-line" /> Scroll to meet vyce <Icon name="arrowUp" size={14} /></div>
        </section>
        <section className="logo-strip reveal story-section" data-story="signal" data-chapter="01"><span>Teams who refuse to sound like everyone else</span><div className="logo-list">{logos.map((logo) => <span key={logo} className={`customer-logo customer-logo--${logo.toLowerCase()}`}>{logo}</span>)}</div></section>

        <section className="section features-section story-section" id="product" data-story="listen" data-chapter="02">
          <div className="section-heading reveal"><div><div className="eyebrow"><span className="eyebrow-dot" /> Why vyce</div><h2>A voice agent<br /><em>with range.</em></h2></div><p>Most AI can answer a question. vyce understands what needs to happen next—and makes it happen.</p></div>
          <div className="feature-layout"><div className="feature-intro reveal"><div className="feature-quote"><Icon name="quote" size={28} /><p>“Finally, an AI that knows when to talk, when to listen, and when to just get it done.”</p><span>— Maya Chen, COO at Morrow</span></div><div className="feature-ticker"><span className="ticker-number">24/7</span><span>Always on.<br />Never on autopilot.</span></div></div><div className="feature-grid">{featureData.map((feature, index) => <article className={`feature-card feature-card--${feature.accent} reveal tilt-card`} key={feature.title} style={{ '--delay': `${index * 90}ms` }}><div className="feature-card-top"><span className="feature-icon"><Icon name={feature.icon} size={21} /></span><span className="feature-number">{feature.number}</span></div><h3>{feature.title}</h3><p>{feature.body}</p><a href="#demo" onClick={(event) => handleAnchor(event, '#demo')} aria-label={`Learn more about ${feature.title}`}><Icon name="arrow" size={18} /></a></article>)}</div></div>
        </section>

        <section className="section workflow-section story-section" id="solutions" data-story="think" data-chapter="03"><div className="workflow-copy reveal"><div className="eyebrow"><span className="eyebrow-dot" /> From first hello to done</div><h2>The conversation<br /><em>is the workflow.</em></h2><p>Give your team a head start with an agent that can listen, reason, and take action in one natural flow.</p><a className="text-link text-link--dark" href="#demo" onClick={(event) => handleAnchor(event, '#demo')}>See how it works <Icon name="arrow" size={16} /></a></div><div className="workflow-steps reveal"><div className="workflow-step"><span className="step-index">01</span><div><h3>Listen</h3><p>vyce hears the words behind the words, capturing intent and sentiment in real time.</p></div><span className="step-icon"><Icon name="wave" size={20} /></span></div><div className="workflow-connector" /><div className="workflow-step"><span className="step-index">02</span><div><h3>Think</h3><p>It reasons with your knowledge, policies, and live context—without losing the human tone.</p></div><span className="step-icon"><Icon name="spark" size={20} /></span></div><div className="workflow-connector" /><div className="workflow-step"><span className="step-index">03</span><div><h3>Do</h3><p>It updates, books, routes, and follows through. The work is done before the goodbye.</p></div><span className="step-icon"><Icon name="check" size={20} /></span></div></div></section>

        <section className="video-section section story-section" id="demo" data-story="speak" data-chapter="04"><div className="video-head reveal"><div><div className="eyebrow eyebrow--light"><span className="eyebrow-dot" /> See vyce in motion</div><h2>More than a voice.<br /><em>A point of view.</em></h2></div><p>Watch a 62-second walkthrough of the little moments that make a big difference.</p></div><div className="video-card reveal"><div className="video-grid-lines" /><div className="video-signal"><div className="video-signal-ring video-signal-ring--one" /><div className="video-signal-ring video-signal-ring--two" /><div className="video-signal-core"><VoiceVisualizer /></div></div><div className="video-overlay-top"><span className="video-badge"><span /> vyce / Live</span><span>01:02 / 01:02</span></div><button className="play-button" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause video' : 'Play video'}><Icon name={isPlaying ? 'pause' : 'play'} size={25} /></button><div className="video-overlay-bottom"><span>How great conversations get to “done.”</span><span className="video-progress"><i style={{ width: isPlaying ? '72%' : '28%' }} /></span><span>00:34</span></div></div></section>

        <section className="parallax-section story-section" data-story="human" data-chapter="05"><div className="parallax-word parallax-word--back">human</div><div className="parallax-content reveal"><div className="eyebrow"><span className="eyebrow-dot" /> The vyce difference</div><h2>Built for the<br /><em>messy middle.</em></h2><p>Because the best conversations never follow the script. They pause. They wander. They surprise you. vyce is built for all of it.</p><div className="parallax-proof"><span className="proof-line" /><span>Natural by design<br /><strong>Powerful by default</strong></span></div></div><div className="parallax-orb parallax-orb--one" /><div className="parallax-orb parallax-orb--two" /><div className="parallax-word parallax-word--front">human</div></section>

        <section className="section cases-section story-section" data-story="act" data-chapter="06"><div className="section-heading reveal"><div><div className="eyebrow"><span className="eyebrow-dot" /> One agent. Many jobs.</div><h2>Make more room<br /><em>for the work.</em></h2></div><p>Wherever conversations slow your team down, vyce gives the work a way forward.</p></div><div className="case-list">{useCases.map((item, index) => <article className={`case-card case-card--${item.tone} reveal tilt-card`} key={item.label} style={{ '--delay': `${index * 110}ms` }}><div className="case-card-top"><span className="case-label">{item.label}</span><Icon name="arrow" size={18} /></div><div className="case-index">0{index + 1}</div><h3>{item.title}</h3><p>{item.body}</p><span className="case-tag">{item.tag}</span></article>)}</div></section>

        <section className="stats-section story-section" data-story="proof" data-chapter="07"><div className="stats-grid reveal"><div><span className="stat-number">98<span>%</span></span><span className="stat-label">customer satisfaction<br />on AI-handled calls</span></div><div><span className="stat-number">4.6<span>×</span></span><span className="stat-label">more conversations<br />per rep, per day</span></div><div><span className="stat-number">32</span><span className="stat-label">languages, accents,<br />and local nuance</span></div></div><div className="testimonial reveal"><div className="testimonial-mark"><Icon name="quote" size={24} /></div><blockquote>“vyce gave our team back the time to do the work only humans can do.”</blockquote><div className="testimonial-author"><span className="author-avatar">MC</span><span><strong>Maya Chen</strong><small>COO, Morrow</small></span></div></div></section>

        <section className="section pricing-section story-section" id="pricing" data-story="scale" data-chapter="08"><div className="pricing-header reveal"><div><div className="eyebrow"><span className="eyebrow-dot" /> Simple, transparent, human</div><h2>Pick your<br /><em>starting point.</em></h2></div><div className="billing-toggle"><button className={!isAnnual ? 'active' : ''} onClick={() => setIsAnnual(false)}>Monthly</button><button className={isAnnual ? 'active' : ''} onClick={() => setIsAnnual(true)}>Yearly <span>Save 20%</span></button></div></div><div className="pricing-grid">{plans.map((plan, index) => <article className={`price-card ${plan.popular ? 'price-card--popular' : ''} reveal tilt-card`} key={plan.name} style={{ '--delay': `${index * 100}ms` }}>{plan.popular && <div className="popular-ribbon">Most popular</div>}<div className="price-top"><span className="price-name">{plan.name}</span><span className="price-index">0{index + 1}</span></div><p>{plan.description}</p><div className="price-amount">{plan.price ? <><span className="currency">$</span>{isAnnual ? Math.round(plan.price * .8) : plan.price}<span className="price-period">/mo</span></> : <span className="price-custom">Let’s talk</span>}</div><a className={`button ${plan.popular ? 'button--lime' : 'button--outline'}`} href="#demo" onClick={(event) => handleAnchor(event, '#demo')}>{plan.cta} <Icon name="arrow" size={16} /></a><div className="price-divider" /><ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={15} />{feature}</li>)}</ul></article>)}</div><p className="pricing-footnote"><Icon name="lock" size={14} /> No credit card required · Cancel anytime · Human support included</p></section>

        <section className="section faq-section story-section" id="resources" data-story="questions" data-chapter="09"><div className="faq-heading reveal"><div className="eyebrow"><span className="eyebrow-dot" /> Good questions deserve answers</div><h2>Curious?<br /><em>Good.</em></h2><p>Still wondering if vyce is right for your team? We probably have an answer.</p><a className="text-link text-link--dark" href="mailto:hello@vyce.ai">Ask us anything <Icon name="arrow" size={16} /></a></div><div className="faq-list reveal">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'faq-item--open' : ''}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><Icon name="plus" size={19} /></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></section>

        <section className="cta-section story-section" data-story="start" data-chapter="10"><div className="cta-glow" /><div className="cta-content reveal"><div className="eyebrow eyebrow--light"><span className="eyebrow-dot" /> Your next great conversation</div><h2>Let’s make<br /><em>it count.</em></h2><p>Give your team a voice that never misses the moment.</p><div className="hero-actions"><a className="button button--lime" href="mailto:hello@vyce.ai">Start a conversation <Icon name="arrow" size={17} /></a><span className="cta-note"><Icon name="spark" size={15} /> Setup takes less than a day</span></div></div><div className="cta-orbit cta-orbit--one" /><div className="cta-orbit cta-orbit--two" /></section>
      </main>

      <footer className="footer"><div className="footer-top"><a className="brand brand--footer" href="#top" onClick={(event) => handleAnchor(event, '#top')}><span className="brand-mark"><span /><span /><span /></span><span>vyce</span></a><p>Conversation, elevated.</p><div className="footer-socials"><a href="#linkedin">in</a><a href="#x">x</a><a href="#youtube">▶</a></div></div><div className="footer-links"><div><span>Product</span><a href="#product">Features</a><a href="#demo">Live demo</a><a href="#pricing">Pricing</a></div><div><span>Company</span><a href="#about">About</a><a href="#careers">Careers <small>We’re hiring</small></a><a href="#contact">Contact</a></div><div><span>Resources</span><a href="#docs">Documentation</a><a href="#stories">Customer stories</a><a href="#security">Security</a></div><div><span>Legal</span><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#status">Status <i /></a></div></div><div className="footer-bottom"><span>© 2025 vyce, Inc.</span><span>Made for the moments that matter.</span><span>San Francisco · New York · Everywhere</span></div></footer>
    </div>
  )
}

export default App
