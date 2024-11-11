const Discord = require('discord.js')
const fs = require('fs')

module.exports = async (bot, interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused()

        if (interaction.commandName === "help") {
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({ name: cmd.name, value: cmd.name })) : choices.map(choice => ({ name: choice.name, value: choice.name })))
        }

        if (interaction.commandName === "createchannel") {
            const focusedOption = interaction.options.getFocused(true);
            const guild = interaction.guild;
            const entry = focusedOption.value;

            if (focusedOption.name === "type") {

                const isCommunity = guild.features.includes('COMMUNITY');
                let choices;

                if (isCommunity) {
                    choices = [
                        { name: 'Annonce', value: 'announcement' },
                        { name: 'Forum', value: 'forum' },
                        { name: 'Textuel', value: 'textuel' },
                        { name: 'Vocal', value: 'vocal' }
                    ];
                } else {
                    choices = [
                        { name: 'Textuel', value: 'textuel' },
                        { name: 'Vocal', value: 'vocal' }
                    ];
                }


                const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(entry.toLowerCase()));
                await interaction.respond(filtered.map(choice => ({ name: choice.name, value: choice.value })));

            } else if (focusedOption.name === "catégorie") {

                const categories = guild.channels.cache
                    .filter(c => c.type === Discord.ChannelType.GuildCategory)
                    .map(c => ({ name: c.name, value: c.name }));

                const filtered = categories.filter(c => c.name.toLowerCase().startsWith(entry.toLowerCase()));
                await interaction.respond(
                    entry === ""
                        ? categories.map(c => ({ name: c.name, value: c.name }))
                        : filtered.map(c => ({ name: c.name, value: c.name }))
                );
            }

        }

    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        fs.readdirSync("./AllCommandes").forEach(async dir => {
            const files = fs.readdirSync(`./AllCommandes/${dir}`).filter(f => f.endsWith(".js"))
            for (const file of files) {
                let command = require(`../AllCommandes/${dir}/${file}`)
                if (command.name == interaction.commandName) {
                    let commande = require(`../AllCommandes/${dir}/${interaction.commandName}`)
                    commande.run(bot, interaction, interaction.options)
                }

            }
        })


    }
}