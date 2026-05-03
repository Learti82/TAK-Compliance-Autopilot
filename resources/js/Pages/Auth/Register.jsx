import { useForm, Link } from '@inertiajs/react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        fiscal_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-xl">
                        <ShieldCheckIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Krijoni llogarinë tuaj</h1>
                    <p className="text-blue-200 text-sm mt-1">Filloni menaxhimin e pajtueshmërisë sot</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Informacioni i kompanisë</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emri i kompanisë <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company_name ? 'border-red-400' : 'border-gray-300'}`}
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    placeholder="Kompania SH.P.K."
                                />
                                {errors.company_name && <p className="mt-1 text-xs text-red-600">{errors.company_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nr. Fiskal <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fiscal_number ? 'border-red-400' : 'border-gray-300'}`}
                                    value={data.fiscal_number}
                                    onChange={e => setData('fiscal_number', e.target.value)}
                                    placeholder="600123456"
                                />
                                {errors.fiscal_number && <p className="mt-1 text-xs text-red-600">{errors.fiscal_number}</p>}
                            </div>

                            <div className="col-span-2 pt-2">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Llogaria juaj</h3>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emri i plotë <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Emri Mbiemri"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@kompania.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fjalëkalimi <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Min. 8 karaktere"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmo fjalëkalimin <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
                        >
                            {processing ? 'Duke u regjistruar...' : 'Krijo llogarinë'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Keni llogari?{' '}
                        <Link href="/login" className="text-blue-600 font-medium hover:underline">Hyni këtu</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
