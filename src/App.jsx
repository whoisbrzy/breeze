import React, { useState } from 'react';
import { ArrowUpRight, AudioLines, Bot, Gamepad2, Github, Image, MessageSquareQuote, Music2, Radio, ShieldCheck, Sparkles, Wallet, Zap, Menu, X } from 'lucide-react';
import GradientASCII from './GradientASCII.jsx';

const integrations = [
  { name: 'Spotify', note: 'Listening status and music details', icon: Music2, tag: 'MUSIC' },
  { name: 'Last.fm', note: 'Your listening history and charts', icon: AudioLines, tag: 'MUSIC' },
  { name: 'Roblox', note: 'Profiles, games and player activity', icon: Gamepad2, tag: 'GAMES' },
  { name: 'Fortnite', note: 'Stats and player information', icon: Zap, tag: 'GAMES' },
  { name: 'GitHub', note: 'Repositories and developer activity', icon: Github, tag: 'DEVELOPMENT' },
  { name: 'Crypto', note: 'Market information at a glance', icon: Wallet, tag: 'MARKETS' }
];

const commands = [
  { name: '/gif', description: 'Find the right GIF for the conversation.', icon: Image },
  { name: '/quote', description: 'Make a message worth saving.', icon: MessageSquareQuote },
  { name: '/ask', description: 'Get a hand from the Breeze assistant.', icon: Sparkles },
  { name: '/summarise', description: 'Get the key points without the scroll.', icon: Bot }
];

const faqs = [
  ['What is Breeze?', 'Breeze is a multipurpose Discord app bringing useful commands and integrations into one place.'],
  ['Is it available yet?', 'Breeze is currently being built. The website will be updated when the app is ready to invite.'],
  ['Which integrations are planned?', 'Spotify, Last.fm, Roblox, Fortnite, GitHub and crypto market information are on the roadmap.'],
  ['Will it be free?', 'The core experience is being designed around free access. Any optional paid features will be clearly explained.']
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const close = () => setMenuOpen(false);

  return <div className="site-shell">
    <GradientASCII />
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={close}><span className="brand-mark">b</span><span>breeze<span className="blue-period">.</span></span></a>
      <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={19}/> : <Menu size={19}/>}</button>
      <nav className={menuOpen ? 'site-nav open' : 'site-nav'}>
        <a href="#integrations" onClick={close}>Integrations</a>
        <a href="#commands" onClick={close}>Commands</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#faq" onClick={close}>FAQ</a>
      </nav>
      <a className="nav-cta" href="#commands">Explore Breeze <ArrowUpRight size={14}/></a>
    </header>

    <main id="home">
      <section className="hero section-wrap">
        <div className="hero-meta"><span className="status-dot"/> A DISCORD APP FOR YOUR EVERYDAY</div>
        <h1>Your Discord,<br/><span>with more to it.</span></h1>
        <p className="hero-description">Music, games, developer tools and small everyday commands. Breeze brings the things you use closer together.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#integrations">See what's inside <ArrowUpRight size={16}/></a>
          <a className="button-quiet" href="#about">A little about Breeze</a>
        </div>
        <div className="hero-foot"><span>MADE TO FIT RIGHT INTO DISCORD</span><span>01 / 04</span></div>
      </section>

      <section className="section-wrap integrations-section" id="integrations">
        <div className="section-label"><span>01 — CONNECTED</span><span>YOUR PLATFORMS</span></div>
        <div className="section-intro"><div><p className="eyebrow">ONE PLACE, MANY INTERESTS</p><h2>The stuff you're<br/>already into.</h2></div><p className="section-description">A growing set of integrations that make your Discord feel a little more like your own space.</p></div>
        <div className="integration-grid">{integrations.map(({name,note,icon:Icon,tag}) => <article className="integration-card" key={name}><div className="integration-top"><span className="integration-icon"><Icon size={19}/></span><span className="integration-tag">{tag}</span></div><h3>{name}</h3><p>{note}</p><span className="card-arrow"><ArrowUpRight size={15}/></span></article>)}</div>
        <p className="section-note"><span>↳</span> More integrations can find their place here over time.</p>
      </section>

      <section className="commands-section" id="commands"><div className="section-wrap">
        <div className="section-label"><span>02 — THE TOOLBOX</span><span>QUICK COMMANDS</span></div>
        <div className="commands-layout"><div><p className="eyebrow">LESS TYPING, MORE DOING</p><h2>Small commands.<br/><span>Useful moments.</span></h2><p className="section-description">A few handy shortcuts for the conversations, questions and things you share every day.</p></div>
          <div className="command-list">{commands.map(({name,description,icon:Icon},i)=><div className="command-row" key={name}><span className="command-number">0{i+1}</span><span className="command-icon"><Icon size={17}/></span><div><b>{name}</b><p>{description}</p></div><ArrowUpRight className="command-arrow" size={16}/></div>)}</div>
        </div>
      </div></section>

      <section className="about-section section-wrap" id="about">
        <div className="section-label"><span>03 — THE IDEA</span><span>WHY BREEZE</span></div>
        <div className="about-content"><div className="about-symbol">b<span>.</span></div><div><p className="eyebrow">NOT ANOTHER TAB TO KEEP OPEN</p><h2>Everything in reach.<br/>Nothing in the way.</h2><p className="section-description">Breeze is being built to feel simple: the right information, the right tools, and a bit of personality — without turning your server into a dashboard.</p></div></div>
        <div className="values-row"><div><ShieldCheck size={18}/><span>Simple by design</span></div><div><Radio size={18}/><span>Connected to your world</span></div><div><Sparkles size={18}/><span>Room to grow</span></div></div>
      </section>

      <section className="faq-section section-wrap" id="faq">
        <div className="section-label"><span>04 — GOOD TO KNOW</span><span>QUESTIONS</span></div>
        <div className="faq-layout"><div><p className="eyebrow">BEFORE YOU GO</p><h2>Fair questions.<br/>Straight answers.</h2></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={faqOpen===i?'faq-item active':'faq-item'} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><b>{faqOpen===i?'−':'+'}</b></button>{faqOpen===i&&<p>{a}</p>}</div>)}</div></div>
      </section>
    </main>

    <footer className="site-footer section-wrap"><a className="wordmark" href="#home"><span className="brand-mark">b</span><span>breeze<span className="blue-period">.</span></span></a><span className="footer-copy">A little more of your world, in Discord.</span><span className="copyright">© 2026 BREEZE</span></footer>
  </div>;
}
