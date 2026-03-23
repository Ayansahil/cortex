import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 glass rounded-3xl border border-red-500/20 bg-red-500/5 text-center">
          <h2 className="text-2xl font-bold font-heading text-red-400 mb-4">Something went wrong</h2>
          <p className="text-gray-400 font-mono text-sm max-w-md mb-6">
            An error occurred while rendering this component. Check the console for details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo hover:bg-indigo-dark text-white rounded-xl transition-colors font-bold"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
