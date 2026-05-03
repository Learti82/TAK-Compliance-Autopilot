export default function Input({ label, error, hint, className = '', required, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

export function Select({ label, error, children, className = '', required, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

export function Textarea({ label, error, className = '', required, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
