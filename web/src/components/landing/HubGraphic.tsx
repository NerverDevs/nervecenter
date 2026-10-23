// HubGraphic is the home page's hero picture: upstream sites wired into one
// hub. Decorative only (aria-hidden); the sample hosts are example domains.
const nodes = [
  { x: 78, y: 84, host: 'relay-a.example', kind: 'new-api', tone: '#34d399' },
  { x: 404, y: 70, host: 'api.example.com', kind: 'sub2api', tone: '#34d399' },
  { x: 418, y: 214, host: 'hub.example.net', kind: 'new-api', tone: '#fbbf24' },
  { x: 384, y: 344, host: 'x.example.org', kind: 'sub2api', tone: '#34d399' },
  { x: 104, y: 336, host: 'lab.example.io', kind: 'new-api', tone: '#fb7185' },
  { x: 64, y: 212, host: 'gpt.example.dev', kind: 'sub2api', tone: '#34d399' },
]
const hub = { x: 240, y: 206 }

export function HubGraphic({ className = '' }: { className?: string }) {
  return (
    // The view box has room either side, so no host label is cut off.
    <svg viewBox="-10 0 500 410" className={className} aria-hidden="true" fill="none">
      <defs>
        <radialGradient id="nc-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity=".55" />
          <stop offset="60%" stopColor="#6366f1" stopOpacity=".12" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nc-wire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="nc-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <circle cx={hub.x} cy={hub.y} r="150" fill="url(#nc-hub-glow)" />
      <circle cx={hub.x} cy={hub.y} r="112" stroke="#6366f1" strokeOpacity=".18" />
      <circle cx={hub.x} cy={hub.y} r="74" stroke="#6366f1" strokeOpacity=".25" strokeDasharray="2 6" />

      {nodes.map(n => (
        <g key={n.host}>
          <path d={`M${n.x} ${n.y} Q ${(n.x + hub.x) / 2} ${hub.y} ${hub.x} ${hub.y}`} stroke="#334155" strokeWidth="1.5" />
          <path className="nc-flow" d={`M${n.x} ${n.y} Q ${(n.x + hub.x) / 2} ${hub.y} ${hub.x} ${hub.y}`} stroke="url(#nc-wire)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}

      {nodes.map(n => (
        <g key={n.host + '-node'}>
          <circle className="nc-pulse" cx={n.x} cy={n.y} r="13" fill={n.tone} fillOpacity=".18" />
          <circle cx={n.x} cy={n.y} r="6" fill="#0f172a" stroke={n.tone} strokeWidth="2" />
          <text x={n.x} y={n.y + 26} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="ui-monospace, monospace">{n.host}</text>
          <text x={n.x} y={n.y + 40} textAnchor="middle" fill="#64748b" fontSize="10">{n.kind}</text>
        </g>
      ))}

      <circle className="nc-pulse" cx={hub.x} cy={hub.y} r="46" fill="#6366f1" fillOpacity=".25" />
      <circle cx={hub.x} cy={hub.y} r="34" fill="url(#nc-core)" />
      <g stroke="#eef2ff" strokeWidth="2.4" strokeLinecap="round" transform={`translate(${hub.x - 14} ${hub.y - 14}) scale(1.17)`}>
        <circle cx="12" cy="12" r="3" fill="none" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
      </g>
    </svg>
  )
}
