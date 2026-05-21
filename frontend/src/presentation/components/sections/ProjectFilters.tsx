import { useState } from 'react';

interface ProjectFiltersProps {
    categories: string[];
    onCategoryChange: (category: string | null) => void;
    onFeaturedChange: (featured: boolean | null) => void;
    initialCategory?: string;
}

export function ProjectFilters({
    categories,
    onCategoryChange,
    onFeaturedChange,
    initialCategory
}: ProjectFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
    const [showFeatured, setShowFeatured] = useState<boolean | null>(null);

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
        onCategoryChange(category);
    };

    const handleFeaturedChange = () => {
        const newValue = showFeatured === true ? null : true;
        setShowFeatured(newValue);
        onFeaturedChange(newValue);
    };

    return (
        <div className="glass-card rounded-xl p-md mb-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex flex-wrap gap-1.5 flex-1">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            selectedCategory === null
                                ? 'bg-accent text-white shadow-sm'
                                : 'bg-border/40 text-text-secondary hover:bg-border hover:text-text-primary'
                        }`}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                                selectedCategory === category
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'bg-border/40 text-text-secondary hover:bg-border hover:text-text-primary'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="sm:border-l sm:border-border sm:pl-3">
                    <button
                        onClick={handleFeaturedChange}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                            showFeatured === true
                                ? 'bg-accent/15 text-accent border border-accent/25'
                                : 'bg-border/40 text-text-secondary hover:bg-border hover:text-text-primary'
                        }`}
                    >
                        <svg className={`w-3.5 h-3.5 ${showFeatured === true ? 'text-accent' : 'text-text-tertiary'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Destacados
                    </button>
                </div>
            </div>
        </div>
    );
}
