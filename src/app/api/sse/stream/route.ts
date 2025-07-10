import { NextResponse } from 'next/server';
import Emitter from '../../../../../libs/Emitter';
import GetServerUser from '../../../../../libs/GetServerUser';

export const runtime = 'nodejs'; // ensure Node runtime (not edge)

export async function GET(req: Request) {
  const user = await GetServerUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const encoder = new TextEncoder();

  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      // Initial comment to establish SSE
      controller.enqueue(encoder.encode(': connected\n\n'));

      const sendHeartbeat = () => {
        controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
      };

      const heartbeatId = setInterval(sendHeartbeat, 15000);

      const handler = (payload: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
      };

      Emitter.on(`notify:${user.id}`, handler);

      cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeatId);
        Emitter.off(`notify:${user.id}`, handler);
      };
    },
    cancel() {
      // Client disconnected
      cleanup();
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
