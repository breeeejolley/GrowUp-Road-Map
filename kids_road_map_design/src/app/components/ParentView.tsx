import upLogoImg from '../../imports/UP_CORE_LOGO-1.png';

export function ParentView() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 16px 64px',
      width: '100%',
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <img
          src={upLogoImg}
          alt="Up"
          style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 20 }}
        />
        <p style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 10,
        }}>
          Up · Parent View
        </p>
        <h1 style={{
          fontSize: 30,
          fontWeight: 400,
          letterSpacing: '-0.5px',
          lineHeight: '36px',
          color: '#FF7A64',
          margin: '0 0 12px',
        }}>
          Your Financial Roadmap
        </h1>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: '22px',
          maxWidth: 480,
          margin: '0 auto',
        }}>
          Track your family's financial journey alongside your kids — from budgeting and saving to investing and beyond.
        </p>
      </div>

      {/* Placeholder map area */}
      <div style={{
        width: '100%',
        aspectRatio: '16 / 7',
        background: 'rgba(255,255,255,0.03)',
        border: '2px dashed rgba(255,122,100,0.25)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle road lines as decoration */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
          viewBox="0 0 1200 420"
          preserveAspectRatio="none"
        >
          <rect x={0}   y={160} width={1200} height={28} fill="#4E6280" />
          <rect x={0}   y={260} width={1200} height={28} fill="#4E6280" />
          <rect x={220} y={0}   width={28}   height={420} fill="#4E6280" />
          <rect x={580} y={0}   width={28}   height={420} fill="#4E6280" />
          <rect x={940} y={0}   width={28}   height={420} fill="#4E6280" />
        </svg>

        {/* Connector icon */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: 'rgba(255,122,100,0.12)',
          border: '1.5px solid rgba(255,122,100,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
        }}>
          🗺️
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 16,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 6,
          }}>
            Adult Roadmap connects here
          </p>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace',
            letterSpacing: 0.5,
          }}>
            → ready for backend connection
          </p>
        </div>
      </div>

      {/* Feature cards below */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        width: '100%',
        marginTop: 24,
      }}>
        {[
          { icon: '💸', label: 'Budgeting',        desc: 'Track income, expenses and savings goals as a family' },
          { icon: '📈', label: 'Investing',         desc: 'Build long-term wealth with guided investing milestones' },
          { icon: '🏡', label: 'Financial Freedom', desc: 'Plan for big life moments — home, travel, retirement' },
        ].map(card => (
          <div
            key={card.label}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '20px 18px',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
              {card.label}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: '17px' }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
