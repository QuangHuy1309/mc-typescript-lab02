# MC-Lab02 — Library Pocket (Option 1) — Báo cáo nháp

> Bản nháp phần chữ. Bạn tự chụp ảnh E1–E9 (xem hướng dẫn cuối file) và chèn vào PDF.

## 1. Tài khoản demo
- Username: `reader01` — Password: `library2026` (chỉ dùng cho demo học tập)

## 2. Luồng
Login (`/login`) → My Library (`/library`) → Logout → Login. `/` redirect theo `user`.

## 3. Cây thư mục src/ (E2)
```
src/
├── app/            _layout.tsx (AuthProvider + Stack), index.tsx (Redirect), login.tsx, library.tsx (route guard)
├── components/     FormInput.tsx, AppButton.tsx
├── features/
│   ├── auth/       AuthContext.tsx, LoginScreen.tsx, types.ts, data/demoAccount.ts, services/authService.ts
│   └── library/    LibraryScreen.tsx, components/BookItem.tsx
└── constants/      theme.ts
```

## 4. Test cases (E10) — điền cột Actual sau khi chạy
| TC | Thao tác | Expected | Actual |
|---|---|---|---|
| TC01 | Username & password rỗng | "Please enter username and password." | |
| TC02 | Username đúng, password sai | "Invalid credentials.", ở lại Login | |
| TC03 | reader01 / library2026 | Chuyển sang My Library | |
| TC04 | Xem My Library | Avatar, tên, cardId, tier + 4 sách | |
| TC05 | Logout | Về Login, user = null | |
| TC06 | Mở /library khi chưa login | Redirect về /login | |
| TC07 | Bấm Login liên tục khi loading | Nút disable + ref chặn, chỉ 1 request | |
| TC08 | Reload app | Mất phiên (chỉ lưu trong memory) | |

## PHẦN 2 — Problem Solving

### 2.1 Login đúng nhưng màn hình đích báo "No active session"
- **Nguyên nhân**: `setUser(profile)` không chạy, hoặc màn hình dùng một context khác/ngoài Provider. Thường gặp: `AuthProvider` không bọc `Stack`, hoặc `login()` bị gọi nhưng LoginScreen dùng service trực tiếp (không qua context).
- **File**: `src/app/_layout.tsx`, `AuthContext.tsx`, `LoginScreen.tsx`.
- **Debug**: (1) `console.log("service result:", profile)` trong `login()`; (2) log `user` trong LibraryScreen; (3) kiểm tra `_layout.tsx` có `<AuthProvider><Stack/></AuthProvider>`.
- **Sửa**: đặt Provider phía trên Stack; LoginScreen gọi `useAuth().login`, không gọi service trực tiếp.
- **Test**: TC03 + TC04.

### 2.2 Lỗi "Property 'profile' does not exist"
- **Nguyên nhân**: `DEMO_ACCOUNT` được suy kiểu chỉ có `{username, password}`; service `return DEMO_ACCOUNT.profile` nên TypeScript báo thiếu thuộc tính.
- **File**: `data/demoAccount.ts`, `types.ts`, `authService.ts`.
- **Sửa**:
```ts
export const DEMO_ACCOUNT: { username: string; password: string; profile: MemberProfile } = {...};
export async function loginWithUsernamePassword(u: string, p: string): Promise<MemberProfile | null> {...}
```
- **Test**: `npx tsc --noEmit` pass.

### 2.3 Sai import sau khi di chuyển component
- `BookItem` chuyển sang `src/features/library/components/`. Import type: `../../auth/types` (lên 2 cấp tới `features/`, rồi vào `auth/types`). Import component ở screen: `./components/BookItem`. Với `src/components/` dùng `../../components/...` từ `features/<x>/`.
- Cách xác định: đếm số cấp thư mục từ file hiện tại tới đích; dùng `tsc --noEmit` hoặc gợi ý auto-import của VS Code để kiểm tra.

### 2.4 Logout nhưng vẫn vào lại được màn hình bảo vệ
- Dùng `router.push` sẽ giữ Login trong stack, nút Back quay lại màn hình cũ; `router.replace` thay route hiện tại nên không Back được.
- Deep link `/library` vẫn mở route, nên cần guard theo state:
```tsx
const { user } = useAuth();
if (!user) return <Redirect href="/login" />;
```
- Test: TC05 rồi TC06 (gõ trực tiếp /library trên web hoặc deep link).

### 2.5 Bấm Login liên tục / lỗi mạng giả lập
- Dùng `loading` để disable nút + `useRef` chặn bấm lặp (state cập nhật bất đồng bộ nên hai lần bấm sát nhau vẫn có thể lọt).
- `try { ... } catch { setError("Login failed...") } finally { setLoading(false) }` để luôn tắt loading kể cả khi Promise throw.
- Test: TC07.

### 2.6 Refactor làm hỏng chức năng
- Ví dụ lỗi: truyền `onChangeText={() => {}}` hoặc quên truyền `value` → input không cập nhật; quên `onPress` → nút không chạy.
- Kiểm tra: props khớp tên (`value`, `onChangeText`, `onPress`), callback thật sự gọi `setState`.
- Regression: TC01–TC07 sau mỗi bước tách component.

## PHẦN 3 — Interview (trả lời ngắn)

1. **View/Text/Pressable**: RN không có DOM; `View` ≈ div, `Text` bắt buộc cho chữ (không để chữ trần trong View), `Pressable` thay button/onClick, render ra component native.
2. **JSX**: cú pháp giống HTML trong JS, được biên dịch thành lời gọi tạo element; component trả JSX để mô tả UI theo state.
3. **Controlled TextInput**: giá trị do state quyết định: `value={username}` + `onChangeText={setUsername}`; gõ → cập nhật state → render lại.
4. **Event → setState → re-render**: gõ ký tự → `onChangeText` → `setUsername` → React render lại component với giá trị mới.
5. **secureTextEntry**: chỉ che ký tự trên UI. Password vẫn gửi/lưu như bình thường; bảo mật thật cần HTTPS, hash ở server.
6. **Local vs shared**: username/password/error/loading chỉ LoginScreen dùng (local); `user` nhiều màn hình cần (shared, AuthContext).
7. **Promise/async-await**: service mô phỏng chờ 500ms; `await login(...)` giúp code đọc tuần tự, `try/catch/finally` xử lý lỗi.
8. **`MemberProfile | null`**: boolean chỉ nói đúng/sai; màn hình đích cần dữ liệu. Đúng → profile, sai → null.
9. **Separation of Concerns**: screen lo UI/tương tác, service lo xác thực, data lo dữ liệu; dễ test và thay backend mà không sửa UI.
10. **Expo Router**: file trong `src/app` thành route: `login.tsx` → `/login`, `library.tsx` → `/library`.
11. **replace vs push**: `replace` thay route hiện tại (không Back về Login sau khi login/logout); `push` thêm vào stack.
12. **Context/Provider/useAuth**: chia sẻ `user`, `login`, `logout` cho nhiều screen mà không truyền props qua nhiều tầng.
13. **Provider bọc Stack**: mọi route nằm trong Stack mới gọi được `useAuth()`; nếu không sẽ ném lỗi "must be used inside AuthProvider".
14. **Props**: dữ liệu truyền vào component. Required (`label`, `value`), optional `?` (`placeholder`, `secureTextEntry`), default (`variant = "primary"`, `showDueDate = true`).
15. **Item không gọi service/router**: item chỉ hiển thị theo props → tái sử dụng được, dễ test; logic để screen/context lo.
16. **key trong map()**: giúp React nhận diện từng phần tử khi danh sách đổi, tránh render sai/mất state; dùng `book.id` ổn định, không dùng index.
17. **Route guard**: kiểm tra điều kiện truy cập ở route; `user = null` → `<Redirect href="/login" />`, không chỉ hiện text.
18. **Password hard-code**: lộ trong source/bundle, không hash, không đổi được. Production cần server, hash + salt, token.

### Code interview
- **A**: Service chỉ export `loginWithUsernamePassword`, không có `checkLogin` → lỗi thiếu tên. Sửa: `import { loginWithUsernamePassword } from ".../authService"; const profile = await loginWithUsernamePassword(u, p);` rồi xử lý `profile === null` (kiểu `MemberProfile | null`).
- **B**: `onChangeText={() => {}}` không gọi `setUsername` nên state không đổi. Sửa: `onChangeText={setUsername}`.
- **C**: `return <Text>` chỉ hiện chữ, người dùng vẫn ở route bảo vệ và không có đường quay lại. Dùng `<Redirect href="/login" />` ở `app/<route>.tsx` (route layer) để chuyển hẳn.

## Hướng dẫn chụp ảnh (E1–E9)
- E1: sơ đồ Login → My Library → Logout (có thể dùng mục "Luồng" ở trên).
- E2: cây `src/` trong VS Code.
- E3: `types.ts` + `data/demoAccount.ts`. E4: `authService.ts`. E5: `AuthContext.tsx`. E6: `LoginScreen.tsx`. E7: `LibraryScreen.tsx` + `BookItem.tsx`.
- E8: Login trống, sai, đúng → My Library (đủ 4 sách), sau Logout.
- E9: chạy `npx tsc --noEmit` (không lỗi) + mở `/library` khi chưa login bị đưa về `/login`.
