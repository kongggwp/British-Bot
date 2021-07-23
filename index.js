const Discord = require("discord.js");
const memberCounter= require("./counters/member-counter");
const ytdl = require("ytdl-core");
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL" , "REACTION"]});
const token = 'ODY3NjU2OTYwMzcxMDY0ODYy.YPkSgw.36BGsgoY0o_CFnj434Fsck5LIw8';
const queue = new Map();
const prefix ='=';

//client.commands = new Discord.Collection();
//client.events = new Discord.Collection();

//['command_handler','event_handler'].forEach(handler =>{
//  require(`./handlers/${handler}`)(client, Discord);
//})

client.on("ready", () => {
  console.log("Ready!");
  memberCounter(client);
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } 
  else if(message.content ==="=help"){
    message.channel.send("1.พิมพ์ 'ตารางสอน ห้อง' เช่น 'ตารางสอน 442' เพื่อเเสดงตารางสอน")
    message.channel.send("2.พิมพ์ '+play LinkเพลงในYoutube' เพื่อฟังเพลง")
    message.channel.send("3.พิมพ์ 'กฎ' เพื่อดูกฎระเบียบเซิฟเว่อ")
  }
  else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  }
  else {
    message.channel.send("อย่าพิมพ์อะไรมั่วๆ!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "อยู่ในห้องก่อนเปิดเพลงดิ"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} อยู่ในคิว!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "อยู่ในห้องก่อนดิ!"
    );
  if (!serverQueue)
    return message.channel.send("ไม่เห็นมีไรให้ skip !");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "ไม่ได้เปิดเพลงจะหยุดได้ไง!"
    );
    
  if (!serverQueue)
    return message.channel.send("ไม่ได้เปิดเพลงจะหยุดได้ไง!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.on('message',msg=>{
    //ตารางสอน
    if(msg.content ==="ตารางสอน 421"){
        msg.reply("ตารางสอนห้อง 421",{files:["./421.jpg"]});}
    if(msg.content ==="ตารางสอน 441"){
        msg.reply("ตารางสอนห้อง 441",{files:["./441.jpg"]});}
    if(msg.content ==="ตารางสอน 442"){
        msg.reply("ตารางสอนห้อง 442",{files:["./442.jpg"]});}
    if(msg.content ==="ตารางสอน 443"){
        msg.reply("ตารางสอนห้อง 443",{files:["./443.jpg"]});}
    if(msg.content ==="ตารางสอน 444"){
        msg.reply("ตารางสอนห้อง 444",{files:["./444.png"]});}
    if(msg.content ==="ตารางสอน 445"){
        msg.reply("ตารางสอนห้อง 445",{files:["./445.jpg"]});}
    if(msg.content ==="ตารางสอน 446"){
        msg.reply("ตารางสอนห้อง 446",{files:["./446.jpg"]});}
    //อื่นๆ
    if(msg.content ==="กฎ"){
      msg.channel.send("1.อย่ากวนตีนภีม");
    }
    if(msg.content ==="Owner"){
      msg.channel.send({fisles:["./Peam_.jpg"]});}
    if(msg.content ==="Dev"){
      msg.channel.send({files:["./Kong.jpg"]});}
    //คำสั่งRaid
    if(msg.content ==="ขยะ"){ 
      for(let i = 0; i < 100; i++){
        msg.channel.send("พวกขยะ");}
      };
    }
)

client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // if the message content starts with "!ban"
  if (message.content.startsWith('!ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.members.resolve(user);
      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
         */
        member
          .ban({
            reason: 'They were bad!',
          })
          .then(() => {
            // We let the message author know we were able to ban the person
            message.channel.send(`Successfully banned ${user.tag}`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to ban the member,
            // either due to missing permissions or role hierarchy
            message.channel.send('I was unable to ban the member');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.channel.send("That user isn't in this guild!");
      }
    } else {
      // Otherwise, if no user was mentioned
      message.channel.send("You didn't mention the user to ban!");
    }
  }
});
client.login(token);