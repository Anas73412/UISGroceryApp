export const theme = {

    colors:{
           // New Design System Colors
    background: '#FFFFFF',
    headerText: '#39afbc',
    textPrimary: '#39afbc',
    textSecondary: '#39afbc',
    link: '#439A86',
    underline: '#EAEAEA',

    // Primary colors (updated to match new design)
    primary: '#39afbc',
    primaryDark: '#1997a5',
    primaryLight: '#39afbc',
    primaryLightBG: '#39afbc',
    // Secondary colors
    secondary: '#1f637a',
    secondaryDark: '#357a69',
    secondaryLight: '#4fa894',

    // Status colors
    success: '#439A86',
    warning: '#D97706',
    error: '#DC2626',
    info: '#E57373',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#EAEAEA',
    gray300: '#D1D5DB',
    gray400: '#BFBFBF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#271914',
    gray900: '#E57373',

    // Background colors
    backgroundSecondary: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',

    // Text colors (updated for new design)
    textDisabled: '#BFBFBF',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',

    // Border colors
    border: '#E0E0E0',
    borderFocus: '#439A86',
    borderError: '#DC2626',
    borderLight: '#EAEAEA',
    },

    spacing: {
    // Spacing scale (in pixels)
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Component-specific styling
  components: {
    // Button styles based on design specifications
    button: {
      // Primary button style
      primary: {
        height: 60,
        backgroundColor: '#39afbc',
        borderRadius: 6,
        paddingHorizontal: 16,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        opacity: 1,
        // Minimum tap target size (44dp as per accessibility guidelines)
        minHeight: 44,
        minWidth: 44,
      },

      // Secondary button style
      secondary: {
        height: 60,
        backgroundColor: 'transparent',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#1f637a',
        paddingHorizontal: 16,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        opacity: 1,
        minHeight: 44,
        minWidth: 44,
      },

      // Link button style
      link: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 8,
        justifyContent: 'center' as const,
        alignItems: 'flex-start' as const,
      },
    },

    // Input field styles
    input: {
      // Primary input style
      primary: {
        height: 60,
        borderWidth: 1,
        borderColor: '#E57373',
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 18,
        backgroundColor: '#FFFFFF',
        opacity: 1,
        fontSize: 16,
        color: '#E57373',
        fontFamily: 'Noto Sans',
      },

      // Focus state
      focus: {
        borderColor: '#439A86',
        borderWidth: 2,
      },

      // Error state
      error: {
        borderColor: '#DC2626',
        borderWidth: 1,
      },

      // Disabled state
      disabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#BFBFBF',
        color: '#BFBFBF',
      },
    },

    card: {
      borderRadius: 12,
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#EAEAEA',
    },

    badge: {
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
      minHeight: 24,
    },

    // Form field container
    formField: {
      marginBottom: 16,
    },

    // Form label
    label: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '500',
      color: '#E57373',
      fontFamily: 'Noto Sans',
    },

    // Dividers and separators
    divider: {
      height: 1,
      backgroundColor: '#EAEAEA',
      marginVertical: 16,
    },
  },

  typography: {
    // Font families (Noto Sans as primary)
    fontFamily: {
      primary: 'Noto Sans',
      regular: 'Noto Sans',
      medium: 'Noto Sans',
      bold: 'Noto Sans',
      fallback: 'System', // Fallback if Noto Sans is not available
    },

    // Font sizes (based on design specifications)
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,

      // Design system specific sizes
      normal: 14, // Normal Text: 14px
      medium: 16, // Medium Text: 16px
      button: 18, // Button Text: 18px
    },

    // Line heights (based on design specifications)
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,

      // Design system specific line heights
      normalText: 19 / 14, // Normal Text: 19px/14px = 1.357
      mediumText: 22 / 16, // Medium Text: 22px/16px = 1.375
      buttonText: 24 / 18, // Button Text: 24px/18px = 1.333
    },

    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    // Complete text style definitions
    textStyles: {
      // Button text style
      button: {
        fontFamily: 'Noto Sans',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'left' as const,
        letterSpacing: 0,
      },

      // Normal text style
      normal: {
        fontFamily: 'Noto Sans',
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '500', // medium
        color: '#E57373',
        textAlign: 'left' as const,
        letterSpacing: 0,
      },

      // Medium text style
      medium: {
        fontFamily: 'Noto Sans',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600',
        color: '#E57373',
        textAlign: 'left' as const,
        letterSpacing: 0,
      },

      // Header text style
      header: {
        fontFamily: 'Noto Sans',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600',
        color: '#E57373',
        textAlign: 'left' as const,
        letterSpacing: 0,
      },

      // Link text style
      link: {
        fontFamily: 'Noto Sans',
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '500',
        color: '#439A86',
        textAlign: 'left' as const,
        letterSpacing: 0,
        textDecorationLine: 'underline' as const,
        textDecorationColor: '#EAEAEA',
      },
    },
  },
};