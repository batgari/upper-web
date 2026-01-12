// 언어
export enum Language {
  CHINESE = 'CHINESE',           // 중국어
  ENGLISH = 'ENGLISH',           // 영어
  SPANISH = 'SPANISH',           // 스페인어
  ARABIC = 'ARABIC',             // 아랍어
  PORTUGUESE = 'PORTUGUESE',     // 포르투갈어
  RUSSIAN = 'RUSSIAN',           // 러시아어
  JAPANESE = 'JAPANESE',         // 일본어
  GERMAN = 'GERMAN',             // 독일어
  FRENCH = 'FRENCH',             // 프랑스어
  TURKISH = 'TURKISH',           // 터키어
  VIETNAMESE = 'VIETNAMESE',     // 베트남어
  ITALIAN = 'ITALIAN',           // 이탈리아어
  MALAY = 'MALAY',               // 말레이어
  POLISH = 'POLISH',             // 폴란드어
  UKRAINIAN = 'UKRAINIAN',       // 우크라이나어
  BURMESE = 'BURMESE',           // 미얀마어
  UZBEK = 'UZBEK',               // 우즈베크어
  DUTCH = 'DUTCH',               // 네덜란드어
  NEPALI = 'NEPALI',             // 네팔어
  THAI = 'THAI',                 // 태국어
  HUNGARIAN = 'HUNGARIAN',       // 헝가리어
  GREEK = 'GREEK',               // 그리스어
  CZECH = 'CZECH',               // 체코어
}

export namespace Language {
  const labels: Record<Language, string> = {
    [Language.CHINESE]: '중국어',
    [Language.ENGLISH]: '영어',
    [Language.SPANISH]: '스페인어',
    [Language.ARABIC]: '아랍어',
    [Language.PORTUGUESE]: '포르투갈어',
    [Language.RUSSIAN]: '러시아어',
    [Language.JAPANESE]: '일본어',
    [Language.GERMAN]: '독일어',
    [Language.FRENCH]: '프랑스어',
    [Language.TURKISH]: '터키어',
    [Language.VIETNAMESE]: '베트남어',
    [Language.ITALIAN]: '이탈리아어',
    [Language.MALAY]: '말레이어',
    [Language.POLISH]: '폴란드어',
    [Language.UKRAINIAN]: '우크라이나어',
    [Language.BURMESE]: '미얀마어',
    [Language.UZBEK]: '우즈베크어',
    [Language.DUTCH]: '네덜란드어',
    [Language.NEPALI]: '네팔어',
    [Language.THAI]: '태국어',
    [Language.HUNGARIAN]: '헝가리어',
    [Language.GREEK]: '그리스어',
    [Language.CZECH]: '체코어',
  };

  export function getLabel(language: Language): string {
    return labels[language];
  }

  export function getAll(): Language[] {
    return Object.values(Language);
  }
}

export default Language;
