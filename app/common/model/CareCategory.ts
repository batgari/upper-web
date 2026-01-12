// 대분류 치료 분야
export enum CareCategory {
  EYEAREA = 'EYEAREA',       // 눈 주변
  MOUTHAREA = 'MOUTHAREA',   // 입가/표정
  JAWLINE = 'JAWLINE',         // 턱선/하안면
}

export namespace CareCategory {
  const labels: Record<CareCategory, string> = {
    [CareCategory.EYEAREA]: '눈 주변',
    [CareCategory.MOUTHAREA]: '입가 · 표정',
    [CareCategory.JAWLINE]: '턱선 · 하안면',
  };

  export function getLabel(area: CareCategory): string {
    return labels[area];
  }

  export function getAll(): CareCategory[] {
    return Object.values(CareCategory);
  }
}
