import { StyleSheet } from 'react-native';
import { appTheme } from '../../../../theme';

const { primary, background } = appTheme;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backArrow: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: primary,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerTitleUnderline: {
    textDecorationLine: 'underline',
  },
  headerSpacer: {
    width: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(57, 175, 188, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(57, 175, 188, 0.3)',
  },
  iconImage: {
    width: 64,
    height: 64,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  mainTitleUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  subtitleLink: {
    color: primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  card: {
    backgroundColor: background,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(57, 175, 188, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 200,
    
  },
  inputIcon: {
    fontSize: 18,
  },
  verifyButton: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  signInHint: {
    fontSize: 16,
    color: '#4b5563',
  },
  registerLink: {
    color: primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
