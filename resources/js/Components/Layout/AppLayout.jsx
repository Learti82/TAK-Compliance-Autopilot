import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    HomeIcon,
    UsersIcon,
    BanknotesIcon,
    ClipboardDocumentCheckIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    ClockIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';

const navigation = [
    { name: 'Paneli', href: '/', icon: HomeIcon, routeName: 'dashboard' },
    { name: 'Punëtorët', href: '/employees', icon: UsersIcon, routeName: 'employees' },
    { name: 'Lista e Pagave', href: '/payroll', icon: BanknotesIcon, routeName: 'payroll' },
    { name: 'Pajtueshmëria', href: '/compliance', icon: ClipboardDocumentCheckIcon, routeName: 'compliance' },
    { name: 'Raportet', href: '/reports/payroll', icon: ChartBarIcon, routeName: 'reports' },
    { name: 'Aktiviteti', href: '/audit-logs', icon: ClockIcon, routeName: 'audit_logs' },
    { name: 'Kompania', href: '/company', icon: BuildingOffice2Icon, routeName: 'company' },
];

const adminNavigation = [
    { name: 'Kompanitë', href: '/admin/companies', icon: BuildingOffice2Icon },
    { name: 'Brezi Tatimor', href: '/admin/tax-brackets', icon: Cog6ToothIcon },
];

function ComplianceBadge({ score }) {
    const colors = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${colors[score?.level] ?? 'bg-gray-400'}`}>
            <ShieldCheckIcon className="w-3 h-3" />
            {score?.score ?? 100}
        </span>
    );
}

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const url = usePage().url;

    const isActive = (href) => url === href || (href !== '/' && url.startsWith(href));

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const isSuperAdmin = auth.user?.roles?.includes('super_admin');

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <ShieldCheckIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold leading-tight">TAK Compliance</p>
                                <p className="text-slate-400 text-xs">Autopilot</p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Company name */}
                    {auth.user?.company && (
                        <div className="px-4 py-3 border-b border-slate-700">
                            <p className="text-slate-400 text-xs uppercase tracking-wide">Kompania</p>
                            <p className="text-white text-sm font-medium truncate">{auth.user.company.name}</p>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {item.name}
                            </Link>
                        ))}

                        {isSuperAdmin && (
                            <>
                                <div className="pt-4 pb-1">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider px-3">Admin</p>
                                </div>
                                {adminNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    {/* User footer */}
                    <div className="border-t border-slate-700 p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{auth.user?.name}</p>
                                <p className="text-slate-400 text-xs truncate">{auth.user?.email}</p>
                            </div>
                            <button onClick={handleLogout} className="text-slate-400 hover:text-white ml-2 flex-shrink-0" title="Dil">
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
                    </div>
                    <div className="flex items-center gap-3">
                        {auth.user?.company && <ComplianceBadge score={null} />}
                    </div>
                </header>

                {/* Flash messages */}
                {(flash?.success || flash?.error) && (
                    <div className={`mx-4 lg:mx-6 mt-4 p-3 rounded-lg text-sm font-medium ${flash?.success
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {flash?.success || flash?.error}
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
