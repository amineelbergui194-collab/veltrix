import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { FeaturedContentSection } from './components/FeaturedContentSection';
import { FeaturedCollectionsSection } from './components/FeaturedCollectionsSection';
import { PromoBanner } from './components/PromoBanner';
import { CustomerReviews } from './components/CustomerReviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { AccountPage } from './components/auth/AccountPage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { SupportModals } from './components/SupportModals';
import { ToastContainer } from './components/ToastContainer';

const MainContent = () => {
  const { currentView } = useShop();

  switch (currentView) {
    case 'home':
      return (
        <main className="min-h-screen bg-[#0C0C0C]">
          <HeroSection />
          <MarqueeSection />
          <AboutSection />
          <div id="featured-content">
            <FeaturedContentSection />
          </div>
          <FeaturedCollectionsSection />
          <PromoBanner />
          <CustomerReviews />
          <Newsletter />
        </main>
      );
    case 'shop':
      return <ShopPage />;
    case 'product-detail':
      return <ProductDetailPage />;
    case 'cart':
      return <CartPage />;
    case 'checkout':
      return <CheckoutPage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignUpPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    case 'reset-password':
      return <ResetPasswordPage />;
    case 'account':
      return <AccountPage />;
    default:
      return (
        <main className="min-h-screen bg-[#0C0C0C]">
          <HeroSection />
          <MarqueeSection />
          <AboutSection />
          <FeaturedContentSection />
          <FeaturedCollectionsSection />
          <PromoBanner />
          <CustomerReviews />
          <Newsletter />
        </main>
      );
  }
};

const AppShell = () => {
  const { currentView } = useShop();
  const isDedicatedAuthPage = ['login', 'signup', 'forgot-password', 'reset-password'].includes(currentView);

  if (isDedicatedAuthPage) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit">
        <MainContent />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0C0C] text-[#D7E2EA] font-kanit selection:bg-[#B600A8] selection:text-white">
      {/* Sticky Cinematic Studio Header */}
      <Navbar />

      {/* Dynamic Page Views */}
      <div className="flex-1">
        <MainContent />
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <SearchModal />
      <SupportModals />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppShell />
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
