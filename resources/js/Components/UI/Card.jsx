export default function Card({ children, className = '', title, actions }) {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
            {(title || actions) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
