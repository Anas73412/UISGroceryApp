/**
 * App color palette
 * Primary: #39afbc | Secondary: #1f637a
 */

export const colors = {
  primary: '#39afbc',
  secondary: '#1f637a',
  primaryLight: '#5bc4cf',
  primaryDark: '#2d8a94',
  secondaryLight: '#2d7d92',
  secondaryDark: '#184a5c',
} as const;

/** Light theme - active for development */
export const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  ...colors,
} as const;

/**
 * Dark theme - commented for development
 * Uncomment and use when enabling dark mode
 */
// export const darkTheme = {
//   background: '#121212',
//   surface: '#1e1e1e',
//   text: '#f5f5f5',
//   textSecondary: '#b0b0b0',
//   border: '#333333',
//   ...colors,
// } as const;

export type Theme = typeof lightTheme;
