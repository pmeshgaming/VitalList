const { getCode, clean } = require("@elara-services/eval-helper");

module.exports = {
    name: "eval",
    description: "Evaluates Javascript code in a command.",
    async run(client, message, args) {
        if (!global.config.developers.includes(message.author.id)) return null; 
        if (!args[0]) return message.reply(`:x: You must provide a code to evaluate.`);
        const evaled = await getCode({ code: args.join(" ") });
        const code = await clean(eval(evaled), [ client.token ]);
        try {
            return message.reply(`:white_check_mark: Successfully evaluated.\n\`\`\`js\n${code}\n\`\`\``);
        } catch (e) {
            return message.reply(`:x: There was an error during evaluation.\n\`\`\`js\n${e}\`\`\``)
        }
    },
};
