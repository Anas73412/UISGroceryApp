import { StyleSheet } from 'react-native';
import { appTheme } from '../../../theme';

const { primary, background } = appTheme;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: background,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  digitInput: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    padding: 0,
    marginHorizontal: 4,
  },
  digitInputFocused: {
    borderColor: primary,
    backgroundColor: '#fff',
  },
  digitInputFilled: {
    borderColor: primary,
    backgroundColor: 'rgba(57, 175, 188, 0.08)',
  },
  actions: {
    flexDirection: 'row',
  },
  buttonCancel: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
    marginRight: 6,
  },
  buttonVerify: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primary,
    marginLeft: 6,
  },
  buttonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  buttonVerifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
