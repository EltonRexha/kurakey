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
