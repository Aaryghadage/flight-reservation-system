/**
 * Skeleton loading placeholders with shimmer animation.
 * Named exports: FlightCardSkeleton, PageSkeleton, CardSkeleton
 */

const shimmerStyle = `
  @keyframes skeletonShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0;  }
  }
`;

const barStyle = (width = '100%', height = '14px', extra = {}) => ({
  width,
  height,
  borderRadius: '6px',
  background: 'linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%)',
  backgroundSize: '800px 100%',
  animation: 'skeletonShimmer 1.6s infinite linear',
  ...extra,
});

/**
 * FlightCardSkeleton — mimics the FlightCard layout.
 */
export function FlightCardSkeleton() {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div
        className="card border-0 shadow-sm mb-3"
        style={{ borderRadius: '16px', overflow: 'hidden' }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            {/* Airline badge */}
            <div style={barStyle('50px', '50px', { borderRadius: '12px', flexShrink: 0 })} />

            {/* Route info */}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div style={barStyle('70px', '20px')} />
                <div style={barStyle('30px', '6px')} />
                <div style={barStyle('70px', '20px')} />
              </div>
              <div className="d-flex gap-3">
                <div style={barStyle('90px', '12px')} />
                <div style={barStyle('60px', '12px')} />
              </div>
            </div>

            {/* Duration & stops */}
            <div className="text-center" style={{ minWidth: '100px' }}>
              <div className="mb-2 mx-auto" style={barStyle('80px', '14px')} />
              <div className="mx-auto" style={barStyle('55px', '12px')} />
            </div>

            {/* Price */}
            <div className="text-end" style={{ minWidth: '110px' }}>
              <div className="mb-2 ms-auto" style={barStyle('90px', '22px')} />
              <div className="ms-auto" style={barStyle('70px', '12px')} />
            </div>

            {/* Button */}
            <div style={barStyle('120px', '40px', { borderRadius: '10px', flexShrink: 0 })} />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * CardSkeleton — generic card skeleton.
 */
export function CardSkeleton({ lines = 4, style: extraStyle = {} }) {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: '16px', overflow: 'hidden', ...extraStyle }}
      >
        <div className="card-body p-4">
          <div className="mb-3" style={barStyle('60%', '18px')} />
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="mb-2"
              style={barStyle(i === lines - 1 ? '40%' : `${80 - i * 10}%`, '13px')}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * PageSkeleton — full page loading skeleton.
 */
export function PageSkeleton() {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div className="container py-5">
        {/* Title bar */}
        <div className="mb-4" style={barStyle('35%', '28px')} />
        <div className="mb-5" style={barStyle('55%', '14px')} />

        <div className="row g-4">
          {/* Sidebar placeholder */}
          <div className="col-lg-3 d-none d-lg-block">
            <CardSkeleton lines={6} />
          </div>
          {/* Main content placeholders */}
          <div className="col-lg-9">
            {[1, 2, 3].map((n) => (
              <FlightCardSkeleton key={n} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* Default export for convenience when only PageSkeleton is needed */
export default PageSkeleton;
