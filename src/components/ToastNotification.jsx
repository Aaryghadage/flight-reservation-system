import { useEffect, useRef } from 'react';

/**
 * ToastNotification — a single Bootstrap-styled toast notification.
 *
 * Props:
 *  - message  {string}   Text to display
 *  - type     {string}   'success' | 'error' | 'warning' | 'info'
 *  - show     {boolean}  Whether the toast is visible
 *  - onClose  {function} Called when the toast should be dismissed
 */
export default function ToastNotification({ message, type = 'info', show, onClose }) {
  const timerRef = useRef(null);

  /* Auto-dismiss after 4 seconds */
  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(() => {
        onClose?.();
      }, 4000);
    }
    return () => clearTimeout(timerRef.current);
  }, [show, onClose]);

  if (!show) return null;

  /* Map type → Bootstrap colour classes & icon */
  const typeMap = {
    success: { bg: '#0d6832', icon: 'bi-check-circle-fill', label: 'Success' },
    error:   { bg: '#b91c1c', icon: 'bi-exclamation-triangle-fill', label: 'Error' },
    warning: { bg: '#b45309', icon: 'bi-exclamation-circle-fill', label: 'Warning' },
    info:    { bg: '#1d4ed8', icon: 'bi-info-circle-fill', label: 'Info' },
  };

  const cfg = typeMap[type] || typeMap.info;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className="toast show shadow-lg text-white border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          backgroundColor: cfg.bg,
          borderRadius: '12px',
          minWidth: '300px',
          animation: 'toastSlideIn 0.35s ease-out',
        }}
      >
        <div className="toast-header border-0 bg-transparent text-white py-2 px-3">
          <i className={`bi ${cfg.icon} me-2`}></i>
          <strong className="me-auto">{cfg.label}</strong>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="toast-body px-3 pb-3 pt-0" style={{ fontSize: '0.92rem' }}>
          {message}
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
