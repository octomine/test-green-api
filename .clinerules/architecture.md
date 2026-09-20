# Архитектура проекта (FSD)

## Стек

- React + Vite + TypeScript
- Zustand
- react-i18next + i18next
- Tailwind CSS v4 (через @tailwindcss/vite)
- lucide-react
- clsx + tailwind-merge (утилита cn)
- Prettier (с prettier-plugin-tailwindcss)
- pnpm

## Структура слоёв

src/
├── app/
│   ├── providers/
│   │   └── LongPollingProvider.tsx
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   └── index.ts
├── pages/
│   └── chat/
│       ├── ui/
│       │   └── ChatPage.tsx
│       └── index.ts
├── features/
│   ├── auth/
│   │   ├── ui/
│   │   │   └── LoginForm.tsx
│   │   └── index.ts
│   ├── create-chat/
│   │   ├── ui/
│   │   │   └── NewChatForm.tsx
│   │   └── index.ts
│   └── send-message/
│       ├── ui/
│       │   └── MessageInput.tsx
│       ├── model/
│       │   └── useSendMessage.ts
│       └── index.ts
├── entities/
│   ├── session/
│   │   ├── model/
│   │   │   └── store.ts
│   │   └── index.ts
│   ├── chat/
│   │   ├── model/
│   │   │   └── store.ts
│   │   └── index.ts
│   └── message/
│       ├── model/
│       │   ├── store.ts
│       │   └── types.ts
│       ├── ui/
│       │   ├── MessageBubble.tsx
│       │   ├── MessageList.tsx
│       │   └── index.ts
│       └── index.ts
└── shared/
    ├── api/
    │   ├── httpClient.ts
    │   ├── greenApi.ts
    │   ├── types.ts
    │   ├── errors.ts
    │   └── index.ts
    ├── lib/
    │   ├── longPolling.ts
    │   ├── cn.ts
    │   └── index.ts
    ├── ui/
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── index.ts
    │   ├── Input/
    │   │   ├── Input.tsx
    │   │   └── index.ts
    │   ├── Textarea/
    │   │   ├── Textarea.tsx
    │   │   └── index.ts
    │   └── index.ts
    ├── i18n/
    │   ├── config.ts
    │   ├── i18next.d.ts
    │   ├── index.ts
    │   └── locales/
    │       └── ru.json
    └── config/
        └── env.ts

## Правила импортов (FSD)

- Импорты только «вниз»: pages → features → entities → shared
- Запрещено: shared → entities/features, entities → features/pages
- Снаружи слайса — только через публичный API (index.ts)
- Внутри слайса — относительные пути, НЕ алиасы

Примеры:
- ✅ `import { useSessionStore } from '@/entities/session'`
- ✅ `import { sendMessage } from '@/shared/api'`
- ❌ `import { Credentials } from '../../../shared/api/types'` (вместо этого `import type { Credentials } from '@/shared/api'`)
- ✅ Внутри shared/api: `import { httpRequest } from './httpClient'`

## UI-кит

Структура компонентов в shared/ui/<ComponentName>/:
- ComponentName.tsx - реализация компонента
- index.ts - реэкспорт компонента и его пропсов

Пропсы компонентов наследуются через ComponentPropsWithoutRef.
Стилизация через className, который мержится через cn.
Варианты (variant, size) реализуются через объект-маппинг.

Подробности см. в .clinerules/coding.md.

## Тема

Дизайн-токены определены в @theme в src/app/styles/index.css.
Используются семантические токены, а не дефолтная палитра.
Произвольные значения (arbitrary values) запрещены.
Dark mode не поддерживается.

## Zustand

Конвенции:
- Файл стора: store.ts внутри model/ соответствующего entity
- Экспорт: всегда use<Entity>Store (например, useSessionStore)
- Используется create, а не createStore
- Доступ к стору вне React через getState()
- Селекторы не возвращают новые объекты/массивы — используются EMPTY_* константы
- Persist только для session (credentials)

## i18n

Используется useTranslation из '@/shared/i18n'.
Тексты хранятся в src/shared/i18n/locales/ru.json.
Никаких хардкодных строк в интерфейсе.

## Prettier

Форматирование кода через pnpm format.
Плагин prettier-plugin-tailwindcss автоматически сортирует Tailwind-классы.
Конфигурационные файлы: .prettierrc.json, .prettierignore, .vscode/settings.json.

## Текущие модули

### shared
- `shared/api/httpClient.ts` — httpRequest<T> с поддержкой signal, 204, пустого тела
- `shared/api/greenApi.ts` — sendMessage, receiveNotification, deleteNotification, getStateInstance
- `shared/api/types.ts` — DTO GREEN-API
- `shared/api/errors.ts` — HttpError
- `shared/api/index.ts` — публичный API сегмента (реэкспорт всех функций)
- `shared/lib/longPolling.ts` — синглтон longPolling
- `shared/lib/cn.ts` — clsx + tailwind-merge
- `shared/ui/` — Button, Input, Textarea
- `shared/i18n/` — react-i18next + ru.json
- `shared/config/env.ts` — API_URL

### entities
- `entities/session` — useSessionStore (credentials, persist)
- `entities/chat` — useChatStore (activeChatId)
- `entities/message` — useMessageStore + MessageList, MessageBubble

### features
- `features/auth` — LoginForm, валидация credentials через getStateInstance перед сохранением
- `features/create-chat` — NewChatForm, валидация номера (10–15 цифр, только цифры)
- `features/send-message` — MessageInput + useSendMessage (оптимистичная отправка, обработка ошибок)

### pages / app
- `pages/chat` — ChatPage (три состояния)
- `app/providers/LongPollingProvider` — управляет жизненным циклом longPolling; фильтрует входящие по chatType и senderPhoneNumber; обрабатывает 401/403 через logout

## Особенности GREEN-API

- Авторизация в URL: /waInstance{id}/{method}/{token}
- receiveNotification возвращает null при таймауте (это НЕ ошибка)
- HTTP 408 от GREEN-API при простое — обрабатывать как continue
- HTTP 401/403 — невалидные credentials. long polling останавливается, пользователь разлогинивается.
- Отправка на РФ/РБ — chatId в формате phone@c.us
- В сторе chatId без @c.us, конвертация — только при API-вызове
- Входящие уведомления содержат senderData:
  - senderData.chatType — 'user' / 'group' / 'channel'
  - senderData.senderPhoneNumber — номер отправителя (число, не строка)
  - senderData.chatId — числовой ID, не совпадает с номером телефона
- Фильтрация входящих: только chatType === 'user' и senderPhoneNumber совпадает с activeChatId
