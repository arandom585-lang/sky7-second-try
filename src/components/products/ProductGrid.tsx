import { motion } from 'motion/react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="all-products-heading">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mb-10 flex items-end justify-between gap-5"
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">The Complete Edit</p>
            <h2 id="all-products-heading" className="text-3xl font-black tracking-[-0.035em] text-[#111827] sm:text-4xl">All Products</h2>
            <p className="mt-3 text-sm text-[#6B7280] sm:text-base">Browse our complete product range</p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            {products.length} total
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
