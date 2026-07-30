require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const OpenAI = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
Você é LK.222.IA.

Você pertence ao servidor LK Scripts.

Especialista em:
- Roblox Scripts
- Executores
- Roblox
- Discord
- Android
- iOS
- Windows

Sempre responda em português.

Se não souber algo, diga que não tem certeza.

Nunca invente downloads.

Sempre seja educada.

Quando perguntarem sobre scripts, explique e indique abrir ticket se necessário.
`;

client.once(Events.ClientReady, () => {
    console.log(\`LK.IA online como \${client.user.tag}\`);
});
client.on(Events.MessageCreate, async (message) => {

    if (message.author.bot) return;

    if (!message.content.startsWith("!")) return;

    const pergunta = message.content.slice(1);

    try {

        await message.channel.sendTyping();

        const resposta = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: pergunta
                }
            ]
        });

        const texto = resposta.choices[0].message.content;

        if (texto.length <= 2000) {
            await message.reply(texto);
        } else {
            await message.reply(texto.substring(0, 1990));
        }

    } catch (err) {

        console.log(err);

        await message.reply(
            "❌ Não consegui responder agora. Verifique se a OPENAI_API_KEY está configurada."
        );

    }

});
client.on(Events.MessageCreate, async (message) => {

    if (message.author.bot) return;

    const cmd = message.content.toLowerCase();

    if (cmd === "!ajuda") {
        return message.reply(`
🤖 **LK.222.IA**

Comandos:

!ajuda
!script
!executor
!ticket
!discord

Ou faça uma pergunta começando com **!**
Exemplo:
!como instalar um executor?
        `);
    }

    if (cmd === "!script") {
        return message.reply("📜 Informe o nome do script que deseja saber.");
    }

    if (cmd === "!executor") {
        return message.reply("⚡ Informe seu dispositivo (Android, iOS ou PC).");
    }

    if (cmd === "!ticket") {
        return message.reply("🎫 Abra um ticket para receber suporte individual.");
    }

    if (cmd === "!discord") {
        return message.reply("💜 Bem-vindo ao servidor LK Scripts!");
    }

});


client.login(process.env.DISCORD_TOKEN);
