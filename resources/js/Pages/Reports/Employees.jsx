import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { formatCurrency } from '@/Utils/format';
import { router } from '@inertiajs/react';

export default function EmployeesReport({ employees, year, available_years }) {
    return (
        <AppLayout title={`Raporti i punëtorëve – ${year}`}>
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Viti:</label>
                    <select
                        value={year}
                        onChange={e => router.get('/reports/employees', { year: e.target.value })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {available_years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <Card title={`Përmbledhje sipas punëtorit – ${year}`}>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Punëtori</Th>
                                <Th>Pozita</Th>
                                <Th right>Paga Mujore</Th>
                                <Th right>Bruto Vjetor</Th>
                                <Th right>PIT/TM Vjetor</Th>
                                <Th right>Pensioni Vjetor</Th>
                                <Th right>Muaj të paguar</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {employees.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">Nuk ka të dhëna</td></tr>
                            )}
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <Td>
                                        <p className="font-medium text-gray-900">{emp.name}</p>
                                    </Td>
                                    <Td className="text-gray-500">{emp.position ?? '—'}</Td>
                                    <Td right mono>{formatCurrency(emp.gross_salary)}</Td>
                                    <Td right mono>{formatCurrency(emp.annual_gross)}</Td>
                                    <Td right mono className="text-amber-700">{formatCurrency(emp.annual_pit)}</Td>
                                    <Td right mono className="text-blue-700">{formatCurrency(emp.annual_pension)}</Td>
                                    <Td right>{emp.months_paid}</Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
