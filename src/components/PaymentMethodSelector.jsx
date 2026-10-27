import { useState } from 'react';

/**
 * PaymentMethodSelector — demo payment method selection & simulation.
 *
 * Props:
 *  - selectedMethod     {string}   Currently selected method
 *  - onMethodChange     {function} (method) => void
 *  - onSimulatePayment  {function} (result: 'success'|'failed'|'cancelled') => void
 */

const METHODS = [
  { id: 'upi', label: 'UPI', icon: 'bi-phone' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'bi-credit-card' },
  { id: 'netbanking', label: 'Net Banking', icon: 'bi-bank' },
  { id: 'wallet', label: 'Wallet', icon: 'bi-wallet2' },
  { id: 'demo', label: 'Demo Payment', icon: 'bi-lightning-charge' },
];

const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Yes Bank',
];

const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik', 'Freecharge'];

export default function PaymentMethodSelector({
  selectedMethod = 'demo',
  onMethodChange,
  onSimulatePayment,
}) {
  const [upiId, setUpiId] = useState('demo@upi');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('DEMO USER');
  const [bank, setBank] = useState(BANKS[0]);
  const [wallet, setWallet] = useState(WALLETS[0]);

  const activeStyle = (id) => ({
    borderColor: selectedMethod === id ? '#2563eb' : '#dee2e6',
    backgroundColor: selectedMethod === id ? 'rgba(37,99,235,0.04)' : '#fff',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background-color 0.2s',
  });

  return (
    <div>
      {/* ── Warning banner ──────────────────────────────────────── */}
      <div
        className="alert mb-4 border-0"
        style={{
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          borderLeft: '4px solid #f59e0b',
        }}
      >
        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '1.3rem', marginTop: '2px' }}></i>
          <div>
            <strong className="d-block mb-1" style={{ color: '#92400e' }}>
              ⚠️ Demo Payment Simulation
            </strong>
            <p className="mb-0 small" style={{ color: '#78350f' }}>
              This is a demo payment simulation. <strong>Do not enter real financial information.</strong>{' '}
              No actual transactions are processed. All payment data shown below is
              pre-filled with test values for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* ── Method selection ─────────────────────────────────────── */}
      <div className="row g-2 mb-4">
        {METHODS.map((m) => (
          <div className="col-6 col-md" key={m.id}>
            <div
              className="card border p-3 text-center h-100"
              style={activeStyle(m.id)}
              onClick={() => onMethodChange?.(m.id)}
            >
              <i
                className={`bi ${m.icon} d-block mb-1`}
                style={{
                  fontSize: '1.4rem',
                  color: selectedMethod === m.id ? '#2563eb' : '#6b7280',
                }}
              ></i>
              <small
                className="fw-semibold"
                style={{
                  fontSize: '0.78rem',
                  color: selectedMethod === m.id ? '#2563eb' : '#374151',
                }}
              >
                {m.label}
              </small>
              {selectedMethod === m.id && (
                <i
                  className="bi bi-check-circle-fill position-absolute"
                  style={{ top: '6px', right: '6px', color: '#2563eb', fontSize: '0.9rem' }}
                ></i>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Method-specific form ─────────────────────────────────── */}
      <div
        className="p-4 mb-4 border rounded-3"
        style={{ backgroundColor: '#fafafa', borderColor: '#e5e7eb', borderRadius: '14px' }}
      >
        {/* UPI */}
        {selectedMethod === 'upi' && (
          <div>
            <h6 className="fw-bold mb-3" style={{ color: '#0a1628' }}>
              <i className="bi bi-phone me-2 text-primary"></i>UPI Payment (Demo)
            </h6>
            <label className="form-label small fw-semibold text-muted">UPI ID</label>
            <input
              type="text"
              className="form-control"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              style={{ borderRadius: '10px', maxWidth: '360px' }}
            />
            <small className="text-muted d-block mt-1">
              <i className="bi bi-info-circle me-1"></i>Demo UPI ID — not real
            </small>
          </div>
        )}

        {/* Card */}
        {selectedMethod === 'card' && (
          <div>
            <h6 className="fw-bold mb-3" style={{ color: '#0a1628' }}>
              <i className="bi bi-credit-card me-2 text-primary"></i>Card Payment (Demo)
            </h6>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-semibold text-muted">Card Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted">Cardholder Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold text-muted">Expiry</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold text-muted">CVV</label>
                <input
                  type="password"
                  className="form-control"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="•••"
                  maxLength={4}
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
            <div
              className="alert alert-danger mt-3 mb-0 py-2 border-0 small"
              style={{ borderRadius: '10px' }}
            >
              <i className="bi bi-shield-exclamation me-1"></i>
              <strong>Do NOT enter real card details.</strong> This is a test form with
              pre-filled demo data.
            </div>
          </div>
        )}

        {/* Net Banking */}
        {selectedMethod === 'netbanking' && (
          <div>
            <h6 className="fw-bold mb-3" style={{ color: '#0a1628' }}>
              <i className="bi bi-bank me-2 text-primary"></i>Net Banking (Demo)
            </h6>
            <label className="form-label small fw-semibold text-muted">Select Bank</label>
            <select
              className="form-select"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              style={{ borderRadius: '10px', maxWidth: '360px' }}
            >
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <small className="text-muted d-block mt-2">
              <i className="bi bi-info-circle me-1"></i>You will be redirected to a demo bank page (simulated).
            </small>
          </div>
        )}

        {/* Wallet */}
        {selectedMethod === 'wallet' && (
          <div>
            <h6 className="fw-bold mb-3" style={{ color: '#0a1628' }}>
              <i className="bi bi-wallet2 me-2 text-primary"></i>Wallet Payment (Demo)
            </h6>
            <label className="form-label small fw-semibold text-muted">Select Wallet</label>
            <div className="d-flex flex-wrap gap-2">
              {WALLETS.map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`btn btn-sm ${wallet === w ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setWallet(w)}
                  style={{ borderRadius: '20px', fontSize: '0.85rem' }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Demo Payment */}
        {selectedMethod === 'demo' && (
          <div className="text-center py-3">
            <i
              className="bi bi-lightning-charge-fill d-block mb-2"
              style={{ fontSize: '2.5rem', color: '#2563eb' }}
            ></i>
            <h6 className="fw-bold mb-1" style={{ color: '#0a1628' }}>Quick Demo Payment</h6>
            <p className="text-muted small mb-0">
              Click one of the buttons below to simulate a payment outcome.
              No form fields required.
            </p>
          </div>
        )}
      </div>

      {/* ── Simulation buttons ───────────────────────────────────── */}
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <button
          type="button"
          className="btn btn-success px-4 py-2 fw-semibold"
          onClick={() => onSimulatePayment?.('success')}
          style={{ borderRadius: '12px', minWidth: '200px' }}
        >
          <i className="bi bi-check-circle me-2"></i>
          Simulate Successful Payment
        </button>
        <button
          type="button"
          className="btn btn-danger px-4 py-2 fw-semibold"
          onClick={() => onSimulatePayment?.('failed')}
          style={{ borderRadius: '12px', minWidth: '200px' }}
        >
          <i className="bi bi-x-circle me-2"></i>
          Simulate Failed Payment
        </button>
        <button
          type="button"
          className="btn btn-warning px-4 py-2 fw-semibold text-dark"
          onClick={() => onSimulatePayment?.('cancelled')}
          style={{ borderRadius: '12px', minWidth: '200px' }}
        >
          <i className="bi bi-dash-circle me-2"></i>
          Simulate Cancelled Payment
        </button>
      </div>

      {/* ── Explanation note ─────────────────────────────────────── */}
      <div className="text-center mt-4">
        <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
          <i className="bi bi-info-circle me-1"></i>
          In a production system, this would integrate with a real payment gateway
          (e.g., Razorpay, Stripe, PayU). The buttons above simply simulate different
          payment outcomes for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
