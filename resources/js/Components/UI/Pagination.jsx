import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ links, meta }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-500">
                {meta && `Shfaqen ${meta.from ?? 0}–${meta.to ?? 0} nga ${meta.total ?? 0}`}
            </div>
            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    if (link.label === '&laquo; Previous') {
                        return (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </Link>
                        );
                    }
                    if (link.label === 'Next &raquo;') {
                        return (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </Link>
                        );
                    }
                    return (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`min-w-[2rem] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${link.active
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
