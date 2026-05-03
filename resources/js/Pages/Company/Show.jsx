import AppLayout from '@/Components/Layout/AppLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import { formatDate } from '@/Utils/format';
import { PencilIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function CompanyShow({ company }) {
    const fields = [
        ['Emri', company.name],
        ['Nr. Fiskal', company.fiscal_number],
        ['Industria', company.industry],
        ['Qyteti', company.city],
        ['Adresa', company.address],
        ['Telefoni', company.phone],
        ['Email', company.email],
        ['Themeluar', formatDate(company.founded_at)],
        ['Statusi', <Badge key="s" status={company.status} />],
    ];

    const sub = company.active_subscription;

    return (
        <AppLayout title="Profili i kompanisë">
            <div className="max-w-2xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BuildingOffice2Icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                            <p className="text-gray-500 text-sm">Nr. Fiskal: {company.fiscal_number}</p>
                        </div>
                    </div>
                    <Button href="/company/edit" variant="secondary" icon={PencilIcon} size="sm">
                        Redakto
                    </Button>
                </div>

                <Card title="Informacioni i kompanisë">
                    <dl className="divide-y divide-gray-50">
                        {fields.map(([label, value]) => (
                            <div key={label} className="flex justify-between px-5 py-3">
                                <dt className="text-sm text-gray-500">{label}</dt>
                                <dd className="text-sm font-medium text-gray-900">{value || '—'}</dd>
                            </div>
                        ))}
                    </dl>
                </Card>

                {sub && (
                    <Card title="Abonimi">
                        <dl className="divide-y divide-gray-50">
                            <div className="flex justify-between px-5 py-3">
                                <dt className="text-sm text-gray-500">Plani</dt>
                                <dd className="text-sm font-medium text-gray-900">{sub.plan?.label ?? sub.plan?.name}</dd>
                            </div>
                            <div className="flex justify-between px-5 py-3">
                                <dt className="text-sm text-gray-500">Statusi</dt>
                                <dd><Badge status={sub.status} /></dd>
                            </div>
                            <div className="flex justify-between px-5 py-3">
                                <dt className="text-sm text-gray-500">Skadon</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(sub.current_period_end)}</dd>
                            </div>
                        </dl>
                    </Card>
                )}

                {company.tak_username && (
                    <Card title="Kredencialet TAK">
                        <dl className="divide-y divide-gray-50">
                            <div className="flex justify-between px-5 py-3">
                                <dt className="text-sm text-gray-500">Emri i përdoruesit TAK</dt>
                                <dd className="text-sm font-mono text-gray-900">{company.tak_username}</dd>
                            </div>
                        </dl>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
