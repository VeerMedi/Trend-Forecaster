import React, { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  subscription: string;
}

interface LoginViewProps {
  onLogin: (user: User) => void;
}

/**
 * Responsive Login View
 * Fully adaptive for mobile, tablet, and desktop
 */
const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Demo User',
    email: 'demo@trendai.com',
    password: 'demo123'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mockUser: User = {
      id: '1',
      email: formData.email,
      name: formData.name || formData.email.split('@')[0],
      subscription: 'free'
    };

    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left Side - Branding & Info (Hidden on mobile, visible on tablet+) */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extralight text-stone-100 leading-tight">
              Trend <span className="text-amber-400 font-light">Direction</span>
            </h1>
            <p className="text-lg xl:text-xl text-stone-400 font-light leading-relaxed">
              AI-powered fashion trend forecasting for designers, brands, and creative professionals.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="text-stone-200 font-medium mb-1">Real-Time Data</h3>
                <p className="text-sm text-stone-500">Google Trends, Reddit, Fashion Media</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="text-stone-200 font-medium mb-1">AI Analysis</h3>
                <p className="text-sm text-stone-500">12-month forecasts, market timing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="text-stone-200 font-medium mb-1">Regional Insights</h3>
                <p className="text-sm text-stone-500">India, USA, UK market data</p>
              </div>
            </div>
          </div>

          {/* Decorative Stats (Desktop only) */}
          <div className="hidden xl:grid grid-cols-3 gap-4 pt-8 border-t border-stone-800/50">
            <div>
              <div className="text-2xl font-light text-amber-400">500+</div>
              <div className="text-xs text-stone-500 uppercase tracking-wider">Trends Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-light text-violet-400">95%</div>
              <div className="text-xs text-stone-500 uppercase tracking-wider">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-light text-blue-400">24/7</div>
              <div className="text-xs text-stone-500 uppercase tracking-wider">Real-Time</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form (Always visible, adaptive width) */}
        <div className="w-full">
          {/* Mobile-only branding (shown only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extralight text-stone-100 mb-2">
              Trend <span className="text-amber-400 font-light">Direction</span>
            </h1>
            <p className="text-sm sm:text-base text-stone-400 font-light">
              AI-powered fashion forecasting
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-stone-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-stone-800/50 p-6 sm:p-8 shadow-2xl">

            {/* Demo Credentials Banner */}
            <div className="mb-6 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-600/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔑</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-amber-200 mb-1">Demo Credentials (Pre-filled)</div>
                  <div className="text-xs text-stone-300 space-y-1">
                    <div><strong className="text-amber-300">Email:</strong> demo@trendai.com</div>
                    <div><strong className="text-amber-300">Password:</strong> demo123</div>
                  </div>
                  <div className="text-xs text-stone-500 mt-2">Just click "Sign In" to proceed →</div>
                </div>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-6 sm:mb-8 bg-stone-950/50 rounded-xl p-1">
              <button
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${!isSignup
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-stone-400 hover:text-stone-200'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${isSignup
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-stone-400 hover:text-stone-200'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-950/50 border border-stone-700/50 rounded-xl px-4 py-3 sm:py-3.5 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all text-sm sm:text-base"
                    placeholder="Your name"
                    required={isSignup}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-stone-950/50 border border-stone-700/50 rounded-xl px-4 py-3 sm:py-3.5 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all text-sm sm:text-base"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-stone-950/50 border border-stone-700/50 rounded-xl px-4 py-3 sm:py-3.5 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="flex items-center gap-2 text-stone-400 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500/50" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-amber-400 hover:text-amber-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-base hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-900/30 active:scale-[0.98]"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {/* Social Login (Optional) */}
            <div className="mt-6 pt-6 border-t border-stone-800/50">
              <p className="text-center text-xs sm:text-sm text-stone-500 mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-stone-950/50 border border-stone-700/50 rounded-lg px-4 py-2.5 sm:py-3 text-sm text-stone-300 hover:bg-stone-800/50 hover:border-stone-600 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="hidden sm:inline">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-stone-950/50 border border-stone-700/50 rounded-lg px-4 py-2.5 sm:py-3 text-sm text-stone-300 hover:bg-stone-800/50 hover:border-stone-600 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-center text-xs text-stone-500">
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Mobile features (shown only on small screens) */}
          <div className="lg:hidden mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg sm:text-xl font-light text-amber-400">500+</div>
              <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">Trends</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-light text-violet-400">95%</div>
              <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">Accuracy</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-light text-blue-400">24/7</div>
              <div className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider">Live</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
