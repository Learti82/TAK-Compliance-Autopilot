import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Select } from '@/Components/UI/Input';
import { useForm } from '@inertiajs/react';
import { MONTHS_AL } from '@/Utils/format';

export default function PayrollCreate({ suggested_year, suggested_month }) {
    const { data, setData, post, processing, errors } = useForm({
        year: suggested_year ?? new Date().getFullYear(),
        month: suggested_month ?? new Date().getMonth() + 1,
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/payroll');
    };

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i + 1);

    return (
        <AppLayout title="Gjenero listën e pagave">
            <div className="max-w-lg">
                <Card title="Periudha e pagës">
                    <form onSubmit={submit} className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Viti" required
                                value={data.year}
                                onChange={e => setData('year', parseInt(e.target.value))}
                                error={errors.year}
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </Select>
                            <Select
                                label="Muaji" required
                                value={data.month}
                                onChange={e => setData('month', parseInt(e.target.value))}
                                error={errors.month}
                            >
                                {Object.entries(MONTHS_AL).map(([num, name]) => (
                                    <option key={num} value={num}>{name}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shënime</label>
                            <textarea
                                rows={2}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Shënime opsionale..."
                            />
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                            <p className="font-medium">Si funksionon:</p>
                            <ul className="mt-1 space-y-1 text-blue-600 list-disc list-inside">
                                <li>Sistemi do të llogarisë pagën për të gjithë punëtorët aktivë</li>
                                <li>Do të aplikohen rregullat e tatimit të Kosovës (TM, Pensioni)</li>
                                <li>Lista do të krijohet si Draft – mund ta modifikoni para aprovimit</li>
                            </ul>
                        </div>

                        {errors.month && <p className="text-sm text-red-600">{errors.month}</p>}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Duke gjeneruar...' : 'Gjenero listën'}
                            </Button>
                            <Button variant="secondary" href="/payroll">Anulo</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
