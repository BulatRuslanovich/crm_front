/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseCookie(setCookieHeader: string) {
  const [nameValue, ...options] = setCookieHeader.split("; ");
  const [name, value] = nameValue.split("=");

  const cookie: {
    name: string;
    value: string;
    options?: {
      [key: string]: string | boolean | Date;
    };
  } = { name, value };

  if (options.length > 0) {
    cookie.options = options.reduce((acc, option) => {
      const [key, val] = option.split("=");
      const lowerKey = key.toLowerCase();

      // Handle special cases
      if (lowerKey === "expires") {
        acc.expires = new Date(val);
      } else if (lowerKey === "max-age") {
        acc.maxAge = parseInt(val, 10);
      } else if (lowerKey === "httponly") {
        acc.httpOnly = true;
      } else if (lowerKey === "secure") {
        acc.secure = true;
      } else if (lowerKey === "samesite") {
        acc.sameSite = val.toLowerCase() as "lax" | "strict" | "none";
      } else if (val) {
        acc[key] = val;
      } else {
        acc[key] = true;
      }

      return acc;
    }, {} as any);
  }

  return cookie;
}
