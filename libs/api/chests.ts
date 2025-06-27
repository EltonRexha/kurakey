import { $Enums } from "@/generated/prisma";
import axios from "../axios";

export interface ChestDropRatesResponse {
  odds: Record<string, { rarity: string; chance: number }[]>;
}

export async function getAllChestDropRates() {
  const response = await axios.get<ChestDropRatesResponse>(
    "/chests/drop-rates"
  );
  return response.data;
}

interface BuyChestResponse {
  message: string;
  success: boolean;
  amount: number;
  xpGained: number;
}

export async function buyChest({
  typeId,
  amount,
}: {
  typeId: string;
  amount: number;
}) {
  const response = await axios.post<BuyChestResponse>("/chests", {
    typeId,
    amount,
  });
  return response.data;
}

interface OpenChestResponse {
  message: string;
  room: {
    name: string;
    id: string;
    rarity: $Enums.Rarity;
    category: $Enums.RoomCategory;
    isSecret: boolean;
    previewImageUrl: string;
    assetUrl: string;
  };
}

export async function openChest({ chestType }: { chestType: string }) {
  const response = await axios.post<OpenChestResponse>("/chests/open", {
    chestType,
  });

  return response.data;
}
