import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import { useForm } from '@inertiajs/react';

export default function CompanyEdit({ company }) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name ?? '',
        address: company.address ?? '',
        city: company.city ?? '',
        phone: company.phone ?? '',
        email: company.email ?? '',
        industry: company.industry ?? '',
        tak_username: company.tak_username ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/company');
    };

    return (
        <AppLayout title="Redakto kompaninë">
            <div className="max-w-xl">
                <form onSubmit={submit} className="space-y-5">
                    <Card title="Informacioni i kompanisë">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Emri i kompanisë" required className="sm:col-span-2" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                            <Input label="Industria" value={data.industry} onChange={e => setData('industry', e.target.value)} error={errors.industry} placeholder="p.sh. Teknologji" />
                            <Input label="Qyteti" value={data.city} onChange={e => setData('city', e.target.value)} error={errors.city} placeholder="Prishtinë" />
                            <Input label="Adresa" className="sm:col-span-2" value={data.address} onChange={e => setData('address', e.target.value)} error={errors.address} />
                            <Input label="Telefoni" value={data.phone} onChange={e => setData('phone', e.target.value)} error={errors.phone} />
                            <Input label="Email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                        </div>
                    </Card>
                    <Card title="Kredencialet TAK (opsionale)">
                        <div className="p-5">
                            <Input label="Emri i përdoruesit TAK" value={data.tak_username} onChange={e => setData('tak_username', e.target.value)} error={errors.tak_username} placeholder="Username juaj në TAK" />
                        </div>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}</Button>
                        <Button variant="secondary" href="/company">Anulo</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
