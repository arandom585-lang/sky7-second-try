import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Leaf, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import FeaturedProducts from '../components/products/FeaturedProducts';
import ProductGrid from '../components/products/ProductGrid';
import ProductUniverseCTA from '../components/products/ProductUniverseCTA';
import { db } from '../supabaseService';
import { Product } from '../types';

const featurePills = [
  { label: '100% Natural', icon: Leaf },
  { label: 'Quality Certified', icon: ShieldCheck },
  { label: 'Premium Grade', icon: Check },
];





export default function ProductsPage({ isSinglePage = false }: { isSinglePage?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await db.getProducts(true));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex ${isSinglePage ? '' : 'min-h-screen'} items-center justify-center bg-[#F7F7F9] pt-24`} id="products-spinner">
        <div className="flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B132B]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Curating collection</span>
        </div>
      </div>
    );
  }

  const WrapperTag = isSinglePage ? 'section' : 'main';

  return (
    <WrapperTag className={`${isSinglePage ? 'pb-20' : 'min-h-screen overflow-hidden'} bg-[#F7F7F9] text-[#111827]`} id={isSinglePage ? "products" : "products-page"}>
      {/* 1. PRODUCTS HERO SECTION */}
      <section className={`relative px-4 pb-16 ${isSinglePage ? 'pt-16 sm:pt-20' : 'pt-40 sm:pt-44'} lg:px-8`} aria-labelledby="products-hero-title">
        <div className="absolute left-1/2 top-16 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(219,226,242,0.7),transparent_68%)] blur-2xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0B132B] shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            New Collection 2026
          </span>

          <h1 id="products-hero-title" className="mt-8 text-5xl font-black tracking-[-0.055em] text-[#111827] sm:text-6xl lg:text-7xl">
            Our Products<br className="hidden sm:block" /> Ecosystem
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg">
            Thoughtfully selected products that combine natural excellence, certified quality, and refined performance for discerning customers.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {featurePills.map(({ label, icon: Icon }) => (
              <motion.span
                key={label}
                whileHover={{ y: -3, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/55 px-4 py-2.5 text-xs font-semibold text-slate-700 backdrop-blur-md"
              >
                <Icon className="h-3.5 w-3.5 text-[#173B8C]" />
                {label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>


      {products.length === 0 ? (
        <section className="mx-auto max-w-xl px-4 pb-28 text-center">
          <div className="rounded-[32px] border border-white bg-white/75 p-12 shadow-xl shadow-slate-900/5">
            <PackageCheck className="mx-auto mb-5 h-10 w-10 text-slate-300" />
            <h2 className="text-xl font-bold text-[#111827]">The new collection is being prepared</h2>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">Products will appear here as soon as they are published.</p>
          </div>
        </section>
      ) : (
        <>
          {/* 4. NEWLY LAUNCHED PRODUCTS SECTION HEADER */}
          <section className="px-4 pb-4 sm:px-6 lg:px-8 bg-transparent" id="newly-launched-section">
            <div className="mx-auto max-w-[1400px]">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#173B8C]">
                    <Sparkles className="h-3 w-3" />
                    Fresh Releases
                  </span>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-[#111827] sm:text-4xl lg:text-5xl font-display">
                    Newly Launched Products
                  </h2>
                  <p className="mt-3 text-sm text-[#6B7280] sm:text-base max-w-xl">
                    Explore our newest technology systems engineered for immediate industrial integration and deployment.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 5. FEATURED PRODUCTS & 6. PRODUCT GRID */}
          <FeaturedProducts products={products.slice(0, 2)} />
          <ProductGrid products={products} />
        </>
      )}

      {/* 7. PRODUCT UNIVERSE CTA */}
      <ProductUniverseCTA />
    </WrapperTag>
  );
}

