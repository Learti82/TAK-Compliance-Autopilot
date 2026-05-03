import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { router } from '@inertiajs/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AdminCompanies({ companies, filters }) {
    return (
        <AppLayout title="Administrimi – Kompanitë">
            <div className="space-y-5">
                <div className="flex gap-2">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Kërko kompani..."
                            defaultValue={filters.search ?? ''}
                            onKeyDown={e => e.key === 'Enter' && router.get('/admin/companies', { search: e.target.value })}
                            className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                </div>

                <Card>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Kompania</Th>
                                <Th>Nr. Fiskal</Th>
                                <Th>Qyteti</Th>
                                <Th>Plani</Th>
                                <Th>Statusi</Th>
                                <Th>Punonjës</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {companies.data?.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Nuk ka kompani</td></tr>
                            )}
                            {companies.data?.map(company => (
                                <tr key={company.id} className="hover:bg-gray-50">
                                    <Td>
                                        <p className="font-medium text-gray-900">{company.name}</p>
                                        <p className="text-xs text-gray-400">{company.email ?? '—'}</p>
                                    </Td>
                                    <Td mono>{company.fiscal_number}</Td>
                                    <Td>{company.city ?? '—'}</Td>
                                    <Td>
                                        {company.active_subscription?.plan?.label
                                            ? <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{company.active_subscription.plan.label}</span>
                                            : <span className="text-xs text-gray-400">Pa abonim</span>}
                                    </Td>
                                    <Td><Badge status={company.status} /></Td>
                                    <Td>{company.employee_count}</Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                    <Pagination links={companies.links} meta={companies.meta ?? companies} />
                </Card>
            </div>
        </AppLayout>
    );
}
