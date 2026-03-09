import React from 'react';

interface EditorialTransitionProps {
    quote: string;
    author?: string;
}

/**
 * Editorial Transition Block
 * Subtle dividers with poetic insights between sections
 * Adds emotional rhythm and slows the reader down
 */
const EditorialTransition: React.FC<EditorialTransitionProps> = ({ quote, author }) => {
    return (
        <div className="py-16 sm:py-20">
            <div className="max-w-4xl mx-auto text-center">
                {/* Subtle top fade line */}
                <div className="h-px w-32 mx-auto mb-12 bg-gradient-to-r from-transparent via-stone-700 to-transparent opacity-30" />

                {/* Quote */}
                <p className="text-xl sm:text-2xl font-light italic text-stone-400 leading-relaxed px-6">
                    "{quote}"
                </p>

                {/* Optional author attribution */}
                {author && (
                    <p className="text-xs uppercase tracking-widest text-stone-600 mt-6">
                        — {author}
                    </p>
                )}

                {/* Subtle bottom fade line */}
                <div className="h-px w-32 mx-auto mt-12 bg-gradient-to-r from-transparent via-stone-700 to-transparent opacity-30" />
            </div>
        </div>
    );
};

export default EditorialTransition;
