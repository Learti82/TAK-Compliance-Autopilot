import { useForm, Link } from '@inertiajs/react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-xl">
                        <ShieldCheckIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">TAK Compliance Autopilot</h1>
                    <p className="text-blue-200 text-sm mt-1">Sistemi i menaxhimit të pagave dhe pajtueshmërisë</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Hyrja në sistem</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="you@company.com"
                                autoFocus
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fjalëkalimi</label>
                            <input
                                type="password"
                                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Mbaje mend</label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Duke u kyçur...' : 'Hyr'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Nuk keni llogari?{' '}
                        <Link href="/register" className="text-blue-600 font-medium hover:underline">
                            Regjistrohuni
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
