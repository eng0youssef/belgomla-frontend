"use client";

import { useState } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Image as ImageIcon, CheckCircle2, Edit2 } from "lucide-react";
import { useActiveProducts, useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { CreateProductRequest, ProductResponse } from "@/types/api";
import { isTrustedImageUrl } from "@/lib/image-utils";

export function AdminProductsTab() {
  const { data: products, isLoading } = useActiveProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    imageUrl: "",
    wholesalePrice: 0,
    standardPrice: 0,
    minDiscountPrice: 0,
    cartonCapacity: 10,
    maxReferrals: 3,
    referralDiscountPerReferral: 5,
    depositAmount: 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateMutation.mutate(
        { id: editingProductId, data: formData },
        {
          onSuccess: () => {
            setIsCreating(false);
            setEditingProductId(null);
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsCreating(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      imageUrl: "",
      wholesalePrice: 0,
      standardPrice: 0,
      minDiscountPrice: 0,
      cartonCapacity: 10,
      maxReferrals: 3,
      referralDiscountPerReferral: 5,
      depositAmount: 50,
    });
  };

  const handleEdit = (product: ProductResponse) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      imageUrl: product.imageUrl || "",
      wholesalePrice: product.wholesalePrice,
      standardPrice: product.standardPrice,
      minDiscountPrice: product.minDiscountPrice,
      cartonCapacity: product.cartonCapacity,
      maxReferrals: product.maxReferrals,
      referralDiscountPerReferral: product.referralDiscountPerReferral,
      depositAmount: product.depositAmount || 50,
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-900">إدارة المنتجات</h2>
        <Button 
          onClick={() => {
            setIsCreating(!isCreating);
            if (!isCreating) {
              setEditingProductId(null);
              resetForm();
            }
          }} 
          className="gap-2 bg-gray-900 text-white hover:bg-gray-800"
        >
          {isCreating ? (
            "إلغاء"
          ) : (
            <>
              <Plus className="w-4 h-4" />
              إضافة منتج جديد
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Card className="border-0 shadow-lg bg-gray-50/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">اسم المنتج</label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: نسكافيه جولد 200 جرام"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">رابط الصورة (URL)</label>
                  <Input 
                    value={formData.imageUrl || ""}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">السعر العادي (للعرض)</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.standardPrice}
                    onChange={e => setFormData({ ...formData, standardPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">سعر الجملة (الأساسي)</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.wholesalePrice}
                    onChange={e => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-amber-800 leading-none">قيمة العربون لتأكيد الحجز (ج.م)</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.depositAmount}
                    onChange={e => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                    placeholder="مثال: 50 أو 100"
                    className="border-amber-300 bg-amber-50/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">أقصى سعر بعد الخصم</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.minDiscountPrice}
                    onChange={e => setFormData({ ...formData, minDiscountPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">سعة الكارتونة</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.cartonCapacity}
                    onChange={e => setFormData({ ...formData, cartonCapacity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">خصم لكل إحالة</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.referralDiscountPerReferral}
                    onChange={e => setFormData({ ...formData, referralDiscountPerReferral: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">أقصى عدد إحالات مسموح</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.maxReferrals}
                    onChange={e => setFormData({ ...formData, maxReferrals: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-black"
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? "جاري الحفظ..." 
                    : (editingProductId ? "تحديث المنتج" : "حفظ المنتج")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map(product => (
          <Card key={product.id} className="border-0 shadow hover:shadow-lg transition-all overflow-hidden group">
            {isTrustedImageUrl(product.imageUrl) ? (
              <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                <NextImage
                  src={product.imageUrl!}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> نشط
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="min-h-[36px] min-w-[36px] p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEdit(product)}
                    aria-label={`تعديل منتج ${product.name}`}
                    title={`تعديل منتج ${product.name}`}
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>السعر العادي: <span className="line-through">{product.standardPrice} ج</span></p>
                <p>سعر الجملة: <span className="font-bold text-gray-900">{product.wholesalePrice} ج</span></p>
                <p className="text-amber-700 font-black">العربون المطلوب: <span>{product.depositAmount || 50} ج.م</span></p>
                <p>سعة الكارتونة: <span className="font-bold">{product.cartonCapacity} قطعة</span></p>
              </div>
            </CardContent>
          </Card>
        ))}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            لا توجد منتجات حالياً. أضف منتجك الأول لتبدأ!
          </div>
        )}
      </div>
    </div>
  );
}

