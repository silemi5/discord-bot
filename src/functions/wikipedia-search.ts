// Reference: https://www.mediawiki.org/wiki/Special:MyLanguage/API:Search#JavaScript
import fetch from 'node-fetch';
import R from 'ramda';

type Search = {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  wordcount: number;
  snippet: string;
  timestamp: Date;
}

export type SearchQuery = {
  query: {
    searchInfo: {
      totalHits: number;
    },
    search: Search[];
  }
}

export default async function (args: string[], lang?: string) {
  const query = args.join(' ').replace('+', '%2B').replace(' ', '+');

  let url = `https://${lang || 'en'}.wikipedia.org/w/api.php`;

  const params = {
    action: 'query',
    list: 'search',
    srsearch: query,
    format: 'json',
  };

  url += '?origin=*';
  R.forEach((param) => {
    url = `${url}&${param}=${params[param]}`;
  }, R.keys(params));

  return fetch(url).then((res) => res.json());
}
