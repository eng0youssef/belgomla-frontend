"use client";

import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ActivityTicker from "@/components/ActivityTicker";
import Footer from "@/components/Footer";
import { useActiveProducts } from "@/hooks/use-products";

export default function Home() {
  const { data: products, isLoading: isProductsLoading } = useActiveProducts();

  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 pb-12 pt-8">
        <div className="text-center mb-12 relative">
          {/* Decorative background blurs */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-10 -right-10 w-24 h-24 bg-amber-200/40 rounded-full blur-3xl -z-10"></div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-loose pb-4 pt-2 flex flex-col items-center gap-4">
            <span>
              ليه تدفع <span className="text-red-500 line-through decoration-red-500/50 decoration-4">قطاعي</span>.. 
            </span>
            <span>
              لما ممكن تشتري <span className="text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 relative inline-block">
                بالجملة؟
                <svg className="absolute -bottom-3 -left-3 w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </span>
            </span>
          </h1>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 font-bold">
              لا توجد منتجات متاحة حالياً
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ActivityTicker />
    </main>
  );
}

