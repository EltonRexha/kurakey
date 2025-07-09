import { z } from 'zod';

const PutTradeSchema = z.object({
  chests: z.array(
    z.object({
      chestTypeId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
  rooms: z.array(
    z.object({
      roomId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
});

export default PutTradeSchema;
