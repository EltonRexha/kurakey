import nextConfig from '@/../next.config'; 

const remotePatterns = nextConfig.images?.remotePatterns || [];

export function isAllowedRemoteImage(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);

    return remotePatterns.some(pattern => {
      if (pattern.protocol && url.protocol.replace(':', '') !== pattern.protocol) {
        return false;
      }

      if (pattern.hostname && !matchHostname(url.hostname, pattern.hostname)) {
        return false;
      }

      if (pattern.pathname) {
        const regex = new RegExp(
          '^' + pattern.pathname
            .replace(/\*\*/g, '.*') 
            .replace(/\*/g, '[^/]*') + '$'
        );
        if (!regex.test(url.pathname)) return false;
      }

      return true;
    });
  } catch {
    return false;
  }
}

function matchHostname(actual: string, pattern: string): boolean {
  if (pattern.startsWith('*.')) {
    return actual.endsWith(pattern.slice(1));
  }
  return actual === pattern;
}