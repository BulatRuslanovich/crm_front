interface TokenInfo {
  exp: number;
  iat: number;
}

export function decodeJWT(token: string): TokenInfo | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function isTokenExpiringSoon(token: string): boolean {
  const tokenInfo = decodeJWT(token);
  if (!tokenInfo) {
    return true;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = tokenInfo.exp;
  const fiveMinutes = 5 * 60;
  
  return (expirationTime - now) < fiveMinutes;
}


export function isTokenExpired(token: string): boolean {
  const tokenInfo = decodeJWT(token);
  if (!tokenInfo) {
    return true;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return tokenInfo.exp < now;
}

export function getTimeUntilExpiration(token: string): number {
  const tokenInfo = decodeJWT(token);
  if (!tokenInfo) {
    return 0;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = tokenInfo.exp;
  
  return Math.max(0, (expirationTime - now) * 1000);
}
