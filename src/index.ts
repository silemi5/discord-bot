/* eslint-disable prefer-const */
import Discord, { Message } from 'discord.js';
import R from 'ramda';

interface Club {
  name: string;
  members: (Discord.User | Discord.PartialUser)[];
}

interface Rollcall {
  club: string;
  present: (Discord.User | Discord.PartialUser)[];
}

const client = new Discord.Client();
const prefix = '> ';

let clubs: Club[] = [
  {
    name: 'mission-control',
    members: [],
  }
];

let rollcalls: Rollcall[] = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageReactionAdd', (messageReaction, user) => {
  if (!messageReaction.message.author.bot) return;
  if (user.bot) return;

  const clubToFind = messageReaction.message.content.split('`')[1];

  if (messageReaction.message.content.startsWith('[🚀]')) {
    const club: any = R.find(R.propEq('name', clubToFind))(clubs);
  
    // Club doesn't exist
    if (!club) return;

    // User already a member
    if(R.includes(user, club.members)) return;
  
    const clubIndex = R.findIndex(R.propEq('name', clubToFind))(clubs);
    clubs[clubIndex].members.push(user);
  }

  if (messageReaction.message.content.startsWith('[✔️]')) {
    const club: any = R.find(R.propEq('club', clubToFind))(rollcalls);
  
    // Club doesn't exist
    if (!club) return;

    if(R.includes(user, club.present)) return;

    const clubIndex = R.findIndex(R.propEq('club', clubToFind))(rollcalls);
    rollcalls[clubIndex].present.push(user);
    console.log('nice');
  }
});

client.on('message', async (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'join') {
    if(!args[0]) {
      message.channel.send(`${message.author}, please indicate what club do you want to join.`);
      return;
    }

    const club: any = R.find(R.propEq('name', args[0]))(clubs);

    // Club doesn't exist
    if (!club) {
      message.channel.send(`${message.author}, that club doesn't exist!`);
      return;
    }

    // User already a member
    if(R.includes(message.author, club.members)) {
      message.channel.send(`${message.author}, you already joined ${args[0]}!`);
      return;
    }

    // Adds to club
    const clubIndex = R.findIndex(R.propEq('name', args[0]))(clubs);
    clubs[clubIndex].members.push(message.author);
    message.channel.send(`Welcome to ${args[0]} ${message.author}!`);
  }

  if (command === 'react') {
    if(!args[0]) {
      message.channel.send(`${message.author}, please indicate what club do you want to list.`);
      message.delete();
      return;
    }

    if (!R.find(R.propEq('name', args[0]))(clubs)) {
      message.channel.send(`${message.author}, that club doesn't exist!`);
      return;
    }

    const msgToSent = await message.channel.send(`[🚀] React to join \`${args[0]}\``);
    msgToSent.react('🚀');
    message.delete();
  }

  if (command === 'list') {
    if (args[0] === 'members') {
      if (!args[1]) {
        message.channel.send(`${message.author}, please indicate what club do you want to list.`);
        return;
      }

      const club: any = R.find(R.propEq('name', args[1]))(clubs);

      // Club doesn't exist
      if (!club) {
        message.channel.send(`${message.author}, that club doesn't exist!`);
        return;
      }

      let messageListString = `**Members for ${args[1]}**`;
      
      R.forEach((member: Discord.User) => {
        messageListString += `\n${member}`
      }, club.members);

      message.channel.send(messageListString);
    }
  }

  if (command === 'rollcall') {
    if (!args[0] || !args[1]) {
      message.channel.send(`Invalid parameters. It should be \`> rollcall [present|call]\`.`);
      return;
    }

    if (args[0] === 'call') {
      // Club doesn't exist
      if (!R.find(R.propEq('name', args[1]))(clubs)) {
        message.channel.send(`${message.author}, that club doesn't exist!`);
        return;
      }

      // Rollcall already exists!
      if (R.find(R.propEq('club', args[1]))(rollcalls)) return;

      rollcalls.push({
        club: args[1],
        present: [],
      });

      const msgSent = await message.channel.send(`[✔️] Calling @here who are members of \`${args[1]}\`, react to be marked as present.`);
      msgSent.react('✔️');
      message.delete();
      return;
    }

    if (args[0] === 'present') {
      const club: any = R.find(R.propEq('name', args[1]))(clubs);
      // Club doesn't exist
      if (!club) {
        message.channel.send(`${message.author}, that club doesn't exist!`);
        return;
      }

      const rollcall: any = R.find(R.propEq('club', args[1]))(rollcalls);

      // Rollcall doesn't exist
      if (!rollcall) {
        message.channel.send(`${message.author}, that rollcall doesn't exist yet!`);
        return;
      };

      let messageStringToSent = `**Rollcall in \`${args[1]}\`**`;
      R.forEach((member: Discord.User) => {
        if (R.includes(member, rollcall.present)) {
          messageStringToSent += `\n${member}`;
        } else {
          messageStringToSent += `\n~~${member}~~`;
        }
      }, club.members);
      // messageStringToSent += `\n\b**Absent:`;
      // R.forEach((member: Discord.User) => {
      //   if (!R.includes(member, club.present)) {
      //     messageStringToSent += `\n${member}`;
      //   }
      // }, club.members);

      message.channel.send(messageStringToSent);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
