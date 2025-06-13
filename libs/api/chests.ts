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
