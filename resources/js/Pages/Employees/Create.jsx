import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input, { Select, Textarea } from '@/Components/UI/Input';
import { useForm } from '@inertiajs/react';

export default function EmployeeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        personal_number: '',
        email: '',
        phone: '',
        birth_date: '',
        address: '',
        bank_account: '',
        bank_name: '',
        position: '',
        department: '',
        contract_type: 'full_time',
        gross_salary: '',
        start_date: '',
        tak_registered_at: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/employees');
    };

    return (
        <AppLayout title="Shto punëtor">
            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <Card title="Të dhënat personale">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Emri" required
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                error={errors.first_name}
                                placeholder="Emri"
                            />
                            <Input
                                label="Mbiemri" required
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                error={errors.last_name}
                                placeholder="Mbiemri"
                            />
                            <Input
                                label="Nr. Personal"
                                value={data.personal_number}
                                onChange={e => setData('personal_number', e.target.value)}
                                error={errors.personal_number}
                                placeholder="XXXXXXXXXX"
                            />
                            <Input
                                label="Datëlindja"
                                type="date"
                                value={data.birth_date}
                                onChange={e => setData('birth_date', e.target.value)}
                                error={errors.birth_date}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={errors.email}
                                placeholder="punëtori@email.com"
                            />
                            <Input
                                label="Telefoni"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                error={errors.phone}
                                placeholder="+383 44 000 000"
                            />
                            <Input
                                label="Adresa"
                                className="sm:col-span-2"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                error={errors.address}
                                placeholder="Rruga, Qyteti"
                            />
                        </div>
                    </Card>

                    <Card title="Të dhënat e punës">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Pozita"
                                value={data.position}
                                onChange={e => setData('position', e.target.value)}
                                error={errors.position}
                                placeholder="p.sh. Inxhinier softuerësh"
                            />
                            <Input
                                label="Departamenti"
                                value={data.department}
                                onChange={e => setData('department', e.target.value)}
                                error={errors.department}
                                placeholder="p.sh. IT, Financa"
                            />
                            <Select
                                label="Lloji i kontratës" required
                                value={data.contract_type}
                                onChange={e => setData('contract_type', e.target.value)}
                                error={errors.contract_type}
                            >
                                <option value="full_time">Orar i plotë</option>
                                <option value="part_time">Orar i pjesshëm</option>
                                <option value="contract">Kontratë</option>
                            </Select>
                            <Input
                                label="Paga bruto (€)" required
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.gross_salary}
                                onChange={e => setData('gross_salary', e.target.value)}
                                error={errors.gross_salary}
                                placeholder="450.00"
                            />
                            <Input
                                label="Data e fillimit" required
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                error={errors.start_date}
                            />
                            <Input
                                label="Data e regjistrimit TAK"
                                type="date"
                                value={data.tak_registered_at}
                                onChange={e => setData('tak_registered_at', e.target.value)}
                                error={errors.tak_registered_at}
                                hint="Duhet të jetë para ose në datën e fillimit"
                            />
                        </div>
                    </Card>

                    <Card title="Llogaria bankare">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Numri i llogarisë"
                                value={data.bank_account}
                                onChange={e => setData('bank_account', e.target.value)}
                                error={errors.bank_account}
                                placeholder="IBAN ose nr. llogarie"
                            />
                            <Input
                                label="Banka"
                                value={data.bank_name}
                                onChange={e => setData('bank_name', e.target.value)}
                                error={errors.bank_name}
                                placeholder="Emri i bankës"
                            />
                        </div>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Duke ruajtur...' : 'Shto punëtorin'}
                        </Button>
                        <Button variant="secondary" href="/employees">Anulo</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
