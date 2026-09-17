import { httpRequest } from "./httpClient";
import type {
  Credentials,
  SendMessageRequest,
  SendMessageResponse,
  ReceiveNotificationResponse,
  DeleteNotificationResponse,
} from "./types";

export function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const { idInstance, apiTokenInstance } = credentials;
  const path = `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

  const requestBody: SendMessageRequest = {
    chatId,
    message,
  };

  return httpRequest<SendMessageResponse>(path, {
    method: "POST",
    body: requestBody,
  });
}

export function receiveNotification(
  credentials: Credentials,
  receiveTimeout: number,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse> {
  const { idInstance, apiTokenInstance } = credentials;
  // Ограничиваем таймаут значениями от 5 до 60
  const timeout = Math.min(Math.max(receiveTimeout, 5), 60);
  const path = `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${timeout}`;

  return httpRequest<ReceiveNotificationResponse>(path, {
    method: "GET",
    signal,
  });
}

export function deleteNotification(
  credentials: Credentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> {
  const { idInstance, apiTokenInstance } = credentials;
  const path = `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  return httpRequest<DeleteNotificationResponse>(path, {
    method: "DELETE",
  });
}
