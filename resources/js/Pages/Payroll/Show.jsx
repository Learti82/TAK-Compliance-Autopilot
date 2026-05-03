import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import Alert from '@/Components/UI/Alert';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { formatCurrency, formatDate, formatDateTime } from '@/Utils/format';
import { router } from '@inertiajs/react';
import {
    CheckCircleIcon,
    PaperAirplaneIcon,
    ArrowPathIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function PayrollShow({ run, is_overdue }) {
    const approve = () => router.post(`/payroll/${run.id}/approve`);
    const submit = () => {
        if (confirm('Jeni të sigurt që doni ta shënoni si të dorëzuar tek TAK?')) {
            router.post(`/payroll/${run.id}/submit`);
        }
    };
    const regenerate = () => {
        if (confirm('Do të rigjeneroni listën e pagave. Ndryshimet manuale do të humbasin. Vazhdoni?')) {
            router.post(`/payroll/${run.id}/regenerate`);
        }
    };

    const summaryItems = [
        { label: 'Punëtorë', value: run.employee_count, color: 'text-gray-900' },
        { label: 'Total Bruto', value: formatCurrency(run.total_gross), color: 'text-gray-900' },
        { label: 'Pensioni Punëtor', value: formatCurrency(run.total_employee_pension), color: 'text-blue-700' },
        { label: 'Pensioni Punëdhënës', value: formatCurrency(run.total_employer_pension), color: 'text-blue-700' },
        { label: 'Total TM/PIT', value: formatCurrency(run.total_pit), color: 'text-amber-700' },
        { label: 'Total Neto', value: formatCurrency(run.total_net), color: 'text-green-700 font-bold text-lg' },
        { label: 'Kosto totale punëdhënësi', value: formatCurrency(run.total_employer_cost), color: 'text-blue-800 font-bold' },
    ];

    return (
        <AppLayout title={`Lista e pagave – ${run.period_label}`}>
            <div className="space-y-5">
                {is_overdue && (
                    <Alert type="error" title="Lista e pagave është e vonuar!">
                        Afati i dorëzimit ishte {formatDate(run.submission_deadline)}. Dorëzoni tek TAK sa më shpejt.
                    </Alert>
                )}

                {/* Header actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">{run.period_label}</h2>
                        <Badge status={run.status} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {run.status === 'draft' && (
                            <>
                                <Button onClick={regenerate} variant="secondary" icon={ArrowPathIcon} size="sm">
                                    Rigjeneroje
                                </Button>
                                <Button onClick={approve} variant="success" icon={CheckCircleIcon} size="sm">
                                    Aprovo
                                </Button>
                            </>
                        )}
                        {run.status === 'approved' && (
                            <Button onClick={submit} icon={PaperAirplaneIcon} size="sm">
                                Shëno si dorëzuar
                            </Button>
                        )}
                        <a href={`/payroll/${run.id}/export`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            Excel
                        </a>
                        <a href={`/payroll/${run.id}/tak-file`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <DocumentTextIcon className="w-4 h-4" />
                            Fajl TAK
                        </a>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
                    {summaryItems.map(item => (
                        <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                            <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Krijuar nga: <strong className="text-gray-700">{run.created_by?.name ?? '—'}</strong></span>
                    {run.approved_by && <span>Aprovuar nga: <strong className="text-gray-700">{run.approved_by?.name}</strong> – {formatDateTime(run.approved_at)}</span>}
                    {run.submitted_at && <span>Dorëzuar: <strong className="text-gray-700">{formatDateTime(run.submitted_at)}</strong></span>}
                    <span>Afati: <strong className={is_overdue ? 'text-red-600' : 'text-gray-700'}>{formatDate(run.submission_deadline)}</strong></span>
                </div>

                {/* Items table */}
                <Card title={`Detajet e punëtorëve (${run.items?.length ?? 0})`}>
                    <Table>
                        <Thead>
                            <tr>
                                <Th>#</Th>
                                <Th>Punëtori</Th>
                                <Th>Pozita</Th>
                                <Th right>Bruto</Th>
                                <Th right>Pensioni Pt.</Th>
                                <Th right>Pensioni Pd.</Th>
                                <Th right>T.A. Tatimore</Th>
                                <Th right>TM/PIT</Th>
                                <Th right>Neto</Th>
                                <Th right>Kosto Pd.</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {run.items?.length === 0 && (
                                <tr><td colSpan={10} className="text-center py-8 text-gray-400 text-sm">Nuk ka punëtorë në këtë listë</td></tr>
                            )}
                            {run.items?.map((item, i) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <Td className="text-gray-400 w-8">{i + 1}</Td>
                                    <Td>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {item.employee?.first_name} {item.employee?.last_name}
                                            </p>
                                            <p className="text-xs text-gray-400">{item.employee?.department}</p>
                                        </div>
                                    </Td>
                                    <Td className="text-gray-500">{item.employee?.position ?? '—'}</Td>
                                    <Td right mono>{formatCurrency(item.gross_salary)}</Td>
                                    <Td right mono className="text-blue-600">{formatCurrency(item.employee_pension)}</Td>
                                    <Td right mono className="text-blue-600">{formatCurrency(item.employer_pension)}</Td>
                                    <Td right mono>{formatCurrency(item.taxable_income)}</Td>
                                    <Td right mono className="text-amber-600">{formatCurrency(item.pit)}</Td>
                                    <Td right mono className="text-green-700 font-semibold">{formatCurrency(item.net_salary)}</Td>
                                    <Td right mono className="text-blue-700 font-semibold">{formatCurrency(item.employer_cost)}</Td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
