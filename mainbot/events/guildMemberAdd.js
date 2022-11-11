module.exports = {
    async run(client, member) {
      if(member.user.bot) {

        if(member.guild.id === global.config.guilds.main) {
         member.roles.add(global.config.roles.bots)
        }
        if(member.guild.id === global.config.guilds.testing) {
            member.roles.add(global.config.roles.botsintesting)
        }
      } 
      if(!member.user.bot) {
        if(member.guild.id === global.config.guilds.main) {
        client.channels.resolve("1017613906107175002").send(`<:VD_add:1006511788155752558> \`${member.user.username}\` has joined the server.`).catch(() => null);
        member.roles.add("1006067703238369291")
            //client.channels.resolve("1017613906107175002").send("<:VD_add:1006511788155752558> `"+member.user.username+"` has joined the server.")
      }
     }
    },
  };
  
