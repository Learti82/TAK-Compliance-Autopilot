import AppLayout from '@/Components/Layout/AppLayout';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import Pagination from '@/Components/UI/Pagination';
import { formatCurrency, formatDate, MONTHS_AL } from '@/Utils/format';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, DocumentArrowDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PayrollIndex({ runs, filters }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <AppLayout title="Lista e Pagave">
            <div className="space-y-5">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="flex gap-2">
                        <select
                            value={filters.year ?? ''}
                            onChange={e => router.get('/payroll', { year: e.target.value, status: filters.status }, { preserveState: true })}
                            className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Të gjithë vitet</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select
                            value={filters.status ?? ''}
                            onChange={e => router.get('/payroll', { year: filters.year, status: e.target.value }, { preserveState: true })}
                            className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Të gjithë statuset</option>
                            <option value="draft">Draft</option>
                            <option value="approved">Aprovuar</option>
                            <option value="submitted">Dorëzuar</option>
                        </select>
                    </div>
                    <Button href="/payroll/create" icon={PlusIcon}>
                        Gjenero listën e pagave
                    </Button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Periudha</Th>
                                <Th>Punëtorë</Th>
                                <Th right>Total Bruto</Th>
                                <Th right>Total Neto</Th>
                                <Th right>Total TM/PIT</Th>
                                <Th right>Kosto totale</Th>
                                <Th>Afati</Th>
                                <Th>Statusi</Th>
                                <Th></Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {runs.data?.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                                        Nuk ka lista pagash. Krijoni të parën!
                                    </td>
                                </tr>
                            )}
                            {runs.data?.map(run => {
                                const isOverdue = run.status !== 'submitted' && new Date(run.submission_deadline) < new Date();
                                return (
                                    <tr key={run.id} className={`hover:bg-gray-50 transition-colors ${isOverdue ? 'bg-red-50/30' : ''}`}>
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                {isOverdue && <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                                <span className="font-medium">{MONTHS_AL[run.month]} {run.year}</span>
                                            </div>
                                        </Td>
                                        <Td>{run.employee_count}</Td>
                                        <Td right mono>{formatCurrency(run.total_gross)}</Td>
                                        <Td right mono className="text-green-700">{formatCurrency(run.total_net)}</Td>
                                        <Td right mono className="text-amber-700">{formatCurrency(run.total_pit)}</Td>
                                        <Td right mono className="text-blue-700 font-semibold">{formatCurrency(run.total_employer_cost)}</Td>
                                        <Td className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                            {formatDate(run.submission_deadline)}
                                        </Td>
                                        <Td><Badge status={run.status} /></Td>
                                        <Td>
                                            <Link href={`/payroll/${run.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                                                Shiko
                                            </Link>
                                        </Td>
                                    </tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                    <Pagination links={runs.links} meta={runs.meta ?? runs} />
                </div>
            </div>
        </AppLayout>
    );
}
