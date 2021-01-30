/* eslint-disable prefer-const */
import Discord, { Message } from 'discord.js';
import fetch from 'node-fetch';
import R from 'ramda';

const client = new Discord.Client();
const prefix = '> ';
const loginToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('message', async (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'listcommits') {
    if (!args[0] || !args[1]) {
      message.channel.send(`${message.author}, there's an error with your parameters.`);
      message.channel.send("Here's the correct format: `> listcommit {owner} {repository}`");
      return;
    }

    const response = await fetch(
      `https://api.github.com/repos/${args[0]}/${args[1]}/commits?per_page=5`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${loginToken}`,
        },
      },
    ).then((res) => res.json());

    let commits: { name: any; value: string; }[] = [];
    R.forEach((commit: { sha: string, commit: { message: string, htmlUrl: string } }) => {
      commits.push({
        name: `${commit.commit.message}`,
        value: `[commit](${commit.commit.htmlUrl}) hash: \`${commit.sha}\``,
      });
    }, response);

    const commitsEmbed = {
      title: `5 latest commits from ${args[0]}/${args[1]}`,
      author: {
        name: `${args[0]}`,
        url: `https://github.com/${args[0]}`,
      },
      fields: commits,
      timestamp: new Date(),
      footer: {
        text: "Emir's little bot",
      },
    };

    message.channel.send({ embed: commitsEmbed });
  }
});

client.login(process.env.DISCORD_TOKEN);
