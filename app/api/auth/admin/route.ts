import { NextResponse } from "next/server";
import { token } from "@/lib/auth";

export async function POST(req:Request){const {password}=await req.json();if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:"unauthorized"},{status:401});const r=NextResponse.json({ok:true});r.cookies.set("lts_admin",token("admin:1"),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:60*60*12,path:"/"});return r}
export async function DELETE(){const r=NextResponse.json({ok:true});r.cookies.set("lts_admin","",{maxAge:0,path:"/"});return r}
