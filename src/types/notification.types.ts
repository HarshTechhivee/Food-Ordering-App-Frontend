export type NotificationType =
  | "NEW_ORDER"
  | "ORDER_STATUS_UPDATED"
  | "CANCEL_ORDER"
  | "REJECT_ORDER"

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}