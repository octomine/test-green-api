# Конвенции кода

## Импорты React

- **Всегда** named imports из `'react'`:
  ```ts
  import {
    useState,
    useId,
    useRef,
    type ChangeEvent,
    type ComponentPropsWithoutRef,
  } from "react";
  ```
- **Никогда** не использовать `import \* as React from 'react'` и обращения через `React.xxx`.
  - ❌ `React.useId()`, `React.ChangeEvent<...>`, `React.ComponentPropsWithoutRef<...>`
  - ✅ `useId()`, `ChangeEvent<...>`, `ComponentPropsWithoutRef<...>`

### Типы React

- **Никогда** не использовать `React.XxxType` без импорта `React`. Все типы импортируются named:
  - ✅ `import { type ChangeEventHandler, type Ref, type ComponentPropsWithoutRef } from 'react';`
  - ❌ `const handler: React.ChangeEventHandler<...>` (React не импортирован)
  - ❌ `ref?: React.Ref<HTMLButtonElement>` (то же самое)

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

## Тема Tailwind

### Где живёт

Все дизайн-токены определены через `@theme` в `src/app/styles/index.css`. Дублировать значения в компонентах **запрещено**.

### Как использовать токены

В компонентах **всегда** используются семантические Tailwind-классы, сгенерированные из темы, а **не** дефолтная палитра Tailwind:

- ✅ `bg-primary`, `text-text-muted`, `border-border`, `bg-bg-chat`, `rounded-bubble`, `rounded-input`
- ❌ `bg-blue-500`, `text-gray-500`, `border-gray-300`, `bg-slate-100`, `rounded-2xl`

Дефолтные палитры (`blue-*`, `gray-*`, `slate-*`, `zinc-*`, `red-*` и т.д.) **не использовать** — только семантические токены из темы.

### Доступные токены

Цвета:

- `primary`, `primary-hover` — акцент (кнопки, исходящие сообщения)
- `bg`, `bg-chat`, `surface` — фоны (страница, лента чата, карточки)
- `border` — границы
- `text`, `text-muted` — основной и вторичный текст
- `bubble-incoming`, `bubble-outgoing`, `bubble-outgoing-text` — пузыри сообщений
- `error` — ошибки (валидация, статусы)

Радиусы:

- `rounded-bubble` — пузыри сообщений
- `rounded-input` — поля ввода и кнопки

Шрифт:

- `font-sans` — основной (уже применён глобально на `body`)

### Если нужен новый цвет или радиус

1. **Не хардкодить** его в компоненте через arbitrary values (`bg-[#abcdef]`).
2. **Добавить** в `@theme` в `src/app/styles/index.css` как новый токен.
3. Только потом использовать в компонентах.

Пример:

```css
@theme {
  --color-success: #10b981;
  /* ... */
}
```

→ в компоненте: `text-success`, `bg-success`.

### Правила использования в `cn`

Поскольку установлен `tailwind-merge`, конфликтующие классы корректно переопределяются. Это значит:

- Внешний `className` **может** перебивать базовые классы компонента.
- Порядок классов в `cn` не важен для tailwind-merge.

Пример:

```tsx
<Button className="bg-error">Удалить</Button>
```

`bg-error` перебьёт `bg-primary` из варианта `primary` — это ожидаемое поведение.

### Arbitrary values в Tailwind

- **Запрещены** arbitrary values вида `min-h-[80px]`, `w-[320px]`, `bg-[#abcdef]`.
- Если нужен нестандартный размер — использовать ближайший токен Tailwind (`min-h-20` = 80px) или добавить токен в `@theme`.

### Мёртвый код в компонентах

- Не оставлять стили для неиспользуемых сценариев (`file:*` в текстовом `<input>`, `flex` на `<input>`, и т.п.).

### Dark mode

Пока **не поддерживается**. Не добавляй `dark:` префиксы в компоненты. Если понадобится — сначала обсудить, потом менять `index.css`.

## UI Kit (shared/ui)

### Утилита `cn`

- В проекте **установлены** `clsx` и `tailwind-merge`.
- Утилита живёт в `src/shared/lib/cn.ts`.
- Импорт: `import { cn } from '@/shared/lib';`.
- **Всегда** используй `cn` для склейки Tailwind-классов, включая условные классы и проброс `className` снаружи.
- **Не** используй конкатенацию через шаблонные строки для классов.
- **Не** устанавливай `class-variance-authority` (cva) или другие альтернативы без явной просьбы.

### Структура компонента

- Каждый компонент — в своей папке: `shared/ui/ComponentName/`.
- Файл: `ComponentName.tsx`, экспорт: `export const ComponentName`.
- Обязательный `index.ts` в папке компонента: реэкспорт компонента и его пропсов.
- Общий `src/shared/ui/index.ts` — реэкспорт всех компонентов кита.
- Стили — **только** Tailwind-классы. Никаких CSS-модулей, inline-стилей, styled-components.

### Пропсы

- Типизация через `interface ComponentNameProps extends React.ComponentPropsWithoutRef<'button'|'input'|'textarea'|...>` плюс свои поля.
- Проп `className?: string` — обязателен, мержится через `cn` в корневой элемент.
- Варианты (`variant`, `size`) — через простой объект-маппинг или тернарники, **не** через `cva`.
- Не использовать `React.FC`.
- Не использовать `forwardRef` — React 19, `ref` передаётся как обычный проп при необходимости.
- Не добавлять `'use client'` — это не Next.js.

### ref в компонентах

- Если компонент принимает `ref` — импортировать `type Ref` из `'react'`, **не** использовать `React.Ref`.
  - ✅ `import { type Ref } from 'react'; ref?: Ref<HTMLButtonElement>`
  - ❌ `ref?: React.Ref<HTMLButtonElement>` (без импорта `React`)
- Не создавать `internalRef` / `combinedRef` — если компонент не использует ref внутри, пробрасывать `ref` напрямую в DOM-элемент.
- `displayName` не указывать для именованных экспортов (`export const Button = ...`).
