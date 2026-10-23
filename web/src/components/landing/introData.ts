import { useMeta, useSiteName } from '../../lib/meta'
import type { MetaView } from '../../lib/types'

// The product introduction (home page section and /intro) as data: the same
// text serves the short cards and the full page. Facts the platform admin can
// change are read from /meta here, never written into the copy: the ways to
// connect a channel (bind_methods), mail, the Telegram bot, the sign-up
// captcha and the password rule. While /meta is loading, or on an older
// server without bind_methods, the wording stays neutral.

// /meta also carries the bot fields (types.integrations reads them elsewhere).
type IntroMeta = MetaView & { telegram_enabled?: boolean; telegram_bot_username?: string }

// The listing order of the ways to connect, as the add page offers them.
const METHOD_ORDER = ['paste', 'extension', 'cloud', 'form']

export interface IntroFacts {
  site: string
  // methods: the ways to connect open here, in METHOD_ORDER; null = unknown.
  methods: string[] | null
  defaultMethod: string | null
  mail: boolean
  telegramOff: boolean
  bot: string
  passwordMin: number
  captcha: 'img' | 'bot' | null
  signUpClosed: boolean
}

export function useIntroFacts(): IntroFacts {
  const meta = useMeta().data as IntroMeta | undefined
  const site = useSiteName()
  const enabled = meta?.bind_methods?.enabled
  const methods = enabled && enabled.length > 0 ? METHOD_ORDER.filter(m => enabled.includes(m)) : null
  const def = meta?.bind_methods?.default
  const captchaOn = meta?.captcha?.scopes?.includes('register') ?? false
  return {
    site,
    methods,
    defaultMethod: methods && def && methods.includes(def) ? def : null,
    mail: meta?.mail_enabled === true,
    telegramOff: meta?.telegram_enabled === false,
    bot: meta?.telegram_bot_username?.trim() ?? '',
    passwordMin: meta?.password_min || 10,
    captcha: !captchaOn ? null : meta?.captcha?.provider === 'turnstile' ? 'bot' : meta?.captcha?.provider === 'builtin' ? 'img' : null,
    signUpClosed: meta?.registration_open === false,
  }
}

type T = (key: string, vars?: Record<string, string | number>) => string

// A detail line: a paragraph, a bullet, or a worked example; link adds a
// short link after the text.
export interface IntroDetail {
  text: string
  kind: 'p' | 'li' | 'ex'
  link?: { to: string; label: string }
}

export interface IntroFeature {
  key: string
  icon: string
  title: string
  summary: string[]
  details: IntroDetail[]
  isNew?: boolean
  soon?: boolean
}

export interface IntroQA {
  key: string
  q: string
  a: string
}

export interface IntroContent {
  features: IntroFeature[]
  steps: { title: string; text: string }[]
  limits: string[]
  privacy: { key: string; title: string; items: string[] }[]
  privacyWarn: string
  faq: IntroQA[]
}

export const introIcons: Record<string, string> = {
  connect: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.4 1.4M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.4-1.4',
  balance: 'M3 13h8V3H3zM3 21h8v-6H3zM13 21h8V11h-8zM13 3v6h8V3z',
  keys: 'M15 3a5 5 0 1 1-4.6 7L3 17.4V21h3.6l1-1V18h2v-2h2l1.4-1.4A5 5 0 0 1 15 3zM16.5 7.5h.01',
  usage: 'M4 20V10M10 20V4M16 20v-7M2 20h20',
  pricing: 'M19 5 5 19M7 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM17 15a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  briefing: 'M3 12h4l3-8 4 16 3-8h4',
  compare: 'M12 3v18M8 21h8M4 7h16M4 7l-2.5 6a2.5 2.5 0 0 0 5 0zM20 7l-2.5 6a2.5 2.5 0 0 0 5 0z',
  alerts: 'M6 9a6 6 0 1 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0',
  telegram: 'M21 3 3 10.5l7 2.5M21 3l-7 18-4-8M21 3 10 13',
  team: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7M22 21a7 7 0 0 0-4.5-6.5',
  security: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  tokens: 'M4 5h16v14H4zM8 10l2 2-2 2M13 14h3',
}

// methodList names the ways to connect in a sentence ("A、B" / "A, B").
export function methodList(t: T, methods: string[]): string {
  return methods.map(m => t(`intro.m.${m}`)).join(t('intro.m.join'))
}
// buildIntro resolves every string for the current language and facts.
export function buildIntro(t: T, f: IntroFacts): IntroContent {
  const site = f.site
  const when = {
    balanceWhen: t('intro.when.balance'), logsWhen: t('intro.when.logs'),
    ratioWhen: t('intro.when.ratio'), modelsWhen: t('intro.when.models'),
  }
  const paste = f.methods?.includes('paste') ?? false
  const form = f.methods?.includes('form') ?? false
  const names = f.methods ? methodList(t, f.methods) : ''
  const p = (key: string, vars?: Record<string, string | number>): IntroDetail => ({ text: t(key, vars), kind: 'p' })
  const li = (key: string, vars?: Record<string, string | number>): IntroDetail => ({ text: t(key, vars), kind: 'li' })
  const ex = (key: string): IntroDetail => ({ text: t(key), kind: 'ex' })
  // Bullets s1..sN of a feature.
  const sum = (key: string, n: number, vars?: Record<string, string | number>) =>
    Array.from({ length: n }, (_, i) => t(`intro.f.${key}.s${i + 1}`, vars))

  // 渠道接入: one detail per way that is open here.
  const ways: IntroDetail[] = []
  if (!f.methods) ways.push(li('intro.f.connect.dAny'))
  else {
    ways.push(p('intro.f.connect.dMethods', { methods: names }))
    for (const m of f.methods) {
      if (m === 'paste') {
        ways.push(li('intro.f.connect.dPaste'), li('intro.f.connect.dPasteNewapi1'), li('intro.f.connect.dPasteNewapi2'), li('intro.f.connect.dPasteSub2api'))
      } else ways.push(li(`intro.f.connect.d${m[0].toUpperCase()}${m.slice(1)}`))
    }
  }
  const connectSummary = sum('connect', 3)
  connectSummary[1] = f.methods ? t('intro.f.connect.s2', { methods: names }) : t('intro.f.connect.s2any')

  const channels = t(f.mail ? 'intro.f.alerts.chMail' : 'intro.f.alerts.chNoMail')
  const cols = t(f.mail ? 'intro.f.alerts.colsMail' : 'intro.f.alerts.colsNoMail')
  const tool = { to: '/tools/2fa', label: t('intro.app.tool') }

  const features: IntroFeature[] = [
    { key: 'connect', icon: introIcons.connect, title: t('intro.f.connect.t'), summary: connectSummary,
      details: [p('intro.f.connect.d1'), ...ways, p('intro.f.connect.d3')] },
    { key: 'balance', icon: introIcons.balance, title: t('intro.f.balance.t'), summary: sum('balance', 3),
      details: [p('intro.f.balance.d1'), p('intro.f.balance.d2'), p('intro.f.balance.d3', when)] },
    { key: 'keys', icon: introIcons.keys, title: t('intro.f.keys.t'), summary: sum('keys', 3),
      details: [p('intro.f.keys.d0'), li('intro.f.keys.d1'), li('intro.f.keys.d2'), li('intro.f.keys.d3'), li('intro.f.keys.d4'), p('intro.f.keys.d5')] },
    { key: 'usage', icon: introIcons.usage, title: t('intro.f.usage.t'), summary: sum('usage', 3),
      details: [p('intro.f.usage.d1'), p('intro.f.usage.d2'), p('intro.f.usage.d3', when)] },
    { key: 'pricing', icon: introIcons.pricing, title: t('intro.f.pricing.t'), summary: sum('pricing', 3),
      details: [p('intro.f.pricing.d0'), li('intro.f.pricing.d1'), li('intro.f.pricing.d2'), p('intro.f.pricing.d3')] },
    { key: 'briefing', icon: introIcons.briefing, title: t('intro.f.briefing.t'), summary: sum('briefing', 3, when),
      details: [p('intro.f.briefing.d1', when), li('intro.f.briefing.d2'), li('intro.f.briefing.d3'), p('intro.f.briefing.d4'), ex('intro.f.briefing.ex')] },
    { key: 'compare', icon: introIcons.compare, title: t('intro.f.compare.t'), summary: sum('compare', 3), isNew: true,
      // V4 IU's page name, or this card's while that string is not registered.
      details: [p('intro.f.compare.d1', { page: t('nav.compare') === 'nav.compare' ? t('intro.f.compare.t') : t('nav.compare') }), li('intro.f.compare.d2'), li('intro.f.compare.d3'), li('intro.f.compare.d5'), p('intro.f.compare.d4')] },
    { key: 'alerts', icon: introIcons.alerts, title: t('intro.f.alerts.t'), summary: sum('alerts', 3, { channels }),
      details: [
        li('intro.f.alerts.d1'),
        { text: t('intro.f.alerts.d2') + t('intro.sep') + t(f.mail ? 'intro.f.alerts.d2mail' : 'intro.f.alerts.d2noMail'), kind: 'li' },
        li('intro.f.alerts.d3', { cols }), li('intro.f.alerts.d4'), li('intro.f.alerts.d5'), p('intro.f.alerts.d6'), ex('intro.f.alerts.ex'),
      ] },
    { key: 'telegram', icon: introIcons.telegram, title: t('intro.f.telegram.t'), summary: sum('telegram', 3), soon: f.telegramOff,
      details: [
        ...(f.telegramOff ? [p('intro.f.telegram.dOff')] : f.bot ? [p('intro.f.telegram.d0', { bot: f.bot })] : []),
        li('intro.f.telegram.d1'), li('intro.f.telegram.d2'), li('intro.f.telegram.d3'), li('intro.f.telegram.d4'), li('intro.f.telegram.d5'),
      ] },
    { key: 'team', icon: introIcons.team, title: t('intro.f.team.t'), summary: sum('team', 3),
      details: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].map(d => li(`intro.f.team.${d}`)) },
    { key: 'security', icon: introIcons.security, title: t('intro.f.security.t'), summary: sum('security', 3),
      details: [li('intro.f.security.d1'), { ...li('intro.f.security.d2'), link: tool }, li('intro.f.security.d3'), li('intro.f.security.d4'), li('intro.f.security.d5')] },
    { key: 'tokens', icon: introIcons.tokens, title: t('intro.f.tokens.t'), summary: sum('tokens', 3),
      details: [p('intro.f.tokens.d0'), li('intro.f.tokens.d1'), li('intro.f.tokens.d2'), li('intro.f.tokens.d3'), li('intro.f.tokens.d4')] },
  ]

  const captcha = f.captcha === 'img' ? t('intro.st1.captchaImg') : f.captcha === 'bot' ? t('intro.st1.captchaBot') : ''
  const steps = [
    { title: t('intro.st1.t'), text: f.signUpClosed ? t('intro.st1.closed')
      : t('intro.st1.d', { min: f.passwordMin, captcha, after: t(f.mail ? 'intro.st1.mail' : 'intro.st1.noMail') }) },
    { title: t('intro.st2.t'), text: t('intro.st2.d') + (f.defaultMethod ? t('intro.sep') + t('intro.st2.default', { method: t(`intro.m.${f.defaultMethod}`) }) : '') },
    { title: t('intro.st3.t'), text: t('intro.st3.d') },
  ]

  const limits = [
    t('intro.lim.l1'),
    // Any way but the form has the person do the sign-in, captcha included.
    f.methods
      ? t('intro.lim.methods', { methods: names }) + (f.methods.some(m => m !== 'form') ? t('intro.sep') + t('intro.lim.captcha') : '')
      : t('intro.lim.methodsAny'),
    t('intro.lim.l3'),
    ...(paste ? [t('intro.lim.passkey')] : []),
    t('intro.lim.l2'), t('intro.lim.l4'), t('intro.lim.l5'), t('intro.lim.l6'), t('intro.lim.l7'),
    ...(f.mail ? [] : [t('intro.lim.noMail')]),
  ]

  const privacy = [
    { key: 'keep', title: t('intro.priv.keep.t'), items: [t('intro.priv.keep1', { site }), t('intro.priv.keep2'), t('intro.priv.keep3')] },
    { key: 'guard', title: t('intro.priv.guard.t'), items: ['guard1', 'guard2', 'guard3', 'guard4'].map(k => t(`intro.priv.${k}`)) },
    { key: 'never', title: t('intro.priv.never.t'), items: [
      ...(paste ? [t('intro.priv.never1', { site }), t('intro.priv.never2')] : []), t('intro.priv.never3'),
    ] },
  ]

  const qa = (key: string, a: string): IntroQA => ({ key, q: t(`intro.faq.${key}.q`), a })
  const faq: IntroQA[] = [
    ...(f.methods ? [qa('pw', t(form ? 'intro.faq.pw.aForm' : paste ? 'intro.faq.pw.a' : 'intro.faq.pw.aNoPaste'))] : []),
    ...(paste ? [qa('clear', t('intro.faq.clear.a'))] : []),
    qa('reauth', t('intro.faq.reauth.a')),
    qa('fresh', t('intro.faq.fresh.a', when)),
    qa('cost', t('intro.faq.cost.a')),
    qa('lost', t(f.mail ? 'intro.faq.lost.aMail' : 'intro.faq.lost.aNoMail')),
    qa('delete', t('intro.faq.delete.a')),
  ]

  return { features, steps, limits, privacy, privacyWarn: t('intro.priv.warn'), faq }
}
