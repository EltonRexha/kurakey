import { PrismaClient } from '../src/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import notificationEmitter from '../libs/Emitter';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()
    .$extends(withAccelerate()) // keep Accelerate
    .$extends({
      // NEW: query extension
      query: {
        notification: {
          async create({ args, query }) {
            const result = await query(args);
            notificationEmitter.emit(
              `notify:${result.userId}`,
              'NEW_NOTIFICATION'
            );
            return result;
          },
        },
        trade: {
          async update({ args, query }) {
            const result = await query(args);
            // notify both participants of the trade
            notificationEmitter.emit(
              `notify:${result.senderId}`,
              'TRADE_UPDATE'
            );
            notificationEmitter.emit(
              `notify:${result.receiverId}`,
              'TRADE_UPDATE'
            );
            return result;
          },
        },
      },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
