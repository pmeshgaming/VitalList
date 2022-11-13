const { getCode, clean } = require("@elara-services/eval-helper");


module.exports = {
  name: "eval",
  description: "Evaluates Javascript code in a command.",
  async run(client, message, args) {
    if (!global.config.owners.includes(message.author.id)) return;
    if (!args[0])
      return message.reply({
        content: `:x: You must provide a code to evaluate.`,
      });
     const evaled = await getCode({
        code: args.join(" "),
        async: true, 
      });
      const code = await clean(eval(evaled), [
        client.token
    ]);
    try { 
      if (typeof code !== "string") {
        message.channel.send({
          content: `:white_check_mark: Successfully evaluated.\n\`\`\`js\n${code}\n\`\`\``,
        });
      } else {
        message.channel.send({
          content: `:white_check_mark: Successfully evaluated.\n\`\`\`js\n${evaled}\n\`\`\``,
        });
      }
    } catch (e) {
      message.channel.send({
        content: ":x: There was an error during evaluation.\n"+ e
      })
    }
  },
};
