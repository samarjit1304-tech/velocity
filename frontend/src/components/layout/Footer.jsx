import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Welcome to VelocityX. You are now subscribed to early drops and athletic insights.');
  };

  return (
    <footer className="bg-dark text-white pt-20 pb-12 border-t border-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Brand Story Column */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="text-xl font-bold tracking-[0.15em] uppercase font-display flex items-center gap-1">
            <span className="text-primary">VELOCITY</span>
            <span className="text-orange font-light italic">X</span>
          </Link>
          <p className="text-xs text-grey-medium leading-relaxed max-w-sm font-light">
            Premium sportswear and footwear engineered for champions, designed for everyone. Move beyond limits with sustainable performance gear.
          </p>
          <div className="flex space-x-6 pt-2">
            {['Instagram', 'Youtube', 'Twitter'].map(social => (
              <a
                key={social}
                href="#"
                className="text-[10px] uppercase tracking-widest text-grey-medium hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Directory Links Column 1 */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-primary font-display">Collections</h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/shop" className="text-xs text-grey-medium hover:text-white transition-colors font-light">All Products</Link>
            </li>
            <li>
              <Link to="/shop?category=running" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Running</Link>
            </li>
            <li>
              <Link to="/shop?category=training" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Training</Link>
            </li>
            <li>
              <Link to="/shop?category=football" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Football</Link>
            </li>
            <li>
              <Link to="/shop?category=basketball" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Basketball</Link>
            </li>
          </ul>
        </div>

        {/* Directory Links Column 2 */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-orange font-display">Company</h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/about" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Our Story</Link>
            </li>
            <li>
              <Link to="/contact" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Contact & Support</Link>
            </li>
            <li>
              <Link to="/blog" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Blog / Journal</Link>
            </li>
            <li>
              <a href="#" className="text-xs text-grey-medium hover:text-white transition-colors font-light">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-lime font-display">Early Drops</h4>
          <p className="text-xs text-grey-medium font-light leading-relaxed">
            Subscribe to receive private drops and training advice.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-charcoal border-0 text-xs py-3 px-4 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder-grey-medium outline-none font-light"
              required
            />
            <button
              type="submit"
              className="btn-velocity text-white text-xs py-3 rounded-xl hover:bg-opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-charcoal flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-grey-medium font-light">
          &copy; {new Date().getFullYear()} VelocityX. All rights reserved.
        </p>
        <div className="flex space-x-4">
          {['Stripe', 'ApplePay', 'GooglePay', 'PayPal'].map(payment => (
            <span key={payment} className="text-[9px] uppercase tracking-widest text-grey-medium border border-charcoal px-2.5 py-1 rounded">
              {payment}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
