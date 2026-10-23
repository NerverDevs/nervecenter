import { useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { buildIntro, useIntroFacts, type IntroDetail, type IntroFeature, type IntroQA } from './introData'

// IntroSection is the product introduction on the home page (V4 LAND): why
// we built it, the features as cards that open for details, three steps,
// limits, security and privacy, and an FAQ. /intro shows the same text in
// full. Always dark, like the rest of the home page.

export const introFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'

export function IntroIcon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden="true">
      <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
    </svg>
  )
}

// Tag is the small "new" / "coming soon" label beside a card's icon.
export function Tag({ tone, children }: { tone: 'new' | 'soon'; children: ReactNode }) {
  const look = tone === 'new' ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-200' : 'border-amber-300/30 bg-amber-400/10 text-amber-200'
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${look}`}>{children}</span>
}

// DetailList renders a feature's details: paragraphs, bullet runs, examples.
export function DetailList({ items }: { items: IntroDetail[] }) {
  const { t } = useI18n()
  const blocks: ReactNode[] = []
  let run: IntroDetail[] = []
  const flush = () => {
    if (run.length === 0) return
    const list = run
    blocks.push(
      <ul key={`ul${blocks.length}`} className="space-y-2">
        {list.map(d => (
          <li key={d.text} className="flex gap-2.5">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" aria-hidden="true" />
            <span>
              {d.text}
              {d.link && <> <Link to={d.link.to} className={`rounded font-medium text-indigo-300 underline-offset-2 hover:underline ${introFocus}`}>{d.link.label}</Link></>}
            </span>
          </li>
        ))}
      </ul>,
    )
    run = []
  }
  for (const d of items) {
    if (d.kind === 'li') {
      run.push(d)
      continue
    }
    flush()
    blocks.push(
      d.kind === 'ex' ? (
        <p key={d.text} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-300">
          <span className="mr-1.5 font-semibold text-indigo-200">{t('intro.example')}</span>
          {d.text}
        </p>
      ) : (
        <p key={d.text}>{d.text}</p>
      ),
    )
  }
  flush()
  return <>{blocks}</>
}

function FeatureCard({ f }: { f: IntroFeature }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <article
      aria-labelledby={`${id}t`}
      className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 transition hover:border-indigo-400/40"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20 transition group-hover:bg-indigo-500/25">
          <IntroIcon d={f.icon} />
        </span>
        {f.isNew && <Tag tone="new">{t('intro.new')}</Tag>}
        {f.soon && <Tag tone="soon">{t('intro.soon')}</Tag>}
      </div>
      <h4 id={`${id}t`} className="mt-5 text-base font-semibold text-white">{f.title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
        {f.summary.map(s => (
          <li key={s} className="flex gap-2.5">
            <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
            </svg>
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <div id={`${id}d`} hidden={!open} className="nc-fade mt-4 space-y-3 border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-400">
        <DetailList items={f.details} />
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}d`}
        aria-describedby={`${id}t`}
        onClick={() => setOpen(o => !o)}
        className={`mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-indigo-300 hover:text-indigo-200 ${introFocus}`}
      >
        {t(open ? 'intro.less' : 'intro.more')}
        <Chevron open={open} />
      </button>
    </article>
  )
}
// FaqItem is one accordion row: the question is a button inside a heading
// (WAI-ARIA accordion pattern), the answer a labelled region.
function FaqItem({ item }: { item: IntroQA }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <h4>
        <button
          type="button"
          id={`${id}q`}
          aria-expanded={open}
          aria-controls={`${id}a`}
          onClick={() => setOpen(o => !o)}
          className={`flex w-full items-center justify-between gap-4 rounded-lg px-1 py-4 text-left text-sm font-semibold text-white hover:text-indigo-200 sm:text-base ${introFocus}`}
        >
          {item.q}
          <Chevron open={open} />
        </button>
      </h4>
      <div id={`${id}a`} role="region" aria-labelledby={`${id}q`} hidden={!open} className="nc-fade px-1 pb-5 text-sm leading-relaxed text-slate-400">
        {item.a}
      </div>
    </div>
  )
}

// Block is a titled sub-part of the section (h3), each with its own anchor.
function Block({ id, title, children, className = '' }: { id: string; title: string; children: ReactNode; className?: string }) {
  return (
    <div id={id} className={`scroll-mt-24 ${className}`}>
      <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
      {children}
    </div>
  )
}

// How many limits show before "show details".
const LIMITS_SHOWN = 4

export function IntroSection() {
  const { t } = useI18n()
  const facts = useIntroFacts()
  const c = buildIntro(t, facts)
  const [allLimits, setAllLimits] = useState(false)
  const limitsId = useId()
  const jumps: [string, string][] = [
    ['intro-features', t('intro.features')],
    ['intro-steps', t('intro.steps.t')],
    ['intro-limits', t('intro.lim.t')],
    ['intro-privacy', t('intro.priv.t')],
    ['intro-faq', t('intro.faq.t')],
  ]
  return (
    <section id="intro" aria-labelledby="intro-title" className="relative scroll-mt-20 border-t border-white/5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-950/40 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-indigo-300">{t('intro.kicker')}</p>
          <h2 id="intro-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('intro.title')}</h2>
          <p className="mt-4 text-slate-400">{t('intro.sub')}</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">{t('intro.why.t')}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{t('intro.why.p1')}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{t('intro.why.p2', { site: facts.site })}</p>
        </div>

        <nav aria-label={t('intro.page.toc')} className="mt-10 flex flex-wrap justify-center gap-2">
          {jumps.map(([to, label]) => (
            <a key={to} href={`#${to}`} className={`rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-indigo-400/40 hover:text-white ${introFocus}`}>
              {label}
            </a>
          ))}
        </nav>

        <Block id="intro-features" title={t('intro.features')} className="mt-16">
          <div className="mt-8 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.map(f => <FeatureCard key={f.key} f={f} />)}
          </div>
        </Block>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <Block id="intro-steps" title={t('intro.steps.t')}>
            <ol className="mt-8 space-y-6">
              {c.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/10 font-mono text-sm font-semibold text-indigo-200" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">{s.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>
          <Block id="intro-limits" title={t('intro.lim.t')}>
            <ul id={limitsId} className="mt-8 space-y-3 text-sm leading-relaxed text-slate-400">
              {c.limits.map((l, i) => (
                <li key={l} hidden={!allLimits && i >= LIMITS_SHOWN} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/70" aria-hidden="true" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            {c.limits.length > LIMITS_SHOWN && (
              <button
                type="button"
                aria-expanded={allLimits}
                aria-controls={limitsId}
                onClick={() => setAllLimits(o => !o)}
                className={`mt-4 inline-flex items-center gap-1 rounded text-sm font-medium text-indigo-300 hover:text-indigo-200 ${introFocus}`}
              >
                {t(allLimits ? 'intro.less' : 'intro.more')}
                <Chevron open={allLimits} />
              </button>
            )}
          </Block>
        </div>

        <Block id="intro-privacy" title={t('intro.priv.t')} className="mt-20">
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {c.privacy.map(g => (
              <div key={g.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h4 className="font-semibold text-white">{g.title}</h4>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-400">
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
          <p className="mt-5 text-sm text-slate-400">{c.privacyWarn}</p>
        </Block>

        <Block id="intro-faq" title={t('intro.faq.t')} className="mx-auto mt-20 max-w-3xl">
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:px-6">
            {c.faq.map(item => <FaqItem key={item.key} item={item} />)}
          </div>
        </Block>

        <div className="mt-12 text-center">
          <Link to="/intro" className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5 ${introFocus}`}>
            {t('intro.full')}
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L14.6 11H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
