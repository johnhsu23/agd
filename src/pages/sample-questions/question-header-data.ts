export interface QuestionBarData {
  readonly naepid: string;
  readonly value: number;
  readonly label: string;
}

// Labels for the bars (e.g. XX% Correct)
const multipleChoiceLabel = 'Correct';
const acceptableLabel = 'Acceptable';
const sufficientLabel = 'Sufficient';
const adequateLabel = 'Adequate';
const developedLabel = 'Developed';

export const questionData: {[k: string]: QuestionBarData} = {
  /**
   * Visual Arts
   */
  VC00003: {
    naepid: 'VC00003',
    value: 41.19,
    label: multipleChoiceLabel,
  },
  VC00002: {
    naepid: 'VC00002',
    value: 35.84,
    label: acceptableLabel,
  },
  VC000B6: {
    naepid: 'VC000B6',
    value: 3.4,
    label: sufficientLabel,
  },
  VC00001: {
    naepid: 'VC00001',
    value: 41.37,
    label: multipleChoiceLabel,
  },
  // LD000458 (VCCL004): non-NQT item. using Part A data
  VCCL004: {
    naepid: 'VCCL004',
    value: 49.15,
    label: acceptableLabel + ' (part A)',
  },

  /**
   * Music
   */
  UD00002: {
    naepid: 'UD00002',
    value: 56.18,
    label: multipleChoiceLabel,
  },
  UE00006: {
    naepid: 'UE00006',
    value: 17.73,
    label: adequateLabel,
  },
  UF00004: {
    naepid: 'UF00004',
    value: 50.53,
    label: multipleChoiceLabel,
  },
  UDCL009: {
    naepid: 'UDCL009',
    value: 49.28,
    label: developedLabel,
  },
  UE00005: {
    naepid: 'UE00005',
    value: 47.98,
    label: multipleChoiceLabel,
  },
  UE00007: {
    naepid: 'UE00007',
    value: 53.84,
    label: multipleChoiceLabel,
  },
  UECL008: {
    naepid: 'UECL008',
    value: 16.69,
    label: developedLabel,
  },
};
