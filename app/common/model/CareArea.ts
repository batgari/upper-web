import { CareCategory } from './CareCategory';

// 소분류 치료 분야
export enum CareArea {
  // 눈 주변
  EYEAREA_DARKCIRCLES = 'EYEAREA_DARKCIRCLES',
  EYEAREA_UNDEREYEHOLLOWS = 'EYEAREA_UNDEREYEHOLLOWS',
  EYEAREA_WRINKLES = 'EYEAREA_WRINKLES',

  // 입가/표정
  MOUTHAREA_WRINKLES = 'MOUTHAREA_WRINKLES',
  MOUTHAREA_NASOLABIALFOLDS = 'MOUTHAREA_NASOLABIALFOLDS',
  MOUTHAREA_PERIORALWRINKLES = 'MOUTHAREA_PERIORALWRINKLES',

  // 턱선/하안면
  JAWLINE_SAGGING = 'JAWLINE_SAGGING',
  JAWLINE_DOUBLECHIN = 'JAWLINE_DOUBLECHIN',
  JAWLINE_SQUAREJAW = 'JAWLINE_SQUAREJAW',
}

export namespace CareArea {
  const labels: Record<CareArea, string> = {
    // 눈 주변
    [CareArea.EYEAREA_DARKCIRCLES]: '다크서클',
    [CareArea.EYEAREA_UNDEREYEHOLLOWS]: '눈 밑 꺼짐',
    [CareArea.EYEAREA_WRINKLES]: '눈가 잔주름',

    // 입가/표정
    [CareArea.MOUTHAREA_WRINKLES]: '입가 주름',
    [CareArea.MOUTHAREA_NASOLABIALFOLDS]: '팔자 주름',
    [CareArea.MOUTHAREA_PERIORALWRINKLES]: '입 주변 잔주름',

    // 턱선/하안면
    [CareArea.JAWLINE_SAGGING]: '턱선 처짐',
    [CareArea.JAWLINE_DOUBLECHIN]: '이중턱',
    [CareArea.JAWLINE_SQUAREJAW]: '사각턱',
  };

  export function getLabel(area: CareArea): string {
    return labels[area];
  }

  export function getCareCategory(area: CareArea): CareCategory {
    // '_' 앞부분 추출 (예: 'EYEAREA_DARKCIRCLES' -> 'EYEAREA')
    const prefix = area.split('_')[0];
    return prefix as CareCategory;
  }

  export function getCareAreaByCareCategory(careCategory: CareCategory): CareArea[] {
    return (Object.values(CareArea) as string[]).filter(area => area.startsWith(careCategory));
  }
}
