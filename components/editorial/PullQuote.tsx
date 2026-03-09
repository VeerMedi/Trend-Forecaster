import React from 'react';

interface PullQuoteProps {
    quote: string;
    author?: string;
    alignment?: 'left' | 'center' | 'right';
}

/**
 * Pull Quote - Editorial Emphasis
 * Large italic quotes for narrative emphasis
 */
const PullQuote: React.FC<PullQuoteProps> = ({
    quote,
    author,
    alignment = 'left'
}) => {
    const alignmentClasses = {
        'left': 'text-left',
        'center': 'text-center mx-auto',
        'right': 'text-right ml-auto'
    };

    return (
        <blockquote className={`max-w-4xl ${alignmentClasses[alignment]} py-8 sm:py-12`}>
            <p className="text-3xl sm:text-4xl md:text-5xl font-light italic text-stone-100 leading-tight mb-6">
                "{quote}"
            </p>
            {author && (
                <cite className="text-sm sm:text-base font-light text-stone-400 not-italic uppercase tracking-wider">
                    — {author}
                </cite>
            )}
        </blockquote>
    );
};

export default PullQuote;
