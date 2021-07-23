module.exports = async (client) =>{
    const guild = client.guilds.cache.get('867216959492587560');
    setInterval(()=>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('867943641652555786');
        channel.setName(`British Members : ${memberCount.toLocaleString()}`);
        console.log(`Updating Member Count : ${memberCount.toLocaleString()}`);
    }, 5000);
}