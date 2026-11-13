import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, AudioLines, Bot, Gamepad2, Github, Image, Menu, MessageSquareQuote, Music2, Radio, ShieldCheck, Sparkles, Wallet, WandSparkles, X, Zap } from 'lucide-react';

const integrations = [
  { name:'Spotify', description:'Your music, right where your friends are.', icon:Music2, tone:'spotify', category:'MUSIC' },
  { name:'Last.fm', description:'Listening history, charts and stats.', icon:AudioLines, tone:'lastfm', category:'MUSIC' },
  { name:'Roblox', description:'Players, profiles, games and presence.', icon:Gamepad2, tone:'roblox', category:'GAMING' },
  { name:'Fortnite', description:'Player stats and highlights.', icon:Zap, tone:'fortnite', category:'GAMING' },
  { name:'GitHub', description:'Repos, commits and developer activity.', icon:Github, tone:'github', category:'DEVELOPER' },
  { name:'Crypto', description:'A quick glance at markets you follow.', icon:Wallet, tone:'crypto', category:'DISCOVER' }
];
const features = [
  { icon:Sparkles, title:'AI, within reach', text:'Get help, explore ideas and turn long conversations into clear answers.' },
  { icon:Image, title:'A little more fun', text:'Find GIFs, make quote cards and add something extra to the chat.' },
  { icon:Radio, title:'Your world, connected', text:'Bring updates and activity from platforms you already use into Discord.' },
  { icon:ShieldCheck, title:'One simple place', text:'A thoughtful collection of everyday tools, without the clutter.' }
];
const commands = [
  { name:'/gif', text:'Find a GIF for the moment.', icon:Image, type:'FUN' },
  { name:'/quote', text:'Turn a message into a shareable quote.', icon:MessageSquareQuote, type:'FUN' },
  { name:'/ask', text:'Ask the Breeze AI assistant.', icon:Sparkles, type:'AI' },
  { name:'/summarise', text:'Get the important parts, quickly.', icon:WandSparkles, type:'AI' }
];
const faqs = [
  ['What is Breeze?','Breeze is a multipurpose Discord app that brings integrations, useful commands and everyday tools together.'],
  ['Is Breeze free to use?','Breeze is being built with a free core experience in mind. Any future optional features will be explained clearly.'],
  ['Which integrations are planned?','The first planned integrations include Spotify, Last.fm, Roblox, Fortnite, GitHub and crypto market information.'],
  ['How do I get started?','Once the Discord app is ready, you will be able to add it to your account and explore its commands.']
];

export default function App() {
  const [menuOpen,setMenuOpen] = useState(false);
  const [faqOpen,setFaqOpen] = useState(0);
  const close = () => setMenuOpen(false);
  return <div className="site-shell">
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={close}><span className="brand-symbol">b</span><span>breeze<span className="wordmark-dot">.</span></span></a>
      <button className="mobile-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X size={20}/>:<Menu size={20}/>}</button>
      <nav className={menuOpen?'site-nav open':'site-nav'}><a href="#integrations" onClick={close}>Integrations</a><a href="#features" onClick={close}>Features</a><a href="#commands" onClick={close}>Commands</a><a href="#faq" onClick={close}>FAQ</a></nav>
      <a className="header-cta" href="#get-started">Add to Discord <ArrowUpRight size={15}/></a>
    </header>
    <main id="home">
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="announcement"><i/> A new kind of Discord companion <ArrowUpRight size={13}/></div>
          <h1>More of your world.<br/><span>Less switching around.</span></h1>
          <p className="hero-description">Your music, games, socials and everyday tools — all coming together in one little corner of Discord.</p>
          <div className="hero-actions"><a className="button-primary" href="#get-started">Get started <ArrowRight size={16}/></a><a className="button-secondary" href="#integrations">Explore Breeze <ArrowUpRight size={15}/></a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>B</span><span>✳</span><span>⌘</span></div><p><strong>One app.</strong> A whole lot to explore.</p></div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow"/>
          <div className="floating-chip chip-music"><span className="mini-icon spotify"><Music2 size={15}/></span><span><b>Now playing</b><small>Something good</small></span><AudioLines size={17}/></div>
          <div className="preview-window">
            <div className="preview-top"><div className="preview-dots"><i/><i/><i/></div><span>breeze / your space</span><div className="preview-live"><i/> LIVE</div></div>
            <div className="preview-content">
              <div className="preview-greeting"><span>YOUR PERSONAL SPACE</span><b>Hey there<span>.</span></b><small>Here's a little look at your world.</small></div>
              <div className="preview-cards">
                <div className="preview-card"><div className="preview-card-icon spotify"><Music2 size={16}/></div><span>LISTENING</span><b>On repeat</b><small>Spotify · connected</small><div className="equalizer"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
                <div className="preview-card"><div className="preview-card-icon roblox"><Gamepad2 size={16}/></div><span>GAMING</span><b>Game on</b><small>Roblox · ready</small><div className="game-squares">{Array.from({length:9},(_,i)=><i key={i}/>)}</div></div>
              </div>
              <div className="preview-command"><div className="command-spark"><Sparkles size={16}/></div><div><b>/ask</b><small>Ask Breeze anything...</small></div><ArrowUpRight size={15}/></div>
              <div className="preview-bottom"><span><i/> YOUR SPACE, ALL TOGETHER</span><span>01 / 04</span></div>
            </div>
          </div>
          <div className="floating-chip chip-github"><span className="mini-icon github"><Github size={15}/></span><span><b>Build something</b><small>GitHub activity</small></span><ArrowUpRight size={14}/></div>
          <div className="hero-stamp"><span>MADE FOR</span><b>YOUR<br/>DISCORD</b><span className="stamp-star">✳</span></div>
        </div>
        <div className="hero-bottom-line"><span>ONE PLACE FOR YOUR FAVOURITE THINGS</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      <section className="integrations-section section-wrap" id="integrations">
        <div className="section-topline"><span>01 — YOUR WORLD, CONNECTED</span><span>THE GOOD STUFF</span></div>
        <div className="section-heading"><h2>All the things you love.<br/><em>Right here.</em></h2><p>From what you're listening to, to what you're playing and building. Breeze brings your favourite platforms a little closer.</p></div>
        <div className="integration-grid">{integrations.map(item=><article className="integration-card" key={item.name}><div className={'integration-icon '+item.tone}><item.icon size={21}/></div><div className="integration-card-content"><span>{item.category}</span><h3>{item.name}</h3><p>{item.description}</p></div><div className="integration-arrow"><ArrowUpRight size={17}/></div></article>)}</div>
        <div className="integrations-foot"><span className="foot-spark">✳</span><span>And there's more room for your world to grow.</span><i/></div>
      </section>
      <section className="features-section" id="features"><div className="section-wrap features-wrap">
        <div className="section-topline"><span>02 — A LITTLE BIT OF EVERYTHING</span><span>BUILT TO BE USEFUL</span></div>
        <div className="features-intro"><div><span className="tiny-label">NOT JUST ANOTHER BOT</span><h2>Small things.<br/><em>Big convenience.</em></h2></div><p>Less hopping between apps. More time doing the things you actually came to Discord for.</p></div>
        <div className="features-grid">{features.map((f,i)=><article className="feature-card" key={f.title}><div className="feature-number">0{i+1}</div><div className="feature-icon"><f.icon size={21}/></div><h3>{f.title}</h3><p>{f.text}</p><span className="feature-corner">↗</span></article>)}</div>
      </div></section>
      <section className="commands-section section-wrap" id="commands">
        <div className="section-topline"><span>03 — THE BREEZE TOOLBOX</span><span>READY WHEN YOU ARE</span></div>
        <div className="commands-layout"><div className="commands-intro"><span className="tiny-label">JUST TYPE A COMMAND</span><h2>A shortcut to<br/><em>something useful.</em></h2><p>Handy little commands for everyday moments, curious moments and just-for-fun moments.</p><a href="#get-started" className="inline-link">See what Breeze can do <ArrowUpRight size={15}/></a></div>
          <div className="command-board">{commands.map((c,i)=><div className="command-item" key={c.name}><div className="command-index">0{i+1}</div><div className="command-icon"><c.icon size={18}/></div><div className="command-detail"><b>{c.name}</b><span>{c.text}</span></div><span className={'command-type '+c.type.toLowerCase()}>{c.type}</span><ArrowUpRight size={16} className="command-arrow"/></div>)}</div>
        </div>
      </section>
      <section className="faq-section section-wrap" id="faq"><div className="section-topline"><span>04 — GOOD TO KNOW</span><span>THE FAQ</span></div>
        <div className="faq-layout"><div><span className="tiny-label">A FEW QUICK ANSWERS</span><h2>Curious?<br/><em>We've got you.</em></h2></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={faqOpen===i?'faq-item expanded':'faq-item'} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><b>{faqOpen===i?'−':'+'}</b></button>{faqOpen===i&&<p>{a}</p>}</div>)}</div></div>
      </section>
      <section className="final-cta section-wrap" id="get-started"><div className="cta-orb orb-a"/><div className="cta-orb orb-b"/><div className="cta-content"><span className="tiny-label">YOUR DISCORD, WITH A LITTLE MORE BREEZE</span><h2>Ready to bring it<br/><em>all together?</em></h2><p>Breeze is getting ready to make your Discord experience feel a little more you.</p><a className="button-dark" href="#home">Back to the top <ArrowUpRight size={16}/></a></div><div className="cta-mark">b<span>.</span></div></section>
    </main>
    <footer className="site-footer section-wrap"><a className="wordmark footer-wordmark" href="#home"><span className="brand-symbol">b</span><span>breeze<span className="wordmark-dot">.</span></span></a><span className="footer-note">A little bit of everything, in one place.</span><div className="footer-links"><a href="#integrations">Integrations</a><a href="#commands">Commands</a><a href="#faq">FAQ</a></div><span className="copyright">© 2026 BREEZE</span></footer>
  </div>;
}