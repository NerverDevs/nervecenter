import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useMeta, useSiteName } from '../lib/meta'
import { Logo } from '../components/AuthShell'
import { HubGraphic } from '../components/landing/HubGraphic'
import { ConsolePreview } from '../components/landing/ConsolePreview'
import { IntroSection } from '../components/landing/IntroSection'
import { useIntroFacts } from '../components/landing/introData'

// Landing is the public home page, shown at / to anyone not signed in. It is
// always dark: it is a brand surface, and the console keeps its own theme.

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const icons = {
  hub: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8',
  browser: 'M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01',
  ratio: 'M19 5 5 19M7 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM17 15a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  caps: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  keys: 'M15 3a5 5 0 1 1-4.6 7L3 17.4V21h3.6l1-1V18h2v-2h2l1.4-1.4A5 5 0 0 1 15 3zM16.5 7.5h.01',
  bell: 'M6 9a6 6 0 1 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 1 1 8 0v4M12 15v2',
  audit: 'M9 3h6v3H9zM7 4.5H5V21h14V4.5h-2M8 11h8M8 15h8M8 19h4',
  isolate: 'M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10',
  mfa: 'M7 2h10v20H7zM11 18h2M10 9l1.5 1.5L14.5 7.5',
}

const features = [
  { key: 'hub', icon: icons.hub },
  { key: 'browser', icon: icons.browser },
  { key: 'ratio', icon: icons.ratio },
  { key: 'caps', icon: icons.caps },
  { key: 'keys', icon: icons.keys },
  { key: 'alerts', icon: icons.bell },
]
const security = [
  { key: 'enc', icon: icons.lock },
  { key: 'audit', icon: icons.audit },
  { key: 'browser', icon: icons.isolate },
  { key: 'mfa', icon: icons.mfa },
]

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 ${focus}`
const btnGhost = `inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5 ${focus}`

// V4 P1: the platform admin may close sign-up. Until /meta answers it counts
// as open, so the page never flickers to "closed" on a slow load.
function useSignUpClosed() {
  return useMeta().data?.registration_open === false
}

// ClosedSignUp replaces the sign-up buttons while sign-up is closed.
function ClosedSignUp({ center }: { center?: boolean }) {
  const { t } = useI18n()
  const site = useSiteName()
  return (
    <div className={`relative mt-8 space-y-4 ${center ? 'text-center' : ''}`}>
      <p className="text-sm text-slate-400">
        <span className="font-medium text-slate-200">{t('ps.regClosed.title')}</span> · {t('ps.regClosed.body', { site })}
      </p>
      <Link to="/login" className={btnPrimary}>{t('ps.regClosed.cta')}</Link>
    </div>
  )
}

function Nav() {
  const { t, lang, setLang } = useI18n()
  const siteName = useSiteName()
  const closed = useSignUpClosed()
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-lg">
      <nav aria-label={t('ld.nav.menu')} className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className={`flex min-w-0 items-center gap-2 rounded text-base font-semibold text-white ${focus}`}>
          <Logo className="h-6 w-6 shrink-0" /> <span className="truncate">{siteName}</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <a href="#features" className={`rounded hover:text-white ${focus}`}>{t('ld.nav.features')}</a>
          <a href="#how" className={`rounded hover:text-white ${focus}`}>{t('ld.nav.how')}</a>
          <a href="#security" className={`rounded hover:text-white ${focus}`}>{t('ld.nav.security')}</a>
          <a href="#intro" className={`rounded hover:text-white ${focus}`}>{t('intro.nav')}</a>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={t('ux.langSwitch')} className={`rounded px-2 py-1 text-xs text-slate-400 hover:text-white ${focus}`}>
            {/* Phones get the short form, so the site name keeps its room. */}
            <span className="hidden sm:inline">{t('c.lang')}</span>
            <span className="sm:hidden" aria-hidden="true">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
          <Link to="/login" className={`whitespace-nowrap rounded px-2 py-1 text-sm text-slate-300 hover:text-white ${focus}`}>{t('ld.nav.signIn')}</Link>
          {!closed && <Link to="/register" className={`${btnPrimary} whitespace-nowrap px-4 py-2`}>{t('ld.nav.start')}</Link>}
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  const { t } = useI18n()
  const closed = useSignUpClosed()
  return (
    <section className="relative overflow-hidden">
      <div className="nc-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />
      {/* minmax(0,1fr): the preview's rows must not widen the phone column past the screen. */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {t('ld.hero.badge')}
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            {t('ld.hero.title1')}
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent">{t('ld.hero.title2')}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{t('ld.hero.sub')}</p>
          {closed ? <ClosedSignUp /> : <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className={btnPrimary}>
              {t('ld.hero.cta')}
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L14.6 11H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" /></svg>
            </Link>
            <Link to="/login" className={btnGhost}>{t('ld.hero.cta2')}</Link>
          </div>}
          {/* V4 LAND: down to the product introduction. */}
          <a href="#intro" className={`mt-5 inline-flex items-center gap-1.5 rounded text-sm font-medium text-indigo-300 hover:text-indigo-200 ${focus}`}>
            {t('intro.heroLink')}
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M10 3a1 1 0 0 1 1 1v9.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4L9 13.6V4a1 1 0 0 1 1-1Z" /></svg>
          </a>
          <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d={icons.caps} /></svg>
            {t('ld.hero.note')}
          </p>
        </div>
        <ConsolePreview />
      </div>
    </section>
  )
}

function Stats() {
  const { t } = useI18n()
  // V4 LAND: the ways to connect and mail are what this site has open.
  const facts = useIntroFacts()
  const items: [string, string][] = [
    [t('ld.stat.platformsV'), t('ld.stat.platforms')],
    ['8', t('ld.stat.caps')],
    [facts.methods ? String(facts.methods.length) : '–', t('ld.stat.ways')],
    [t(facts.mail ? 'ld.stat.alertsV' : 'ld.stat.alertsVNoMail'), t('ld.stat.alerts')],
  ]
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
        {items.map(([value, label]) => (
          <div key={label} className="px-2 py-8 text-center">
            <dt className="text-xs tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-2 text-lg font-semibold text-white sm:text-xl">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wide text-indigo-300">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-slate-400">{sub}</p>}
    </div>
  )
}

function Features() {
  const { t } = useI18n()
  // V4 LAND: the cloud browser and email are mentioned only where open.
  const facts = useIntroFacts()
  const text = (key: string) =>
    key === 'browser' && !facts.methods?.includes('cloud') ? t('ld.f.browser.dOwn')
      : key === 'alerts' && !facts.mail ? t('ld.f.alerts.dNoMail')
        : t(`ld.f.${key}.d`)
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHead kicker={t('ld.f.kicker')} title={t('ld.f.title')} />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(f => (
          <article key={f.key} className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 transition hover:border-indigo-400/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20 transition group-hover:bg-indigo-500/25">
              <Icon d={f.icon} />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">{t(`ld.f.${f.key}.t`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{text(f.key)}</p>
          </article>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-slate-500">{t('ld.f.more')}</p>
    </section>
  )
}

function How() {
  const { t } = useI18n()
  return (
    <section id="how" className="relative scroll-mt-20 border-y border-white/5 bg-gradient-to-b from-indigo-950/30 to-transparent">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-wide text-indigo-300">{t('ld.how.kicker')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('ld.how.title')}</h2>
          <ol className="mt-10 space-y-8">
            {['s1', 's2', 's3'].map((s, i) => (
              <li key={s} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/10 font-mono text-sm font-semibold text-indigo-200">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{t(`ld.${s}.t`)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t(`ld.${s}.d`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <HubGraphic className="mx-auto w-full max-w-lg" />
      </div>
    </section>
  )
}

function Security() {
  const { t } = useI18n()
  // V4 LAND: the isolated sign-in browser only where the cloud browser is open.
  const cloud = useIntroFacts().methods?.includes('cloud') ?? false
  const cards = security.map(s => (s.key === 'browser' && !cloud ? { ...s, key: 'admin' } : s))
  return (
    <section id="security" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHead kicker={t('ld.sec.kicker')} title={t('ld.sec.title')} sub={t('ld.sec.sub')} />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(s => (
          <article key={s.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
              <Icon d={s.icon} />
            </div>
            <h3 className="mt-5 font-semibold text-white">{t(`ld.sec.${s.key}.t`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(`ld.sec.${s.key}.d`)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Cta() {
  const { t } = useI18n()
  const closed = useSignUpClosed()
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/30 via-indigo-900/30 to-cyan-900/20 px-6 py-14 text-center sm:px-12">
        <div className="nc-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('ld.cta.title')}</h2>
        <p className="relative mt-4 text-slate-300">{t('ld.cta.sub')}</p>
        {closed ? <ClosedSignUp center /> : <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register" className={btnPrimary}>{t('ld.hero.cta')}</Link>
          <Link to="/login" className={btnGhost}>{t('ld.hero.cta2')}</Link>
        </div>}
      </div>
    </section>
  )
}

export function Landing() {
  const { t } = useI18n()
  const siteName = useSiteName()
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <How />
        <Security />
        <IntroSection />
        <Cta />
      </main>
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
          <span className="flex items-center gap-2 text-slate-400">
            <Logo className="h-5 w-5" /> {siteName}
          </span>
          <span>{t('ld.footer')}</span>
          <span>© {new Date().getFullYear()} {siteName}</span>
        </div>
      </footer>
    </div>
  )
}
