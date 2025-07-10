import { useEffect, useRef } from 'react';

type SSEMessageHandler = (data: unknown) => void;

interface UseSSEOptions {
  url: string;
  handlers: Record<string, SSEMessageHandler>;
  onError?: (error: Event) => void;
  maxRetries?: number;
}

export function useSSE({
  url,
  handlers,
  onError,
  maxRetries = 3,
}: UseSSEOptions) {
  const retryCountRef = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      retryCountRef.current = 0;
      if (!e.data) return;

      try {
        const payload = JSON.parse(e.data);
        const type =
          typeof payload === 'string'
            ? payload.toUpperCase()
            : payload.type?.toUpperCase();

        if (type && handlers[type]) {
          handlers[type](payload);
        }
      } catch (err) {
        console.error('Failed to parse SSE message', err);
      }
    };

    es.onerror = (err) => {
      retryCountRef.current++;
      console.error(`SSE error (attempt ${retryCountRef.current})`, err);
      onError?.(err);

      if (retryCountRef.current >= maxRetries) {
        console.warn('Max SSE retries reached. Reloading page...');
        window.location.reload();
      }
    };

    return () => {
      es.close();
    };
  }, [url, handlers, maxRetries, onError]);
}
