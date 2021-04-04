export default function () {
  const commands: {
    command: string;
    description: string;
    example: string | string[];
  }[] = [
    {
      command: 'w',
      description: 'Wikipedia query',
      example: 'w Discord',
    },
    {
      command: 'remind',
      description: 'Reminds a user about something. Uses natural language for setting up time and/or date.',
      example: [
        'remind me to water the plants later this 5pm',
        'remind me to check stocks in 5 minutes',
        'remind for liftoff in 120 seconds',
        'remind to get ready for a date in 3 hours',
      ],
    },
    {
      command: 'q',
      description: 'Provides instant answers about the query provided.',
      example: [
        'q Zamboanga City',
      ],
    },
  ];

  return commands;
}