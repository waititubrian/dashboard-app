# UI (shadcn/ui) migration, navigation fix, and functional fixes

What changed, and why, in the pass that fixed the `/` 404, adopted shadcn/ui,
and fixed several functional bugs found while auditing the app. Grouped in
the order the work was done.

## 1. Navigation + root route (fixes the reported 404)

**Problem:** `https://bizna-ops.vercel.app` 404'd. There was no
`src/app/page.tsx` (root route) and nothing linked the 5 pages together —
each of `/dashboard`, `/products`, `/orders`, `/users`, `/revenue` only
existed if you typed its URL directly.

**Changed:**
- `src/app/page.tsx` (new) — redirects `/` to `/dashboard`.
- `src/components/layout/NavBar.tsx` (new) — horizontal nav linking all 5
  pages, active-route highlighting via `usePathname()`.
- `src/app/layout.tsx` — renders `<NavBar />` above the page content; real
  `metadata` (title/description) instead of the leftover `create-next-app`
  defaults.

## 2. shadcn/ui adopted in place of the hand-rolled `ui/` primitives

**Problem:** `src/components/ui/` had 6 hand-rolled components (Button,
Card, Input, Modal, Notification, Spinner) — plain inline Tailwind, no
shared variant system. That showed up as real gaps: `Modal` had no
`role="dialog"`, no focus trap, no Escape-key handling; `Input` labels
weren't `htmlFor`-linked to their fields; active/inactive status was shown
as a bare ✅/❌ emoji with no text alternative. Table markup (`<table>`,
borders, cell padding) was copy-pasted identically across `ProductTable`,
`OrderTable`, `UserTable`, `RevenueTable`, and `Dashboard`.

**Changed:**
- Ran `npx shadcn@latest init` then `add button input label card table
  dialog select badge sonner textarea`. This added `components.json`,
  `src/lib/utils.ts` (the `cn()` class-merging helper), and rewrote
  `src/app/globals.css`'s token block (light/dark CSS variables).
- **App stays dark by default** — added `className="dark"` on `<html>` in
  `layout.tsx` rather than switching to shadcn's light-by-default look, so
  the existing visual identity didn't change out from under you.
- **Filename collision, worth knowing about:** macOS's default filesystem
  is case-insensitive, so shadcn's `button.tsx` and the old `Button.tsx`
  are literally the same file on disk — the CLI silently overwrote
  `Button.tsx`/`Card.tsx`/`Input.tsx` in place. I renamed everything in
  `src/components/ui/` to lowercase (`button.tsx`, `card.tsx`, etc.) to
  match shadcn's own internal imports — without that, the app would build
  and run fine on your Mac but **fail on Vercel**, whose Linux build
  environment is case-sensitive and would see `button.tsx` (imported) and
  `Button.tsx` (on disk) as two different, non-existent files.
- Deleted `Modal.tsx` and `Notification.tsx` (replaced by shadcn `Dialog`
  and `sonner` toasts below). Kept `Spinner.tsx` (renamed `spinner.tsx`) —
  shadcn has no direct equivalent and it was already accessible
  (`role="status"`, `aria-label`).
- Added a `warning` variant to the generated `button.tsx`'s variant list
  (amber) so the existing Edit(warning)/Delete(destructive) color
  distinction in every table survived the migration — shadcn ships
  `default/outline/secondary/ghost/destructive/link` but not `warning`.

## 3. Every consumer migrated to the new primitives

11 files imported the old `ui/` components — same handful of mechanical
substitutions repeated across `products/`, `orders/`, `users/`,
`revenue/`, and `dashboard/`:

- Raw `<table>`/`<thead>`/`<tr>`/`<td>` → shadcn `Table`/`TableHeader`/
  `TableRow`/`TableHead`/`TableBody`/`TableCell`. Removes the copy-pasted
  border/padding classes; one definition (`components/ui/table.tsx`)
  instead of five.
- `product.active ? "✅" : "❌"` (and the equivalent for users, and order
  status) → shadcn `Badge` with visible text ("Active"/"Inactive", or the
  order status word), not glyph-only — fixes the color/glyph-only a11y gap.
- The delete-confirmation `Modal` in `ProductManagement`, `OrderManagement`,
  `UserManagement` → shadcn `Dialog`/`DialogContent`/`DialogHeader`/
  `DialogTitle`/`DialogFooter` — gets ARIA (`role="dialog"`,
  `aria-modal`), focus trap, and Escape-to-close for free from the
  underlying primitive.
- `Notification` + each component's own `NotificationState`
  (`useState`/`onClose` boilerplate duplicated in `OrderManagement`,
  `ProductManagement`, `UserManagement`, `RevenueManagement`, `Dashboard`,
  and the inline form-level error banner in `OrderForm`, `ProductForm`,
  `UserForm`) → `sonner`'s `toast.success()`/`toast.error()`, called
  directly at the point of success/failure. One `<Toaster />` added once
  in `layout.tsx`. This deleted the `notification`/`error` state, its
  setter calls, and the conditional render block from all 8 files instead
  of just restyling it.
- `Input` (label + input, no `htmlFor`) → shadcn `Label` + `Input`, with
  an explicit `id`/`htmlFor` pair on every field.
- `OrderForm`'s three raw `<select>`s (customer/product/status) → shadcn
  `Select`/`SelectTrigger`/`SelectContent`/`SelectItem`.
- `ProductForm`'s single-line description `Input` → shadcn `Textarea` —
  descriptions are free text, a single-line box was cramped.
- `Card` → shadcn `Card`/`CardContent` (used as a single padded
  container, same as before — not restructured into Header/Footer).

## 4. Functional fixes found during the audit

- **`src/app/api/users/route.ts` and `.../users/[id]/route.ts`** had no
  try/catch, no id validation, and no 404 handling — unlike
  `products/[id]/route.ts`, which already did this correctly. Brought both
  up to that same standard: `parseId()` validation, existence checks
  before update/delete, try/catch around everything, 400 on bad input, 404
  on missing user, 500 on unexpected errors. Extracted the `parseId()`
  helper both routes now share into `src/utils/api.ts` instead of leaving
  a third copy inline. **Side effect worth knowing:** the old
  `users/route.ts` returned errors as `{ message: ... }`, but `UserForm`
  always read `data.error` — so server-side validation messages (e.g. a
  duplicate email) were silently swallowed and replaced with a generic
  "Unable to save user." Fixed by using `error` consistently, matching
  every other route.
- **`src/services/user.service.ts`**: added a basic email-format check
  (regex) in `validateUserData` — previously only checked the field was
  non-empty, so `"not-an-email"` was accepted until it happened to collide
  with an existing address at the database's unique-constraint level.
- **Order stock accounting** (`src/services/order.service.ts`): stock was
  decremented at order creation regardless of status, and only ever
  restored when an order was *deleted* — cancelling or refunding an order
  through the UI never released its reserved stock, permanently locking
  that inventory as unavailable. Fixed `updateOrder` to treat stock as
  "held" only while an order is not `CANCELLED`/`REFUNDED`: moving into
  one of those statuses now releases the reservation, moving out of one
  re-reserves it (checking current availability), and the existing
  quantity/product-change math is unchanged when the order stays held
  throughout. Also fixed `createOrder` to skip the initial decrement
  entirely if an order is created directly with status `CANCELLED`/
  `REFUNDED`.
- **`src/repositories/order.repository.ts`**: deleted the unused
  `createOrder`, `updateOrder`, `deleteOrder` exports. `order.service.ts`
  never called them (it talks to `prisma`/`tx.order.*` directly for all
  mutations) — they were dead code, and `order.repository.createOrder`
  didn't even decrement stock, so it would have silently reintroduced the
  stock bug above if anyone had "fixed" the service to use it later.
- **Deleted `src/app/api/test-db/route.ts`** — an unauthenticated route
  that dumped every user row, functionally identical to `GET /api/users`.
  Left over from development; flagged twice in earlier conversation before
  finally being removed here.

## Not done in this pass (flagged, not implemented)

- A shared `useApiRequest`/`useFetch` hook to fully dedupe the
  loading/error-fetch boilerplate still duplicated across the 5
  management components. The `sonner` migration above removed the
  notification-state slice of that duplication; the fetch/loading slice
  is a separate, larger refactor.
- `Decimal` → `Number` precision hardening (`Number(product.price)` etc.)
  — currently consistent across the codebase, just not `Decimal.js`-safe
  if prices ever need cent-level accuracy at real scale.
- A deeper accessibility pass beyond what shadcn/Base UI (the headless
  primitive library this version of shadcn is built on) gives for free —
  e.g. a full keyboard-navigation audit.
- 7 pre-existing `react-hooks/set-state-in-effect` lint errors (in
  `OrderForm`, `ProductForm`, `UserForm`, `RevenueManagement`,
  `Dashboard`) were already present before this work and are unrelated to
  it — left as-is, same count before and after (`npm run lint`).

## Verification performed

- `npm run build` — clean after every phase (type-check + all routes).
- `npm run lint` — same 7 pre-existing errors as before this work, no new
  ones introduced.
- `npm run dev` + manual checks: `/` → 307 redirect to `/dashboard`; nav
  renders all 5 links; `GET /api/test-db` → 404 (route removed);
  `GET /api/users/999999` → clean 404 JSON instead of a crash;
  `GET /api/products` returns real data.
