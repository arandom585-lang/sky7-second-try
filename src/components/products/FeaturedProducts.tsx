import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="featured-products-heading">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mb-10 flex items-end justify-between gap-5"
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Curated Selection</p>
            <h2 id="featured-products-heading" className="text-[28px] font-black tracking-[-0.03em] text-[#111827] sm:text-[32px]">Featured Products</h2>
            <p className="mt-3 text-sm text-[#6B7280] sm:text-base">Our most popular and recommended items</p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            {products.length} items
          </span>
        </motion.div>

        <div className="space-y-8">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative grid overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(15,23,42,0.13)] lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative min-h-[340px] overflow-hidden bg-slate-100 lg:min-h-[470px]">
                <img
                  src={product.image_url}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/45 via-transparent to-black/5" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#0B132B] px-3.5 py-2 text-[11px] font-bold text-white shadow-xl">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  Featured
                </span>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#173B8C]">{product.category}</span>
                <h3 className="mt-3 text-[22px] font-black tracking-[-0.03em] text-[#111827] sm:text-[24px]">{product.name}</h3>
                <p className="mt-5 text-sm leading-7 text-[#6B7280] sm:text-base">{product.description}</p>

                <div className="mt-7">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#111827]">Key Benefits</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(product.features?.length ? product.features : ['Premium-grade quality', 'Carefully selected']).slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-9 flex flex-col gap-5 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Product Price</span>
                    <strong className="mt-1 block text-2xl font-black text-[#111827]">{product.price}</strong>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={`https://wa.me/${product.whatsapp_number || '919999999999'}?text=Hi, I would like to get more details about the featured product: ${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-350 bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 transition-all duration-300 hover:bg-slate-50"
                    >
                      View Details
                    </a>
                    <a
                      href={`https://wa.me/${product.whatsapp_number || '919999999999'}?text=Hi, I am interested in buying the featured product: ${encodeURIComponent(product.name)} (Price: ${product.price})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B132B] px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg shadow-slate-950/15 transition-all duration-300 hover:scale-[1.03] hover:bg-[#173B8C]"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
