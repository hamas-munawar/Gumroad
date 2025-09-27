import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)"],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const hostName = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

  if (hostName.endsWith("." + rootDomain)) {
    const tenantSlug = hostName.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(
      new URL(`/store/${tenantSlug}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
