# Конвенции кода

## Zustand-сторы

### Именование

- Файл стора: `store.ts` внутри `model/` соответствующего entity.
- Экспорт: **всегда** `use<Entity>Store`, например:
  - `entities/session/model/store.ts` → `export const useSessionStore`
  - `entities/chat/model/store.ts` → `export const useChatStore`
  - `entities/message/model/store.ts` → `export const useMessageStore`

### API

- **Всегда** используй `create` из `zustand`, **никогда** `createStore`.
  - `create` — для React-компонентов (хук).
  - `createStore` — vanilla, только если сознательно нужен стор без React.
- Каррирование: `create<State>()((set) => ({ ... }))` — обязательно для вывода типов.

### Чтение стора вне React

Для доступа из `longPolling`, `httpClient` и т.п. используй:

```ts
useSessionStore.getState().credentials;
```

### Именование полей и методов

- Поля состояния: существительные (`credentials`, `messages`, `activeChatId`).
- Методы: глаголы (`setCredentials`, `addMessage`, `clearCredentials`).
- Если имя метода совпадает с импортированной функцией — **переименовывай импорт**, а не метод:
  ```ts
  import { clearCredentials as clearStoredCredentials } from "@/shared/lib/storage";
  ```

## Импорты

### Алиасы
- Между слоями и сегментами — **всегда** через `@/`.
  - `@/shared/api`, `@/shared/lib/storage`, `@/entities/session`.
- Внутри одного сегмента — относительные пути.
  - В `shared/api/greenApi.ts`: `import { httpRequest } from './httpClient'`.

### Публичный API
- Импорт из другого сегмента — **только через `index.ts`**.
  - ✅ `import type { Credentials } from '@/shared/api'`
  - ❌ `import type { Credentials } from '@/shared/api/types'`

### `import type`
- Только типы — `import type { X } from '...'`.
- Только значения — `import { x } from '...'`.
- Смешанные — **разделяй на два импорта**.
