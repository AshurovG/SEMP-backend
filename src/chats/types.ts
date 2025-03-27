export interface ChatData {
  id: number;
  title: string;
  description: string;
}

export interface MessageData {
  id: number;
  senderID: number;
  recipientID?: number;
  chatID: number;
  text?: string;
  image?: string;
  sendingTime: Date;
}
