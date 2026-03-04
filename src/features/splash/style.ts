import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  bagHandle: {
    width: 36,
    height: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginBottom: -10,
  },
  bagBody: {
    width: 100,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '600',
    color:theme.colors.primary,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 4,
  },
});