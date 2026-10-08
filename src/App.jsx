import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { BestSellers } from './components/BestSellers';
import { PromoBanner } from './components/PromoBanner';
import { WhyVeltrix } from './components/WhyVeltrix';
import { CustomerReviews } from './components/CustomerReviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { SupportModals } from './components/SupportModals';
import { ToastContainer } from './components/ToastContainer';

const MainContent = () => {
  const { currentView } = useShop();

  return (
    <main className="min-h-screen bg-neutral-950">
      {currentView === 'home' && (
        <>
          <Hero />
          <FeaturedCategories />
          <BestSellers />
          <PromoBanner />
          <WhyVeltrix />
          <CustomerReviews />
          <Newsletter />
        </>
      )}

      {currentView === 'shop' && <ShopPage />}
      {currentView === 'product-detail' && <ProductDetailPage />}
      {currentView === 'cart' && <CartPage />}
      {currentView === 'checkout' && <CheckoutPage />}
    </main>
  );
};

export function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500 selection:text-black">
        {/* Sticky Header with Announcement Bar & Nav */}
        <Header />

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
    </ShopProvider>
  );
}

export default App;
