import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Pagination from '@/Components/UI/Pagination';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { formatDateTime } from '@/Utils/format';
import { router } from '@inertiajs/react';
import { ClockIcon } from '@heroicons/react/24/outline';

const actionColors = {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-blue-100 text-blue-700',
    deleted: 'bg-red-100 text-red-700',
    approved: 'bg-purple-100 text-purple-700',
    submitted: 'bg-indigo-100 text-indigo-700',
    exported: 'bg-gray-100 text-gray-700',
    login: 'bg-teal-100 text-teal-700',
    logout: 'bg-gray-100 text-gray-500',
};

const actionLabels = {
    created: 'Krijuar', updated: 'Përditësuar', deleted: 'Fshirë',
    approved: 'Aprovuar', submitted: 'Dorëzuar', exported: 'Eksportuar',
    login: 'Hyrje', logout: 'Dalje', regenerated: 'Rigjeneruar',
    tak_export: 'Eksport TAK',
};

export default function AuditLogsIndex({ logs, filters }) {
    return (
        <AppLayout title="Regjistri i aktivitetit">
            <div className="space-y-5">
                {/* Filters */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Kërko..."
                        defaultValue={filters.search ?? ''}
                        onKeyDown={e => e.key === 'Enter' && router.get('/audit-logs', { ...filters, search: e.target.value })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
                    />
                    <select
                        value={filters.action ?? ''}
                        onChange={e => router.get('/audit-logs', { ...filters, action: e.target.value })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Të gjitha veprimet</option>
                        {Object.entries(actionLabels).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                    <select
                        value={filters.entity_type ?? ''}
                        onChange={e => router.get('/audit-logs', { ...filters, entity_type: e.target.value })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Të gjitha entitetet</option>
                        <option value="employee">Punëtori</option>
                        <option value="payroll_run">Lista e pagave</option>
                        <option value="company">Kompania</option>
                        <option value="user">Përdoruesi</option>
                    </select>
                </div>

                <Card>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Koha</Th>
                                <Th>Përdoruesi</Th>
                                <Th>Veprimi</Th>
                                <Th>Entiteti</Th>
                                <Th>Përshkrimi</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {logs.data?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                                        <ClockIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        Nuk ka aktivitet akoma
                                    </td>
                                </tr>
                            )}
                            {logs.data?.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <Td className="text-gray-400 text-xs whitespace-nowrap">{formatDateTime(log.created_at)}</Td>
                                    <Td>
                                        <span className="font-medium text-gray-800">{log.user?.name ?? 'Sistemi'}</span>
                                    </Td>
                                    <Td>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${actionColors[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {actionLabels[log.action] ?? log.action}
                                        </span>
                                    </Td>
                                    <Td>
                                        <div>
                                            <p className="text-sm text-gray-700">{log.entity_label ?? '—'}</p>
                                            <p className="text-xs text-gray-400">{log.entity_type}</p>
                                        </div>
                                    </Td>
                                    <Td className="text-gray-500 text-sm max-w-xs truncate">{log.description ?? '—'}</Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                    <Pagination links={logs.links} meta={logs.meta ?? logs} />
                </Card>
            </div>
        </AppLayout>
    );
}
