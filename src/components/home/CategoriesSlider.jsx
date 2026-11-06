import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../../api/categoriesApi';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function CategoriesSlider() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesApi.getCategories({ limit: 12 });
        if (res.data) {
          setCategories(res.data);
        }
      } catch {
        // silent fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <section id="categories" className="py-10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div className="flex items-center gap-3 my-4 sm:my-8">
            <div className="h-8 w-1.5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Shop By <span className="text-primary-600">Category</span>
            </h2>
          </div>

          <Link
            to="/categories"
            className="text-primary-600 self-end sm:self-auto hover:text-primary-700 font-medium flex items-center cursor-pointer transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Categories Grid (matching demo: grid-cols-2 md:grid-cols-3 lg:grid-cols-6) */}
        {!isLoading && categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category._id}
                to={`/categories/${category._id}`}
                className="bg-white rounded-lg p-4 text-center shadow-xs hover:shadow-md transition group cursor-pointer border border-gray-100/80"
              >
                <div className="h-20 w-20 overflow-hidden bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition truncate">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
