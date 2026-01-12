// 대분류 치료 분야
export enum CareCategory {
  EYEAREA = 'EYEAREA',
  MOUTHAREA = 'MOUTHAREA',
  JAWLINE = 'JAWLINE',
  VOLUMESTRUCTURE = 'VOLUMESTRUCTURE',
  SKINELASTICITY = 'SKINELASTICITY',
  SKINTONE = 'SKINTONE',
  ACNESCAR = 'ACNESCAR',
  PORETEXTURE = 'PORETEXTURE',
  SKINSENSITIVITY = 'SKINSENSITIVITY',
  HAIRSCALP = 'HAIRSCALP',
  BODYUPPER = 'BODYUPPER',
  BODYLOWER = 'BODYLOWER',
  BODYELASTICITY = 'BODYELASTICITY',
  BODYSHAPE = 'BODYSHAPE',
  OVERALLIMPRESSION = 'OVERALLIMPRESSION',
}

export namespace CareCategory {
  const labels: Record<CareCategory, string> = {
    [CareCategory.EYEAREA]: '눈 주변',
    [CareCategory.MOUTHAREA]: '입가 · 표정',
    [CareCategory.JAWLINE]: '턱선 · 하안면',
    [CareCategory.VOLUMESTRUCTURE]: '볼륨 · 구조',
    [CareCategory.SKINELASTICITY]: '피부 탄력 · 결',
    [CareCategory.SKINTONE]: '피부 톤 · 인상',
    [CareCategory.ACNESCAR]: '여드름 흔적',
    [CareCategory.PORETEXTURE]: '모공 · 결',
    [CareCategory.SKINSENSITIVITY]: '피부 민감 · 회복',
    [CareCategory.HAIRSCALP]: '모발 · 두피',
    [CareCategory.BODYUPPER]: '바디 상체 · 중심',
    [CareCategory.BODYLOWER]: '바디 힙 · 하체',
    [CareCategory.BODYELASTICITY]: '바디 탄력 · 처짐',
    [CareCategory.BODYSHAPE]: '바디 체형 · 비율',
    [CareCategory.OVERALLIMPRESSION]: '전체 인상',
  };

  export function getLabel(area: CareCategory): string {
    return labels[area];
  }

  export function getAll(): CareCategory[] {
    return Object.values(CareCategory);
  }
}

export default CareCategory;
