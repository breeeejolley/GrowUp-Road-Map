import type { Stop } from '../App';

interface StopModalProps {
  stop: Stop;
  onClose: () => void;
}

// Age group icon map
const AGE_ICONS: Record<string, string> = {
  start: '🏁',
  school: '🏫',
  library: '📚',
  groceries: '🛒',
  clothing: '👕',
  bank: '🏦',
};

export function StopModal({ stop, onClose }: StopModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#242430',
          borderRadius: 20,
          width: '100%',
          maxWidth: 580,
          border: '1px solid rgba(255,255,255,0.09)',
          borderTop: `4px solid ${stop.color}`,
          position: 'relative',
          overflow: 'hidden',
          animation: 'uptown-slide-up 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes uptown-slide-up {
            from { transform: scale(0.92); opacity: 0; }
            to   { transform: scale(1);    opacity: 1; }
          }
        `}</style>

        {/* Decorative pixel-art building silhouette strip */}
        <div
          style={{
            height: 6,
            background: `linear-gradient(90deg, ${stop.color}44 0%, ${stop.color}11 100%)`,
          }}
        />

        <div style={{ padding: '20px 24px 28px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            {/* Building icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: `${stop.color}22`,
                border: `2px solid ${stop.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {AGE_ICONS[stop.id] ?? '📍'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Age badge */}
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: stop.color,
                  background: `${stop.color}22`,
                  padding: '3px 8px',
                  borderRadius: 4,
                  marginBottom: 6,
                  fontFamily: 'monospace',
                }}
              >
                {stop.ages}
              </span>

              <h2
                style={{
                  color: 'rgba(255,255,255,0.98)',
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  lineHeight: '26px',
                  margin: '0 0 2px',
                }}
              >
                {stop.name}
              </h2>

              <p
                style={{
                  color: stop.color,
                  fontSize: 13,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {stop.topic}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 18,
                lineHeight: 1,
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              ×
            </button>
          </div>

          {/* Hairline divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 16 }} />

          {/* Description */}
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14,
              lineHeight: '22px',
              marginBottom: 20,
            }}
          >
            {stop.description}
          </p>

          {/* Skills list */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 12,
                fontFamily: 'monospace',
              }}
            >
              What you'll learn
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {stop.skills.map((skill, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: stop.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.82)',
                      fontSize: 14,
                      lineHeight: '18px',
                    }}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer hint */}
          <div
            style={{
              marginTop: 24,
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 16 }}>🗺️</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '16px' }}>
              Follow the road through UpTown to unlock the next stop on your financial journey
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
