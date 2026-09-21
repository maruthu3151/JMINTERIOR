import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50 text-stone-900">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-stone-200 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
            </p>
            <Button
              variant="primary"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
