import { z } from 'zod';

const BuyChestSchema = z.object({
  typeId: z.string(),
  amount: z.number().min(1).max(100),
});

export default BuyChestSchema;
