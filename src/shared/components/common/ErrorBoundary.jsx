import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui';

/**
 * ErrorBoundary - Componente para capturar erros de React
 * Exibe uma UI amigável quando ocorre um erro na aplicação
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Aqui você pode enviar o erro para um serviço de logging
    // Ex: Sentry, LogRocket, etc
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/pagina-inicial';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Ícone de erro */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Título e descrição */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Algo deu errado
            </h1>
            <p className="text-gray-600 mb-6">
              Desculpe, ocorreu um erro inesperado na aplicação.
              Nossa equipe foi notificada e estamos trabalhando para corrigir.
            </p>

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-48">
                <p className="text-sm font-mono text-red-600 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="primary"
                className="flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Tentar Novamente
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Home size={18} />
                Ir para Início
              </Button>
            </div>

            {/* Link de suporte */}
            <p className="mt-6 text-sm text-gray-500">
              Precisa de ajuda?{' '}
              <a
                href="mailto:suporte@leovidros.com.br"
                className="text-blue-600 hover:underline"
              >
                Entre em contato
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
