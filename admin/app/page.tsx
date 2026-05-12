'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, setNewPassword, confirmForgotPassword, saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [newPw, setNewPw]       = useState('');
  const [code, setCode]         = useState('');
  const [challenge, setChallenge] = useState<{ session: string; username: string } | null>(null);
  const [resetRequired, setResetRequired] = useState<{ username: string } | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (resetRequired) {
        await confirmForgotPassword(resetRequired.username, code, newPw);
        setResetRequired(null);
        setPassword('');
        setError('');
        // Now sign in with new password
        const result = await signIn(resetRequired.username, newPw);
        if ('idToken' in result) {
          saveAuth(result);
          router.replace('/dashboard');
        }
      } else if (challenge) {
        const auth = await setNewPassword(challenge.username, newPw, challenge.session);
        saveAuth(auth);
        router.replace('/dashboard');
      } else {
        const result = await signIn(email, password);
        if ('type' in result && result.type === 'NEW_PASSWORD_REQUIRED') {
          setChallenge({ session: result.session, username: result.username });
        } else if ('type' in result && result.type === 'PASSWORD_RESET_REQUIRED') {
          setResetRequired({ username: result.username });
        } else if ('idToken' in result) {
          saveAuth(result);
          router.replace('/dashboard');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 mb-4">
            <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-900 fill-current">
              <path d="M16 2 L19 11 L29 11 L21 17 L24 26 L16 20 L8 26 L11 17 L3 11 L13 11 Z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">LebVentures Admin</h1>
          <p className="text-amber-400 text-sm mt-1">Sign in to manage events</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {resetRequired ? (
              <div className="space-y-4">
                <div className="bg-amber-50 text-amber-700 rounded-xl p-3 text-sm font-medium">
                  A verification code was sent to your email. Enter it below with your new password.
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Verification Code</label>
                  <input type="text" required value={code} onChange={e => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <input type="password" required value={newPw} onChange={e => setNewPw(e.target.value)}
                    placeholder="Min 10 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                </div>
              </div>
            ) : !challenge ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@lebventures.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 text-amber-700 rounded-xl p-3 text-sm font-medium">Set a new password to continue.</div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <input type="password" required value={newPw} onChange={e => setNewPw(e.target.value)}
                    placeholder="Min 10 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
                </div>
              </div>
            )}
            {error && <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
              {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round"/>
                </svg>
              )}
              {resetRequired ? 'Reset Password' : challenge ? 'Set Password' : loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
