const { Client, GatewayIntentBits, SlashCommandStringOption } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const dotenv = require('dotenv');
dotenv.config();
const axios = require("axios");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let quote;
let author;
let contentTH;
let contentEN;

const options = {
  method: 'GET',
  url: 'https://quotes15.p.rapidapi.com/quotes/random/',
  headers: {
    'X-RapidAPI-Key': process.env.RAPID_KEY,
    'X-RapidAPI-Host': process.env.RAPID_HOST
  }
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const quoteRequest = () => {
    axios.request(options).then(function (response) {
        quote = response.data.content
        author = response.data.originator.name
    }).catch(function (error) {
        console.error(error);
    });
}

function translate(sentences, from_lang ='en', to_lang='th'){
  
  let endPoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from_lang}&tl=${to_lang}&dt=t&ie=UTF-8&oe=UTF-8&q=${encodeURIComponent(sentences)}` ;
						
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var jsonText = JSON.parse(this.responseText);
		contentTH = jsonText[0][0][0]
    }
  };
  xhttp.open("GET", endPoint, true);
  xhttp.send();
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  quoteRequest();

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'quote') {
   if (quote) {
      contentEN = `>>> :scroll: **${quote}** - __${author}__`;
      await interaction.reply(contentEN);
      return;
   }
   await interaction.reply(">>> Whoops! Something went wrong. Please try again later.");
  }

  if (interaction.commandName === 'quoteแปลด้วยนะ') {
    translate(quote);
   if (quote && contentTH) {
      await interaction.reply(`>>> :scroll: **${contentTH}** - __${author}__`);
      return
   }
   await interaction.reply(`>>> **มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง**`);
  }
});

client.login(process.env.TOKEN);