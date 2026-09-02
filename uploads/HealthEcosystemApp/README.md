# Haven — ứng dụng hệ sinh thái sức khoẻ (bản demo frontend)

A calm, image-led **Vietnamese-first** mobile frontend for a connected health ecosystem built around **dịch vụ y tế / chăm sóc sức khoẻ tại nhà**: **Chăm sóc** (bác sĩ, điều dưỡng, vật lý trị liệu, phục hồi chức năng, chăm sóc người cao tuổi, dinh dưỡng, sức khoẻ tinh thần – tại nhà), **Dinh dưỡng**, **Thuốc**, **Vận động** and **Gia đình** in one app. Built with Expo SDK 57, Expo Router and strict TypeScript, running in **Expo Go**.

> **Status:** Home design checkpoint, localized for Vietnam (vi-VN) and refined into a broader home-healthcare platform (Care = marketplace of healthcare professionals, not only doctors). The foundation (design system, navigation, i18n, provider model + matching, mock data, service layer, stores) and the Home screen are complete. Every Home button lands on a real route; the deeper pillar flows are Vietnamese placeholder screens that describe what they will contain and are built next.

## Chạy thử trên điện thoại (Expo Go)

1. Install dependencies (first time only):

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Install **Expo Go** on your phone (App Store / Google Play), then scan the QR code printed in the terminal:
   - **iPhone:** open the Camera app and tap the banner.
   - **Android:** open Expo Go and tap *Scan QR code*.

4. The app opens in Expo Go on the phone. Shake the phone (or press `r` in the terminal) to reload after changes.

If the phone cannot reach your computer over Wi-Fi (different network, VPN, firewall), use a tunnel:

```bash
npx expo start --tunnel
```

The web target also works (`w` in the terminal) but is optional — the product is a native iOS/Android app.

### Tài khoản demo (development only)

The app ships with a role switch so both sides of the marketplace can be demonstrated in one session. It is **not authentication** and is removed before release.

| Vai trò                  | Tài khoản         | Cách mở                                                                   |
| ------------------------ | ----------------- | ------------------------------------------------------------------------- |
| Bệnh nhân                | Nguyễn Minh Anh   | Mặc định                                                                  |
| Chuyên gia y tế (bác sĩ) | BS. Nguyễn Thu Hà | Tab **Tài khoản** → *Chuyển tài khoản demo* (or route `/dev/role-switch`) |

**Provider Mode** is the professional side for every role on the platform (bác sĩ, điều dưỡng, chuyên viên VLTL/PHCN, chuyên gia dinh dưỡng, …). Doctor-specific flows such as prescriptions stay restricted to doctors (`Provider.canPrescribe`, `PRESCRIBING_ROLES`).

## Quality checks

```bash
npm run typecheck   # tsc --noEmit (strict, typed routes, noUncheckedIndexedAccess)
npm run lint        # expo lint (eslint-config-expo + React Compiler rules)
npm test            # jest-expo + @testing-library/react-native
npm run doctor      # npx expo-doctor
```

## Localization (vi-VN by default)

- All user-facing UI text lives in `src/i18n/vi.ts`; `src/i18n/en.ts` mirrors the structure and falls back to Vietnamese for missing keys. Components use `useI18n().t('key')`; non-React code uses `t()` / `tLabel()` from `src/i18n`.
- Enum-like values (relationships, care categories, visit states, dietary labels, difficulty, equipment…) keep English keys in code and are displayed through `labels.*` in the dictionary via helpers such as `relationshipLabel()`, `careStatusLabel()`, `dietaryLabel()`.
- Dates/times: `src/utils/date.ts` (24-hour clock, `Chủ nhật, 23 tháng 8`, `23/8`, `Hôm nay, 15:00`).
- Money: `src/utils/format.ts` → `1.000.000 ₫`, decimals with a comma (`4,9`, `1,2 km`).
- Names follow Vietnamese order (`Nguyễn Minh Anh`, `BS. Nguyễn Thu Hà`, `ĐD. Võ Lan Anh`) via `fullName()` / `providerDisplayName()`; professional prefixes (BS., BS.CKI, BS.CKII, ThS.BS, ĐD., KTV., CV., CG., NV.) are fictional demo data.
- Demo content (people, healthcare professionals, kitchens, Vietnamese meals, park/tai-chi programs, addresses in Thành phố Hồ Chí Minh) is written directly in Vietnamese in `src/mocks/` — in production this comes from the backend, localized server-side.

## Architecture

```text
src/
  app/              Expo Router routes only (src/app is the router root)
    (customer)/     Customer tabs: home · services · activity · account
    auth/           Role picker, customer sign-in/up, provider application
    (provider)/     Provider tabs: dashboard · schedule · summary · profile
    care/providers  provider/[id]  food/ fitness/ medication/ account/ search dev/
  features/         Screen bodies + private components, one folder per feature
  components/       Reusable UI (ui/, cards/, navigation/, feedback/)
  domain/           Types and pure logic (provider roles + care service types, care state machine, settlement maths)
  i18n/             vi.ts (default), en.ts, typed t()/useI18n()
  mocks/            Fictional demo data (people, providers, care services, meals, programs, …)
  services/         Repository interfaces + in-memory mock implementations
  store/            Persisted Zustand stores + AsyncStorage (auth, family, food-log, reminders, gym, chat, wallet, activity, care, toast)
  theme/            Brand, colours (pillar palette), typography, spacing, ThemeProvider
  utils/            Formatting, dates, haptics
```

**Swapping in a backend:** implement the interfaces in `src/services/repositories.ts` and register them in `src/services/index.ts`. Screens and stores never import mock data for behaviour.

**Branding:** `src/theme/brand.ts` (name, wordmark, tagline, currency, market) and `src/theme/colors.ts`. Icons are generated placeholders in `assets/images`.

**Imagery:** all demo photos are Unsplash images referenced from `src/mocks/images.ts`, chosen to feel local (Vietnamese food, TP.HCM parks and markets, multi-generational families, home-care scenes) and requested at consistent ratios (4:5 portraits, 4:3 tiles, 16:10 banners) with a blurhash placeholder and an icon fallback.

**Care marketplace:** `src/domain/provider.ts` defines `ProviderRole` and `CareServiceType`; `careServiceRoles` says which professions may deliver each service and `scoreProvider()` in `src/services/mock/mock-provider-repository.ts` ranks professionals for a request (service type first, then concern category, availability, distance, language, patient age). Matching only – it never diagnoses.

## Design language

- **Phone-first shell.** On web the app is clamped to a 430pt column centred on a grey canvas (`MobileShell`), so it is always reviewed as a mobile app.
- Black / white / grey with one health accent (deep green) for verified professionals, progress and confirmations. Primary actions are black. No pillar colours, gradients, hero banners or promotional badges.
- System font only (SF Pro / Roboto / system-ui), weight-based scale in `src/theme/typography.ts`: 34pt screen titles, 22pt sections, 15–17pt body, nothing under 12pt; 44pt targets; Vietnamese wrapping checked on narrow screens.
- Four bottom tabs per mode — Trang chủ · Dịch vụ · Hoạt động · Tài khoản (customer), Trang chủ · Lịch · Tổng kết · Tài khoản (Provider Mode) — each one a separate route. The workout module at /fitness is a standalone dark sub-app with its own three tabs.
- The Home **Hôm nay** spine merges medication, workouts, visits and food orders into one timeline — the ecosystem made visible.

## Healthcare safety rules baked in

- **The app is free and shows no prices at all.** It is an ecosystem, not a price menu: healthcare services, professionals, restaurants and dishes are presented without cost. Nutrition metrics (calories and macros) stay prominent.
- The health information form exists only to match a suitable professional for the chosen service; nothing in the app diagnoses.
- Prescriptions are doctor-authored only (nurses, therapists and other professionals cannot prescribe); the app never suggests dosage changes.
- Platform commission is settled from the provider share and is never shown on customer screens.
- All health data, people and credentials are fictional demo data.
