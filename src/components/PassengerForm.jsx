/**
 * PassengerForm — form for a single passenger.
 *
 * Props:
 *  - index         {number}   Passenger index (0-based)
 *  - passengerType {string}   'adult' | 'child' | 'infant'
 *  - passenger     {object}   Current passenger data
 *  - onChange       {function} (index, field, value) => void
 *  - errors        {object}   Validation errors keyed by field name
 */
export default function PassengerForm({
  index = 0,
  passengerType = 'adult',
  passenger = {},
  onChange,
  errors = {},
}) {
  const isFirst = index === 0;
  const typeLabel =
    passengerType === 'adult'
      ? 'Adult'
      : passengerType === 'child'
        ? 'Child (2–11 yrs)'
        : 'Infant (< 2 yrs)';

  const titles =
    passengerType === 'child' || passengerType === 'infant'
      ? ['Master', 'Miss']
      : ['Mr', 'Mrs', 'Ms', 'Master', 'Miss'];

  /* ── helper ────────────────────────────────────────────────────── */
  const handleChange = (field) => (e) => {
    const val = e.target.value;
    const patch = { [field]: val };
    if (field === 'dateOfBirth') patch.dob = val;
    if (field === 'dob') patch.dateOfBirth = val;
    onChange?.(patch);
    onChange?.(index, field, val);
  };

  const fieldError = (field) => {
    if (!errors) return null;
    if (typeof errors === 'object' && !Array.isArray(errors) && errors[field]) {
      return <div className="invalid-feedback d-block">{errors[field]}</div>;
    }
    if (Array.isArray(errors)) {
      const match = errors.find((err) => {
        const lower = err.toLowerCase();
        if (field === 'firstName' && lower.includes('first name')) return true;
        if (field === 'lastName' && lower.includes('last name')) return true;
        if ((field === 'dateOfBirth' || field === 'dob') && (lower.includes('birth') || lower.includes('dob'))) return true;
        if (field === 'gender' && lower.includes('gender')) return true;
        if (field === 'email' && lower.includes('email')) return true;
        if (field === 'phone' && lower.includes('phone')) return true;
        return lower.includes(field.toLowerCase());
      });
      if (match) return <div className="invalid-feedback d-block">{match}</div>;
    }
    return null;
  };

  const hasError = (field) => Boolean(fieldError(field));

  const typeColors = {
    adult: '#2563eb',
    child: '#0891b2',
    infant: '#8b5cf6',
  };

  return (
    <div
      className="card border-0 shadow-sm mb-3"
      style={{ borderRadius: '16px', overflow: 'hidden' }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="card-header bg-white border-bottom d-flex align-items-center gap-2 py-3 px-4"
        style={{ cursor: 'pointer' }}
        data-bs-toggle="collapse"
        data-bs-target={`#passenger-${index}`}
        aria-expanded="true"
      >
        <span
          className="badge rounded-pill text-white"
          style={{ backgroundColor: typeColors[passengerType] || '#2563eb', fontSize: '0.75rem' }}
        >
          {typeLabel}
        </span>
        <span className="fw-semibold" style={{ color: '#0a1628', fontSize: '0.95rem' }}>
          Passenger {index + 1}
          {passenger.firstName
            ? ` — ${passenger.title || ''} ${passenger.firstName} ${passenger.lastName || ''}`
            : ''}
        </span>
        <i className="bi bi-chevron-down ms-auto text-muted"></i>
      </div>

      {/* ── Collapsible body ────────────────────────────────────── */}
      <div className="collapse show" id={`passenger-${index}`}>
        <div className="card-body p-4">
          <div className="row g-3">
            {/* Title */}
            <div className="col-md-2 col-sm-4">
              <label className="form-label small fw-semibold text-muted">
                Title <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${hasError('title') ? 'is-invalid' : ''}`}
                value={passenger.title || ''}
                onChange={handleChange('title')}
                style={{ borderRadius: '10px' }}
              >
                <option value="">Select</option>
                {titles.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {fieldError('title')}
            </div>

            {/* First Name */}
            <div className="col-md-5 col-sm-8">
              <label className="form-label small fw-semibold text-muted">
                First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${hasError('firstName') ? 'is-invalid' : ''}`}
                placeholder="First name"
                value={passenger.firstName || ''}
                onChange={handleChange('firstName')}
                style={{ borderRadius: '10px' }}
              />
              {fieldError('firstName')}
            </div>

            {/* Last Name */}
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted">
                Last Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${hasError('lastName') ? 'is-invalid' : ''}`}
                placeholder="Last name"
                value={passenger.lastName || ''}
                onChange={handleChange('lastName')}
                style={{ borderRadius: '10px' }}
              />
              {fieldError('lastName')}
            </div>

            {/* Date of Birth */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">
                Date of Birth <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${hasError('dateOfBirth') || hasError('dob') ? 'is-invalid' : ''}`}
                value={passenger.dateOfBirth || passenger.dob || ''}
                onChange={handleChange('dateOfBirth')}
                style={{ borderRadius: '10px' }}
              />
              {fieldError('dateOfBirth') || fieldError('dob')}
            </div>

            {/* Gender */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">
                Gender <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${hasError('gender') ? 'is-invalid' : ''}`}
                value={passenger.gender || ''}
                onChange={handleChange('gender')}
                style={{ borderRadius: '10px' }}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {fieldError('gender')}
            </div>

            {/* Nationality */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">
                Nationality <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${hasError('nationality') ? 'is-invalid' : ''}`}
                placeholder="e.g. Indian"
                value={passenger.nationality || ''}
                onChange={handleChange('nationality')}
                style={{ borderRadius: '10px' }}
              />
              {fieldError('nationality')}
            </div>

            {/* Email — first passenger only */}
            {isFirst && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">
                  <i className="bi bi-envelope me-1"></i>
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${hasError('email') ? 'is-invalid' : ''}`}
                  placeholder="email@example.com"
                  value={passenger.email || ''}
                  onChange={handleChange('email')}
                  style={{ borderRadius: '10px' }}
                />
                {fieldError('email')}
              </div>
            )}

            {/* Phone — first passenger only */}
            {isFirst && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">
                  <i className="bi bi-phone me-1"></i>
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control ${hasError('phone') ? 'is-invalid' : ''}`}
                  placeholder="+91 98765 43210"
                  value={passenger.phone || ''}
                  onChange={handleChange('phone')}
                  style={{ borderRadius: '10px' }}
                />
                {fieldError('phone')}
              </div>
            )}

            {/* Passport — optional (for international) */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">
                <i className="bi bi-passport me-1"></i>
                Passport Number
                <span className="text-muted fw-normal ms-1">(optional)</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.passportNumber ? 'is-invalid' : ''}`}
                placeholder="For international flights"
                value={passenger.passportNumber || ''}
                onChange={handleChange('passportNumber')}
                style={{ borderRadius: '10px' }}
              />
              {fieldError('passportNumber')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
