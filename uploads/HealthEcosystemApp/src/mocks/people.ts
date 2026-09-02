import type { Address, FamilyMember, PatientProfile, ProviderProfile } from '@/domain';

import { IMAGES } from './images';

/**
 * Fictional demo people and addresses in Thành phố Hồ Chí Minh.
 * Street numbers are invented; districts and wards are real so the demo
 * feels local. Nobody here is a real person.
 */

export const HOME_ADDRESS: Address = {
  id: 'addr-home',
  label: 'Nhà riêng',
  line1: '128/4 Nguyễn Đình Chiểu',
  line2: 'Phường Võ Thị Sáu, Quận 3',
  city: 'Thành phố Hồ Chí Minh',
  postcode: '700000',
  approximateArea: 'Quận 3, gần Nguyễn Đình Chiểu',
  location: { latitude: 10.7797, longitude: 106.6898 },
};

export const PARENTS_ADDRESS: Address = {
  id: 'addr-parents',
  label: 'Nhà mẹ',
  line1: '45 Phan Xích Long',
  line2: 'Phường 2, Quận Phú Nhuận',
  city: 'Thành phố Hồ Chí Minh',
  postcode: '700000',
  approximateArea: 'Phú Nhuận, gần Phan Xích Long',
  location: { latitude: 10.7987, longitude: 106.6847 },
};

export const MINH_ANH: FamilyMember = {
  id: 'person-minh-anh',
  firstName: 'Minh Anh',
  lastName: 'Nguyễn',
  avatarUrl: IMAGES.people.minhAnh,
  dateOfBirth: '1990-04-12',
  relationship: 'self',
  statusLine: 'Đã uống 1/2 liều thuốc hôm nay',
  sharedConditions: ['Hen suyễn nhẹ'],
  allergies: ['Penicillin'],
  bloodType: 'O+',
};

export const GIA_HAN: FamilyMember = {
  id: 'person-gia-han',
  firstName: 'Gia Hân',
  lastName: 'Trần',
  avatarUrl: IMAGES.people.giaHan,
  dateOfBirth: '1992-11-02',
  relationship: 'partner',
  statusLine: 'Có buổi tập tối nay',
  sharedConditions: [],
  allergies: [],
  bloodType: 'A+',
};

export const HOANG_NAM: FamilyMember = {
  id: 'person-hoang-nam',
  firstName: 'Hoàng Nam',
  lastName: 'Nguyễn',
  avatarUrl: IMAGES.people.hoangNam,
  dateOfBirth: '2019-06-21',
  relationship: 'child',
  statusLine: 'Khám nhi với BS. Ngọc Mai vào thứ sáu',
  sharedConditions: ['Viêm mũi dị ứng theo mùa'],
  allergies: ['Đậu phộng'],
};

export const BA_LAN: FamilyMember = {
  id: 'person-ba-lan',
  firstName: 'Thị Lan',
  lastName: 'Lê',
  shortName: 'bà Lan',
  avatarUrl: IMAGES.people.baLan,
  dateOfBirth: '1954-02-08',
  relationship: 'parent',
  statusLine: 'Đến hạn kiểm tra huyết áp',
  sharedConditions: ['Tăng huyết áp', 'Thoái hoá khớp gối'],
  allergies: [],
  bloodType: 'B+',
};

export const FAMILY_MEMBERS: FamilyMember[] = [MINH_ANH, GIA_HAN, HOANG_NAM, BA_LAN];

export const PATIENT: PatientProfile = {
  ...MINH_ANH,
  email: 'minhanh.nguyen@example.com',
  phoneMasked: '+84 •••• ••• 482',
  addresses: [HOME_ADDRESS, PARENTS_ADDRESS],
  preferredLanguage: 'Tiếng Việt',
  family: FAMILY_MEMBERS,
};

export const PROVIDER: ProviderProfile = {
  id: 'person-thu-ha',
  providerId: 'prov-thu-ha',
  firstName: 'Thu Hà',
  lastName: 'Nguyễn',
  avatarUrl: IMAGES.providers.thuHa,
  dateOfBirth: '1986-09-17',
  title: 'BS.',
  role: 'doctor_general',
  expertise: 'Đa khoa · Y học gia đình',
  isOnline: true,
};
