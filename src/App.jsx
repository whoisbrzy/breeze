import { useState } from 'react';
import {
  Activity, ArrowUpRight, AudioLines, Bot, ChevronDown, Command, Compass,
  Gamepad2, Github, Globe2, Headphones, Image, LayoutDashboard, MessageSquareQuote,
  Music2, Search, Settings2, ShieldCheck, Sparkles, Wallet, Zap, Menu, X,
  CircleHelp, Plus, ExternalLink, Clock3, Radio, UserRound, WandSparkles
} from 'lucide-react';

const integrations = [
  { name: 'Spotify', detail: 'Your listening, at a glance', icon: Music2, tone: 'green', category: 'Music', status: 'Connect' },
  { name: 'Last.fm', detail: 'Scrobbles, charts and taste', icon: AudioLines, tone: 'red', category: 'Music', status: 'Connect' },
  { name: 'Roblox', detail: 'Profiles, presence and stats', icon: Gamepad2, tone: 'blue', category: 'Gaming', status: 'Connect' },
  { name: 'Fortnite', detail: 'Player stats and highlights', icon: Zap, tone: 'purple', category: 'Gaming', status: 'Connect' },
  { name: 'GitHub', detail: 'Repositories and activity', icon: Github, tone: 'light', category: 'Developer', status: 'Connect' },
  { name: 'Crypto', detail: 'Follow the markets you care about', icon: Wallet, tone: 'orange', category: 'Utilities', status: 'Connect' },
];

const commands = [
  { name: '/gif', description: 'Find the perfect GIF for the moment.', icon: Image, tag: 'Fun' },
  { name: '/quote', description: 'A little wisdom, whenever you need it.', icon: MessageSquareQuote, tag: 'Fun' },
  { name: '/ask', description: 'Ask AI a question right inside Discord.', icon: Sparkles, tag: 'AI' },
  { name: '/summarise', description: 'Turn a long message into the essentials.', icon: WandSparkles, tag: 'AI' },
];

function App() {
  const [active, setActive] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [connected, setConnected] = useState([]);
  const [toast, setToast] = useState('');

  const nav = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Integrations', icon: Compass },
    { label: 'Commands', icon: Command },
  ];

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__breezeToast);
    window.__breezeToast = window.setTimeout(() => setToast(''), 2600);
  };

  const visibleIntegrations = integrations.filter(item =>
    (item.name + item.detail + item.category).toLowerCase().includes(query.toLowerCase())
  );

  const sidebar = (
    <>
      <div className="brand">
        <div className="brand-mark"><span>b</span></div>
        <span className="brand-name">breeze<span className="brand-period">.</span></span>
        <button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19}/></button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch" onClick={() => notify('Workspace switcher coming soon')}>
        <div className="workspace-avatar">B</div>
        <span><strong>My Breeze</strong><small>Personal space</small></span>
        <ChevronDown size={15} className="muted-icon"/>
      </button>
      <div className="nav-label">MENU</div>
      <nav className="side-nav">
        {nav.map(item => <button key={item.label} className={active === item.label ? 'nav-item active' : 'nav-item'} onClick={() => {setActive(item.label); setMobileOpen(false);}}>
          <item.icon size={17}/><span>{item.label}</span>{item.label === 'Integrations' && <span className="nav-count">{integrations.length}</span>}
        </button>)}
      </nav>
      <div className="nav-label tools-label">YOUR SPACE</div>
      <div className="side-note"><div className="side-note-icon"><Bot size={16}/></div><div><strong>Made for your Discord</strong><p>Your interests, tools and little moments — all together.</p></div></div>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => notify('Settings are coming soon')}><Settings2 size={17}/><span>Settings</span></button>
        <button className="nav-item" onClick={() => notify('Help centre coming soon')}><CircleHelp size={17}/><span>Help & support</span></button>
        <div className="profile-mini"><div className="profile-avatar">B</div><div className="profile-copy"><strong>Your profile</strong><small>Discord account not linked</small></div><ChevronDown size={15}/></div>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">{sidebar}</aside>
      {mobileOpen && <div className="mobile-scrim" onClick={() => setMobileOpen(false)}><aside className="mobile-sidebar" onClick={e => e.stopPropagation()}>{sidebar}</aside></div>}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button><span className="breadcrumb">Workspace</span><span className="crumb-slash">/</span><strong>{active}</strong></div>
          <div className="topbar-right"><div className="status-pill"><span className="status-dot"/> All systems operational</div><button className="icon-button top-help" onClick={() => notify('Help centre coming soon')} aria-label="Help"><CircleHelp size={18}/></button><div className="top-avatar">B</div></div>
        </header>

        <div className="page-content">
          {active === 'Overview' && <>
            <section className="welcome-row">
              <div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PERSONAL DISCORD COMPANION</div><h1>Your space,<br/><span>connected.</span></h1><p className="welcome-copy">A little bit of everything you love, brought together in one place.</p></div>
              <div className="welcome-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-core"><span>b.</span></div><div className="orbit-node node-one"><Music2 size={17}/></div><div className="orbit-node node-two"><Gamepad2 size={17}/></div><div className="orbit-node node-three"><Github size={17}/></div><div className="orbit-node node-four"><Sparkles size={17}/></div></div>
            </section>

            <section className="quick-stats">
              <div className="stat-card"><div className="stat-icon violet"><Globe2 size={17}/></div><div><span className="stat-label">Integrations</span><strong>{integrations.length}</strong><small>Ready to connect</small></div></div>
              <div className="stat-card"><div className="stat-icon blue"><Command size={17}/></div><div><span className="stat-label">Commands</span><strong>{commands.length}+</strong><small>Useful little tools</small></div></div>
              <div className="stat-card"><div className="stat-icon green"><Activity size={17}/></div><div><span className="stat-label">Connected</span><strong>{connected.length}</strong><small>Your linked services</small></div></div>
            </section>

            <section className="section-block">
              <div className="section-heading"><div><div className="eyebrow small-eyebrow">MAKE IT YOURS</div><h2>Your integrations</h2><p>Bring your favourite platforms into Breeze.</p></div><button className="text-link" onClick={() => setActive('Integrations')}>Explore all <ArrowUpRight size={15}/></button></div>
              <div className="integration-grid">{integrations.slice(0,4).map(item => <IntegrationCard key={item.name} item={item} connected={connected.includes(item.name)} onConnect={() => {setConnected(prev => prev.includes(item.name) ? prev.filter(x => x !== item.name) : [...prev,item.name]); notify(item.name + (connected.includes(item.name) ? ' disconnected' : ' marked for setup'));}}/>)}</div>
            </section>

            <section className="bottom-grid">
              <div className="panel command-panel"><div className="panel-heading"><div><div className="eyebrow small-eyebrow">AT YOUR FINGERTIPS</div><h2>Commands to explore</h2></div><div className="panel-heading-icon"><Bot size={18}/></div></div><div className="command-list">{commands.slice(0,3).map(item => <div className="command-row" key={item.name}><div className="command-icon"><item.icon size={17}/></div><div className="command-info"><strong>{item.name}</strong><span>{item.description}</span></div><span className={'command-tag ' + item.tag.toLowerCase()}>{item.tag}</span></div>)}</div><button className="panel-footer-link" onClick={() => setActive('Commands')}>Browse commands <ArrowUpRight size={14}/></button></div>
              <div className="panel getting-started"><div className="getting-icon"><Sparkles size={19}/></div><div className="eyebrow small-eyebrow">A FRESH START</div><h2>Make Breeze<br/>feel like yours.</h2><p>Connect the services you use, discover commands and bring your Discord world together.</p><button className="primary-button" onClick={() => setActive('Integrations')}>Get started <ArrowUpRight size={16}/></button><div className="getting-decoration">b.</div></div>
            </section>
          </>}

          {active === 'Integrations' && <section className="inner-page"><div className="eyebrow"><span className="eyebrow-line"/> YOUR DIGITAL WORLD</div><h1 className="inner-title">Everything, <span>in sync.</span></h1><p className="inner-description">Choose the services you want to bring into your Breeze experience.</p><div className="search-wrap"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search integrations..."/></div><div className="integration-grid full-grid">{visibleIntegrations.map(item => <IntegrationCard key={item.name} item={item} connected={connected.includes(item.name)} onConnect={() => {setConnected(prev => prev.includes(item.name) ? prev.filter(x => x !== item.name) : [...prev,item.name]); notify(item.name + (connected.includes(item.name) ? ' disconnected' : ' marked for setup'));}}/>)}</div>{visibleIntegrations.length === 0 && <div className="empty-state">No integrations match that search.</div>}</section>}

          {active === 'Commands' && <section className="inner-page"><div className="eyebrow"><span className="eyebrow-line"/> THE BREEZE TOOLBOX</div><h1 className="inner-title">Small commands.<br/><span>Big possibilities.</span></h1><p className="inner-description">A growing collection of useful, creative and AI-powered Discord commands.</p><div className="command-catalog">{commands.map(item => <div className="catalog-card" key={item.name}><div className="catalog-icon"><item.icon size={19}/></div><div className="catalog-copy"><div className="catalog-title"><strong>{item.name}</strong><span className={'command-tag ' + item.tag.toLowerCase()}>{item.tag}</span></div><p>{item.description}</p></div><ArrowUpRight size={17} className="catalog-arrow"/></div>)}</div><div className="coming-note"><Sparkles size={17}/><span>More commands are on the way. Breeze is just getting started.</span></div></section>}
          <footer className="page-footer"><span>© 2026 Breeze</span><span>Made for your Discord world <span className="footer-heart">✳</span></span></footer>
        </div>
      </main>
      {toast && <div className="toast"><ShieldCheck size={17}/>{toast}</div>}
    </div>
  );
}

function IntegrationCard({ item, connected, onConnect }) {
  return <article className="integration-card"><div className={'integration-icon ' + item.tone}><item.icon size={21}/></div><div className="integration-card-body"><div className="integration-title-row"><h3>{item.name}</h3><span className="integration-category">{item.category}</span></div><p>{item.detail}</p><button className={connected ? 'connect-button connected' : 'connect-button'} onClick={onConnect}>{connected ? 'Added to your space' : 'Explore integration'}<ArrowUpRight size={14}/></button></div></article>;
}

export default App;