import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import { BillDetailModel } from '../../data/models/BillDetailModel';
import { BILL_URL } from '../../utils/constants';

const BILLS_FOLDER = `${RNFS.DocumentDirectoryPath}/bills`;

function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim();
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]/g, '_');
  return safe.toLowerCase().endsWith('.pdf') ? safe : `${safe}.pdf`;
}

export function getBillFileName(
  bill: Pick<BillDetailModel, 'billFile'>,
): string {
  const raw = bill.billFile?.trim();
  if (!raw) {
    throw new Error('Bill file name is missing.');
  }
  return sanitizeFileName(raw);
}

export function getLocalBillPath(
  bill: Pick<BillDetailModel, 'billFile'>,
): string {
  return `${BILLS_FOLDER}/${getBillFileName(bill)}`;
}

export function getRemoteBillUrl(fileName: string): string {
  const trimmed = fileName.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `${BILL_URL}${trimmed}`;
}

async function ensureBillsFolder(): Promise<void> {
  const exists = await RNFS.exists(BILLS_FOLDER);
  if (!exists) {
    await RNFS.mkdir(BILLS_FOLDER);
  }
}

export async function isBillDownloaded(
  bill: Pick<BillDetailModel, 'billFile'>,
): Promise<boolean> {
  await ensureBillsFolder();
  const localPath = getLocalBillPath(bill);
  return RNFS.exists(localPath);
}

export async function downloadBill(
  bill: Pick<BillDetailModel, 'billFile'>,
): Promise<string> {
  await ensureBillsFolder();
  const localPath = getLocalBillPath(bill);
  const remoteUrl = getRemoteBillUrl(bill.billFile!);
  const result = await RNFS.downloadFile({
    fromUrl: remoteUrl,
    toFile: localPath,
  }).promise;

  if (result.statusCode !== 200) {
    if (await RNFS.exists(localPath)) {
      await RNFS.unlink(localPath).catch(() => undefined);
    }
    throw new Error('Unable to download bill. Please try again.');
  }

  return localPath;
}

export async function deleteBillFile(
  bill: Pick<BillDetailModel, 'billFile'>,
): Promise<void> {
  const localPath = getLocalBillPath(bill);
  if (await RNFS.exists(localPath)) {
    await RNFS.unlink(localPath);
  }
}

export async function openBillFile(localPath: string): Promise<void> {
  await FileViewer.open(localPath, {
    showOpenWithDialog: true,
    displayName: 'Bill',
  });
}
