import React from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SkyBook ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 80, height: 80, background: '#fee2e2' }}
          >
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
          </div>
          <h2 className="fw-bold mb-2" style={{ color: '#0a1628' }}>
            Something went wrong
          </h2>
          <p className="text-muted mb-4" style={{ maxWidth: 500 }}>
            We encountered an unexpected issue while loading this page. You can reload the page or return to the SkyBook homepage.
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-primary px-4 py-2" onClick={this.handleReload}>
              <i className="bi bi-arrow-clockwise me-2"></i>Reload Page
            </button>
            <button className="btn btn-outline-secondary px-4 py-2" onClick={this.handleReset}>
              <i className="bi bi-house-door me-2"></i>Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
