import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const variants = {
    error: { icon: XCircleIcon, bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon_color: 'text-red-500' },
    warning: { icon: ExclamationTriangleIcon, bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon_color: 'text-yellow-500' },
    success: { icon: CheckCircleIcon, bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon_color: 'text-green-500' },
    info: { icon: InformationCircleIcon, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon_color: 'text-blue-500' },
};

export default function Alert({ type = 'info', title, children, className = '' }) {
    const v = variants[type] ?? variants.info;
    const Icon = v.icon;
    return (
        <div className={`flex gap-3 p-4 rounded-lg border ${v.bg} ${className}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.icon_color}`} />
            <div className={`text-sm ${v.text}`}>
                {title && <p className="font-semibold mb-0.5">{title}</p>}
                {children}
            </div>
        </div>
    );
}
