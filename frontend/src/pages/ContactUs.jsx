import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Compass, MessageSquare, Send, X } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to VelocityX Support. How can we help you move beyond limits today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    // Simulated reply after 1.2s
    setTimeout(() => {
      let reply = "Thanks for reaching out! A VelocityX specialist will be with you shortly. For fast answers, check our catalog categories or apply coupon codes like VELOCITY10 at checkout.";
      const lower = userMessage.toLowerCase();
      if (lower.includes('size') || lower.includes('shoe') || lower.includes('apparel')) {
        reply = "Our shoes generally run true to size. If you are between sizes, we recommend sizing up by US 0.5. Apparel is athletic tapered fit.";
      } else if (lower.includes('return') || lower.includes('exchange') || lower.includes('refund')) {
        reply = "VelocityX offers a 30-day free athletic exchange policy. You can initiate a self-serve return label directly from your customer order history dashboard!";
      } else if (lower.includes('shipping') || lower.includes('delivery')) {
        reply = "All orders are sent via carbon-neutral DHL Express courier. Standard transit is 2-3 business days.";
      } else if (lower.includes('discount') || lower.includes('coupon') || lower.includes('promo')) {
        reply = "You can use code VELOCITY10 (10% off for min spend $50) or LIMITLESS20 (20% off for min spend $150) at checkout!";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16 bg-dark text-white relative min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-charcoal pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Support Desk</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">Contact Us</h1>
        </div>
        <button
          onClick={() => setIsChatOpen(true)}
          className="btn-velocity text-white text-xs py-3 px-6 rounded-xl flex items-center space-x-2 font-bold shadow-lg shadow-primary/20 shrink-0"
        >
          <MessageSquare size={14} />
          <span>Launch Live Chat</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg uppercase tracking-wider font-bold text-primary font-display">Get In Touch</h3>
            <p className="text-xs text-grey-light font-light leading-relaxed">
              Have questions about drop schedules, technical specifications, orders, or sustainable sourcing? Contact our support line or send a message below.
            </p>
          </div>

          <div className="space-y-6 text-xs text-grey-light font-light">
            <div className="flex items-center space-x-4">
              <div className="bg-charcoal p-3 rounded-full text-primary border border-white/5 shadow-sm">
                <Mail size={16} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-display">Email Support</h4>
                <p className="font-semibold text-primary">support@velocityx.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-charcoal p-3 rounded-full text-primary border border-white/5 shadow-sm">
                <Phone size={16} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-display">Telephone Hotline</h4>
                <p>+1 (800) 555-VELO (Toll-Free)</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-charcoal p-3 rounded-full text-primary border border-white/5 shadow-sm">
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-display">Oregon Design HQ</h4>
                <p>120 Speed Way, Portland, OR 97201, United States</p>
              </div>
            </div>
          </div>

          {/* Stylized Mock Map Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-premium border border-white/10 aspect-[16/10] bg-charcoal group">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"
              alt="Portland HQ location"
              className="w-full h-full object-cover grayscale opacity-60 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10" />
            <div className="absolute top-4 left-4 bg-dark/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-premium text-[9px] uppercase tracking-wider font-semibold text-primary flex items-center space-x-1.5 border border-white/10">
              <Compass size={12} className="animate-spin duration-10000" />
              <span>45.5152° N, 122.6784° W</span>
            </div>
          </div>

        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-charcoal p-8 rounded-3xl space-y-6 border border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lime font-display">Drop Message Request</h3>
          
          {submitted && (
            <div className="bg-green-950 text-green-300 text-xs font-semibold p-4 rounded-xl flex items-center justify-between border border-green-900">
              <span>Thank you! Your message has been sent to our athletic support desk.</span>
              <button onClick={() => setSubmitted(false)} className="underline text-[10px] uppercase tracking-wider font-bold">Dismiss</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Inquiry Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-grey-light font-bold font-display">Message Detail</label>
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Details of your request..."
                className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-xl hover:bg-orange transition-colors shadow-premium flex items-center justify-center"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>

      {/* SIMULATED LIVE CHAT DRAWER */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-charcoal shadow-2xl rounded-2xl flex flex-col z-50 border border-white/10 animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-dark px-4 py-3.5 rounded-t-2xl flex justify-between items-center border-b border-white/5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse shrink-0" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white font-display">VelocityX Assistant</h3>
                <p className="text-[9px] text-grey-medium font-light">Online & Ready</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-grey-medium hover:text-white p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-dark/30">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-charcoal text-grey-light rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex space-x-1 p-2 bg-charcoal/50 rounded-xl max-w-[50px] items-center justify-center border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-grey-medium animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-grey-medium animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-grey-medium animate-bounce delay-300" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-dark border-t border-white/5 rounded-b-2xl flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about sizing, coupon codes, shipping..."
              className="flex-1 bg-charcoal border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary placeholder-grey-medium"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-orange text-white p-2 rounded-xl transition-all"
            >
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default ContactUs;
