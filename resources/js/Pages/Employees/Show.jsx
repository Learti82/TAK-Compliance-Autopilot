import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import Alert from '@/Components/UI/Alert';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { formatCurrency, formatDate } from '@/Utils/format';
import { router } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EmployeeShow({ employee, warning_unregistered }) {
    const destroy = () => {
        if (confirm(`Jeni të sigurt që doni të fshini ${employee.first_name} ${employee.last_name}?`)) {
            router.delete(`/employees/${employee.id}`);
        }
    };

    const fields = [
        ['Nr. Personal', employee.personal_number],
        ['Email', employee.email],
        ['Telefoni', employee.phone],
        ['Adresa', employee.address],
        ['Datëlindja', formatDate(employee.birth_date)],
    ];

    const workFields = [
        ['Pozita', employee.position],
        ['Departamenti', employee.department],
        ['Kontrata', { full_time: 'Orar i plotë', part_time: 'Orar i pjesshëm', contract: 'Kontratë' }[employee.contract_type]],
        ['Paga bruto', formatCurrency(employee.gross_salary)],
        ['Data e fillimit', formatDate(employee.start_date)],
        ['Data e largimit', formatDate(employee.end_date)],
        ['Regjistrim TAK', formatDate(employee.tak_registered_at)],
    ];

    return (
        <AppLayout title={`${employee.first_name} ${employee.last_name}`}>
            <div className="space-y-5 max-w-4xl">
                {warning_unregistered && (
                    <Alert type="warning" title="Punëtori nuk është regjistruar tek TAK">
                        Ky punëtor nuk ka datë regjistrimi. Regjistroni tek TAK para datës së fillimit të punës për të shmangur gjobat.
                    </Alert>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
                            {employee.first_name[0]}{employee.last_name[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{employee.first_name} {employee.last_name}</h2>
                            <p className="text-gray-500 text-sm">{employee.position ?? 'Pa pozitë'}</p>
                        </div>
                        <Badge status={employee.status} className="ml-2" />
                    </div>
                    <div className="flex gap-2">
                        <Button href={`/employees/${employee.id}/edit`} variant="secondary" icon={PencilIcon} size="sm">
                            Redakto
                        </Button>
                        <Button onClick={destroy} variant="danger" icon={TrashIcon} size="sm">
                            Fshi
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Personal info */}
                    <Card title="Informacioni personal">
                        <dl className="divide-y divide-gray-50">
                            {fields.map(([label, value]) => (
                                <div key={label} className="flex justify-between px-5 py-3">
                                    <dt className="text-sm text-gray-500">{label}</dt>
                                    <dd className="text-sm font-medium text-gray-900">{value || '—'}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    {/* Work info */}
                    <Card title="Informacioni i punës">
                        <dl className="divide-y divide-gray-50">
                            {workFields.map(([label, value]) => (
                                <div key={label} className="flex justify-between px-5 py-3">
                                    <dt className="text-sm text-gray-500">{label}</dt>
                                    <dd className="text-sm font-medium text-gray-900">{value || '—'}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>
                </div>

                {/* Payroll history */}
                {employee.payroll_items?.length > 0 && (
                    <Card title="Historiku i pagave">
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>Periudha</Th>
                                    <Th right>Bruto</Th>
                                    <Th right>Pensioni</Th>
                                    <Th right>TM/PIT</Th>
                                    <Th right>Neto</Th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {employee.payroll_items.map(item => (
                                    <tr key={item.id}>
                                        <Td>{item.payroll_run?.period_label ?? '—'}</Td>
                                        <Td right mono>{formatCurrency(item.gross_salary)}</Td>
                                        <Td right mono>{formatCurrency(item.employee_pension)}</Td>
                                        <Td right mono>{formatCurrency(item.pit)}</Td>
                                        <Td right mono className="text-green-700 font-semibold">{formatCurrency(item.net_salary)}</Td>
                                    </tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
