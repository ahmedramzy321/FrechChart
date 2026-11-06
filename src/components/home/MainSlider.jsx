import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'Fresh Products Delivered to your Door',
    subtitle: 'Get 20% off your first order',
    btn1Text: 'Shop Now',
    btn1Link: '/products',
    btn1Color: 'text-green-500',
    btn2Text: 'View Deals',
    btn2Link: '/products?sort=-price',
  },
  {
    title: 'Premium Quality Guaranteed',
    subtitle: 'Fresh from farm to your table',
    btn1Text: 'Shop Now',
    btn1Link: '/products',
    btn1Color: 'text-blue-500',
    btn2Text: 'Learn More',
    btn2Link: '/categories',
  },
  {
    title: 'Fast & Free Delivery',
    subtitle: 'Same day delivery available',
    btn1Text: 'Order Now',
    btn1Link: '/products',
    btn1Color: 'text-purple-500',
    btn2Text: 'Delivery Info',
    btn2Link: '/shipping',
  },
];

export default function MainSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <div className="relative overflow-hidden">
      <div
        style={{
          backgroundImage: 'url(/home-slider-1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-[400px] flex items-center justify-center relative transition-all duration-700 ease-in-out"
      >
        <div className="overlay py-20 text-white p-4 w-full h-full bg-gradient-to-r from-green-500/90 to-green-400/50 flex items-center">
          <div className="container mx-auto px-4 md:px-12 content-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 max-w-lg leading-tight transition-all duration-500">
              {active.title}
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-md">
              {active.subtitle}
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={active.btn1Link}
                className={`btn bg-white border-2 border-white/50 ${active.btn1Color} inline-block px-6 py-2.5 rounded-lg font-semibold hover:scale-105 transition-transform shadow-md`}
              >
                {active.btn1Text}
              </Link>
              <Link
                to={active.btn2Link}
                className="btn bg-transparent border-2 border-white/50 text-white inline-block px-6 py-2.5 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                {active.btn2Text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide
                ? 'bg-white w-8 shadow-sm'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Custom Prev / Next Chevron Arrows */}
      <button
        onClick={prevSlide}
        className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-green-500 hover:text-green-600 rounded-full w-12 h-12 hidden md:flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        title="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-green-500 hover:text-green-600 rounded-full w-12 h-12 hidden md:flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        title="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
