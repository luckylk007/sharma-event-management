import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-ink)] px-6 text-center">
          <p className="eyebrow mb-4">Something went wrong</p>
          <h1 className="font-display text-4xl text-[var(--color-cream)] sm:text-5xl">
            We hit an unexpected snag
          </h1>
          <p className="mt-4 max-w-md text-[var(--color-muted)]">
            Please refresh the page. If the problem persists, reach out and we&apos;ll help
            right away.
          </p>
          <Button className="mt-8" onClick={() => window.location.assign('/')}>
            Back to Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
