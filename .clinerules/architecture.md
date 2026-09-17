# Архитектура проекта (FSD)

## Стек

- React + Vite + TypeScript
- Zustand для стейта
- pnpm

## Структура слоёв

src/
├── app/ # Провайдеры, инициализация, глобальные стили
├── pages/ # Страницы (композиция)
├── features/ # Пользовательские сценарии (отправка, вход, создание чата)
├── entities/ # Доменные сущности (session, chat, message)
└── shared/ # Инфраструктура
    ├── api/ # httpClient, greenApi, types, errors
    ├── lib/ # longPolling, storage
    └── config/ # env.ts

## Правила импортов (FSD)

- Импорты только «вниз»: pages → features → entities → shared
- Запрещено: shared → entities/features, entities → features/pages
- Снаружи слайса — только через публичный API (index.ts)
- Внутри слайса — относительные пути, НЕ алиасы

## Текущие модули

- `shared/api/httpClient.ts` — httpRequest<T> с поддержкой signal, 204, пустого тела
- `shared/api/greenApi.ts` — sendMessage, receiveNotification, deleteNotification
- `shared/lib/longPolling.ts` — синглтон LongPolling (start/stop/isRunning)
- `shared/config/env.ts` — API_URL из import.meta.env

## Особенности GREEN-API

- Авторизация в URL: /waInstance{id}/{method}/{token}
- receiveNotification возвращает null при таймауте (это НЕ ошибка)
- HTTP 408 от GREEN-API при простое — обрабатывать как continue
