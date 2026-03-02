import { StyleSheet } from 'react-native';
import { appTheme } from '../../../../theme';

const { primary, background } = appTheme;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 60,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(57, 175, 188, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: background,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  registerHint: {
    fontSize: 16,
    color: '#4b5563',
  },
  registerLink: {
    color: primary,
    fontWeight: '600',
    fontSize: 16,
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: background,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  themeToggleInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
});
