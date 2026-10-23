import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import { Logo } from '../components/AuthShell'
import { buildIntro, useIntroFacts } from '../components/landing/introData'
import { DetailList, IntroIcon, Tag, introFocus } from '../components/landing/IntroSection'

// Intro is the full product introduction at /intro (V4 LAND), public and
// reachable signed in or out. It has the home page's brand look (always
// dark) and the same text as its 功能详解 section, with every detail open.

const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 ${introFocus}`
const btnGhost = `inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5 ${introFocus}`
const link = `rounded hover:text-white ${introFocus}`

function Header({ authed, closed }: { authed: boolean; closed: boolean }) {
  const { t, lang, setLang } = useI18n()
  const { site } = useIntroFacts()
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
      <nav aria-label={t('ld.nav.menu')} className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className={`flex min-w-0 items-center gap-2 rounded text-base font-semibold text-white ${introFocus}`}>
          <Logo className="h-6 w-6 shrink-0" /> <span className="truncate">{site}</span>
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={t('ux.langSwitch')} className={`rounded px-2 py-1 text-xs text-slate-300 hover:text-white ${introFocus}`}>
            <span className="hidden sm:inline">{t('c.lang')}</span>
            <span className="sm:hidden" aria-hidden="true">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
          {authed ? (
            <Link to="/" className={`${btnPrimary} px-4 py-2`}>{t('intro.page.console')}</Link>
          ) : (
            <>
              <Link to="/login" className={`rounded px-2 py-1 text-sm text-slate-300 hover:text-white ${introFocus}`}>{t('ld.nav.signIn')}</Link>
              {!closed && <Link to="/register" className={`${btnPrimary} px-4 py-2`}>{t('ld.nav.start')}</Link>}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

function H2({ children }: { children: string }) {
  return <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{children}</h2>
}

export function Intro() {
  const { t } = useI18n()
  const { status } = useAuth()
  const location = useLocation()
  const facts = useIntroFacts()
  const c = buildIntro(t, facts)
  const authed = status === 'authed'

  // Arriving from a scrolled page starts at the top, or at the #section asked for.
  useEffect(() => {
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
    if (target) target.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: 0 })
  }, [location.hash])

  const toc: [string, string][] = [
    ['why', t('intro.why.t')],
    ['features', t('intro.features')],
    ...c.features.map((f): [string, string] => [`f-${f.key}`, f.title]),
    ['start', t('intro.steps.t')],
    ['limits', t('intro.lim.t')],
    ['privacy', t('intro.priv.t')],
    ['faq', t('intro.faq.t')],
  ]
  const tocList = (
    <ul className="space-y-1 text-sm">
      {toc.map(([id, label]) => (
        <li key={id} className={id.startsWith('f-') ? 'pl-3' : ''}>
          <a href={`#${id}`} className={`block rounded px-2 py-1 text-slate-400 transition hover:bg-white/5 hover:text-white ${introFocus}`}>{label}</a>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <Header authed={authed} closed={facts.signUpClosed} />
      <div className="relative">
        <div className="nc-grid pointer-events-none absolute inset-x-0 top-0 h-[28rem]" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[min(60rem,100%)] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-24 sm:px-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <nav aria-label={t('intro.page.toc')} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <p className="mb-2 px-2 text-xs font-semibold text-slate-300">{t('intro.page.toc')}</p>
              {tocList}
            </nav>
          </aside>
          <main className="nc-enter min-w-0">
            <p className="text-sm font-semibold tracking-wide text-indigo-300">{t('intro.kicker')}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('intro.page.title', { site: facts.site })}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{t('intro.page.lead', { site: facts.site })}</p>

            <details className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-slate-200">{t('intro.page.toc')}</summary>
              <nav aria-label={t('intro.page.toc')} className="mt-3">{tocList}</nav>
            </details>

            <section id="why" className="mt-14 scroll-mt-24">
              <H2>{t('intro.why.t')}</H2>
              <p className="mt-4 leading-relaxed text-slate-300">{t('intro.why.p1')}</p>
              <p className="mt-3 leading-relaxed text-slate-300">{t('intro.why.p2', { site: facts.site })}</p>
            </section>

            <section id="features" className="mt-16 scroll-mt-24">
              <H2>{t('intro.features')}</H2>
              <div className="mt-6 space-y-5">
                {c.features.map(f => (
                  <section key={f.key} id={`f-${f.key}`} aria-labelledby={`f-${f.key}-t`} className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20">
                        <IntroIcon d={f.icon} />
                      </span>
                      <h3 id={`f-${f.key}-t`} className="text-lg font-semibold text-white">{f.title}</h3>
                      {f.isNew && <Tag tone="new">{t('intro.new')}</Tag>}
                      {f.soon && <Tag tone="soon">{t('intro.soon')}</Tag>}
                    </div>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300 sm:text-[0.95rem]">
                      <DetailList items={f.details} />
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section id="start" className="mt-16 scroll-mt-24">
              <H2>{t('intro.steps.t')}</H2>
              <ol className="mt-6 space-y-6">
                {c.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/10 font-mono text-sm font-semibold text-indigo-200" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="limits" className="mt-16 scroll-mt-24">
              <H2>{t('intro.lim.t')}</H2>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-300">
                {c.limits.map(l => (
                  <li key={l} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/70" aria-hidden="true" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="privacy" className="mt-16 scroll-mt-24">
              <H2>{t('intro.priv.t')}</H2>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {c.privacy.map(g => (
                  <div key={g.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="font-semibold text-white">{g.title}</h3>
                    <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-300">
                      {g.items.map(item => (
                        <li key={item} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-slate-300">{c.privacyWarn}</p>
            </section>

            <section id="faq" className="mt-16 scroll-mt-24">
              <H2>{t('intro.faq.t')}</H2>
              <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] px-5 sm:px-6">
                {c.faq.map(item => (
                  <div key={item.key} className="py-5">
                    <h3 className="font-semibold text-white">{item.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sign-up invitation: only for visitors, and only while sign-up is open. */}
            {!authed && !facts.signUpClosed && (
              <section aria-labelledby="intro-cta" className="relative mt-16 overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/30 via-indigo-900/30 to-cyan-900/20 px-6 py-12 text-center sm:px-10">
                <div className="nc-grid pointer-events-none absolute inset-0" aria-hidden="true" />
                <h2 id="intro-cta" className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">{t('intro.page.ctaTitle')}</h2>
                <p className="relative mt-3 text-slate-300">{t('intro.page.ctaSub')}</p>
                <div className="relative mt-7 flex flex-wrap justify-center gap-3">
                  <Link to="/register" className={btnPrimary}>{t('ld.hero.cta')}</Link>
                  <Link to="/login" className={btnGhost}>{t('ld.hero.cta2')}</Link>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">
          <span className="flex items-center gap-2">
            <Logo className="h-5 w-5" /> {facts.site}
          </span>
          <span className="flex gap-4">
            <Link to="/" className={link}>{t(authed ? 'intro.page.console' : 'intro.page.home')}</Link>
            <Link to="/tools/2fa" className={link}>{t('intro.app.tool')}</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
