# Task Management Dashboard

Vue 3 + TypeScript + Pinia + TailwindCSS. Mock data layer, status filtering, status updates, loading/error states, and a small composable. Built to demonstrate scalable structure and production-minded choices under a 4–5 hour constraint.

---

## A. Setup Instructions

**Prerequisites:** Node.js 18+ (LTS recommended).

```bash
npm install
npm run dev
```

Open **http://localhost:5173**.

- **Build:** `npm run build`
- **Preview build:** `npm run preview`
- **Tests:** `npm run test` (watch) or `npm run test:run` (single run)

No environment variables or backend required; all data is mocked in `src/services/tasks.ts`.

---

## B. Architecture Overview

### Folder structure (and why)

```
src/
  components/     # Reusable UI only: StatusFilter, TaskItem, TaskList
  composables/    # Reusable logic: useDateFormat
  stores/         # Pinia: single tasks store (state, getters, actions)
  services/       # Data layer: tasks.ts mock API (fetchTasks, updateTaskStatus)
  types/          # Shared TS types (Task, TaskStatus, etc.)
  constants/      # Status filter/option labels (no magic strings)
  App.vue
  main.ts
  style.css
```

- **components** – Presentational and list components; no business logic.
- **composables** – Logic that can be reused across components (e.g. date formatting).
- **stores** – Single source of truth for task list, loading, error, and filter.
- **services** – Isolates “API” calls so the store stays testable and swappable for a real backend.
- **types / constants** – Shared contracts and labels so we avoid magic strings and keep types in one place.

This keeps a clear path: service → store → components, with composables for cross-cutting concerns.

### State management (Pinia)

- **State:** `tasks`, `loading`, `error`, `statusFilter`.
- **Getters:** `filteredTasks` (computed from `tasks` + `statusFilter`).
- **Actions:** `loadTasks()` (async fetch, sets loading/error), `setTaskStatus(id, status)` (async update, sets error on failure), `setStatusFilter(value)` (sync).

Async work lives in the store; components call actions and read state/getters. No component-level loading/error duplication.

### Component hierarchy (reusable vs specific)

| Component     | Role        | Reusable? | Notes                                                                 |
|--------------|-------------|-----------|-----------------------------------------------------------------------|
| **StatusFilter** | Filter UI   | Yes       | Controlled via `modelValue` / `update:modelValue`; any parent can bind. |
| **TaskItem**     | Single task row | Yes   | Receives `task`; emits `update:status(id, status)`. No store dependency. |
| **TaskList**     | List + wiring | Page-specific | Uses store’s `filteredTasks` and forwards status updates to store.   |
| **App**          | Layout + data load | No | Mounts store, loads tasks, wires filter and list; handles loading/error/empty. |

Only `TaskList` and `App` touch the store; `StatusFilter` and `TaskItem` stay presentational and easy to test.

### Key patterns used

- **Props / Emits:** All parent–child communication. `StatusFilter` uses v-model-style `modelValue` + `update:modelValue`; `TaskItem` emits `update:status(id, status)` so the parent (TaskList) calls the store.
- **Composables:** `useDateFormat()` in `composables/useDateFormat.ts` used by `TaskItem` for date display. Keeps formatting logic reusable and testable without polluting the component.
- **No Provide/Inject:** Only one level of “smart” components (App, TaskList) and a single store; inject would add indirection without benefit for this size.
- **Store in components that need it:** Only `App` and `TaskList` use `useTasksStore()`; children receive data via props and notify via emits.

---

## C. Trade-offs & Decisions

**What I prioritized**

- **Clarity over flexibility:** One tasks store, one filter, simple list. No generic “entity store” or abstract filter system.
- **Production basics:** Loading and error state in the store, error UI with retry, and try/catch in async actions so failures are visible and recoverable.
- **Testability:** Service is mockable; store actions and filter logic are unit-tested; presentational components get data via props and emit events.

**What I’d add with more time**

- **Search:** Filter by title/assignee; either in the same store (`searchQuery` + computed) or a small composable that returns filtered list.
- **URL sync:** Persist status filter in query (e.g. `?status=done`) so views are shareable and back/forward work.
- **Optimistic updates:** Update UI on status change immediately, then reconcile with server response (and rollback + toast on error).

**Corners intentionally cut**

- **No pagination:** Mock data is small; for 10k tasks we’d add pagination or virtual scrolling (see D).
- **Single store:** No split into “tasks” vs “ui” store; one store keeps the demo simple and is enough for the required features.
- **Minimal validation:** Status is chosen from a fixed dropdown; no form library or client-side validation layer.

**Simplicity vs flexibility**

- Chose **simplicity:** Filter lives in the store as a single `statusFilter` value rather than a generic “filters” object. Easier to read and change; we can generalize later if we add more filter dimensions.
- **Reusable components** where it paid off: `StatusFilter` and `TaskItem` are generic; `TaskList` is the thin glue to the store so that we don’t over-abstract the list itself.

---

## D. Scalability: 10,000 tasks + real-time WebSocket

If this dashboard had to handle **10,000 tasks** and **real-time updates over WebSocket**, I’d change the following:

1. **Rendering**
   - **Virtual scrolling** or **pagination:** Never render 10k DOM nodes. Use a virtual list (e.g. `vue-virtual-scroller`) or server-driven pagination (e.g. 50 items per page) so only the visible set is mounted.

2. **State shape**
   - **Normalise in the store:** Store tasks as `tasksById: Record<id, Task>` and derive the visible list in a computed (e.g. from `ids` + filter/sort). WebSocket updates then do a single key update instead of scanning an array.

3. **Data loading**
   - **Server-side filter/sort:** Client sends filter + sort + page; server returns one page. Client holds only that page (and optionally a small cache). Reduces memory and keeps responses fast.

4. **WebSocket**
   - **Single connection,** messages like `task_updated` / `task_created` / `task_deleted` with id and payload. Client merges into `tasksById` (update, add, or delete by id). No full list refetch on every message.
   - **Optimistic updates:** User changes status → update store immediately and send to server; if server echoes or confirms, keep it; if error/correction, overwrite with server state and show feedback.

5. **Performance**
   - Derived list stays as a **computed** from the normalised store; virtual list only renders a window of rows. With that, 10k tasks don’t affect DOM or render cost; scalability is then about server pagination and WebSocket merge strategy.

---

## E. Technical Leadership: Complex Technical Challenge

**Core problem**

A production dashboard had a large table (2k+ rows) with inline editing and real-time updates over a WebSocket. The first implementation re-rendered the entire table on every socket message and mounted 2k row components. Scrolling and typing became janky and the UI felt broken under load.

**Constraints**

- Existing tech stack (Vue 2 at the time, Vuex, existing API and socket layer).
- Limited time to fix performance without a full rewrite.
- Need to keep real-time behaviour and inline editing.

**Solution**

1. **Virtualised table** – Only ~50 rows in the DOM; scroll position drove which slice of data was rendered. This alone removed the main render cost.
2. **Normalised store** – Tasks were stored as a map by id; the visible list was a computed from that map (filtered/sorted ids). Socket handlers updated only the affected id(s) in the map, so Vue’s reactivity touched a small subset of state.
3. **Debounced outbound edits + “saving” state** – Inline edits were debounced before sending to the server, and a small “saving” indicator prevented double-submit and gave clear feedback.

**Outcome**

Scrolling and typing were smooth again. The same architecture later supported moving to server-side pagination and 10k+ rows without a second rewrite.

**What I’d do differently**

- Introduce the normalised store and a clear “list view = derived from store” contract from day one, instead of refactoring once we hit scale.
- Add performance budgets or a quick virtual-list spike earlier when we knew the table could grow large.

---

## Testing

Two unit test files are included:

- **`src/stores/tasks.spec.ts`** – Pinia store: `filteredTasks` with filter “all” and filter “done” (tasks service is mocked).
- **`src/components/StatusFilter.spec.ts`** – StatusFilter: renders all options and emits `update:modelValue` when an option is clicked.

Run: `npm run test:run`. This demonstrates testable store actions and component contracts (props/emits) without over-building.
