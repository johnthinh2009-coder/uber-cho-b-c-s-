/**
 * Central registry of demo imagery.
 *
 * All remote images are Unsplash photos referenced by ID (verified to resolve
 * and reviewed for subject). Imagery favours Việt Nam: Vietnamese families,
 * elders, parks in Thành phố Hồ Chí Minh, and Vietnamese dishes. Keeping them
 * here means swapping to bundled or CDN assets later is a one-file change.
 */

type ImageOptions = {
  width?: number;
  height?: number;
  /** Unsplash crop focus – use `faces` for portraits. */
  crop?: 'faces' | 'entropy' | 'center' | 'edges';
  quality?: number;
};

export function unsplash(id: string, options: ImageOptions = {}): string {
  const { width = 900, height, crop = 'entropy', quality = 75 } = options;
  const params = new URLSearchParams({
    w: String(width),
    q: String(quality),
    auto: 'format',
    fit: 'crop',
    crop,
  });
  if (height) params.set('h', String(height));
  return `https://images.unsplash.com/${id}?${params.toString()}`;
}

const portrait = (id: string, size = 700) => unsplash(id, { width: size, height: Math.round(size * 1.25), crop: 'faces' });
const square = (id: string, size = 700) => unsplash(id, { width: size, height: size, crop: 'faces' });
const wide = (id: string, width = 1200) => unsplash(id, { width, height: Math.round(width * 0.66) });
const hero = (id: string, width = 1200) => unsplash(id, { width, height: Math.round(width * 0.8) });

export const IMAGES = {
  providers: {
    thuHa: portrait('photo-1757125736482-328a3cdd9743'),
    minhTuan: portrait('photo-1622902046580-2b47f47f5471'),
    vanHung: portrait('photo-1580281658626-ee379f3cce93'),
    ngocMai: portrait('photo-1734002886107-168181bcd6a1'),
    thuTrang: portrait('photo-1573496799652-408c2ac9fe98'),
    lanAnh: portrait('photo-1612277795421-9bc7706a4a34'),
    ducAnh: portrait('photo-1542909168-82c3e7fdca5c'),
    hongNhung: portrait('photo-1559185590-765cdc663325'),
    quangHuy: portrait('photo-1611403119860-57c4937ef987'),
    thuThao: portrait('photo-1623764410283-b45aeaacfd5c'),
    khanhLinh: portrait('photo-1768542920419-d4f9c631a1bf'),
    haiYen: portrait('photo-1724079495338-ad0dd3966237'),
    quocBao: portrait('photo-1540569014015-19a7be504e3a'),
  },
  care: {
    doctorsInPark: hero('photo-1640667600157-c80d11edc0b9'),
    nurseVaccination: hero('photo-1612277795421-9bc7706a4a34'),
    physiotherapy: hero('photo-1559185590-765cdc663325'),
    backTherapy: hero('photo-1719123592776-621ac28b3133'),
    caregiverElder: hero('photo-1623764410283-b45aeaacfd5c'),
    elderlyCoupleLaughing: hero('photo-1625725764771-663bbc578f2e'),
    elderlyCoupleSitting: hero('photo-1644379911960-2d66cb3e4396'),
    smilingElder: hero('photo-1526795443948-005b48ce4791'),
    elderInChair: hero('photo-1651117860079-d59586c1525f'),
    doctorWithPatient: hero('photo-1631217868264-e5b90bb7e133'),
    bloodPressure: hero('photo-1631815589968-fdb09a223b1e'),
    tastingFood: hero('photo-1771339140216-8ecb4e490ba7'),
    calmParkPath: hero('photo-1777736485562-8bc170408136'),
    pharmacist: wide('photo-1580281657527-47f249e8f4df'),
  },
  people: {
    minhAnh: square('photo-1507003211169-0a1dd7228f2d'),
    giaHan: square('photo-1548142813-c348350df52b'),
    hoangNam: square('photo-1596870230751-ebdfce98ec42'),
    baLan: square('photo-1651117860079-d59586c1525f'),
    reviewer1: square('photo-1514315384763-ba401779410f', 200),
    reviewer2: square('photo-1540569014015-19a7be504e3a', 200),
    reviewer3: square('photo-1534528741775-53994a69daeb', 200),
    reviewer4: square('photo-1548142813-c348350df52b', 200),
    reviewer5: square('photo-1611403119860-57c4937ef987', 200),
    reviewer6: square('photo-1634089916298-9fa27180526c', 200),
    reviewer7: square('photo-1726067438466-df7db360f4e3', 200),
    reviewer8: square('photo-1507003211169-0a1dd7228f2d', 200),
    patient1: square('photo-1514315384763-ba401779410f', 300),
    patient2: square('photo-1540569014015-19a7be504e3a', 300),
    patient3: square('photo-1726067438478-7dd7a4dfcab4', 300),
    patient4: square('photo-1542909168-82c3e7fdca5c', 300),
    patient5: square('photo-1774094135149-bbeeb1767bfa', 300),
    patient6: square('photo-1596870230751-ebdfce98ec42', 300),
    patient7: square('photo-1611403119860-57c4937ef987', 300),
    support: square('photo-1734002886107-168181bcd6a1', 300),
  },
  family: {
    motherWithKids: hero('photo-1586865972793-c07ba4785d85'),
    dinnerTable: hero('photo-1576089073624-b5751a8f4de9'),
    dadDaughterScooter: hero('photo-1686930204073-d542d340a305'),
    motherWithBaby: hero('photo-1639832060243-442b6125f18c'),
    girlsLaughing: hero('photo-1729095181716-67c05e26bc94'),
    kidsLaughing: hero('photo-1488521787991-ed7bbaae773c'),
    kindergarten: wide('photo-1587616211892-f743fcca64f9'),
    elderlyCouple: hero('photo-1625725764771-663bbc578f2e'),
  },
  food: {
    phoBo: square('photo-1597345637412-9fd611e758f3'),
    bunBoHue: square('photo-1573555957315-723d970bcdde'),
    bunCha: square('photo-1583316175701-0bc5f25a0a44'),
    goiCuonTom: square('photo-1560162071-da4c4a91077a'),
    goiCuonChay: square('photo-1594020293008-5f99f60bd4d7'),
    huTieuGa: square('photo-1509072619873-adb3dc289b50'),
    miQuang: square('photo-1657812538913-1da9218af26b'),
    bunThitNuong: square('photo-1718942900279-4711345169d3'),
    comGaoLutCaHoi: square('photo-1546069901-ba9599a7e63c'),
    comGaoLutGa: square('photo-1597215753169-e717ab0acbe5'),
    comGaXe: square('photo-1601002357064-e43894c23107'),
    thitKho: square('photo-1628997323766-c846909a7049'),
    banhCuon: square('photo-1669340781012-ae89fbac9fc3'),
    banhMiGa: square('photo-1715925717150-2a6d181d8846'),
    chaGioNuong: square('photo-1695712641388-87c0f9c2d36e'),
    bunChayRauCu: square('photo-1631709497146-a239ef373cf1'),
    bunRieu: square('photo-1527997921830-de1cf1f9b430'),
    goiCuonPeanut: square('photo-1734771308348-ad90bf5835ec'),
    bowlCauVong: square('photo-1512621776951-a57141f2eefd'),
    saladRauNuong: square('photo-1540189549336-e6e99c3679fe'),
    supBiDo: square('photo-1476718406336-bb5a9690ee2a'),
    traiCayNhietDoi: square('photo-1575295154380-6f5aa4f9acf1'),
    suaChuaDau: square('photo-1488477181946-6428a0291777'),
    bowlRauTraiCay: square('photo-1569246294372-ed319c674f14'),
    dauHuXao: square('photo-1604908176997-125f25cc6f3d'),
    vegetableVendor: wide('photo-1495118616717-6816692b9430'),
    marketConicalHats: wide('photo-1496310646944-3203203f09bb'),
    marketGreens: wide('photo-1603519203402-fa71f28d31ce'),
    fruitStand: wide('photo-1717337136050-1ab1a7c0d2ba'),
    familyMeal: hero('photo-1641440615059-42c8ed3af8c8'),
    dishesOverhead: wide('photo-1699670425934-b30d13e63fea'),
    saladBar: wide('photo-1498837167922-ddd27525d352'),
  },
  fitness: {
    taiChiElder: hero('photo-1774618623680-c2286dd71734'),
    taiChiGroup: hero('photo-1777476588700-b68e11850fca'),
    parkWomenExercise: hero('photo-1758798458635-f01402b40919'),
    parkMenStretch: hero('photo-1617293378985-d7fae23773b0'),
    parkPath: hero('photo-1777736485562-8bc170408136'),
    parkStatue: hero('photo-1778057522218-17917e14eb80'),
    parkRoad: hero('photo-1604883555768-e39e7efae702'),
    elderCycling: hero('photo-1755355679385-ac2acfdb14b8'),
    trailRun: hero('photo-1486218119243-13883505764c'),
    stairsShoes: hero('photo-1476480862126-209bfaa8edc8'),
    sunsetMeditation: hero('photo-1506126613408-eca07ce68773'),
    deadlift: hero('photo-1517836357463-d25dfeac3438'),
    pilatesClass: hero('photo-1518611012118-696072aa579a'),
    rowing: hero('photo-1519505907962-0a6cb0167c73'),
    pullUps: hero('photo-1526506118085-60ce8714f8c5'),
    stairRun: hero('photo-1538805060514-97d9cc17730c'),
    squatRack: hero('photo-1541534741688-6078c6bfb5c5'),
    yogaSilhouette: hero('photo-1544367567-0f2fcb009e0b'),
    groupPlank: hero('photo-1549576490-b0b4831ef60a'),
    dumbbellsPink: hero('photo-1558017487-06bf9f82613a'),
    gobletSquat: hero('photo-1567598508481-65985588e295'),
    sitUps: hero('photo-1571019613454-1cb2f99b2d8b'),
    cableRow: hero('photo-1571388208497-71bedc66e932'),
    yogaPose: hero('photo-1575052814086-f385e2e2ad1b'),
    pushUpDumbbells: hero('photo-1594737625785-a6cbdabd333c'),
    pushUpGym: hero('photo-1598971639058-fab3c3109a00'),
    battleRopes: hero('photo-1599058917212-d750089bc07e'),
    kettlebell: hero('photo-1601422407692-ec4eeec1d9b3'),
    gymInterior: hero('photo-1593079831268-3381b0db4a77'),
    tyingShoes: hero('photo-1483721310020-03333e577078'),
    barbellOverhead: hero('photo-1508215885820-4585e56135c8'),
  },
  medication: {
    blisterPacksBlue: hero('photo-1584308666744-24d5c474f2ae'),
    pillsOnBlue: hero('photo-1628771065518-0d82f1938462'),
    blisterOrange: hero('photo-1585435557343-3b092031a831'),
    capsules: hero('photo-1587854692152-cbe660dbde88'),
  },
  city: {
    saigonSkylineTrees: wide('photo-1594128975006-24e630d06564'),
    parkPath: wide('photo-1777736485562-8bc170408136'),
    parkStatue: wide('photo-1778057522218-17917e14eb80'),
  },
  wellness: {
    mountainLake: wide('photo-1470770841072-f978cf4d019e'),
    forestBridge: wide('photo-1447752875215-b2761acb3c5d'),
  },
} as const;

/** Neutral blurhash used as a placeholder while remote images load. */
export const PLACEHOLDER_BLURHASH = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';
