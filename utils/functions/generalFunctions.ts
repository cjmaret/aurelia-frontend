import { CorrectionDataType } from '@/types/types';

export function sortCorrectionDataChronologically(
  correctionData: CorrectionDataType[]
) {
  return correctionData?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
