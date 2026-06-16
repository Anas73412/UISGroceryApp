import { sessionStore } from '../../store/sessionStore';
import { FAILED } from '../../utils/constants';
import {
  deleteBillFile,
  downloadBill,
  getLocalBillPath,
  isBillDownloaded,
  openBillFile,
} from './billFileStorage';
import { billService } from './service';
import type { BillItem } from './types';

type BillPdfDialogHandlers = {
  showConfirm: (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
  }) => void;
  showLoading: (message: string) => void;
  hideLoading: () => void;
  showError: (title: string, message: string) => void;
};

export const billController = {
  async fetchBillList() {
    try {
      const userId = sessionStore.getState().user?.uid ?? 0;
      const res = await billService.getBillList(userId);
      return res;
    } catch (error) {
      return {
        status: FAILED,
        data: null,
        message: (error as Error).message || 'Failed to load bill list',
      };
    }
  },

  async handleBillPdfPress(
    bill: BillItem,
    handlers: BillPdfDialogHandlers,
  ): Promise<void> {
    const fileName = bill.billFile?.trim();
    if (!fileName) {
      handlers.showError('Bill unavailable', 'PDF file name is missing for this bill.');
      return;
    }

    const billFileRef = { billFile: fileName };

    try {
      const alreadyDownloaded = await isBillDownloaded(billFileRef);

      if (alreadyDownloaded) {
        handlers.showConfirm({
          title: 'Bill already downloaded',
          message: 'This bill is saved on your device. What would you like to do?',
          cancelLabel: 'Open',
          confirmLabel: 'Download Again',
          onCancel: async () => {
            try {
              await openBillFile(getLocalBillPath(billFileRef));
            } catch {
              handlers.showError(
                'Unable to open bill',
                'Could not open the saved bill file.',
              );
            }
          },
          onConfirm: async () => {
            handlers.showLoading('Downloading bill...');
            try {
              await deleteBillFile(billFileRef);
              const localPath = await downloadBill(billFileRef);
              await openBillFile(localPath);
            } catch (error) {
              handlers.showError(
                'Download failed',
                (error as Error).message || 'Could not download the bill.',
              );
            } finally {
              handlers.hideLoading();
            }
          },
        });
        return;
      }

      handlers.showLoading('Downloading bill...');
      try {
        const localPath = await downloadBill(billFileRef);
        await openBillFile(localPath);
      } catch (error) {
        handlers.showError(
          'Download failed',
          (error as Error).message || 'Could not download the bill.',
        );
      } finally {
        handlers.hideLoading();
      }
    } catch (error) {
      handlers.showError(
        'Bill error',
        (error as Error).message || 'Something went wrong while handling the bill.',
      );
    }
  },
};
