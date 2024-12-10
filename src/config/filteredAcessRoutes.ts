import { APP_CONFIG } from "./app";


export const filterRoutesByAccess = (userRole: string) => {
  return APP_CONFIG.ROUTES.MENU.filter((route) =>
    route.access?.includes(userRole)
  );
};

export const filterSheduleByAccess = (schedule: string) => {
  return APP_CONFIG.ROUTES.SCHEDULE.filter((route) =>
    route.access?.includes(schedule)
  );
};