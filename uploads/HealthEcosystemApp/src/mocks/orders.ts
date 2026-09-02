import type { FoodOrder } from '@/domain';
import { computeSettlement } from '@/domain';
import { atDayOffset } from '@/utils/date';

export const FOOD_ORDERS: FoodOrder[] = [
  {
    id: 'order-1042',
    contractorId: 'ctr-bien-lanh',
    items: [{ mealId: 'meal-com-gao-lut-ca-hoi', name: 'Cơm gạo lứt cá hồi áp chảo', quantity: 2, unitPrice: 125_000 }],
    subtotal: 250_000,
    deliveryFee: 0,
    total: 250_000,
    status: 'preparing',
    placedAt: atDayOffset(0, '17:40'),
    etaLabel: 'Giao khoảng 18:30 – 18:45',
    addressLabel: 'Nhà riêng · 128/4 Nguyễn Đình Chiểu, Q.3',
    settlement: computeSettlement(250_000, 0.2, 'VND'),
  },
  {
    id: 'order-1031',
    contractorId: 'ctr-bep-xanh',
    items: [
      { mealId: 'meal-goi-cuon-chay', name: 'Gỏi cuốn chay', quantity: 1, unitPrice: 48_000 },
      { mealId: 'meal-bun-chay', name: 'Bún chay rau củ', quantity: 1, unitPrice: 48_000 },
    ],
    subtotal: 96_000,
    deliveryFee: 18_000,
    total: 114_000,
    status: 'delivered',
    placedAt: atDayOffset(-2, '12:10'),
    etaLabel: 'Đã giao lúc 12:48',
    addressLabel: 'Nhà riêng · 128/4 Nguyễn Đình Chiểu, Q.3',
    settlement: computeSettlement(96_000, 0.2, 'VND'),
  },
  {
    id: 'order-1019',
    contractorId: 'ctr-pho-sang',
    items: [{ mealId: 'meal-pho-bo-than', name: 'Phở bò thăn ít béo', quantity: 2, unitPrice: 65_000 }],
    subtotal: 130_000,
    deliveryFee: 15_000,
    total: 145_000,
    status: 'delivered',
    placedAt: atDayOffset(-5, '07:20'),
    etaLabel: 'Đã giao lúc 07:52',
    addressLabel: 'Nhà riêng · 128/4 Nguyễn Đình Chiểu, Q.3',
    settlement: computeSettlement(130_000, 0.2, 'VND'),
  },
];
