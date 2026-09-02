import type { Conversation, Message } from '@/domain';
import { atDayOffset, minutesFromNow } from '@/utils/date';

import { IMAGES } from './images';

const msg = (
  conversationId: string,
  id: string,
  senderId: string,
  text: string,
  createdAt: string,
  kind: Message['kind'] = 'text',
  meta?: Message['meta'],
): Message => ({ id, conversationId, senderId, kind, text, createdAt, status: 'read', meta });

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-thu-ha',
    careRequestId: 'care-past-001',
    participants: [
      { id: 'person-minh-anh', name: 'Nguyễn Minh Anh', avatarUrl: IMAGES.people.minhAnh, role: 'patient' },
      { id: 'prov-thu-ha', name: 'BS. Nguyễn Thu Hà', avatarUrl: IMAGES.providers.thuHa, role: 'provider', subtitle: 'Bác sĩ đa khoa' },
    ],
    unreadCount: 1,
    updatedAt: minutesFromNow(-42),
    messages: [
      msg('conv-thu-ha', 'm1', 'system', 'Đã hoàn thành khám tại nhà', atDayOffset(-1, '16:05'), 'visit', {
        title: 'Đã khám xong',
        subtitle: 'Hôm qua lúc 16:05 · Đã có tóm tắt buổi khám',
        href: '/care/visit/care-past-001/summary',
      }),
      msg('conv-thu-ha', 'm2', 'prov-thu-ha', 'Chào anh Minh Anh, cảm ơn anh hôm nay. Tôi đã gửi tóm tắt buổi khám và đơn montelukast để hỗ trợ anh trong mùa phấn hoa. Anh tiếp tục dùng thuốc hít như trước nhé.', atDayOffset(-1, '16:20')),
      msg('conv-thu-ha', 'm3', 'person-minh-anh', 'Cảm ơn bác sĩ, rất hữu ích ạ. Em uống thuốc cùng bữa ăn được không?', atDayOffset(-1, '18:02')),
      msg('conv-thu-ha', 'm4', 'prov-thu-ha', 'Uống lúc nào cũng được, tốt nhất là buổi tối, hướng dẫn có sẵn trong ứng dụng. Nếu thấy gì bất thường trong vài ngày tới, anh nhắn tôi nhé.', minutesFromNow(-42)),
    ],
  },
  {
    id: 'conv-ngoc-mai',
    participants: [
      { id: 'person-minh-anh', name: 'Nguyễn Minh Anh', avatarUrl: IMAGES.people.minhAnh, role: 'patient' },
      { id: 'prov-ngoc-mai', name: 'BS. Trần Ngọc Mai', avatarUrl: IMAGES.providers.ngocMai, role: 'provider', subtitle: 'Bác sĩ nhi · Hoàng Nam' },
    ],
    unreadCount: 0,
    updatedAt: atDayOffset(-2, '09:40'),
    messages: [
      msg('conv-ngoc-mai', 'm5', 'system', 'Đã xác nhận lịch hẹn', atDayOffset(-4, '16:30'), 'appointment', {
        title: 'Khám định kỳ cho Hoàng Nam',
        subtitle: 'Thứ sáu lúc 10:00 · Khám tại nhà',
        href: '/care/appointments',
      }),
      msg('conv-ngoc-mai', 'm6', 'prov-ngoc-mai', 'Chào anh! Bé Hoàng Nam dùng thuốc dị ứng thế nào rồi ạ? Bé có buồn ngủ không?', atDayOffset(-2, '09:10')),
      msg('conv-ngoc-mai', 'm7', 'person-minh-anh', 'Bé dễ chịu hơn nhiều rồi bác sĩ, cảm ơn bác. Nhà em chưa thấy bé buồn ngủ gì cả.', atDayOffset(-2, '09:40')),
    ],
  },
  {
    id: 'conv-support',
    participants: [
      { id: 'person-minh-anh', name: 'Nguyễn Minh Anh', avatarUrl: IMAGES.people.minhAnh, role: 'patient' },
      { id: 'support', name: 'Đội ngũ Haven', avatarUrl: IMAGES.people.support, role: 'support', subtitle: 'Hỗ trợ' },
    ],
    unreadCount: 0,
    updatedAt: atDayOffset(-6, '12:15'),
    messages: [
      msg('conv-support', 'm8', 'support', 'Chào mừng anh Minh Anh đến với Gói Gia đình. Anh có thể đặt bác sĩ cho chị Gia Hân, bé Hoàng Nam và bà Lan ngay tại mục Chăm sóc. Cần gì anh cứ nhắn chúng tôi nhé.', atDayOffset(-6, '12:15')),
    ],
  },
];

/** Threads as seen from BS. Nguyễn Thu Hà's side in Doctor Mode. */
export const PROVIDER_CONVERSATIONS: Conversation[] = [
  {
    id: 'pconv-minh-anh',
    participants: [
      { id: 'prov-thu-ha', name: 'BS. Nguyễn Thu Hà', avatarUrl: IMAGES.providers.thuHa, role: 'provider' },
      { id: 'person-minh-anh', name: 'Nguyễn Minh Anh', avatarUrl: IMAGES.people.minhAnh, role: 'patient', subtitle: 'Bệnh nhân · Khám tại nhà hôm qua' },
    ],
    unreadCount: 0,
    updatedAt: minutesFromNow(-42),
    messages: [
      msg('pconv-minh-anh', 'pm1', 'prov-thu-ha', 'Chào anh Minh Anh, cảm ơn anh hôm nay. Tôi đã gửi tóm tắt buổi khám và đơn montelukast để hỗ trợ anh trong mùa phấn hoa. Anh tiếp tục dùng thuốc hít như trước nhé.', atDayOffset(-1, '16:20')),
      msg('pconv-minh-anh', 'pm2', 'person-minh-anh', 'Cảm ơn bác sĩ, rất hữu ích ạ. Em uống thuốc cùng bữa ăn được không?', atDayOffset(-1, '18:02')),
      msg('pconv-minh-anh', 'pm3', 'prov-thu-ha', 'Uống lúc nào cũng được, tốt nhất là buổi tối, hướng dẫn có sẵn trong ứng dụng. Nếu thấy gì bất thường trong vài ngày tới, anh nhắn tôi nhé.', minutesFromNow(-42)),
    ],
  },
  {
    id: 'pconv-quang',
    participants: [
      { id: 'prov-thu-ha', name: 'BS. Nguyễn Thu Hà', avatarUrl: IMAGES.providers.thuHa, role: 'provider' },
      { id: 'patient-quang', name: 'Phạm Minh Quang', avatarUrl: IMAGES.people.patient2, role: 'patient', subtitle: 'Bệnh nhân · Khám lúc 15:00' },
    ],
    unreadCount: 2,
    updatedAt: minutesFromNow(-15),
    messages: [
      msg('pconv-quang', 'pm4', 'system', 'Đã xác nhận lịch khám', atDayOffset(0, '08:30'), 'appointment', {
        title: 'Khám tại nhà · Phạm Minh Quang',
        subtitle: 'Hôm nay lúc 15:00 · Quận 10',
      }),
      msg('pconv-quang', 'pm5', 'patient-quang', 'Chào bác sĩ, mã cổng là 4471. Bác bấm chuông bên trái giúp em ạ.', minutesFromNow(-20)),
      msg('pconv-quang', 'pm6', 'patient-quang', 'Mẹ em cũng sẽ có mặt lúc khám, nếu bác sĩ không phiền.', minutesFromNow(-15)),
    ],
  },
  {
    id: 'pconv-hanh',
    participants: [
      { id: 'prov-thu-ha', name: 'BS. Nguyễn Thu Hà', avatarUrl: IMAGES.providers.thuHa, role: 'provider' },
      { id: 'patient-hanh', name: 'Lê Thị Hạnh', avatarUrl: IMAGES.people.patient3, role: 'patient', subtitle: 'Bệnh nhân · Tái khám' },
    ],
    unreadCount: 0,
    updatedAt: atDayOffset(-1, '19:30'),
    messages: [
      msg('pconv-hanh', 'pm7', 'patient-hanh', 'Thuốc bôi mới hiệu quả lắm bác sĩ ơi, em cảm ơn nhiều.', atDayOffset(-1, '19:10')),
      msg('pconv-hanh', 'pm8', 'prov-thu-ha', 'Tin vui quá chị Hạnh. Chị tiếp tục bôi ngày hai lần cho đủ hai tuần nhé.', atDayOffset(-1, '19:30')),
    ],
  },
];
