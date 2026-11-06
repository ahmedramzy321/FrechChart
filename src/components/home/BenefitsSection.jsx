import { Truck, ShieldCheck, Headset, RotateCcw } from 'lucide-react';

export default function BenefitsSection() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Free Shipping */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Free Shipping</h3>
              <p className="text-xs text-gray-500">On orders over 500 EGP</p>
            </div>
          </div>

          {/* 2. Secure Payment */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="bg-emerald-50 text-emerald-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Secure Payment</h3>
              <p className="text-xs text-gray-500">100% secure payment</p>
            </div>
          </div>

          {/* 3. 24/7 Support */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">24/7 Support</h3>
              <p className="text-xs text-gray-500">Dedicated support</p>
            </div>
          </div>

          {/* 4. Easy Returns */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="bg-purple-50 text-purple-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Easy Returns</h3>
              <p className="text-xs text-gray-500">30 day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
