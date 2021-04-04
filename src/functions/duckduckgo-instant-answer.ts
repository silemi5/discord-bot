import fetch from 'node-fetch';

export default async function (args: string[]): Promise<{
  Abstract: string;
  AbstractText: string;
  AbstractSource: string;
  AbstractURL: string;
  Image: string;
  Heading: string;
  Answer: string;
  AnswerType: string;
  RelatedTopics: {
    Result: string;
    FirstURL: string;
    Icon: {
      URL: string;
      Height: number;
      Width: number;
    }
    Text: string;
  }[];
  Type: string;
  Redirect: string;
}> {
  const query = args.join('+');

  const url = `https://api.duckduckgo.com/?q=${query}&format=json&t=discord-bot&no_html=1&pretty=1`;

  return fetch(url).then((res) => res.json());
}
