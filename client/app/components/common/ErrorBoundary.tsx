'use client';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // no-op; could log to a service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-red-400">
          {this.props.message || 'Something went wrong.'}
        </div>
      );
    }
    return this.props.children;
  }
}


