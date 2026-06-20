import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, ShieldAlert } from 'lucide-react';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to VelocityX Digital Assistant. I am your high-performance gear assistant. Ask me anything about our Running, Training, Football, Basketball, or Outdoor gear!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      api.get('/api/products?limit=50')
        .then(res => {
          if (res.data.success) {
            setDbProducts(res.data.products);
          }
        })
        .catch(err => console.log('Assistant products fetch failed', err));
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // AI Performance Gear Engine
    setTimeout(() => {
      let reply = 'VelocityX builds elite gear for runners, gym athletes, footballers, basketball players, and outdoor explorers. Let me know what activity or sport you need gear for!';
      let matchedProduct = null;

      const lowercaseInput = input.toLowerCase();

      // Product matcher helper
      const findProductBySkuOrName = (keyword) => {
        return dbProducts.find(p => p.name.toLowerCase().includes(keyword) || p.sku.toLowerCase().includes(keyword));
      };

      if (lowercaseInput.includes('marathon') || lowercaseInput.includes('running shoe') || lowercaseInput.includes('zoomfly')) {
        const prod = findProductBySkuOrName('zoomfly');
        if (prod) {
          reply = 'For marathons, I highly recommend our VelocityX ZoomFly V1. It integrates a curved carbon-fiber plate and supercritical nitrogen-infused foam for maximum energy return.';
          matchedProduct = prod;
        } else {
          reply = 'Check out our VelocityX ZoomFly V1 marathon shoes under our Running collection. They feature a supercritical V-Zoom Nitro foam and a carbon-fiber plate!';
        }
      } else if (lowercaseInput.includes('jacket') || lowercaseInput.includes('outerwear') || lowercaseInput.includes('windproof')) {
        const prod = findProductBySkuOrName('windrunner');
        if (prod) {
          reply = 'Our AeroVelocity Windrunner Jacket is ultra-lightweight (140g), windproof, and has a durable DWR water-resistant coat. It packs completely into its own chest pocket.';
          matchedProduct = prod;
        }
      } else if (lowercaseInput.includes('gym') || lowercaseInput.includes('lifting') || lowercaseInput.includes('crossfit') || lowercaseInput.includes('trainer')) {
        const prod = findProductBySkuOrName('trainer');
        if (prod) {
          reply = 'For heavy squats, lifts, and cross-training, the VX PowerFit Trainer Pro has a flat 4mm heel drop for maximum ground connection and lateral TPU stability wings.';
          matchedProduct = prod;
        }
      } else if (lowercaseInput.includes('cleats') || lowercaseInput.includes('football') || lowercaseInput.includes('soccer')) {
        const prod = findProductBySkuOrName('cleats');
        if (prod) {
          reply = 'The VelocityX Strike Cleats V3 are professional firm-ground cleats with a lightweight T700 carbon-composite chassis and texturized GripSkin upper panels for ball control.';
          matchedProduct = prod;
        }
      } else if (lowercaseInput.includes('basketball') || lowercaseInput.includes('high-top') || lowercaseInput.includes('vertical')) {
        const prod = findProductBySkuOrName('hyperrise');
        if (prod) {
          reply = 'The VX HyperRise High-Tops feature pressurized air capsules under the heel and forefoot for max bounce, with a high ankle locking strap for stability.';
          matchedProduct = prod;
        }
      } else if (lowercaseInput.includes('waterproof') || lowercaseInput.includes('hiking') || lowercaseInput.includes('outdoor') || lowercaseInput.includes('trail')) {
        const prod = findProductBySkuOrName('trailgrip');
        if (prod) {
          reply = 'Our VX TrailGrip Waterproof Boot features a seam-sealed SympaTex waterproof lining and a high-grip Vibram Megagrip lug outsole for wet rocky terrain.';
          matchedProduct = prod;
        }
      } else if (lowercaseInput.includes('discount') || lowercaseInput.includes('coupon') || lowercaseInput.includes('code')) {
        reply = 'You can apply code "VELOCITY10" to get 10% off items, or "LIMITLESS20" for orders over $150!';
      }

      setMessages(prev => [...prev, {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: reply,
        product: matchedProduct
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-primary to-orange hover:opacity-90 text-white rounded-full p-4 shadow-hover flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={22} className="text-white" />
        </button>
      )}

      {/* Slide up panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] glass-modal rounded-2xl border border-white/10 shadow-hover flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 text-white">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-dark to-charcoal border-b border-white/5 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-lime" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold font-display">VelocityX Assistant</h4>
                <p className="text-[9px] text-grey-medium font-light">24/7 Digital Performance Gear Desk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-grey-medium hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-dark/40 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <div className="bg-charcoal p-1.5 rounded-full text-white shrink-0 mt-0.5 border border-white/5">
                      <Sparkles size={10} className="text-lime" />
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-charcoal text-white rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Inline Product Link Card */}
                {msg.product && (
                  <div className="ml-8 w-full max-w-[70%] glass-card rounded-xl p-2.5 border border-white/10 flex items-center space-x-3 transition-velocity hover:border-primary">
                    <img
                      src={msg.product.images[0]}
                      alt={msg.product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-charcoal"
                    />
                    <div className="flex-grow min-w-0">
                      <h5 className="text-[10px] font-semibold text-white truncate">{msg.product.name}</h5>
                      <p className="text-[9px] text-orange font-bold">${msg.product.price.toFixed(2)}</p>
                      <Link
                        to={`/products/${msg.product._id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-[8px] uppercase tracking-widest text-primary font-bold hover:underline mt-1 block"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start space-x-2.5">
                <div className="bg-charcoal p-1.5 rounded-full text-white shrink-0 border border-white/5">
                  <Sparkles size={10} className="text-lime animate-pulse" />
                </div>
                <div className="bg-charcoal p-3 rounded-2xl rounded-tl-none border border-white/5 shadow-sm flex space-x-1 items-center">
                  <span className="w-1.5 h-1.5 bg-grey-medium rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-grey-medium rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-grey-medium rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-charcoal flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about running shoes, waterproof gear..."
              className="flex-grow bg-dark/50 border border-white/5 text-xs py-2.5 px-3.5 rounded-xl focus:ring-1 focus:ring-primary outline-none text-white placeholder-grey-medium"
            />
            <button
              type="submit"
              className="bg-primary text-white p-2.5 rounded-xl hover:bg-orange transition-colors flex items-center justify-center shadow-sm"
              aria-label="Send message"
            >
              <Send size={14} className="text-white" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
