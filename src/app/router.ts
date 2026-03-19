/**
 * Application router and types
 */

export type Route = "home" | "form" | "result" | "not-found";

export interface RouterState {
  currentRoute: Route;
  params?: Record<string, any>;
}

/**
 * Route definitions with metadata
 */
export const routes = {
  home: {
    path: "/",
    name: "Home",
    description: "Assessment management",
  },
  form: {
    path: "/form",
    name: "Assessment Form",
    description: "Complete the assessment",
  },
  result: {
    path: "/result",
    name: "Assessment Results",
    description: "View risk profile and controls",
  },
  notFound: {
    path: "/404",
    name: "Not Found",
    description: "Page not found",
  },
};

/**
 * Parse URL path to route
 */
export function parseRoute(pathname: string): Route {
  const path = pathname.split("?")[0]; // Remove query params

  switch (true) {
    case path === "/" || path === "/home":
      return "home";
    case path === "/form" || path.startsWith("/form/"):
      return "form";
    case path === "/result" || path.startsWith("/result/"):
      return "result";
    default:
      return "not-found";
  }
}

/**
 * Get route path from route name
 */
export function getRoutePath(route: Route): string {
  return routes[route === "not-found" ? "notFound" : route].path;
}

/**
 * Navigate to route
 */
export function navigateToRoute(route: Route, params?: Record<string, any>): void {
  let url = getRoutePath(route);

  if (params?.id) {
    url = `${url}/${params.id}`;
  }

  window.history.pushState({ route, params }, "", url);
  window.dispatchEvent(
    new CustomEvent("route-change", { detail: { route, params } })
  );
}

/**
 * Navigate to home
 */
export function navigateToHome(): void {
  navigateToRoute("home");
}

/**
 * Navigate to form
 */
export function navigateToForm(assessmentId?: string): void {
  navigateToRoute("form", { id: assessmentId });
}

/**
 * Navigate to results
 */
export function navigateToResult(assessmentId?: string): void {
  navigateToRoute("result", { id: assessmentId });
}
