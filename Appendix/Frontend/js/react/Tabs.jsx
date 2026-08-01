import { useState } from 'react';

export default function Tabs({ tabs, initial = 0 }) {
  const [active, setActive] = useState(initial);
  return (
    <div>
      <nav style={{ display: 'flex', gap: 8, borderBottom: '1px solid #ddd', marginBottom: 12 }}>
        {tabs.map((t, i) => (
          <button
            key={t.key || i}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderBottom: active === i ? '2px solid #4f46e5' : '1px solid #ddd',
              borderRadius: '6px 6px 0 0',
              background: active === i ? '#eef2ff' : '#fff',
              cursor: 'pointer'
            }}
          >
            {t.title}
          </button>
        ))}
      </nav>
      <section>
        {tabs[active]?.content}
      </section>
    </div>
  );
}
