import { $Enums } from '@/generated/prisma';
import axios from '../axios';

interface InventoryApiResponse {
  message: string;
  inventory: {
    userRooms: ({
      room: {
        name: string;
        rarity: $Enums.Rarity;
        category: $Enums.RoomCategory;
        id: string;
        isSecret: boolean;
        previewImageUrl: string;
        assetUrl: string;
      };
    } & {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      roomId: string;
    })[];
    chests: ({
      type: {
        name: string;
        id: string;
        price: number;
        xpGain: number;
        chestImageUrl: string;
      };
    } & {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      chestTypeId: string;
      opened: boolean;
    })[];
  };
}

export async function getInventory() {
  const response = await axios.get<InventoryApiResponse>('/inventory');
  return response.data;
}
