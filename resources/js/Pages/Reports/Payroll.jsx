import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { formatCurrency } from '@/Utils/format';
import { router } from '@inertiajs/react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export default function PayrollReport({ year, monthly_totals, annual_totals, available_years }) {
    return (
        <AppLayout title={`Raporti i pagave – ${year}`}>
            <div className="space-y-6">
                {/* Year selector */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Viti:</label>
                    <select
                        value={year}
                        onChange={e => router.get('/reports/payroll', { year: e.target.value })}
                        className="rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {available_years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {/* Annual totals */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                    {[
                        { label: 'Total Bruto', value: annual_totals.gross, color: 'text-gray-900' },
                        { label: 'Total Neto', value: annual_totals.net, color: 'text-green-700' },
                        { label: 'Total PIT/TM', value: annual_totals.pit, color: 'text-amber-700' },
                        { label: 'Pensioni Pt.', value: annual_totals.employee_pension, color: 'text-blue-700' },
                        { label: 'Pensioni Pd.', value: annual_totals.employer_pension, color: 'text-blue-700' },
                        { label: 'Kosto Pd.', value: annual_totals.employer_cost, color: 'text-blue-900 font-bold' },
                    ].map(item => (
                        <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className={`text-base font-semibold mt-1 ${item.color}`}>{formatCurrency(item.value)}</p>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <Card title="Pagesa mujore">
                    <div className="p-4">
                        {monthly_totals.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={monthly_totals} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={v => formatCurrency(v)} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="gross" name="Bruto" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="net" name="Neto" fill="#10b981" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="pit" name="TM/PIT" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Nuk ka të dhëna</div>
                        )}
                    </div>
                </Card>

                {/* Monthly table */}
                <Card title="Detajet mujore">
                    <Table>
                        <Thead>
                            <tr>
                                <Th>Periudha</Th>
                                <Th>Punëtorë</Th>
                                <Th right>Bruto</Th>
                                <Th right>Neto</Th>
                                <Th right>PIT/TM</Th>
                                <Th right>Pensioni</Th>
                                <Th right>Kosto Pd.</Th>
                                <Th>Statusi</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {monthly_totals.length === 0 && (
                                <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">Nuk ka të dhëna</td></tr>
                            )}
                            {monthly_totals.map(row => (
                                <tr key={row.month} className="hover:bg-gray-50">
                                    <Td className="font-medium">{row.period}</Td>
                                    <Td>{row.employees}</Td>
                                    <Td right mono>{formatCurrency(row.gross)}</Td>
                                    <Td right mono className="text-green-700">{formatCurrency(row.net)}</Td>
                                    <Td right mono className="text-amber-700">{formatCurrency(row.pit)}</Td>
                                    <Td right mono className="text-blue-700">{formatCurrency(row.employee_pension + row.employer_pension)}</Td>
                                    <Td right mono className="text-blue-900 font-semibold">{formatCurrency(row.employer_cost)}</Td>
                                    <Td><Badge status={row.status} /></Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
