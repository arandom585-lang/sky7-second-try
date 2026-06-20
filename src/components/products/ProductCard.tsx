import { motion } from 'motion/react';
import { MessageSquare, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const whatsappNum = product.whatsapp_number || '919999999999';
  
  const detailLink = `https://wa.me/${whatsappNum}?text=Hi, I would like to get more details about the product: ${encodeURIComponent(product.name)}`;
  const buyLink = `https://wa.me/${whatsappNum}?text=Hi, I am interested in buying the product: ${encodeURIComponent(product.name)} (Price: ${product.price})`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_14px_38px_rgba(15,23,42,0.07)] transition-shadow duration-500 hover:shadow-[0_24px_55px_rgba(15,23,42,0.13)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/30 via-transparent to-transparent opacity-70" />
        <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#111827] backdrop-blur-xl">
          {product.category}
        </span>
      </div>

      <div className="flex flex-col flex-grow p-5 justify-between gap-4 text-left">
        <div>
          <h3 className="truncate text-lg font-bold tracking-tight text-[#111827]">{product.name}</h3>
          <p className="mt-2 text-sm font-semibold text-[#173B8C]">{product.price}</p>
          <p className="mt-2 text-xs text-[#6B7280] line-clamp-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Action WhatsApp Redirects */}
        <div className="grid grid-cols-2 gap-2 pt-2 font-mono font-bold uppercase tracking-wider text-[10px]">
          <a
            href={detailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Details</span>
          </a>
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#173B8C] text-white transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            <span>Buy Now</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
