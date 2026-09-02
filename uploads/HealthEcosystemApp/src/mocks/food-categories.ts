import { IMAGES } from './images';

export type FoodCategory = {
  id: string;
  label: string;
  imageUrl: string;
  /** Matches meals by name so the filter always returns something real. */
  match: string[];
};

/** Circular category shortcuts on the food home, in the local vernacular. */
export const FOOD_CATEGORIES: FoodCategory[] = [
  { id: 'com', label: 'Cơm', imageUrl: IMAGES.food.comGaoLutGa, match: ['cơm'] },
  { id: 'pho-bun', label: 'Phở · Bún', imageUrl: IMAGES.food.phoBo, match: ['phở', 'bún', 'hủ tiếu', 'mì'] },
  { id: 'salad', label: 'Salad · Bowl', imageUrl: IMAGES.food.bowlCauVong, match: ['salad', 'bowl'] },
  { id: 'chay', label: 'Món chay', imageUrl: IMAGES.food.bunChayRauCu, match: ['chay', 'đậu hũ', 'rau'] },
  { id: 'cuon', label: 'Cuốn · Nhẹ', imageUrl: IMAGES.food.goiCuonTom, match: ['cuốn', 'gỏi'] },
  { id: 'canh', label: 'Canh · Súp', imageUrl: IMAGES.food.supBiDo, match: ['canh', 'súp'] },
  { id: 'trai-cay', label: 'Trái cây', imageUrl: IMAGES.food.traiCayNhietDoi, match: ['trái cây', 'sữa chua'] },
];
