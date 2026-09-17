import { receiveNotification, deleteNotification } from "../api";
import type { Credentials, NotificationBody } from "../api";

const RECEIVE_TIMEOUT = 30;

type LongPollingCallbacks = {
  onNotification: (notification: {
    receiptId: number;
    body: NotificationBody;
  }) => void | Promise<void>;
  onError?: (error: unknown) => void;
};

export class LongPolling {
  private running = false;
  private controller: AbortController | null = null;

  start(credentials: Credentials, callbacks: LongPollingCallbacks): void {
    // Если уже запущен, ничего не делаем
    if (this.running) return;

    // Создаем новый AbortController
    this.controller = new AbortController();
    this.running = true;

    // Запускаем цикл в fire-and-forget стиле
    void this.pollLoop(credentials, callbacks, this.controller.signal);
  }

  stop(): void {
    // Останавливаем цикл
    if (this.running && this.controller) {
      this.controller.abort();
      this.running = false;
      this.controller = null;
    }
  }

  get isRunning(): boolean {
    return this.running;
  }

  // Приватный метод для асинхронного цикла
  private async pollLoop(
    credentials: Credentials,
    callbacks: LongPollingCallbacks,
    signal: AbortSignal,
  ): Promise<void> {
    while (this.running) {
      try {
        const notification = await receiveNotification(
          credentials,
          RECEIVE_TIMEOUT,
          signal,
        );

        // Если уведомлений нет (таймаут), продолжаем цикл
        if (notification === null) continue;

        // Обрабатываем уведомление
        await callbacks.onNotification(notification);

        // Удаляем уведомление после успешной обработки
        await deleteNotification(credentials, notification.receiptId);
      } catch (error) {
        // Если это AbortError (результат stop()), выходим из цикла
        if (error instanceof Error && error.name === "AbortError") {
          break;
        }

        // Вызываем onError callback, если он определен
        callbacks.onError?.(error);

        // Делаем паузу перед следующей попыткой
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}
