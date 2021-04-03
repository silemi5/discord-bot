import * as chrono from 'chrono-node';

export default function (args: string[]) {
  const parseDate = chrono.parseDate(args.join(' '));
  const parsedCommand = chrono.parse(args.join(' '));
  const reminder = args.join(' ').slice(0, (parsedCommand[0].index - 1));

  return {
    parseDate,
    reminder,
    parsedCommand,
  };
}
