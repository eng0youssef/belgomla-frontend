"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  LogOut,
  CheckCircle2,
  Loader2,
  Clock,
  Users,
  Package,
  Phone,
  MapPin,
  Tag,
  Truck,
  ShoppingCart,
  Archive,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  RefreshCw,
  Edit2,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { usePendingOrders, useConfirmDeposit } from "@/hooks/use-admin";
import { useActiveCarton, useAdminCartons, useUpdateCartonStatus, useUpdateCartonCounter, useForceCreateCarton } from "@/hooks/use-carton";
import { useActiveProducts } from "@/hooks/use-products";
import { getAdminToken, removeAdminToken } from "@/services/api-client";
import { AdminProductsTab } from "@/components/AdminProductsTab";
import { OrderStatus } from "@/types/api";
import type { CartonStatusTransition } from "@/services/carton";

const DEFAULT_PRODUCT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID ||
  "00000000-0000-0000-0000-000000000001";

type ActiveTab = "orders" | "cartons" | "products";

const cartonStatusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Open: {
    label: "مفتوحة",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <Package className="w-3 h-3" />,
  },
  Filled: {
    label: "مكتملة",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Archive className="w-3 h-3" />,
  },
  Purchased: {
    label: "تم الشراء",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <ShoppingCart className="w-3 h-3" />,
  },
  Delivered: {
    label: "تم التسليم",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Cancelled: {
    label: "ملغية",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <AlertTriangle className="w-3 h-3" />,
  },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("orders");
  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = usePendingOrders();
  const { data: activeProducts = [] } = useActiveProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>(DEFAULT_PRODUCT_ID);
  
  const { data: carton } = useActiveCarton(selectedProductId);
  const { data: adminCartons, isLoading: cartonsLoading, refetch: refetchCartons } = useAdminCartons(selectedProductId);
  const confirmMutation = useConfirmDeposit();
  const updateCartonMutation = useUpdateCartonStatus(selectedProductId);
  const updateCounterMutation = useUpdateCartonCounter(selectedProductId);
  const forceCreateMutation = useForceCreateCarton();

  // Set default product ID if we have products and selectedProductId is not set
  useEffect(() => {
    if (activeProducts.length > 0 && selectedProductId === DEFAULT_PRODUCT_ID && !activeProducts.some(p => p.id === DEFAULT_PRODUCT_ID)) {
      setSelectedProductId(activeProducts[0].id);
    }
  }, [activeProducts, selectedProductId]);

  const [editingCartonId, setEditingCartonId] = useState<string | null>(null);
  const [editingCounterValue, setEditingCounterValue] = useState<number>(0);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!getAdminToken()) {
      router.replace("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    removeAdminToken();
    router.replace("/admin/login");
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const handleConfirmDeposit = (orderId: string) => {
    confirmMutation.mutate(orderId);
  };

  const handleUpdateCartonStatus = (
    cartonId: string,
    status: CartonStatusTransition
  ) => {
    updateCartonMutation.mutate({ cartonId, status });
  };

  const pendingOrders = orders?.filter(
    (o) => o.status === OrderStatus.PendingDeposit
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRevenue = orders?.reduce((sum, o) => sum + o.finalPrice, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30" dir="rtl">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">لوحة التحكم</h1>
              <p className="text-xs text-gray-500 font-bold">بالجملة BelGomla</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-gray-500">
            <LogOut className="w-4 h-4" />
            خروج
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">في انتظار التأكيد</p>
                <div className="text-2xl font-black text-gray-900">
                  {!isMounted || ordersLoading ? <Skeleton className="h-8 w-8" /> : pendingOrders?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">الكارتونة الحالية</p>
                <div className="text-2xl font-black text-emerald-600">
                  {!isMounted || !carton ? <Skeleton className="h-8 w-20" /> : `${carton.confirmedCount} / ${carton.capacity}`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">إجمالي الكراتين</p>
                <div className="text-2xl font-black text-gray-900">
                  {!isMounted || cartonsLoading ? <Skeleton className="h-8 w-8" /> : adminCartons?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">إيرادات مؤكدة</p>
                <div className="text-xl font-black text-purple-600">
                  {!isMounted || ordersLoading ? <Skeleton className="h-8 w-16" /> : `${totalRevenue} ج`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carton Progress Bar */}
        {carton && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-black text-gray-800">الكارتونة #{carton.cartonNumber}</h3>
                  <p className="text-xs text-gray-500 font-bold">
                    {carton.confirmedCount} من {carton.capacity} قطعة
                  </p>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${cartonStatusMap[carton.status]?.color}`}>
                  {cartonStatusMap[carton.status]?.label}
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${carton.progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                />
              </div>
              <p className="text-left text-xs font-black text-emerald-600 mt-1">
                {carton.progressPercent.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === "orders"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            الطلبات المعلقة
            {(pendingOrders?.length || 0) > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {pendingOrders?.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("cartons")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === "cartons"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4" />
            إدارة الكراتين
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === "products"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Tag className="w-4 h-4" />
            المنتجات
          </button>
        </div>

        {/* Tab: Products */}
        {activeTab === "products" && (
          <div className="mt-4">
            <AdminProductsTab />
          </div>
        )}

        {/* Tab: Pending Orders */}
        {activeTab === "orders" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                طلبات في انتظار تأكيد العربون
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchOrders()}
                className="gap-1.5 text-gray-500"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !pendingOrders?.length ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-bold">مفيش طلبات معلقة دلوقتي 🙌</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>الموبايل</TableHead>
                        <TableHead>المنطقة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>كود إحالة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>إجراء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {pendingOrders.map((order) => (
                          <motion.tr
                            key={order.orderId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <TableCell className="font-bold">
                              {order.customerName}
                            </TableCell>
                            <TableCell dir="ltr" className="text-right">
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="flex items-center gap-1 text-emerald-600 hover:underline"
                              >
                                <Phone className="w-3 h-3" />
                                {order.customerPhone}
                              </a>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-3 h-3" />
                                {order.villageName}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-black text-emerald-600">
                                {order.finalPrice} ج.م
                              </span>
                              {order.appliedDiscount > 0 && (
                                <Badge variant="default" className="mr-1 text-[10px]">
                                  -{order.appliedDiscount}ج
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {order.referralCodeUsed ? (
                                <Badge variant="secondary" className="gap-1">
                                  <Tag className="w-3 h-3" />
                                  {order.referralCodeUsed}
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleConfirmDeposit(order.orderId)}
                                disabled={
                                  confirmMutation.isPending &&
                                  confirmMutation.variables === order.orderId
                                }
                                className="gap-1.5 whitespace-nowrap"
                              >
                                {confirmMutation.isPending &&
                                confirmMutation.variables === order.orderId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                تأكيد العربون ✅
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab: Carton Management */}
        {activeTab === "cartons" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                إدارة الكراتين — دورة حياة المنتج
              </CardTitle>
              <div className="flex items-center gap-4">
                <select
                  className="bg-white border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  {activeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                  <Button
                    size="sm"
                    onClick={() => forceCreateMutation.mutate(selectedProductId)}
                    disabled={forceCreateMutation.isPending || !selectedProductId}
                    className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs text-white"
                  >
                    <Package className="w-4 h-4" />
                    {forceCreateMutation.isPending 
                      ? "جاري الفتح..." 
                      : (!adminCartons?.length ? "فتح أول كرتونة الآن" : "تقفيل المفتوح وفتح جديدة")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchCartons()}
                    className="gap-1.5 text-gray-500"
                  >
                    <RefreshCw className="w-4 h-4" />
                    تحديث
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {cartonsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : !adminCartons?.length ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-bold text-lg mb-2">لا توجد أي كراتين لهذا المنتج بعد</p>
                  <p className="text-sm text-gray-500 mb-4">اضغط على الزر بالأعلى لفتح أول كرتونة لتبدأ استقبال الطلبات عليها.</p>
                  <Button
                    onClick={() => forceCreateMutation.mutate(selectedProductId)}
                    disabled={forceCreateMutation.isPending || !selectedProductId}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Package className="w-4 h-4" />
                    {forceCreateMutation.isPending ? "جاري الفتح..." : "فتح أول كرتونة الآن"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Lifecycle Guide */}
                  <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
                    {[
                      { label: "مفتوحة", color: "text-emerald-600 bg-emerald-50" },
                      { arrow: true },
                      { label: "مكتملة", color: "text-blue-600 bg-blue-50" },
                      { arrow: true },
                      { label: "تم الشراء", color: "text-purple-600 bg-purple-50" },
                      { arrow: true },
                      { label: "تم التسليم", color: "text-gray-600 bg-gray-50" },
                    ].map((item, i) =>
                      "arrow" in item ? (
                        <ChevronRight key={i} className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      ) : (
                        <span
                          key={i}
                          className={`text-xs font-black px-2.5 py-1 rounded-full flex-shrink-0 ${item.color}`}
                        >
                          {item.label}
                        </span>
                      )
                    )}
                  </div>

                  <AnimatePresence>
                    {adminCartons.map((carton) => {
                      const statusInfo = cartonStatusMap[carton.status] || {
                        label: carton.status,
                        color: "bg-gray-100 text-gray-700",
                        icon: null,
                      };

                      return (
                        <motion.div
                          key={carton.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-gray-800">
                                  كارتونة #{carton.cartonNumber}
                                </h4>
                                <span
                                  className={`text-xs font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusInfo.color}`}
                                >
                                  {statusInfo.icon}
                                  {statusInfo.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-bold">
                                {carton.confirmedCount} / {carton.capacity} قطعة مؤكدة
                                {carton.filledAt && (
                                  <span className="mr-2 text-blue-500">
                                    • اكتملت {formatDate(carton.filledAt)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <span className="text-sm font-black text-gray-600">
                              {carton.progressPercent}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <div
                              className={`h-full rounded-full transition-all ${
                                carton.status === "Delivered"
                                  ? "bg-gray-400"
                                  : carton.status === "Cancelled"
                                  ? "bg-red-400"
                                  : "bg-gradient-to-r from-emerald-400 to-emerald-600"
                              }`}
                              style={{ width: `${carton.progressPercent}%` }}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {carton.status === "Filled" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateCartonStatus(carton.id, "Purchased")
                                  }
                                  disabled={updateCartonMutation.isPending}
                                  className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-xs"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  تأكيد الشراء من المورد
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleUpdateCartonStatus(carton.id, "Cancelled")
                                  }
                                  disabled={updateCartonMutation.isPending}
                                  className="text-xs"
                                >
                                  إلغاء
                                </Button>
                              </>
                            )}

                            {carton.status === "Purchased" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateCartonStatus(carton.id, "Delivered")
                                  }
                                  disabled={updateCartonMutation.isPending}
                                  className="gap-1.5 bg-gray-700 hover:bg-gray-800 text-xs"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  تأكيد التسليم للعملاء
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleUpdateCartonStatus(carton.id, "Cancelled")
                                  }
                                  disabled={updateCartonMutation.isPending}
                                  className="text-xs"
                                >
                                  إلغاء
                                </Button>
                              </>
                            )}

                            {carton.status === "Open" && (
                              <>
                                {editingCartonId === carton.id ? (
                                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                                    <Input
                                      type="number"
                                      className="w-20 h-8 text-center"
                                      value={editingCounterValue}
                                      onChange={(e) => setEditingCounterValue(Number(e.target.value))}
                                      min={0}
                                      max={carton.capacity}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        updateCounterMutation.mutate({ cartonId: carton.id, confirmedCount: editingCounterValue }, {
                                          onSuccess: () => setEditingCartonId(null)
                                        });
                                      }}
                                      disabled={updateCounterMutation.isPending}
                                      className="h-8 bg-emerald-600 hover:bg-emerald-700 text-xs px-2"
                                    >
                                      حفظ
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingCartonId(null)}
                                      className="h-8 text-xs px-2"
                                    >
                                      إلغاء
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingCartonId(carton.id);
                                      setEditingCounterValue(carton.confirmedCount);
                                    }}
                                    className="gap-1.5 text-xs border-dashed border-gray-300"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    تعديل العداد يدوياً
                                  </Button>
                                )}

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleUpdateCartonStatus(carton.id, "Cancelled")
                                  }
                                  disabled={updateCartonMutation.isPending}
                                  className="text-xs"
                                >
                                  إلغاء الكارتونة
                                </Button>
                              </>
                            )}

                            {(carton.status === "Delivered" ||
                              carton.status === "Cancelled") && (
                              <span className="text-xs text-gray-400 font-bold py-1">
                                {carton.status === "Delivered"
                                  ? "✅ تمت دورة حياة هذه الكارتونة"
                                  : "❌ تم إلغاء هذه الكارتونة"}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
