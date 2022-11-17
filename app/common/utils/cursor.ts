import { parse } from 'search-params';

export const getCursor = (url?: string): string | undefined => {
  if (!url) return undefined;
  let r: string;
  try {
    r = parse(url).cursor as string;
  } catch (e) {
    r = url.split('cursor=').pop().split('&')[0];
  }
  return r;
};
