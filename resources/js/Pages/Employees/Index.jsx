import AppLayout from '@/Components/Layout/AppLayout';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import Pagination from '@/Components/UI/Pagination';
import Alert from '@/Components/UI/Alert';
import { formatCurrency, formatDate } from '@/Utils/format';
import { Link, router, useForm } from '@inertiajs/react';
import { MagnifyingGlassIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EmployeesIndex({ employees, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const search = (e) => {
        e.preventDefault();
        get('/employees', { preserveState: true });
    };

    const resetFilters = () => {
        router.get('/employees');
    };

    const unregistered = employees.data?.filter(e => !e.tak_registered_at && e.status === 'active');

    return (
        <AppLayout title="Punëtorët">
            <div className="space-y-5">
                {unregistered?.length > 0 && (
                    <Alert type="warning" title={`${unregistered.length} punëtor(ë) pa regjistrim TAK`}>
                        Punëtorët e listuar duhet të regjistrohen para datës së fillimit të punës.
                    </Alert>
                )}

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <form onSubmit={search} className="flex gap-2">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kërko punëtor..."
                                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                            />
                        </div>
                        <select
                            value={data.status}
                            onChange={e => { setData('status', e.target.value); get('/employees', { preserveState: true }); }}
                            className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Të gjithë statuset</option>
                            <option value="active">Aktivë</option>
                            <option value="inactive">Joaktivë</option>
                            <option value="terminated">Larguar</option>
                        </select>
                        {(filters.search || filters.status) && (
                            <button type="button" onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-700 px-2">
                                Pastro
                            </button>
                        )}
                    </form>

                    <Button href="/employees/create" icon={PlusIcon}>
                        Shto punëtor
                    </Button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Emri</Th>
                                <Th>Pozita</Th>
                                <Th>Kontrata</Th>
                                <Th right>Paga bruto</Th>
                                <Th>Fillimi</Th>
                                <Th>Regjistrim TAK</Th>
                                <Th>Statusi</Th>
                                <Th></Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {employees.data?.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                                        Nuk u gjetën punëtorë
                                    </td>
                                </tr>
                            )}
                            {employees.data?.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                                                {emp.first_name[0]}{emp.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{emp.first_name} {emp.last_name}</p>
                                                {emp.personal_number && <p className="text-xs text-gray-400">{emp.personal_number}</p>}
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>{emp.position ?? <span className="text-gray-300">—</span>}</Td>
                                    <Td>
                                        {{
                                            full_time: 'Orar i plotë',
                                            part_time: 'Orar i pjesshëm',
                                            contract: 'Kontratë',
                                        }[emp.contract_type] ?? emp.contract_type}
                                    </Td>
                                    <Td right mono>{formatCurrency(emp.gross_salary)}</Td>
                                    <Td>{formatDate(emp.start_date)}</Td>
                                    <Td>
                                        {emp.tak_registered_at
                                            ? <span className="text-green-600 text-xs">{formatDate(emp.tak_registered_at)}</span>
                                            : (
                                                <span className="flex items-center gap-1 text-yellow-600 text-xs">
                                                    <ExclamationTriangleIcon className="w-3.5 h-3.5" /> Pa regjistrim
                                                </span>
                                            )}
                                    </Td>
                                    <Td><Badge status={emp.status} /></Td>
                                    <Td>
                                        <Link href={`/employees/${emp.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                                            Shiko
                                        </Link>
                                    </Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                    <Pagination links={employees.links} meta={employees.meta ?? employees} />
                </div>
            </div>
        </AppLayout>
    );
}
