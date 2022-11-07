const inspect = require("util").inspect;
module.exports = {
  name: "eval",
  description: "Evaluates Javascript code in a command.",
  async run(client, message, args) {
    if (!global.config.owners.includes(message.author.id)) return;
    if (!args[0])
      return message.reply({
        content: `:x: You must provide a code to evaluate.`,
      });
    let evaled;
    try {
      evaled = await eval(args.join(" "));
      if (evaled == client.token)
        return message.reply({
          content: `:x: Stop trying to get my token, this is why your dad left.`,
        });
      if (typeof evaled !== "string") {
        evaled = inspect(evaled);
        message.channel.send({
          content: `:white_check_mark: Successfully evaluated.\n\`\`\`js\n${evaled}\n\`\`\``,
        });
      } else {
        message.channel.send({
          content: `:white_check_mark: Successfully evaluated.\n\`\`\`js\n${evaled}\n\`\`\``,
        });
      }
    } catch (error) {
      console.error(error);
      message.reply({ content: `:x: There was an error during evaluation.` });
    }
  },
};

// use https://npmjs.com/package/@elara-services/eval-helper , this is just no
