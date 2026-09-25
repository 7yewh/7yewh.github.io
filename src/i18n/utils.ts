import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** 生成带语言前缀的路径：默认语言无前缀，其余语言加 /en 等 */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return `/${lang}${clean === '/' ? '' : clean}`;
}

/** 把当前路径切换到另一种语言 */
export function switchLangPath(url: URL, target: Lang): string {
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] in ui) parts.shift();
  const rest = '/' + parts.join('/');
  return localePath(target, rest === '/' ? '/' : rest + (url.pathname.endsWith('/') && rest !== '/' ? '/' : ''));
}

/** 内容集合的 id 形如 "zh/slug"，拆出语言和 slug */
export function splitEntryId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: (lang in ui ? lang : defaultLang) as Lang, slug: rest.join('/') };
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'long' : 'short',
    day: 'numeric',
  });
}
