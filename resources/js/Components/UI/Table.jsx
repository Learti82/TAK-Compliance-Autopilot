export function Table({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                {children}
            </table>
        </div>
    );
}

export function Thead({ children }) {
    return (
        <thead className="bg-gray-50">
            {children}
        </thead>
    );
}

export function Tbody({ children }) {
    return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;
}

export function Th({ children, className = '', right }) {
    return (
        <th className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${right ? 'text-right' : 'text-left'} ${className}`}>
            {children}
        </th>
    );
}

export function Td({ children, className = '', right, mono }) {
    return (
        <td className={`px-4 py-3 text-sm text-gray-700 ${right ? 'text-right' : ''} ${mono ? 'font-mono' : ''} ${className}`}>
            {children}
        </td>
    );
}
