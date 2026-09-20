# GREEN-API MAX Chat

Веб-чат для отправки и получения текстовых сообщений в мессенджере MAX через GREEN-API.

## Стек

- React 19 + Vite + TypeScript
- Zustand (стейт)
- react-i18next (локализация)
- Tailwind CSS v4
- clsx + tailwind-merge
- Prettier
- pnpm

## Требования

- Node.js 20.19+ или 22.12+ (требование Vite)
- pnpm

## Установка и запуск

```bash
pnpm install
pnpm dev
```

Открыть http://localhost:5173.

Другие команды:

```bash
pnpm build      # production-сборка
pnpm preview    # просмотр собранной версии
pnpm format     # форматирование Prettier
```

## Как пользоваться

1. Открыть приложение.
2. Ввести idInstance и apiTokenInstance из личного кабинета GREEN-API.
3. Ввести номер телефона получателя (например, 79259091155).
4. Написать сообщение и отправить (Enter или кнопка).
5. Ответ собеседника появится в чате автоматически (long polling).

Инстанс должен быть авторизован, webhookUrl — пустой (HTTP API не работает с вебхуком).

## Архитектура

Краткое описание FSD: app → pages → features → entities → shared.

[Детали архитектуры](.clinerules/architecture.md)

Ключевые модули:

- shared/api — транспорт GREEN-API
- shared/lib/longPolling — драйвер long polling
- entities/* — доменные сущности (модель: типы и Zustand-сторы; UI: компоненты сущности)
- features/* — пользовательские сценарии

## Особенности GREEN-API

- Авторизация в URL — /waInstance{idInstance}/{method}/{apiTokenInstance}, не в заголовках.
- Long polling — метод receiveNotification с receiveTimeout (5–60 сек). При таймауте возвращает пустой ответ — это норма.
- Формат chatId при отправке — для РФ/РБ phone@c.us (например, 79259098192@c.us).
- HTTP 408 — GREEN-API может возвращать при простое; обрабатывается в longPolling.

## Известные ограничения / TODO

- Только текст — медиа, документы, голосовые не поддерживаются (по требованиям).
- Один активный чат — список чатов, переключение между ними не реализованы.
- checkAccount не используется — из-за ограничений Developer-тарифа. chatId = номер телефона без +.
- Фильтрация входящих — только личные чаты, от собеседника активного чата (по senderPhoneNumber).
- Статус доставки — outgoingMessageStatus не обрабатывается, оптимистичное сообщение остаётся с временным id.
- Обработка ошибок отправки — показывает сообщение в Textarea, но не удаляет оптимистичное сообщение из ленты.
- Нет тестов — юнит-тесты не написаны.
