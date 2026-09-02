import type { PaymentMethod, Plan, PlanBenefit, Subscription } from '@/domain';
import { atDayOffset } from '@/utils/date';

import { IMAGES } from './images';

export const PLANS: Plan[] = [
  {
    id: 'personal',
    name: 'Gói Cá nhân',
    headline: 'Trọn bộ cho một người',
    description: 'Bác sĩ khám tại nhà, ăn uống lành mạnh, nhắc uống thuốc và tập luyện – dành cho bạn.',
    monthlyPrice: 199_000,
    annualPrice: 1_990_000,
    memberCapacity: 1,
    heroUrl: IMAGES.fitness.tyingShoes,
    highlights: ['Ưu tiên ghép bác sĩ', 'Giá thành viên cho khám tại nhà', 'Miễn phí giao món từ 150.000 ₫'],
  },
  {
    id: 'family',
    name: 'Gói Gia đình',
    headline: 'Chăm sóc những người bạn yêu thương',
    description: 'Mọi quyền lợi của Gói Cá nhân, chia sẻ cho tối đa năm thành viên, quản lý tại một nơi.',
    monthlyPrice: 399_000,
    annualPrice: 3_990_000,
    memberCapacity: 5,
    heroUrl: IMAGES.family.motherWithKids,
    highlights: ['Tối đa 5 thành viên', 'Đặt bác sĩ cho bất kỳ thành viên nào', 'Lịch uống thuốc dùng chung', 'Tổng quan sức khoẻ gia đình'],
  },
];

export const PLANS_BY_ID: Record<string, Plan> = Object.fromEntries(PLANS.map((p) => [p.id, p]));

export const PLAN_BENEFITS: PlanBenefit[] = [
  { id: 'b1', label: 'Bác sĩ khám tại nhà', detail: 'Đặt bác sĩ và điều dưỡng đã xác minh đến tận nhà.', includedIn: ['personal', 'family'] },
  { id: 'b2', label: 'Giá thành viên', detail: 'Tiết kiệm ở mỗi lần khám tại nhà.', includedIn: ['personal', 'family'] },
  { id: 'b3', label: 'Ăn uống lành mạnh', detail: 'Món ăn đầy đủ thông tin dinh dưỡng từ các bếp uy tín.', includedIn: ['personal', 'family'] },
  { id: 'b4', label: 'Nhắc uống thuốc', detail: 'Lịch uống, lịch sử tuân thủ và đồng bộ đơn thuốc.', includedIn: ['personal', 'family'] },
  { id: 'b5', label: 'Thư viện tập luyện', detail: 'Chương trình cho mọi trình độ, tại nhà hoặc phòng gym.', includedIn: ['personal', 'family'] },
  { id: 'b6', label: 'Thành viên gia đình', detail: 'Thêm vợ/chồng, con, bố mẹ và người phụ thuộc.', includedIn: ['family'] },
  { id: 'b7', label: 'Chăm sóc người thân', detail: 'Đặt bác sĩ cho bất kỳ thành viên nào.', includedIn: ['family'] },
  { id: 'b8', label: 'Tổng quan gia đình', detail: 'Một màn hình cho lịch hẹn, thuốc và hoạt động.', includedIn: ['family'] },
];

export const SUBSCRIPTION: Subscription = {
  planId: 'family',
  billing: 'monthly',
  status: 'active',
  startedAt: atDayOffset(-140, '09:00'),
  renewsAt: atDayOffset(12, '09:00'),
  memberIds: ['person-minh-anh', 'person-gia-han', 'person-hoang-nam', 'person-ba-lan'],
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm-1', brand: 'Visa', last4: '4242', expiry: '09/28', isDefault: true },
  { id: 'pm-2', brand: 'Mastercard', last4: '8810', expiry: '03/27', isDefault: false },
];
