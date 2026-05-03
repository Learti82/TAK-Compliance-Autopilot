import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import StatCard from '@/Components/UI/StatCard';
import Pagination from '@/Components/UI/Pagination';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { formatDate } from '@/Utils/format';
import { router } from '@inertiajs/react';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const typeLabels = {
    monthly_payroll: 'Pagë mujore',
    annual_pit: 'PIT vjetor',
    employee_registration: 'Regjistrim punëtori',
};

function ComplianceRing({ score }) {
    const colors = {
        green: { stroke: '#10b981', text: 'text-green-600', bg: 'bg-green-50' },
        yellow: { stroke: '#f59e0b', text: 'text-yellow-600', bg: 'bg-yellow-50' },
        red: { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50' },
    };
    const c = colors[score?.level] ?? colors.green;
    const pct = score?.score ?? 100;
    const r = 40;
    const circumference = 2 * Math.PI * r;
    const dash = (pct / 100) * circumference;

    return (
        <div className={`flex items-center gap-6 p-6 rounded-xl ${c.bg}`}>
            <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" stroke="#e5e7eb" />
                    <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8"
                        stroke={c.stroke}
                        strokeDasharray={`${dash} ${circumference}`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${c.text}`}>{pct}</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Skori i Pajtueshmërisë</p>
                <p className={`text-3xl font-bold ${c.text}`}>{score?.label ?? 'Mirë'}</p>
                <p className="text-sm text-gray-500 mt-1">
                    {score?.level === 'green' && 'Të gjitha detyrimet janë në rregull. Mbani kështu!'}
                    {score?.level === 'yellow' && 'Ka detyrime afër afatit. Veproni shpejt.'}
                    {score?.level === 'red' && 'Detyrime të vonuara! Veproni menjëherë për gjoba.'}
                </p>
            </div>
        </div>
    );
}

export default function ComplianceIndex({ deadlines, filters, score, summary }) {
    const markComplete = (id) => router.post(`/compliance/${id}/complete`);
    const markWaived = (id) => router.post(`/compliance/${id}/waive`);

    const getDaysLabel = (dueDate, status) => {
        if (status === 'completed') return null;
        if (status === 'overdue') return null;
        const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days === 0) return { text: 'Sot!', cls: 'text-red-600 font-bold' };
        if (days < 0) return { text: `${Math.abs(days)} ditë vonë`, cls: 'text-red-600 font-semibold' };
        if (days <= 3) return { text: `${days} ditë`, cls: 'text-orange-600 font-semibold' };
        if (days <= 7) return { text: `${days} ditë`, cls: 'text-yellow-600 font-semibold' };
        return { text: `${days} ditë`, cls: 'text-gray-500' };
    };

    return (
        <AppLayout title="Pajtueshmëria">
            <div className="space-y-6">
                <ComplianceRing score={score} />

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard icon={ExclamationTriangleIcon} label="Të vonuara" value={summary.overdue} color={summary.overdue > 0 ? 'red' : 'gray'} />
                    <StatCard icon={ClockIcon} label="Afër afatit (7d)" value={summary.due_soon} color={summary.due_soon > 0 ? 'yellow' : 'gray'} />
                    <StatCard icon={CheckCircleIcon} label="Të kompletuar" value={summary.completed} color="green" />
                    <StatCard icon={ShieldCheckIcon} label="Total" value={summary.total} color="blue" />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        value={filters.type ?? ''}
                        onChange={e => router.get('/compliance', { type: e.target.value, status: filters.status }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Të gjitha llojet</option>
                        <option value="monthly_payroll">Pagë mujore</option>
                        <option value="annual_pit">PIT vjetor</option>
                        <option value="employee_registration">Regjistrim</option>
                    </select>
                    <select
                        value={filters.status ?? ''}
                        onChange={e => router.get('/compliance', { type: filters.type, status: e.target.value }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Të gjithë statuset</option>
                        <option value="pending">Në pritje</option>
                        <option value="overdue">Të vonuara</option>
                        <option value="completed">Të kompletuar</option>
                    </select>
                </div>

                {/* Table */}
                <Card>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Titulli</Th>
                                <Th>Lloji</Th>
                                <Th>Data e afatit</Th>
                                <Th>Ditë deri</Th>
                                <Th>Statusi</Th>
                                <Th>Veprimet</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {deadlines.data?.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Nuk ka detyrime</td></tr>
                            )}
                            {deadlines.data?.map(d => {
                                const daysInfo = getDaysLabel(d.due_date, d.status);
                                const rowBg = d.status === 'overdue' ? 'bg-red-50/50' : '';
                                return (
                                    <tr key={d.id} className={`hover:bg-gray-50 ${rowBg}`}>
                                        <Td>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                                                {d.employee && (
                                                    <p className="text-xs text-gray-400">
                                                        {d.employee.first_name} {d.employee.last_name}
                                                    </p>
                                                )}
                                            </div>
                                        </Td>
                                        <Td>
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                                {typeLabels[d.type] ?? d.type}
                                            </span>
                                        </Td>
                                        <Td>{formatDate(d.due_date)}</Td>
                                        <Td>
                                            {daysInfo
                                                ? <span className={daysInfo.cls}>{daysInfo.text}</span>
                                                : <span className="text-gray-300">—</span>}
                                        </Td>
                                        <Td><Badge status={d.status} /></Td>
                                        <Td>
                                            {(d.status === 'pending' || d.status === 'overdue') && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => markComplete(d.id)}
                                                        className="text-xs text-green-600 hover:underline font-medium"
                                                    >
                                                        Kompletuar
                                                    </button>
                                                    <button
                                                        onClick={() => markWaived(d.id)}
                                                        className="text-xs text-gray-400 hover:underline"
                                                    >
                                                        Hiq
                                                    </button>
                                                </div>
                                            )}
                                        </Td>
                                    </tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                    <Pagination links={deadlines.links} meta={deadlines.meta ?? deadlines} />
                </Card>
            </div>
        </AppLayout>
    );
}
