export type Credentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type SendMessageRequest = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type NotificationBody = {
  typeWebhook: string;
  idMessage?: string;
  senderData?: {
    chatId: string;
    senderPhoneNumber: string;
    chatType: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: NotificationBody;
} | null;

export type DeleteNotificationResponse = {
  result: boolean;
};

export type GetStateInstanceResponse = {
  stateInstance: 'authorized' | 'notAuthorized' | 'blocked' | 'starting' | 'yellowCard' | 'suspended';
};
