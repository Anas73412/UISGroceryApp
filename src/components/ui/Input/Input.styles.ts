import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

const { primary } = theme.colors;

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  leftIcon: {
    marginRight: 1,
  },
  rightElement: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  inputWithLeftIcon: {},
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});
