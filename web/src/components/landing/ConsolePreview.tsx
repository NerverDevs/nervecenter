import { useI18n } from '../../lib/i18n'

// ConsolePreview is a still of the console for the home page. Every figure is
// sample data and the caption says so; hosts are example domains.
const rows = [
  { host: 'relay-a.example', kind: 'new-api', balance: '$412.80', ratio: '1.0', status: 'ok' },
  { host: 'api.example.com', kind: 'sub2api', balance: '$668.15', ratio: '0.8', status: 'ok' },
  { host: 'hub.example.net', kind: 'new-api', balance: '$4.37', ratio: '1.2', status: 'low' },
  { host: 'lab.example.io', kind: 'new-api', balance: '$199.28', ratio: '0.5', status: 'reauth' },
] as const

const chip: Record<string, string> = {
  ok: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30',
  low: 'bg-amber-400/10 text-amber-300 ring-amber-400/30',
  reauth: 'bg-rose-400/10 text-rose-300 ring-rose-400/30',
}
const chipKey: Record<string, string> = { ok: 'ld.pv.ok', low: 'ld.pv.low', reauth: 'ld.pv.reauth' }

export function ConsolePreview() {
  const { t } = useI18n()
  return (
    <figure>
      <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-indigo-950/50 ring-1 ring-white/5 backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 font-mono text-xs text-slate-500">nervecenter / dashboard</span>
        </div>
        <div className="grid grid-cols-3 gap-px bg-white/5">
          {[['ld.pv.balance', '$1,284.60'], ['ld.pv.channels', '6'], ['ld.pv.keys', '23']].map(([k, v]) => (
            <div key={k} className="bg-slate-900/90 px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">{t(k)}</div>
              <div className="mt-1 text-lg font-semibold text-white tabular-nums">{v}</div>
            </div>
          ))}
        </div>
        <ul className="divide-y divide-white/5">
          {rows.map(r => (
            <li key={r.host} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-300">{r.host}</span>
              <span className="hidden rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline">{r.kind}</span>
              <span className="w-16 text-right text-[11px] text-slate-500">{t('ld.pv.ratio')} {r.ratio}</span>
              <span className="w-20 text-right font-medium text-slate-100 tabular-nums">{r.balance}</span>
              <span className={`w-24 rounded-full px-2 py-0.5 text-center text-[11px] ring-1 ring-inset ${chip[r.status]}`}>{t(chipKey[r.status])}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="nc-float absolute -bottom-5 -left-4 flex max-w-[85%] items-center gap-2 rounded-xl border border-white/10 bg-slate-800/90 px-3 py-2 text-xs text-slate-200 shadow-xl backdrop-blur sm:-left-8">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M21.9 4.6 18.7 19.7c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2l-11 6.9-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 3.4c.9-.3 1.6.2 1.3 1.2Z" /></svg>
        </span>
        <span className="truncate">{t('ld.pv.alert')}</span>
      </div>
      </div>
      <figcaption className="mt-8 text-center text-xs text-slate-500">{t('ld.pv.title')}</figcaption>
    </figure>
  )
}
