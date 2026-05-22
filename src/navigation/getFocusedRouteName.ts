import type { NavigationState } from '@react-navigation/native';

/** Returns the deepest focused route name from the root navigation state. */
export function getFocusedRouteName(
  state: NavigationState | undefined,
): string {
  if (!state) return '';
  const route = state.routes[state.index];
  if (route.state) {
    return getFocusedRouteName(route.state as NavigationState);
  }
  return route.name;
}
