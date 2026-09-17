/**
 * Кастомная ошибка для HTTP запросов
 */
export class HttpError extends Error {
  public status: number;
  public body: unknown;

  constructor(
    status: number,
    body: unknown,
    message: string = `HTTP Error ${status}`
  ) {
    super(message);
    this.status = status;
    this.body = body;
    this.name = 'HttpError';
    
    // Для корректной работы instanceof в TypeScript
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}