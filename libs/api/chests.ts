import axios from '../axios';

export interface ChestDropRatesResponse {
  odds: Record<string, { rarity: string; chance: number }[]>;
}

export async function getAllChestDropRates() {
  const response = await axios.get<ChestDropRatesResponse>(
    '/chests/drop-rates'
  );
  return response.data;
}

interface BuyChestResponse {
  message: string;
  success: boolean;
  amount: number;
}

export async function buyChest({
  typeId,
  amount,
}: {
  typeId: string;
  amount: number;
}) {
  const response = await axios.post<BuyChestResponse>('/chests', {
    typeId,
    amount,
  });
  return response.data;
}
