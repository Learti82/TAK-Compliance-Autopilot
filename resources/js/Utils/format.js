export function formatCurrency(amount, currency = '€') {
    if (amount === null || amount === undefined) return '—';
    return `${currency}${Number(amount).toLocaleString('sq-AL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('sq-AL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('sq-AL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const MONTHS_AL = {
    1: 'Janar', 2: 'Shkurt', 3: 'Mars', 4: 'Prill',
    5: 'Maj', 6: 'Qershor', 7: 'Korrik', 8: 'Gusht',
    9: 'Shtator', 10: 'Tetor', 11: 'Nëntor', 12: 'Dhjetor',
};

export const STATUS_LABELS = {
    draft: 'Draft',
    approved: 'Aprovuar',
    submitted: 'Dorëzuar',
    pending: 'Në pritje',
    completed: 'Kompletuar',
    overdue: 'Vonuar',
    waived: 'Hequr',
    active: 'Aktiv',
    inactive: 'Joaktiv',
    terminated: 'Larguar',
};

export const STATUS_COLORS = {
    draft: 'bg-gray-100 text-gray-700',
    approved: 'bg-blue-100 text-blue-700',
    submitted: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    waived: 'bg-gray-100 text-gray-500',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
    terminated: 'bg-red-100 text-red-700',
};
