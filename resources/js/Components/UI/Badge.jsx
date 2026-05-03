import { STATUS_LABELS, STATUS_COLORS } from '@/Utils/format';

export default function Badge({ status, children, className = '' }) {
    const label = children ?? STATUS_LABELS[status] ?? status;
    const colorClass = STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass} ${className}`}>
            {label}
        </span>
    );
}
