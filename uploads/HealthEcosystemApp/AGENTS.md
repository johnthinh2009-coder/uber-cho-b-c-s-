# Haven — agent notes

Expo SDK 57 · Expo Router (router root `src/app`) · React 19.2 · RN 0.86 · Reanimated 4.5 · TypeScript 6 (strict) · Zustand 5.

Read the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before using an unfamiliar API.

## Rules that keep the build green

- Import navigation from `expo-router` only: `Tabs` from `expo-router/js-tabs`, `Stack`/`Link`/`useRouter` from `expo-router`, theme types from `expo-router/react-navigation`. Never import `@react-navigation/*` in app code (SDK 56+).
- React Compiler is on. Mutate Reanimated shared values with `.set()` / read with `.get()`; never `.value =` in components. Don't call `setState` synchronously inside `useEffect` — put async loading in a Zustand store action instead.
- Zustand selectors must return stable references (a slice), never a freshly built array/object; derive in `useMemo`.
- Never nest pressables (a `Button` inside a pressable card). Make the tap surface and the CTA siblings.
- Typed routes are on: run `npx expo start` once so `.expo/types/router.d.ts` exists before `npm run typecheck`.
- `@testing-library/react-native` v14: `await render(...)`; Reanimated tests need the worklets resolver already configured in `package.json`.
- Keep brand strings in `src/theme/brand.ts`, colours in `src/theme/colors.ts`, image URLs in `src/mocks/images.ts`.
- The product is Vietnamese-first (vi-VN). Every user-facing string goes through `src/i18n` (`useI18n().t()` in components, `t()`/`tLabel()` elsewhere); never hard-code English UI text. Enum keys stay English in code and are displayed via `labels.*`. Money via `formatMoney` (`1.000.000 ₫`), dates via `src/utils/date.ts` (24h, day-first), names via `fullName()`/`providerDisplayName()` (family name first). Demo content in `src/mocks` is written in Vietnamese with Thành phố Hồ Chí Minh locations.
- Care is a home-healthcare marketplace, not a doctor-only app. Professionals are `Provider`s with a `ProviderRole` (`src/domain/provider.ts`: bác sĩ đa khoa/chuyên khoa, điều dưỡng, VLTL, PHCN, cơ xương khớp, chăm sóc người cao tuổi, chăm sóc sau điều trị, dinh dưỡng, sức khoẻ tinh thần). Always show the role explicitly (`providerRoleLabel`/`providerRoleShortLabel`); never call a non-doctor "bác sĩ". The professional side is **Provider Mode** (`AppRole = 'provider'`, routes under `src/app/(provider)`); use "chuyên gia y tế" wording, not "bác sĩ", unless the flow is doctor-specific.
- **This is a phone app, never a website.** `MobileShell` (`src/components/app/mobile-shell.tsx`) clamps the whole app to a 430pt column centred on a grey canvas on web; never remove it or let a screen stretch full-width on desktop.
- Four tabs per mode, each its own route: patient `home / services / activity / account` under `src/app/(patient)`, Provider Mode `dashboard / schedule / summary / profile` under `src/app/(provider)`. The bar is a floating white pill (`src/components/navigation/tab-bar.tsx`).
- Visual system: black / white / grey plus ONE health accent (`colors.accent`, deep green) for verified, progress and confirmations. Primary buttons are black. No pillar colours, no gradients, no hero banners, no promo badges.
- Typography is system font only (`src/theme/typography.ts`, `fontFamily` undefined on native): `pageTitle` 34 for the one screen title, `section` 22, body 15–17, nothing below 12pt. Check Vietnamese wrapping on 375pt screens (`numberOfLines` + `minHeight`).
- No "coming soon" placeholders. If a screen is linked, it is built; if it is not built, nothing links to it.
- **Every visible primary action must actually work**, backed by a persisted Zustand store (`src/store/*-store.ts` + AsyncStorage): auth, family, food log, medication reminders, routines/workouts, chat, wallet. Never ship a static button.
- **No customer-facing prices anywhere** – this is an ecosystem, not a price menu. Nutrition metrics (kcal, g, macros) are the opposite: keep them prominent. Provider-side screens report workload, not money.
- A normal consumer is **Khách hàng / bạn**, never "bệnh nhân"; medical wording belongs only inside a care encounter.
- Auth is the entry point: role picker → customer sign-in/sign-up (guest browsing allowed) or provider multi-step application → pending approval. Writes are gated behind `useGuestGate()`.
- `/fitness` is a standalone DARK sub-app (its own `ThemeProvider initialPreference="dark"` + 3 internal tabs). The rest of the app stays light.
- Horizontal rows must use `<HScroll>` (flexGrow 0 so they hug their content, visible scrollbar on web). A raw horizontal `ScrollView` in a column parent stretches and centres its chips.
- Lists start at the top (`justifyContent: 'flex-start'`); never vertically centre a single result.
- Medication alarms are simulated in-app (`ReminderWatcher` + toast). Do not add native push libraries – they break the web build and cannot fire in Expo Go.
- Calm healthcare tone: no promotional badges, countdowns, "hot deal" copy or salesy CTAs. Questionnaire = matching only (never diagnoses); prescriptions = doctor-authored only (`Provider.canPrescribe`, `PRESCRIBING_ROLES`); commission never shown on customer screens.

## Checks

`npm run typecheck && npm run lint && npm test && npm run doctor`
