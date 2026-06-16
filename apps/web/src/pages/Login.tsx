import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function Login() {
  const { login, user } = useAuth();
  const [params] = useSearchParams();
  const error = params.get('error');

  if (user) {
    // Já autenticado — volta para a home.
    window.location.assign('/');
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-slate-800/60 p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold">VITA</h1>
        <p className="mt-2 text-slate-400">Acesso restrito</p>

        {error && (
          <p className="mt-4 text-red-400" role="alert">
            Acesso não autorizado para este e-mail.
          </p>
        )}

        <button
          onClick={login}
          className="mt-6 w-full rounded-lg bg-white px-4 py-2 font-medium text-slate-900 hover:bg-slate-200"
        >
          Entrar com Google
        </button>
      </div>
    </main>
  );
}
