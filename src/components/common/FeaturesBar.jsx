import { Truck, RotateCcw, ShieldCheck, Headset } from 'lucide-react';

export default function FeaturesBar() {
  return (
    <div className="bg-primary-50 border-y border-primary-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
              <p className="text-gray-500 text-xs">On orders over 500 EGP</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
              <p className="text-gray-500 text-xs">14-day return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Secure Payment</h4>
              <p className="text-gray-500 text-xs">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">24/7 Support</h4>
              <p className="text-gray-500 text-xs">Contact us anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
