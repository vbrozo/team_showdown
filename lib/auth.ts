import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const secret=()=>process.env.SESSION_SECRET||"dev-only-change-me";
export function token(value:string){return `${value}.${createHmac("sha256",secret()).update(value).digest("hex")}`}
export function verify(raw:string|undefined,prefix:string){if(!raw)return false;const i=raw.lastIndexOf(".");if(i<0)return false;const value=raw.slice(0,i),expected=token(value);return value.startsWith(prefix)&&expected.length===raw.length&&timingSafeEqual(Buffer.from(expected),Buffer.from(raw))}
export async function isAdmin(){return verify((await cookies()).get("lts_admin")?.value,"admin:")}
export async function flightSession(){const raw=(await cookies()).get("lts_flight")?.value;if(!verify(raw,"flight:"))return null;return raw!.split(".")[0].slice(7)}
