import { API_URL } from "../config/env";
import { HttpError } from "./errors";

/**
 * Опции для HTTP запроса
 */
export type RequestOptions = {
  method?: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

/**
 * Выполняет HTTP запрос с использованием fetch API
 *
 * @template T Тип возвращаемых данных
 * @param path Путь к endpoint'у (без базового URL)
 * @param options Опции запроса
 * @returns Promise с данными типа T или undefined для 204 статуса
 * @throws HttpError в случае ошибки HTTP
 */
export async function httpRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  // Формируем полный URL
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_URL}${fullPath}`;

  // Подготавливаем опции для fetch
  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    signal: options.signal,
  };

  // Создаем новый объект заголовков, не мутируя входной options.headers
  const headers: Record<string, string> = options.headers
    ? { ...options.headers }
    : {};

  // Добавляем Content-Type только если body определен
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(options.body);
  }

  // Добавляем заголовки в опции fetch, если они есть
  if (Object.keys(headers).length > 0) {
    fetchOptions.headers = headers;
  }

  // Выполняем запрос
  const response = await fetch(url, fetchOptions);

  // Проверяем успешность запроса
  if (!response.ok) {
    let errorBody: unknown;
    const text = await response.text();
    try {
      errorBody = JSON.parse(text);
    } catch {
      errorBody = text;
    }

    throw new HttpError(response.status, errorBody);
  }

  // Для статуса 204 возвращаем undefined
  if (response.status === 204) {
    return undefined as T;
  }

  // Парсим и возвращаем JSON
  const data: T = await response.json();
  return data;
}
