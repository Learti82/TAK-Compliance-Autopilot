import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input, { Select, Textarea } from '@/Components/UI/Input';
import { useForm } from '@inertiajs/react';

export default function EmployeeEdit({ employee }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: employee.first_name ?? '',
        last_name: employee.last_name ?? '',
        personal_number: employee.personal_number ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        birth_date: employee.birth_date ?? '',
        address: employee.address ?? '',
        bank_account: employee.bank_account ?? '',
        bank_name: employee.bank_name ?? '',
        position: employee.position ?? '',
        department: employee.department ?? '',
        contract_type: employee.contract_type ?? 'full_time',
        gross_salary: employee.gross_salary ?? '',
        start_date: employee.start_date ?? '',
        end_date: employee.end_date ?? '',
        tak_registered_at: employee.tak_registered_at ?? '',
        status: employee.status ?? 'active',
        notes: employee.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/employees/${employee.id}`);
    };

    return (
        <AppLayout title={`Redakto: ${employee.first_name} ${employee.last_name}`}>
            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <Card title="Të dhënat personale">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Emri" required value={data.first_name} onChange={e => setData('first_name', e.target.value)} error={errors.first_name} />
                            <Input label="Mbiemri" required value={data.last_name} onChange={e => setData('last_name', e.target.value)} error={errors.last_name} />
                            <Input label="Nr. Personal" value={data.personal_number} onChange={e => setData('personal_number', e.target.value)} error={errors.personal_number} />
                            <Input label="Datëlindja" type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} error={errors.birth_date} />
                            <Input label="Email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                            <Input label="Telefoni" value={data.phone} onChange={e => setData('phone', e.target.value)} error={errors.phone} />
                            <Input label="Adresa" className="sm:col-span-2" value={data.address} onChange={e => setData('address', e.target.value)} error={errors.address} />
                        </div>
                    </Card>

                    <Card title="Të dhënat e punës">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Pozita" value={data.position} onChange={e => setData('position', e.target.value)} error={errors.position} />
                            <Input label="Departamenti" value={data.department} onChange={e => setData('department', e.target.value)} error={errors.department} />
                            <Select label="Lloji i kontratës" required value={data.contract_type} onChange={e => setData('contract_type', e.target.value)} error={errors.contract_type}>
                                <option value="full_time">Orar i plotë</option>
                                <option value="part_time">Orar i pjesshëm</option>
                                <option value="contract">Kontratë</option>
                            </Select>
                            <Input label="Paga bruto (€)" required type="number" step="0.01" value={data.gross_salary} onChange={e => setData('gross_salary', e.target.value)} error={errors.gross_salary} />
                            <Input label="Data e fillimit" required type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} error={errors.start_date} />
                            <Input label="Data e largimit" type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} error={errors.end_date} />
                            <Input label="Data e regjistrimit TAK" type="date" value={data.tak_registered_at} onChange={e => setData('tak_registered_at', e.target.value)} error={errors.tak_registered_at} />
                            <Select label="Statusi" required value={data.status} onChange={e => setData('status', e.target.value)} error={errors.status}>
                                <option value="active">Aktiv</option>
                                <option value="inactive">Joaktiv</option>
                                <option value="terminated">Larguar</option>
                            </Select>
                        </div>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}</Button>
                        <Button variant="secondary" href={`/employees/${employee.id}`}>Anulo</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
