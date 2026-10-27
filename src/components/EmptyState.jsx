/**
 * EmptyState — reusable centered placeholder for empty views.
 *
 * Props:
 *  - icon        {string}   Bootstrap icon class (e.g. 'bi-airplane')
 *  - title       {string}   Heading
 *  - message     {string}   Description text
 *  - actionText  {string}   Optional button label
 *  - onAction    {function} Optional button handler
 */
export default function EmptyState({
  icon = 'bi-inbox',
  title = 'Nothing here yet',
  message = '',
  actionText = '',
  actionLabel = '',
  onAction,
}) {
  const btnLabel = actionText || actionLabel;
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center py-5 px-3"
      style={{ minHeight: '320px' }}
    >
      {/* Large icon */}
      <div
        className="mb-4 d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(56,189,248,0.12))',
        }}
      >
        <i
          className={`bi ${icon}`}
          style={{ fontSize: '2.6rem', color: '#2563eb' }}
        ></i>
      </div>

      {/* Title */}
      <h4 className="fw-bold mb-2" style={{ color: '#0a1628' }}>
        {title}
      </h4>

      {/* Message */}
      {message && (
        <p className="text-muted mb-4" style={{ maxWidth: '420px', lineHeight: 1.6 }}>
          {message}
        </p>
      )}

      {/* Optional action button */}
      {btnLabel && onAction && (
        <button
          className="btn text-white px-4 py-2"
          onClick={onAction}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            borderRadius: '50px',
            border: 'none',
            fontWeight: 600,
          }}
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
}
