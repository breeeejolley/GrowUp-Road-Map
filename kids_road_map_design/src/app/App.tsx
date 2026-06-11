import { useState } from 'react';
import upLogo from '../imports/UP_CORE_LOGO.png';
import { TownMap } from './components/TownMap';
import { StopModal } from './components/StopModal';
import { ParentView } from './components/ParentView';

export type Stop = {
  id: string;
  name: string;
  ages: string;
  topic: string;
  description: string;
  skills: string[];
  color: string;
  x: number;
  y: number;
};

// Stop positions are grid-aligned to the orthogonal road network:
// H roads at y=200, y=440, y=640  |  V roads at x=120, x=480, x=920
// Route path: M 120,640 H 920 V 200 H 120 V 440 H 560
export const STOPS: Stop[] = [
  {
    id: 'start',
    name: 'Welcome to UpTown',
    ages: 'Ages 5–6',
    topic: 'Introduction to Money',
    description:
      "Your financial adventure starts here! Discover what money is, why we invented it, and how different coins and notes fit into your everyday life. Every great journey begins with a single step.",
    skills: [
      'What is money and why do we use it?',
      'Identifying Australian coins and notes',
      'Understanding that things have a price',
      'The difference between wants and needs',
    ],
    color: '#FF7A64',
    x: 120,
    y: 640,
  },
  {
    id: 'school',
    name: 'School',
    ages: 'Ages 6–7',
    topic: 'Value of Coins & Notes',
    description:
      "School unlocks the building blocks of money! Learn what every coin and note is actually worth, how to count combinations of money, and what it means to give and receive the right change.",
    skills: [
      'Coin values: 5c, 10c, 20c, 50c, $1, $2',
      'Note values: $5, $10, $20, $50, $100',
      'Counting and combining coins and notes',
      'Giving and receiving correct change',
      'Simple addition and subtraction with money',
    ],
    color: '#FF8BB5',
    x: 920,
    y: 640,
  },
  {
    id: 'library',
    name: 'Library',
    ages: 'Ages 7–9',
    topic: 'Ways to Pay, Lending & Borrowing',
    description:
      "The library has all the answers about how money moves! Explore the many ways to pay — cash, card, tap-and-go — and discover what it really means when you borrow or lend money to someone.",
    skills: [
      'Cash vs EFTPOS vs tap-and-go',
      'Debit cards vs credit cards',
      'What is a loan?',
      'Interest: why borrowing costs more',
      'Being a responsible borrower and lender',
    ],
    color: '#3FA8F4',
    x: 920,
    y: 200,
  },
  {
    id: 'groceries',
    name: 'Grocery Store',
    ages: 'Ages 9–11',
    topic: 'Foreign Currency & Spending Influences',
    description:
      "Shopping opens your eyes to the wider world of money! See how prices differ across countries, what exchange rates do, and learn to spot when advertising is trying to influence your choices.",
    skills: [
      'What is an exchange rate?',
      'Converting between currencies',
      'How advertising and peer pressure affect spending',
      'Needs vs wants — a deeper look',
      'Comparing prices and finding value',
    ],
    color: '#FFF06B',
    x: 480,
    y: 200,
  },
  {
    id: 'clothing',
    name: 'Clothing Shop',
    ages: 'Ages 11–14',
    topic: 'Financial Paperwork & Budgeting',
    description:
      "Level up your money skills! Now you're ready for the paper trail of money. Learn to read bank statements, understand receipts and invoices, and build your very first personal budget.",
    skills: [
      'Reading a bank statement',
      'Understanding receipts and invoices',
      'What is a budget and why it matters',
      'Creating your first personal budget',
      'Tracking spending patterns over time',
    ],
    color: '#00BC83',   // green — matches the clothing building
    x: 120,
    y: 440,
  },
  {
    id: 'bank',
    name: 'The Bank',
    ages: 'Ages 14–16+',
    topic: 'Income, Tax & Financial Freedom',
    description:
      "You've arrived! The bank is where it all comes together. Learn how income and tax work in the real world, what superannuation is building for your future, and what financial freedom truly looks like.",
    skills: [
      'Gross vs net income explained',
      'How the Australian tax system works',
      'Superannuation — your future fund',
      'Introduction to investing',
      'Setting meaningful long-term financial goals',
      'What financial freedom really means',
    ],
    color: '#FF7A64',  // orange — matches the bank building
    x: 560,
    y: 440,
  },
];

export default function App() {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isParentMode, setIsParentMode] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1A1A22',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: `url(${upLogo}) 24 24, auto`,
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '0 0 40px',
      }}
    >
      {/* ── Toggle button — fixed top-right ───────────────────────── */}
      <button
        onClick={() => setIsParentMode(v => !v)}
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          borderRadius: 9999,
          border: `1.5px solid ${isParentMode ? 'rgba(255,255,255,0.2)' : '#FF7A64'}`,
          background: isParentMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,122,100,0.12)',
          color: isParentMode ? 'rgba(255,255,255,0.75)' : '#FF7A64',
          fontSize: 13,
          fontWeight: 600,
          cursor: `url(${upLogo}) 24 24, auto`,
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          letterSpacing: 0.2,
          boxShadow: isParentMode ? 'none' : '0 0 0 4px rgba(255,122,100,0.08)',
        }}
        onMouseEnter={e => {
          const btn = e.currentTarget;
          btn.style.background = isParentMode ? 'rgba(255,255,255,0.12)' : '#FF7A64';
          btn.style.color      = isParentMode ? 'rgba(255,255,255,0.95)' : '#242430';
        }}
        onMouseLeave={e => {
          const btn = e.currentTarget;
          btn.style.background = isParentMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,122,100,0.12)';
          btn.style.color      = isParentMode ? 'rgba(255,255,255,0.75)' : '#FF7A64';
        }}
      >
        {isParentMode ? (
          <>
            <span style={{ fontSize: 15 }}>←</span>
            Kids view
          </>
        ) : (
          <>
            <span style={{ fontSize: 15 }}>👨‍👩‍👧</span>
            I'm a parent!
          </>
        )}
      </button>

      {isParentMode ? (
        /* ── PARENT VIEW ─────────────────────────────────────────── */
        <ParentView />
      ) : (
        /* ── KIDS VIEW ───────────────────────────────────────────── */
        <>
      <header
        style={{
          padding: '32px 32px 20px',
          textAlign: 'center',
          width: '100%',
          maxWidth: 1200,
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.47)',
            marginBottom: 10,
          }}
        >
          Up Kids · Financial Roadmap
        </p>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 400,
            lineHeight: '36px',
            letterSpacing: '-0.5px',
            color: '#FF7A64',
            margin: '0 0 10px',
          }}
        >
          Welcome to UpTown
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: '20px',
          }}
        >
          Follow the highlighted road and click any building to discover what you'll learn at each stop
        </p>
      </header>

      <main
        style={{
          width: '100%',
          maxWidth: 1200,
          padding: '0 16px',
        }}
      >
        <TownMap stops={STOPS} onSelectStop={setSelectedStop} />
      </main>

      <div
        style={{
          display: 'flex',
          gap: 24,
          marginTop: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        {STOPS.map((stop, i) => (
          <button
            key={stop.id}
            onClick={() => setSelectedStop(stop)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '6px 12px',
              cursor: `url(${upLogo}) 24 24, auto`,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.05)';
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: stop.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#242430',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              {stop.name}
            </span>
            <span
              style={{
                fontSize: 10,
                color: stop.color,
                background: `${stop.color}22`,
                padding: '1px 6px',
                borderRadius: 3,
              }}
            >
              {stop.ages}
            </span>
          </button>
        ))}
      </div>

      {selectedStop && (
        <StopModal stop={selectedStop} onClose={() => setSelectedStop(null)} />
      )}
        </>
      )}
    </div>
  );
}
