"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminLogin } from "@/hooks/use-admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(credentials);
      router.push("/admin/dashboard");
    } catch (error) {
      // Error handled by mutation state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200/50">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">SLASH | سلاش</h1>
          <p className="text-sm text-gray-500 font-bold">لوحة تحكم الإدارة</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  اسم المستخدم
                </label>
                <Input
                  icon={<User className="w-4 h-4" />}
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  كلمة المرور
                </label>
                <Input
                  icon={<Lock className="w-4 h-4" />}
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginMutation.isError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  بيانات الدخول غلط، حاول تاني
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الدخول...
                  </span>
                ) : (
                  "دخول"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
