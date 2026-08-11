# دليل ربط الواجهة الأمامية (Frontend Integration Guide)
## مشروع منصة الشراء الجماعي (Group Buying Platform)

يحتوي هذا الملف على توثيق شامل لكل ما تم بناؤه في الـ Backend (API) لتسهيل بناء الواجهة الأمامية (React, Next.js, Flutter, etc..).

---

## 1. الإعدادات الأساسية (Base Settings)

- **Base URL:** `https://localhost:5001` (أو البورت اللي هيظهر لما تعمل `dotnet run`)
- **طريقة التوثيق (Authentication):** نستخدم `JWT Bearer Token`.
- **طريقة الإرسال:** في أي Request بيحتاج صلاحيات، ضيف الـ Header ده:
  `Authorization: Bearer <Your_Token_Here>`

---

## 2. الصلاحيات وأنواع المستخدمين (Roles)
السيستم فيه نوعين من المستخدمين:
1. **Admin (مدير النظام):** معاه صلاحيات لإدارة الكراتين، تأكيد العربون، وتعديل حالات الطلبات.
2. **Customer (العميل):** بيعمل حساب لنفسه، يشوف الـ Dashboard الخاص بيه، وتاريخ أوردراته وإحالاته.
*(وهناك مسارات Public لا تحتاج لأي تسجيل دخول مثل رؤية الكراتين المتاحة)*.

---

## 3. مسارات العملاء (Customer Endpoints)

### أ. إنشاء حساب جديد (Register)
- **المسار:** `POST /api/auth/customer/register`
- **الوظيفة:** العميل بيعمل حساب جديد، أو لو هو أصلاً عمل أوردر من قبل كده (السيستم عارف رقمه)، بيضيف الباسورد بس.
- **البيانات المطلوبة (Body):**
```json
{
  "fullName": "أحمد محمد",
  "phoneNumber": "01012345678",
  "villageName": "كفر الشيخ",
  "password": "mySecurePassword123",
  "referralCode": null
}
```
- **الرد (Response):** بيرجعلك `token` و بيانات العميل. لازم تحفظ الـ Token في (LocalStorage/Cookies).

### ب. تسجيل الدخول (Login)
- **المسار:** `POST /api/auth/customer/login`
- **البيانات المطلوبة (Body):**
```json
{
  "phoneNumber": "01012345678",
  "password": "mySecurePassword123"
}
```
- **الرد:** بيرجع نفس بيانات الـ Token.

### ج. لوحة تحكم العميل (Customer Dashboard) 🔒 *[Requires Customer Token]*
- **المسار:** `GET /api/customer/me`
- **الوظيفة:** أهم مسار في الفرونت اند! ده بيرجعلك كل حاجة عن العميل في ريكويست واحد (بياناته، ملخص طلباته، تاريخ طلباته بالكامل، وحالة الـ Referrals اللي عملها).
- **الرد (Response):**
```json
{
  "success": true,
  "data": {
    "customerId": "...",
    "fullName": "أحمد محمد",
    "phoneNumber": "01012345678",
    "villageName": "كفر الشيخ",
    "personalReferralCode": "A8X9MN2Q",
    "memberSince": "2026-08-01T...",
    "orderSummary": {
      "totalOrders": 1,
      "pendingOrders": 1,
      "confirmedOrders": 0,
      "completedOrders": 0,
      "totalSaved": 0.0
    },
    "orders": [
      {
        "orderId": "...",
        "productName": "AirPods Pro",
        "cartonNumber": 1,
        "originalPrice": 150.0,
        "appliedDiscount": 0.0,
        "finalPrice": 150.0,
        "depositAmount": 0.0,
        "status": "PendingDeposit",
        "statusArabic": "في انتظار العربون",
        "createdAt": "..."
      }
    ],
    "referralProgress": { ... }
  }
}
```

---

## 4. مسارات الطلبات والكراتين (Public & Orders Endpoints)

### أ. عرض الكراتين المتاحة (Cartons Progress Bar)
- **المسار:** `GET /api/public/cartons/{productId}`
- **الوظيفة:** بيعرض الكراتين الحالية للمنتج عشان تعرض (العداد) للمستخدم بشكل مباشر. بيرجع العدد اللي دفعوا عربون فعلياً `ConfirmedCount`.

### ب. عمل أوردر جديد (Place Order)
- **المسار:** `POST /api/public/orders`
- **الوظيفة:** العميل بيشتري ويدخل بياناته. السيستم بيدخله في أقرب كرتونة شغالة للمنتج ده.
- **البيانات المطلوبة (Body):**
```json
{
  "productId": "...",
  "customerFullName": "أحمد محمد",
  "customerPhone": "01012345678",
  "villageName": "كفر الشيخ",
  "referralCode": "اختياري - كود صديق"
}
```

---

## 5. مسارات الإدارة (Admin Endpoints) 🔒 *[Requires Admin Token]*

**بيانات الدخول الافتراضية للمدير:**
- Username: `admin`
- Password: `Admin@123`

### أ. تسجيل دخول الإدارة
- **المسار:** `POST /api/admin/auth/login`
- **الرد:** بيرجع الـ Admin Token.

### ب. عرض الأوردرات اللي في انتظار تأكيد العربون
- **المسار:** `GET /api/admin/orders/pending`
- **الوظيفة:** لوحة الأدمن بيتعرض فيها كل الناس اللي طلبوا ومستنيين يتدفع لهم العربون (PendingDeposit).

### ج. تأكيد دفع العربون (Confirm Deposit) - ⭐ أهم Business Logic
- **المسار:** `POST /api/admin/orders/confirm-deposit`
- **الوظيفة:** لما الأدمن يضغط على "تم الدفع"، بيعمل الآتي:
  1. يزود عداد الكرتونة `ConfirmedCount` +1.
  2. يحسب الخصومات (Referrals) للشخص اللي دعا العميل ده، وينزل من سعر أوردر الشخص التاني.
  3. لو الكرتونة اكتملت (مثلاً 5/5)، بيحول حالة الكرتونة لـ `Completed` ويفتح كرتونة جديدة للمنتج ده بشكل أوتوماتيكي!
- **البيانات المطلوبة (Body):**
```json
{
  "orderId": "...",
  "depositAmount": 50.0
}
```

---

## 6. سير العمل المقترح (Workflow Summary)

### رحلة المستخدم (User Journey):
1. المستخدم يفتح الموقع يشوف الكراتين والعداد (عن طريق `GET /api/public/cartons`).
2. يقرر يشتري، فيدخل يملأ فورم الشراء (عن طريق `POST /api/public/orders`).
3. بعد ما يشتري بيظهر له كود الإحالة الخاص بيه `PersonalReferralCode` وبيتقاله "حول العربون عشان يتأكد حجزك".
4. بيعمل حساب (أو بيسجل دخول لو عامل حساب) عن طريق `POST /api/auth/customer/register` عشان يتابع الـ Dashboard.
5. في الـ Dashboard بيشوف أوردراته وحالتها "في انتظار العربون".

### رحلة الأدمن (Admin Journey):
1. الأدمن بيفتح لوحة التحكم الخاصة به ويسجل دخول.
2. بيراجع قائمة الأوردرات المعلقة اللي أصحابها حولوا الفلوس (Vodafone Cash مثلاً).
3. بيضغط "تأكيد الدفع" (عن طريق `confirm-deposit`).
4. تلقائياً العداد في صفحة المستخدمين بيزيد +1، وتلقائياً الخصومات بتنزل للناس اللي دعوا بعض.

---
*تم إنشاء هذا الملف آلياً ليكون دليلك الشامل عند البدء في بناء الـ Frontend.*
