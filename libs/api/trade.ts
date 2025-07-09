import axios from '../axios';

interface CreateTradeResponse {
  message: string;
  tradeId: string;
}

export async function createTrade({ receiverId }: { receiverId: string }) {
  const response = await axios.post<CreateTradeResponse>('/trade', {
    receiverUserId: receiverId,
  });
  return response.data;
}

// A chest returned by the trade route (includes its ChestType relation)
export interface ChestType {
  id: string;
  name: string;
  price: number;
  xpGain: number;
}

export interface TradeChest {
  id: string;
  opened: boolean;
  type: ChestType;
}

// A user-room relation returned by the trade route (includes nested Room)
export interface Room {
  id: string;
  name: string;
  category: string;
  rarity: string;
  previewImageUrl: string;
  assetUrl: string;
}

export interface TradeRoom {
  id: string; // UserRoom id
  roomId: string;
  room: Room;
}

export interface Trader {
  id: string;
  username: string;
  image: string;
}

export interface TradeApiResponse {
  id: string;
  user: Trader;
  guest: Trader;
  userChests: TradeChest[];
  guestChests: TradeChest[];
  userRooms: TradeRoom[];
  guestRooms: TradeRoom[];
  userReady: boolean;
  guestReady: boolean;
  userConfirmed: boolean;
  guestConfirmed: boolean;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
}

export async function fetchTrade(tradeId: string) {
  const response = await axios.get<TradeApiResponse>(`/trade/${tradeId}`);
  return response.data;
}

export async function readyTrade(tradeId: string, ready: boolean) {
  const response = await axios.put<{ message: string }>(
    `/trade/${tradeId}/ready`,
    {
      ready,
    }
  );
  return response.data;
}

export async function cancelTrade(tradeId: string) {
  const response = await axios.post<{ message: string }>(
    `/trade/${tradeId}/cancel`
  );
  return response.data;
}

export async function updateTrade(
  tradeId: string,
  chests: { chestTypeId: string; quantity: number }[],
  rooms: { roomId: string; quantity: number }[]
) {
  const response = await axios.put<{ message: string }>(`/trade/${tradeId}`, {
    chests,
    rooms,
  });
  return response.data;
}

export async function confirmTrade(tradeId: string) {
  const response = await axios.post<{ message: string }>(
    `/trade/${tradeId}/confirm`
  );
  return response.data;
}
