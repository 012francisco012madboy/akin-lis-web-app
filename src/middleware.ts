import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // Caminho da URL
  const token = req.cookies.get('auth-token')?.value; // Obtém o token do cookie
  const userRole = req.cookies.get('user-role')?.value; // Obtém o papel do usuário

  // const USER_Permission = [
  //   {
  //     path: "/akin/dashboard",
  //     access: ["CHEFE", "TECNICO"]
  //   },
  //   {
  //     path: "/akin/schedule/new",
  //     access: ["RECEPCIONISTA", "CHEFE"]
  //   },
  //   {
  //     path: "/akin/patient",
  //     access: ["RECEPCIONISTA", "CHEFE", "TECNICO"]
  //   },
  //   {
  //     path: "/akin/payment",
  //     access: ["RECEPCIONISTA"]
  //   },
  //   {
  //     path: "/akin/message",
  //     access: ["RECEPCIONISTA", "TECNICO", "CHEFE"]
  //   },
  //   {
  //     path: "/akin/setting",
  //     access: ["CHEFE"]
  //   },
  //   {
  //     path: "/akin/profile",
  //     access: ["RECEPCIONISTA", "CHEFE", "TECNICO"]
  //   },
  //   {
  //     path: "/logout",
  //     access: ["RECEPCIONISTA", "CHEFE", "TECNICO"]
  //   },
  //   {
  //     path: "/akin/schedule/request",
  //     access: ["RECEPCIONISTA"]
  //   },
  //   {
  //     path: "/akin/schedule/completed",
  //     access: ["RECEPCIONISTA", "CHEFE"]
  //   },
  //   {
  //     path: "/akin/...",
  //     access: ["RECEPCIONISTA", "CHEFE", "TECNICO"]
  //   },
  //   // Caminho individual de paciente (com base no ID)
  //   {
  //     path: "/akin/patient/:id",
  //     access: ["RECEPCIONISTA", "CHEFE", "TECNICO"]
  //   }
  // ];
  

  // Redirecionar para a página de login se o token não estiver presente
  if (!token && pathname !== '/') {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Impedir acesso à página de login se o usuário estiver autenticado
  if (token && pathname === '/') {
    const homeUrl = new URL('/akin/dashboard', req.url);
    return NextResponse.redirect(homeUrl);
  }

  // Verificar as permissões de acesso às rotas
  // if (token && userRole) {
  //   const routeConfig = Object.values(APP_CONFIG.ROUTES).flat().find((route) =>
  //     typeof route === "object" &&
  //     route.path === pathname &&
  //     route.access.includes(userRole)
  //   );

  //   // Se não houver configuração ou o usuário não tiver acesso, redireciona para dashboard ou página de erro
  //   if (!routeConfig) {
  //     const unauthorizedUrl = new URL('/akin/dashboard', req.url); // Altere para uma página de erro, se necessário
  //     return NextResponse.redirect(unauthorizedUrl);
  //   }
  // }

  // Permite acesso às outras rotas
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
