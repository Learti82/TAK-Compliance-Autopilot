import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Alert from '@/Components/UI/Alert';
import { Table, Thead, Tbody, Th, Td } from '@/Components/UI/Table';
import { useForm, router } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function TaxBracketsIndex({ brackets }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'pit',
        min_amount: '',
        max_amount: '',
        rate: '',
        tax_year: new Date().getFullYear(),
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/tax-brackets', { onSuccess: () => reset() });
    };

    const destroy = (id) => {
        if (confirm('Jeni të sigurt?')) router.delete(`/admin/tax-brackets/${id}`);
    };

    const grouped = brackets.reduce((acc, b) => {
        const key = `${b.type}-${b.tax_year}`;
        if (!acc[key]) acc[key] = { type: b.type, year: b.tax_year, items: [] };
        acc[key].items.push(b);
        return acc;
    }, {});

    const typeLabels = { pit: 'PIT (Tatimi mbi të ardhurat)', pension_employee: 'Pensioni – Punëtor', pension_employer: 'Pensioni – Punëdhënës' };

    return (
        <AppLayout title="Brezat tatimorë">
            <div className="space-y-6 max-w-4xl">
                <Alert type="info" title="Rregullat aktuale të Kosovës (2024)">
                    Pensioni: 5% punëtor + 5% punëdhënës mbi pagën bruto. PIT: Exemptim €80/muaj, 4% mbi €0-€250, 10% mbi €250.
                    Brezat e mëposhtëm do të zëvendësojnë vlerat e paracaktuara.
                </Alert>

                {/* Add form */}
                <Card title="Shto brez tatimor">
                    <form onSubmit={submit} className="p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Lloji</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="pit">PIT</option>
                                    <option value="pension_employee">Pensioni Pt.</option>
                                    <option value="pension_employer">Pensioni Pd.</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Min (€)</label>
                                <input type="number" step="0.01" className="w-full rounded-lg border border-gray-300 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.min_amount} onChange={e => setData('min_amount', e.target.value)} placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Max (€) [null=pa limit]</label>
                                <input type="number" step="0.01" className="w-full rounded-lg border border-gray-300 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.max_amount} onChange={e => setData('max_amount', e.target.value)} placeholder="Opsional" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Norma (0.04 = 4%)</label>
                                <input type="number" step="0.0001" min="0" max="1" className="w-full rounded-lg border border-gray-300 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.rate} onChange={e => setData('rate', e.target.value)} placeholder="0.04" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Viti tatimor</label>
                                <input type="number" className="w-full rounded-lg border border-gray-300 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.tax_year} onChange={e => setData('tax_year', parseInt(e.target.value))} />
                            </div>
                        </div>
                        {errors.rate && <p className="text-xs text-red-600 mt-2">{errors.rate}</p>}
                        <Button type="submit" disabled={processing} icon={PlusIcon} className="mt-3" size="sm">
                            {processing ? 'Duke shtuar...' : 'Shto brezin'}
                        </Button>
                    </form>
                </Card>

                {/* List */}
                {Object.values(grouped).map(group => (
                    <Card key={`${group.type}-${group.year}`} title={`${typeLabels[group.type] ?? group.type} – ${group.year}`}>
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>Minimum (€)</Th>
                                    <Th>Maksimum (€)</Th>
                                    <Th>Norma</Th>
                                    <Th>Aktiv</Th>
                                    <Th></Th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {group.items.map(b => (
                                    <tr key={b.id}>
                                        <Td mono>{b.min_amount}</Td>
                                        <Td mono>{b.max_amount ?? '∞'}</Td>
                                        <Td mono className="text-blue-700 font-semibold">{(b.rate * 100).toFixed(1)}%</Td>
                                        <Td>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {b.is_active ? 'Po' : 'Jo'}
                                            </span>
                                        </Td>
                                        <Td>
                                            <button onClick={() => destroy(b.id)} className="text-red-500 hover:text-red-700 p-1">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </Td>
                                    </tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Card>
                ))}

                {brackets.length === 0 && (
                    <Card>
                        <div className="py-10 text-center text-gray-400 text-sm">
                            Nuk ka brezat tatimorë. Sistemi po përdor vlerat e paracaktuara.
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
