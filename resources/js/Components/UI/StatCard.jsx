export default function StatCard({ icon: Icon, label, value, sub, color = 'blue', onClick }) {
    const colors = {
        blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700' },
        green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-700' },
        yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', value: 'text-yellow-700' },
        red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700' },
        gray: { bg: 'bg-gray-50', icon: 'text-gray-500', value: 'text-gray-700' },
    };
    const c = colors[color] ?? colors.blue;

    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className={`text-2xl font-bold mt-1 ${c.value}`}>{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </div>
                {Icon && (
                    <div className={`p-2.5 rounded-lg ${c.bg}`}>
                        <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
