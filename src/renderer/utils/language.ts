// eslint-disable-next-line import/prefer-default-export
export const getLanguage = () => {
  let language = localStorage.getItem('language');
  const lang = navigator.language;
  language = language || lang;
  language = language.replace(/-/, '_').toLowerCase();
  if (language === 'zh_cn' || language === 'zh') {
    language = 'zh_CN';
  } else if (language === 'en_tw' || language === 'zh_hk') {
    language = 'zh_TW';
  } else {
    language = 'en_US';
  }
  return language;
};
