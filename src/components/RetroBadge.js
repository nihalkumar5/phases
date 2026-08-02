export default function RetroBadge({ text, color = "#FFD166", rotation = "-3deg" }) {
  return (
    <div style={{
      display: 'inline-block',
      backgroundColor: color,
      color: '#000',
      padding: '0.4rem 1rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: '1.5rem',
      textTransform: 'uppercase',
      border: '2px solid #000',
      borderRadius: '0px',
      transform: `rotate(${rotation})`,
      boxShadow: '4px 4px 0px #000',
      letterSpacing: '0.05em'
    }}>
      {text}
    </div>
  );
}
