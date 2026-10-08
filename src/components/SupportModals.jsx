import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FAQS } from '../data/products';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Send,
  Search,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Lock,
  User
} from 'lucide-react';

export const SupportModals = () => {
  const {
    isContactOpen,
    setIsContactOpen,
    isTrackingOpen,
    setIsTrackingOpen,
    isFaqOpen,
    setIsFaqOpen,
    isAboutOpen,
    setIsAboutOpen,
    isAccountOpen,
    setIsAccountOpen,
    addToast
  } = useShop();

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Product Question');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Tracking Lookup State
  const [trackingId, setTrackingId] = useState('');
  const [trackingEmail, setTrackingEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  // FAQ open question index
  const [openFaq, setOpenFaq] = useState(0);

  // Account modal state
  const [accountEmail, setAccountEmail] = useState('');
  const [accountSignedIn, setAccountSignedIn] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    addToast('Message sent! Our support team will respond within 4 hours.', 'success');
  };

  const handleTrackingLookup = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setTrackingResult({
      id: trackingId.toUpperCase(),
      status: 'In Transit',
      carrier: 'FedEx Express Priority',
      estimatedDelivery: 'Tomorrow, October 9, by 4:30 PM',
      currentLocation: 'San Francisco Hub, CA',
      steps: [
        { title: 'Order Processed & Verified', time: 'Yesterday, 9:15 AM', done: true },
        { title: 'Dispatched from Veltrix Distribution Hub', time: 'Yesterday, 2:40 PM', done: true },
        { title: 'In Transit — Sorting Facility', time: 'Today, 6:15 AM', done: true },
        { title: 'Out for Delivery', time: 'Expected Tomorrow', done: false },
      ]
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!accountEmail) return;
    setAccountSignedIn(true);
    addToast(`Welcome back, ${accountEmail}!`, 'success');
  };

  return (
    <>
      {/* 1. CONTACT US MODAL */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsContactOpen(false)} />
          <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl text-white p-6 sm:p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Mail className="w-4 h-4" />
              <span>Direct Support</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Contact Veltrix Team</h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Have questions regarding compatibility, order status, or bulk inquiries? We're available 24/7.
            </p>

            {contactSubmitted ? (
              <div className="p-6 rounded-xl bg-neutral-900/80 border border-emerald-500/30 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold">Message Dispatched!</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Ticket #{Math.floor(100000 + Math.random() * 900000)} opened. A technical specialist has been notified.
                </p>
                <button
                  onClick={() => {
                    setContactSubmitted(false);
                    setIsContactOpen(false);
                  }}
                  className="mt-6 px-6 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs uppercase"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Subject</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-cyan-400"
                  >
                    <option>Product Compatibility Inquiry</option>
                    <option>Order & Shipping Tracking</option>
                    <option>Warranty & 30-Day Return</option>
                    <option>Wholesale & Corporate Orders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Message</label>
                  <textarea
                    required
                    rows="4"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe how we can assist you..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-850 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>support@veltrix.tech</span>
              <span>1-800-VELTRIX</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDER TRACKING MODAL */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsTrackingOpen(false)} />
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl text-white p-6 sm:p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsTrackingOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Package className="w-4 h-4" />
              <span>Live Logistics</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Order Tracking</h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Enter your Veltrix Order ID to inspect real-time courier updates.
            </p>

            <form onSubmit={handleTrackingLookup} className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Order Reference #</label>
                <input
                  type="text"
                  required
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. VELT-89241 or 104829"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-white focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Package</span>
              </button>
            </form>

            {trackingResult && (
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-xs text-neutral-400 font-mono">Status:</span>
                    <div className="text-sm font-bold text-emerald-400">{trackingResult.status}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 font-mono">Carrier:</span>
                    <div className="text-xs font-semibold text-white">{trackingResult.carrier}</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-300">
                  Estimated Delivery: <strong className="text-cyan-300">{trackingResult.estimatedDelivery}</strong>
                </div>

                {/* Stepper */}
                <div className="space-y-3 pt-2">
                  {trackingResult.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${st.done ? 'bg-cyan-400' : 'bg-neutral-800'}`} />
                      <div className="flex-1">
                        <div className={st.done ? 'text-white font-medium' : 'text-neutral-500'}>{st.title}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{st.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. FAQ ACCORDION MODAL */}
      {isFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsFaqOpen(false)} />
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl text-white p-6 sm:p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsFaqOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Answers regarding warranties, shipping, product certifications, and return policies.
            </p>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-neutral-900/70 transition-colors"
                  >
                    <span className="text-sm font-bold text-white">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-850">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ABOUT VELTRIX MODAL */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAboutOpen(false)} />
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl text-white p-6 sm:p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Brand Philosophy</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">About VELTRIX</h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <p>
                <strong>VELTRIX</strong> was founded on a simple premise: everyday electronic accessories shouldn't be fragile afterthoughts. Whether you're listening to high-resolution audio during a flight, charging your smartphone at top speed, or equipping your Apple Watch with aerospace titanium, your hardware should inspire confidence.
              </p>
              <p>
                We specialize in audio engineering, thermal-optimized GaN power delivery, and durable materials like ballistic Kevlar, anodized aircraft aluminum, and hypoallergenic silicone.
              </p>
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
                <div className="font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
                  Our Triple Standard
                </div>
                <div>• <strong>Acoustic Integrity:</strong> Balanced, low-distortion studio frequency profiles.</div>
                <div>• <strong>Certified Safety:</strong> Rigorous MFi and USB Power Delivery compliance with thermal guards.</div>
                <div>• <strong>No-Risk Confidence:</strong> 30-day trial and 1-2 year replacement warranties on all hardware.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. USER ACCOUNT / PROFILE MODAL */}
      {isAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAccountOpen(false)} />
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl text-white p-6 sm:p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAccountOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <User className="w-4 h-4" />
              <span>Member Portal</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Veltrix Account</h2>

            {accountSignedIn ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-xs text-neutral-400 font-mono">Logged in as:</div>
                  <div className="text-sm font-bold text-white truncate">{accountEmail}</div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-1">Tier: Veltrix Insider (10% Tier Active)</div>
                </div>

                <div className="text-xs font-mono uppercase text-neutral-400">Recent Orders</div>
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-850 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>#VELT-73918</span>
                    <span className="text-emerald-400">Delivered</span>
                  </div>
                  <div className="text-neutral-400 mt-1">AirPods Pro 2 • 100W USB-C Cable</div>
                </div>

                <button
                  onClick={() => setAccountSignedIn(false)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <p className="text-xs text-neutral-400">
                  Sign in or create an account to view past orders, warranty registrations, and reward credits.
                </p>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Sign In / Register
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
