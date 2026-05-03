import { Link } from '@inertiajs/react';

const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    disabled,
    className = '',
    icon: Icon,
    ...props
}) {
    const base = `inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed`;
    const classes = `${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`;

    const content = (
        <>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </>
    );

    if (href) {
        return <Link href={href} className={classes}>{content}</Link>;
    }

    return (
        <button className={classes} disabled={disabled} {...props}>
            {content}
        </button>
    );
}
