import AppLayout from '@/Components/Layout/AppLayout';
import StatCard from '@/Components/UI/StatCard';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import { formatCurrency, formatDate } from '@/Utils/format';
import {
    UsersIcon,
    BanknotesIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Link } from '@inertiajs/react';

function ComplianceScore({ score }) {
    const colors = {
        green: { ring: 'stroke-green-500', text: 'text-green-600', bg: 'bg-green-50' },
        yellow: { ring: 'stroke-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' },
        red: { ring: 'stroke-red-500', text: 'text-red-600', bg: 'bg-red-50' },
    };
    const c = colors[score?.level] ?? colors.green;
    const pct = score?.score ?? 100;
    const circumference = 2 * Math.PI * 40;
    const strokeDash = (pct / 100) * circumference;

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl ${c.bg}`}>
            <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" stroke="#e5e7eb" />
                    <circle
                        cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                        className={c.ring}
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${c.text}`}>{pct}</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Skori i Pajtueshmërisë</p>
                <p className={`text-lg font-bold ${c.text}`}>{score?.label ?? 'Mirë'}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                    {score?.level === 'green' && 'Të gjitha detyrimet janë në rregull'}
                    {score?.level === 'yellow' && 'Ka detyrime afër afatit'}
                    {score?.level === 'red' && 'Ka detyrime të vonuara!'}
                </p>
            </div>
        </div>
    );
}

export default function DashboardIndex({ stats, upcoming_deadlines, overdue_deadlines, recent_payrolls, recent_activity, payroll_chart }) {
    return (
        <AppLayout title="Paneli kryesor">
            <div className="space-y-6">
                {/* Overdue alert */}
                {stats.overdue_count > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-800">
                                Keni {stats.overdue_count} detyrim{stats.overdue_count > 1 ? 'e' : ''} të vonuar{stats.overdue_count > 1 ? 'a' : ''}!
                            </p>
                            <p className="text-sm text-red-600">
                                Veproni menjëherë për të shmangur gjobat.{' '}
                                <Link href="/compliance" className="font-semibold underline">Shikoni tani →</Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        icon={UsersIcon}
                        label="Punëtorë aktivë"
                        value={stats.employees.total}
                        sub={stats.employees.unregistered > 0 ? `${stats.employees.unregistered} pa regjistrim TAK` : 'Të gjithë të regjistruar'}
                        color={stats.employees.unregistered > 0 ? 'yellow' : 'green'}
                        onClick={() => window.location.href = '/employees'}
                    />
                    <StatCard
                        icon={ExclamationTriangleIcon}
                        label="Detyrime të vonuara"
                        value={stats.overdue_count}
                        sub="Vepro menjëherë"
                        color={stats.overdue_count > 0 ? 'red' : 'green'}
                        onClick={() => window.location.href = '/compliance'}
                    />
                    <StatCard
                        icon={ClockIcon}
                        label="Afate të ardhshme"
                        value={stats.upcoming_count}
                        sub="Brenda 7 ditëve"
                        color={stats.upcoming_count > 0 ? 'yellow' : 'gray'}
                    />
                    <StatCard
                        icon={BanknotesIcon}
                        label="Pagesa këtij muaji"
                        value={stats.current_month_payroll
                            ? formatCurrency(stats.current_month_payroll.total_gross)
                            : '—'}
                        sub={stats.current_month_payroll
                            ? `${stats.current_month_payroll.employee_count} punëtorë · ${stats.current_month_payroll.status}`
                            : 'Nuk është gjeneruar'}
                        color="blue"
                        onClick={() => window.location.href = '/payroll'}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Chart */}
                    <Card className="xl:col-span-2" title="Pagesa mujore (€)">
                        <div className="p-4">
                            {payroll_chart?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={payroll_chart} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip formatter={(v) => formatCurrency(v)} />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="gross" name="Bruto" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                        <Bar dataKey="net" name="Neto" fill="#10b981" radius={[3, 3, 0, 0]} />
                                        <Bar dataKey="pit" name="TM/PIT" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                                    Nuk ka të dhëna pagese akoma
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Compliance score */}
                    <Card title="Pajtueshmëria">
                        <div className="p-4 space-y-4">
                            <ComplianceScore score={stats.compliance_score} />
                            {overdue_deadlines?.slice(0, 3).map(d => (
                                <div key={d.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div>
                                        <p className="text-sm font-medium text-red-800 truncate max-w-[160px]">{d.title}</p>
                                        <p className="text-xs text-red-500">{formatDate(d.due_date)}</p>
                                    </div>
                                    <Badge status="overdue" />
                                </div>
                            ))}
                            <Link href="/compliance" className="block text-center text-sm text-blue-600 hover:underline font-medium pt-1">
                                Shiko të gjitha →
                            </Link>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Upcoming deadlines */}
                    <Card title="Afate të ardhshme" actions={
                        <Link href="/compliance" className="text-xs text-blue-600 hover:underline">Të gjitha</Link>
                    }>
                        {upcoming_deadlines?.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {upcoming_deadlines.slice(0, 6).map(d => {
                                    const daysLeft = Math.ceil((new Date(d.due_date) - new Date()) / (1000 * 60 * 60 * 24));
                                    const urgency = daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-yellow-600' : 'text-gray-500';
                                    return (
                                        <div key={d.id} className="flex items-center justify-between px-5 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{d.title}</p>
                                                <p className="text-xs text-gray-400">{formatDate(d.due_date)}</p>
                                            </div>
                                            <span className={`text-xs font-semibold ${urgency}`}>
                                                {daysLeft <= 0 ? 'Sot!' : `${daysLeft}d`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-5 py-8 text-center text-sm text-gray-400">
                                <ClipboardDocumentCheckIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                Nuk ka afate të ardhshme
                            </div>
                        )}
                    </Card>

                    {/* Recent activity */}
                    <Card title="Aktiviteti i fundit">
                        {recent_activity?.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {recent_activity.slice(0, 8).map(log => (
                                    <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                                        <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">{log.user?.name ?? 'Sistemi'}</span>
                                                {' '}{log.action_label ?? log.action}{' '}
                                                <span className="text-gray-500">{log.entity_label}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(log.created_at)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-8 text-center text-sm text-gray-400">
                                Nuk ka aktivitet akoma
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
