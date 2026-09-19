export interface Message {
  id: string; // idMessage из GREEN-API
  chatId: string; // номер получателя (или chatId)
  text: string;
  isOutgoing: boolean; // true — исходящее (мы отправили), false — входящее
  timestamp: number; // Date.now() при получении/отправке
}
