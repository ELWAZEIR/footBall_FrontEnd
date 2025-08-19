# هيكل الكود - Code Architecture

## نظرة عامة على التقسيم الجديد

تم تقسيم الكود إلى أجزاء أصغر وأكثر تنظيماً لتحسين قابلية الصيانة وإعادة الاستخدام.

## المكونات الجديدة

### 1. Hooks مخصصة (Custom Hooks)

#### `useRegistrations.ts`
- يدير منطق التسجيلات
- يتعامل مع جلب البيانات وحفظها
- يحسب الإحصائيات

#### `useSubscriptions.ts`
- يدير منطق الاشتراكات
- يتعامل مع الاشتراكات المتأخرة
- يحسب إجمالي الدخل

#### `usePlayers.ts`
- يدير منطق اللاعبين
- يتعامل مع عمليات CRUD للاعبين

#### `useModal.ts`
- Hook مشترك لإدارة النوافذ المنبثقة
- يوفر وظائف `openModal`, `closeModal`, `toggleModal`

#### `useFilters.ts`
- Hook مشترك لإدارة الفلاتر والبحث
- يدير حالة البحث والفلاتر

### 2. مكونات مشتركة (Common Components)

#### `LoadingSpinner.tsx`
- مكون مشترك لعرض حالة التحميل
- يدعم أحجام مختلفة (sm, md, lg)

#### `EmptyState.tsx`
- مكون مشترك لعرض الحالة الفارغة
- قابل للتخصيص مع أيقونات وأزرار

### 3. مكونات النماذج (Form Components)

#### `RegistrationForm.tsx`
- نموذج مخصص للتسجيلات
- يتعامل مع اختيار اللاعبين وحالة الدفع

#### `SubscriptionForm.tsx`
- نموذج مخصص للاشتراكات
- يتعامل مع اختيار الشهر والمبلغ

#### `PlayerForm.tsx`
- نموذج مخصص للاعبين
- يتعامل مع البيانات الشخصية للاعب

## فوائد التقسيم الجديد

### 1. فصل المسؤوليات (Separation of Concerns)
- كل hook مسؤول عن منطق محدد
- المكونات منفصلة عن منطق الأعمال

### 2. إعادة الاستخدام (Reusability)
- المكونات المشتركة يمكن استخدامها في عدة أماكن
- Hooks يمكن مشاركتها بين الصفحات

### 3. قابلية الصيانة (Maintainability)
- كود أكثر تنظيماً وأسهل في الفهم
- تغييرات محلية لا تؤثر على باقي الكود

### 4. قابلية الاختبار (Testability)
- كل جزء يمكن اختباره بشكل منفصل
- منطق الأعمال منفصل عن واجهة المستخدم

## هيكل الملفات الجديد

```
src/
├── hooks/
│   ├── useRegistrations.ts
│   ├── useSubscriptions.ts
│   ├── usePlayers.ts
│   ├── useModal.ts
│   └── useFilters.ts
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── registration/
│   │   └── RegistrationForm.tsx
│   ├── subscriptions/
│   │   └── SubscriptionForm.tsx
│   └── players/
│       └── PlayerForm.tsx
└── pages/
    ├── RegistrationPage.tsx (محدث)
    ├── SubscriptionsPage.tsx (محدث)
    └── PlayersPage.tsx (محدث)
```

## كيفية استخدام المكونات الجديدة

### في الصفحات:
```typescript
import { useModal } from '../hooks/useModal';
import { useFilters } from '../hooks/useFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyPage = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const { filters, updateFilter } = useFilters();
  
  if (isLoading) return <LoadingSpinner />;
  
  // باقي الكود...
};
```

### في النماذج:
```typescript
import RegistrationForm from '../components/registration/RegistrationForm';

const MyModal = () => {
  return (
    <Modal>
      <RegistrationForm
        formData={formData}
        setFormData={setFormData}
        players={players}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
```

## المزايا الإضافية

1. **أداء محسن**: المكونات الصغيرة أسرع في التحديث
2. **ذاكرة أقل**: تحميل المكونات عند الحاجة فقط
3. **تطوير أسرع**: فريق العمل يمكنه العمل على أجزاء مختلفة
4. **أخطاء أقل**: منطق منفصل يقلل من التداخل

## التطوير المستقبلي

- إضافة المزيد من المكونات المشتركة
- إنشاء hooks للعمليات المشتركة الأخرى
- إضافة اختبارات وحدة لكل مكون
- تحسين الأداء باستخدام React.memo و useMemo
