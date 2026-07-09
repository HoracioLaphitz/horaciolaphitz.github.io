interface ProjectFiltersProps {
    selectedCategory: string;
    categories: string[];
    onCategoryChange: (value: string) => void;
    totalPosts: number;
    filteredCount: number;
}

const ProjectFilters = ({
    selectedCategory,
    categories,
    onCategoryChange,
    totalPosts,
    filteredCount,
}: ProjectFiltersProps) => {
    return (
        <div className="mb-12">
            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                <button
                    onClick={() => onCategoryChange("all")}
                    className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                        selectedCategory === "all"
                            ? "bg-brand-primary text-white"
                            : "bg-skin-primary border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                    }`}
                >
                    Mostrar todo
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 ${
                            selectedCategory === cat
                                ? "bg-brand-primary text-white"
                                : "bg-skin-primary border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Results Counter */}
            {filteredCount !== totalPosts && (
                <div className="text-center text-sm text-skin-muted">
                    Mostrando {filteredCount} de {totalPosts} proyectos
                </div>
            )}
        </div>
    );
};

export default ProjectFilters;
