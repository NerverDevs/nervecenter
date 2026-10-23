import { useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { useI18n } from '../lib/i18n'
import { EmptyArt, type EmptyArtName } from './emptyArt'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm shadow-slate-900/[.03] hover:border-slate-400/70 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800',
  danger: 'bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-500 disabled:bg-rose-400 dark:disabled:bg-rose-500/50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
}

// Shared by buttons and button-looking links: one height, one focus ring, a
// small press-down, and labels that never wrap into a column.
const buttonBase =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px dark:focus-visible:ring-offset-slate-900'

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md'; loading?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${buttonBase} ${size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2'} disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0 ${variants[variant]} ${className}`}
    >
      {loading && <Spinner small decorative />}
      {children}
    </button>
  )
}

const control =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm shadow-slate-900/[.02] transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 hover:border-slate-400/70 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:disabled:bg-slate-800/60 dark:disabled:text-slate-400'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${control} pr-8 ${props.className ?? ''}`} />
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="block text-xs leading-relaxed text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  )
}

const surface = 'rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'

// Card is the one container of the console. Every header has the same height,
// with or without action buttons; `id` makes it a jump target (settings nav).
export function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  id,
}: {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`min-w-0 ${surface} ${className}`}>
      {(title || actions) && (
        <header className="flex min-h-[3.25rem] flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-200/80 px-5 py-2.5 dark:border-slate-800">
          <div className="min-w-0">
            <h2 className="text-[0.9375rem] font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export type Tone = 'green' | 'amber' | 'red' | 'slate' | 'indigo' | 'blue'

const tones: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
  slate: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/25',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20',
}
const dots: Record<Tone, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
  slate: 'bg-slate-400',
  indigo: 'bg-indigo-500',
  blue: 'bg-sky-500',
}

// Badge is a status or label chip; `dot` adds a coloured dot for states
// (正常, 需要重新授权) so they read at a glance and not by colour alone.
export function Badge({ tone = 'slate', dot, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Spinner({ small, decorative }: { small?: boolean; decorative?: boolean }) {
  const { t } = useI18n()
  return (
    <span
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : t('c.loading')}
      aria-hidden={decorative || undefined}
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${small ? 'h-3.5 w-3.5' : 'h-5 w-5'}`}
    />
  )
}

// Skeleton is a grey placeholder bar with a soft sweep (still with reduced motion).
export function Skeleton({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`nc-skeleton block rounded-md bg-slate-200/70 dark:bg-slate-800 ${className}`} />
}

// Loading is the placeholder while data is on its way: a skeleton shaped like
// what is coming (rows of a list, stat cards, a detail page), so the page does
// not jump when it lands. `label` explains a wait that can take a while, such
// as data fetched live from the panel.
export function Loading({ variant = 'rows', rows = 4, label }: { variant?: 'rows' | 'cards' | 'detail' | 'inline'; rows?: number; label?: ReactNode }) {
  const { t } = useI18n()
  const status = (
    <span className="sr-only" role="status">
      {t('c.loading')}
    </span>
  )
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Spinner small decorative /> {label ?? t('c.loading')}
        {status}
      </span>
    )
  }
  const hint = label && <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">{label}</p>
  if (variant === 'cards') {
    return (
      <div aria-busy="true" className="nc-fade space-y-3">
        {status}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className={`${surface} space-y-3 p-5`}>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-28" />
            </div>
          ))}
        </div>
        {hint}
      </div>
    )
  }
  if (variant === 'detail') {
    return (
      <div aria-busy="true" className="nc-fade space-y-6">
        {status}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map(i => (
            <div key={i} className={`${surface} space-y-3 p-5`}>
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-7 w-24" />
            </div>
          ))}
        </div>
        <div className={`${surface} space-y-4 p-5`}>
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className={`h-4 ${i === 2 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>
        {hint}
      </div>
    )
  }
  return (
    <div aria-busy="true" className="nc-fade py-2">
      {status}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-4 py-3.5">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className={`h-3.5 ${['w-2/5', 'w-1/3', 'w-1/2', 'w-1/4'][i % 4]}`} />
              <Skeleton className={`h-3 ${['w-3/5', 'w-1/2', 'w-2/3', 'w-2/5'][i % 4]}`} />
            </div>
            <Skeleton className="hidden h-6 w-16 sm:block" />
          </li>
        ))}
      </ul>
      {hint}
    </div>
  )
}

export function ErrorBanner({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t, errorText } = useI18n()
  if (!error) return null
  return (
    <div
      role="alert"
      className="nc-enter flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
    >
      <span className="flex min-w-0 items-start gap-2.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
          <path d="M12 8v5M12 16.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="min-w-0 break-words">{errorText(error)}</span>
      </span>
      {onRetry && (
        <Button variant="ghost" size="sm" className="-my-1 text-rose-700 hover:bg-rose-100 dark:text-rose-200 dark:hover:bg-rose-900/40" onClick={onRetry}>
          {t('c.retry')}
        </Button>
      )}
    </div>
  )
}

// Empty is what a list shows before it has anything: a small illustration,
// one sentence (children, or title + children) and, where there is one, the
// next step as `action`.
export function Empty({
  icon = 'tray',
  title,
  children,
  action,
  compact,
}: {
  icon?: EmptyArtName
  title?: ReactNode
  children?: ReactNode
  action?: ReactNode
  compact?: boolean
}) {
  return (
    <div className={`nc-fade flex flex-col items-center text-center ${compact ? 'py-6' : 'py-10'}`}>
      <EmptyArt name={icon} small={compact} />
      {title && <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>}
      {children && (
        <div className={`${title ? 'mt-1' : 'mt-4'} max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400`}>{children}</div>
      )}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className={`${surface} p-5`}>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    </div>
  )
}

// Table wraps a data table. On a desktop it scrolls sideways inside its card
// when it has to; on a phone (cards, the default) every row becomes a small
// card: the first cell is its title and every other cell is shown with its
// column name (index.css .nc-cards), so nothing hides off-screen. The column
// names are copied from the header into data-label as rows render; the
// actions column (c.actions) gets none, and its buttons line up at the bottom.
export function Table({ children, cards = true }: { children: ReactNode; cards?: boolean }) {
  const ref = useRef<HTMLTableElement>(null)
  const { t } = useI18n()
  const actions = t('c.actions')
  useLayoutEffect(() => {
    const table = ref.current
    if (!table || !cards) return
    const label = () => {
      const heads = Array.from(table.querySelectorAll(':scope > thead > tr:last-child > th'), th => {
        const text = th.textContent?.trim() ?? ''
        return text === actions ? '' : text
      })
      for (const row of Array.from(table.querySelectorAll(':scope > tbody > tr'))) {
        let col = 0
        for (const cell of Array.from(row.children) as HTMLTableCellElement[]) {
          const name = heads[col] ?? ''
          if (cell.getAttribute('data-label') !== name) cell.setAttribute('data-label', name)
          col += cell.colSpan || 1
        }
      }
    }
    label()
    const watch = new MutationObserver(label)
    watch.observe(table, { childList: true, subtree: true, characterData: true })
    return () => watch.disconnect()
  }, [cards, actions])
  return (
    <div className="-mx-5 overflow-x-auto">
      <table
        ref={ref}
        className={`min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800 [&>tbody>tr]:transition-colors [&>tbody>tr:hover]:bg-slate-50/80 dark:[&>tbody>tr:hover]:bg-slate-800/30 ${cards ? 'nc-cards' : ''}`}
      >
        {children}
      </table>
    </div>
  )
}

// Switch is an on/off control that takes effect at once (role="switch").
// The visible label is optional; `label` always names it for screen readers.
export function Switch({
  checked,
  onChange,
  label,
  children,
  disabled,
  id,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  children?: ReactNode
  disabled?: boolean
  id?: string
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900 ${
          checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 transition-transform duration-200 ${checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'}`}
        />
      </button>
      {children && (
        <span aria-hidden="true" className="select-none" onClick={() => !disabled && onChange(!checked)}>
          {children}
        </span>
      )}
    </span>
  )
}

// Pager is the previous/next row under a paged list. A list that fits on one
// page shows no pager at all.
export function Pager({ page, hasMore, onPage, label }: { page: number; hasMore: boolean; onPage: (page: number) => void; label?: ReactNode }) {
  const { t } = useI18n()
  if (page <= 1 && !hasMore) return null
  return (
    <nav aria-label={t('ux.pager')} className="mt-4 flex items-center justify-end gap-2">
      <span className="mr-auto text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
        {label ?? t('ux.pageOf', { page })}
      </span>
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        {t('c.prevPage')}
      </Button>
      <Button variant="secondary" size="sm" disabled={!hasMore} onClick={() => onPage(page + 1)}>
        {t('c.nextPage')}
      </Button>
    </nav>
  )
}

// Filters lays out a list's filter fields. On a phone only `primary` (usually
// the search box) shows; the rest fold behind a 筛选 button that counts the
// filters in use, so the list itself is not pushed below the fold.
// `inline` lays the fields out in one row from sm up instead of a grid.
export function Filters({
  primary,
  active = 0,
  inline,
  children,
  className = '',
}: {
  primary?: ReactNode
  active?: number
  inline?: boolean
  children: ReactNode
  className?: string
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="mb-4">
      <div className="flex items-end gap-2 sm:hidden">
        {primary && <div className="min-w-0 flex-1">{primary}</div>}
        <Button variant="secondary" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)} className={primary ? '' : 'w-full'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M3 5h18l-7 8.5V19l-4 2v-7.5L3 5z" />
          </svg>
          {t('ux.filters')}
          {active > 0 && <span className="rounded-full bg-indigo-600 px-1.5 text-[11px] leading-4 text-white">{active}</span>}
        </Button>
      </div>
      <div id={id} className={`${open ? 'grid' : 'hidden'} mt-3 gap-4 sm:mt-0 ${inline ? 'sm:flex sm:items-center sm:gap-3' : 'sm:grid'} ${className}`}>
        {primary && <div className={`hidden sm:block ${inline ? 'min-w-0 flex-1' : ''}`}>{primary}</div>}
        {children}
      </div>
    </div>
  )
}

export const th = 'whitespace-nowrap px-3.5 py-2.5 text-left text-xs font-medium text-slate-500 first:pl-5 last:pr-5 dark:text-slate-400'
export const td = 'whitespace-nowrap px-3.5 py-3 align-middle first:pl-5 last:pr-5'

// Link styles, for navigation that should look like a button.
export const linkPrimary = `${buttonBase} px-3.5 py-2 bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-500`
export const linkSecondary = `${buttonBase} px-3.5 py-2 ${variants.secondary}`
export const textLink = 'rounded-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
