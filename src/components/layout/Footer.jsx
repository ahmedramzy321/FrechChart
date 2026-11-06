import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand Info & Contact */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <div className="bg-white rounded-lg px-4 py-2 inline-block">
                <img
                  src="/freshcart-logo.svg"
                  alt="FreshCart Logo"
                  className="h-8 w-auto"
                />
              </div>
            </Link>

            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              FreshCart is your one-stop destination for quality products. From fashion to electronics,
              we bring you the best brands at competitive prices with a seamless shopping experience.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+1 (800) 123-4567</span>
              </a>

              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>support@freshcart.com</span>
              </a>

              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 320 512">
                  <path d="M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z" />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                title="Twitter"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 512 512">
                  <path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 448 512">
                  <path d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 576 512">
                  <path d="M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-5 text-white">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/products?category=6439d58a0049ad0b52b9003f" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=6439d2d167d9aa4ca970649f" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/products?category=6439d5b90049ad0b52b90048" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Women's Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Account */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-5 text-white">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/allorders" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-5 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/allorders" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-5 text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payments */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 FreshCart. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-5 h-5 fill-currentColor text-gray-500" viewBox="0 0 512 512">
                  <path d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z" />
                </svg>
                <span>Visa</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-5 h-5 fill-currentColor text-gray-500" viewBox="0 0 512 512">
                  <path d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z" />
                </svg>
                <span>Mastercard</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-5 h-5 fill-currentColor text-gray-500" viewBox="0 0 512 512">
                  <path d="M0 128l0 32 512 0 0-32c0-35.3-28.7-64-64-64L64 64C28.7 64 0 92.7 0 128zm0 80L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-176-512 0zM64 360c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm144 0c0-13.3 10.7-24 24-24l64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0c-13.3 0-24-10.7-24-24z" />
                </svg>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
