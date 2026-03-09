import React from 'react';

interface EditorialSectionProps {
    spacing?: 'tight' | 'normal' | 'loose' | 'extra-loose';
    background?: 'dark' | 'darker' | 'darkest';
    children: React.ReactNode;
}

/**
 * Editorial Section - Base Container
 * No borders, no cards - just content with strategic whitespace
 */
const EditorialSection: React.FC<EditorialSectionProps> = ({
    spacing = 'normal',
    background = 'dark',
    children
}) => {
    const spacingClasses = {
        'tight': 'py-12',
        'normal': 'py-20',
        'loose': 'py-32',
        'extra-loose': 'py-40'
    };

    const backgroundClasses = {
        'dark': 'bg-stone-950',
        'darker': 'bg-stone-900',
        'darkest': 'bg-black'
    };

    return (
        <section className={`${spacingClasses[spacing]} ${backgroundClasses[background]} w-full`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {children}
            </div>
        </section>
    );
};

export default EditorialSection;
