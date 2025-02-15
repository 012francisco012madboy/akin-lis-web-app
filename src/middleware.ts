import { NextRequest, NextResponse } from "next/server";
import path from "path";

const publicRoutes = ["/", "/auth/forgot-password", "/auth/forgot-password/change-password", "/auth/signup"];
const protectedRoutes = [
  { path: "/akin/dashboard", roles: ["CHEFE", "TECNICO"] },
  { path: "/akin/schedule/new", roles: ["RECEPCIONISTA"] },
  { path: "/akin/schedule/request", roles: ["RECEPCIONISTA"] },
  { path: "/akin/schedule/completed", roles: ["RECEPCIONISTA", "CHEFE"] },
  { path: "/akin/patient", roles: ["RECEPCIONISTA", "CHEFE", "TECNICO"] },
  { path: "/akin/patient/:id", roles: ["RECEPCIONISTA", "CHEFE", "TECNICO"] },
  { path: "/akin/patient/:id/exam-history", roles: ["RECEPCIONISTA", "CHEFE", "TECNICO"] },
  { path: "/akin/patient/:id/next-exam", roles: ["RECEPCIONISTA", "CHEFE", "TECNICO"] },
  { path: "/akin/patient/:id/ready-exam", roles: ["CHEFE", "TECNICO"] },
  { path: "/akin/team-management", roles: ["CHEFE", "TECNICO"] },
  { path: "/akin/payment", roles: ["RECEPCIONISTA"] },
  { path: "/akin/message", roles: ["RECEPCIONISTA", "TECNICO", "CHEFE"] },
  { path: "/akin/setting", roles: ["CHEFE"] },
  { path: "/akin/profile", roles: ["RECEPCIONISTA", "CHEFE", "TECNICO"] },
  { path: "/logout", roles: ["RECEPCIONISTA", "CHEFE", "TECNICO"] },
];
type Role = "CHEFE" | "RECEPCIONISTA" | "TECNICO";

const ScreenToRendirectWhenLogin: Record<Role, string[]>[] = [{
  CHEFE: [
    "/akin/dashboard",
    "/akin/schedule/new",
    "/akin/schedule/completed",
    "/akin/schedule/request",
    "/akin/patient",
    "/akin/patient/:id",
    "/akin/patient/:id/exam-history",
    "/akin/patient/:id/next-exam",
    "/akin/patient/:id/ready-exam",
    "/akin/team-management",
    "/akin/payment",
    "/akin/message",
    "/akin/setting",
    "/akin/profile",
    "/logout"
  ],
  RECEPCIONISTA: [
    "/akin/schedule/new",
    "/akin/schedule/completed",
    "/akin/schedule/request",
    "/akin/patient",
    "/akin/patient/:id",
    "/akin/patient/:id/exam-history",
    "/akin/patient/:id/next-exam",
    "/akin/patient/:id/ready-exam",
    "/akin/payment",
    "/akin/message",
    "/akin/setting",
    "/akin/profile",
    "/logout"
  ],
  TECNICO: [
    "/akin/dashboard",
    "/akin/schedule/completed",
    "/akin/patient",
    "/akin/patient/:id",
    "/akin/patient/:id/exam-history",
    "/akin/patient/:id/next-exam",
    "/akin/patient/:id/ready-exam",
    "/akin/payment",
    "/akin/message",
    "/akin/setting",
    "/akin/profile",
    "/logout"
  ]
}];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

function matchProtectedRoute(pathname: string) {
  return protectedRoutes.find((route) => pathToRegex(route.path).test(pathname));
}

function pathToRegex(path: string): RegExp {
  const regex = path.replace(/:[^\s/]+/g, "([^/]+)");
  return new RegExp(`^${regex}$`);
}
function getRedirectPathForRole(role: string): string {
  const rolePaths = ScreenToRendirectWhenLogin[0][role as Role];
  return rolePaths ? rolePaths[0] : "/";
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("akin-token")?.value;
  const userRole = request.cookies.get("akin-role")?.value;
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (!token) {
    // Não autenticado
    if (matchProtectedRoute(pathname)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (token && isPublicRoute(pathname)) {
    // Autenticado tentando acessar rota pública
    url.pathname = getRedirectPathForRole(userRole || "");
    return NextResponse.redirect(url);
  }

  const matchedRoute = matchProtectedRoute(pathname);
  if (matchedRoute) {
    // Rota protegida acessada com token
    if (!userRole || !matchedRoute.roles.includes(userRole)) {
      url.pathname = getRedirectPathForRole(userRole || "");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
