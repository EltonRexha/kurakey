import { $Enums } from "@/generated/prisma";
import axios from "../axios";

export interface Notification {
  id: string;
  message: string;
  type: $Enums.NotificationType;
  chestType?: {
    name: string;
  };
  xpAmount?: number;
  room?: {
    previewImageUrl: string;
    name: string;
  };
}

export async function getUnShownNotifications() {
  const response = await axios.get<Notification[]>("/notification/un-shown");
  return response.data;
}

export async function markNotificationsAsShown(id: string) {
  await axios.post("/notification/mark-shown", { id });
}
