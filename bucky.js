#!/usr/bin/env node


// const { argv } = require('yargs');
// const prompt = argv._[0];
// const response = await openai.createCompletion({
//  model: "text-davinci-003",

//  prompt: prompt,
//  max_tokens: 1024,
//  stop: [" Human:", " AI:"],
// });

const fs = require('fs');
require('dotenv').config();
const readline = require('readline');
const { Configuration, OpenAIApi } = require("openai");

const datapath = __dirname+"/apiKey.json"

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout
});

const HumanName = "Vince"


const greeting = "Bucky: How can I help?"
const conversation = [greeting];
buckySpeak(greeting);

var apiKey;
apiKey = process.env.APIKEY||getSavedApiKey()|| guaranteeApiKey()
apiKey&&converse();

function guaranteeApiKey() {
 if (!apiKey) {

  rl.question("Please enter your OpenAi Api key, you can get one here https://beta.openai.com/account/api-keys: ", async (answer) => {
  rl.close();

  const configuration = new Configuration({apiKey: answer});
  let openai = new OpenAIApi(configuration);

  openai.createCompletion({
   prompt: "this prompt is testing my apiKey, if you can read this, congratulate me for having a valid apiKey",
   model: "text-davinci-003",
   max_tokens:1024,
  })
  .then((response) => {
   if(response.data.error) return console.log(response.data.error.message)
   buckySpeak(response.data.choices[0]?.text)
   apiKey = answer;
   saveApiKey(answer);
   converse();
  });
  });
 }
}

async function converse(){
 const configuration = new Configuration({apiKey:apiKey});
 const openai = new OpenAIApi(configuration);
 awaitPromptIndefinitely();

 function awaitPromptIndefinitely(){
  consoleColor("reset")
  rl.question('', async (prompt) => {
   if (prompt=="cya") {rl.close();return;}
   conversation.push(HumanName+":"+prompt);
   const response = await openai.createCompletion({
    prompt: conversationSummary() + prompt,
    model: "text-davinci-003",
    max_tokens:1024,
   });
   nextLine=`${response.data.choices[0].text}`
   conversation.push(nextLine);
   buckySpeak(nextLine);
   awaitPromptIndefinitely();
  });
 }
};


////

function conversationSummary() {
 let sum ="You will play the role of Nebuchadnezzar the helpful chatbot who knows how to code. Sometimes this name will be shortened to Bucky, Chad, or Nezz. You are extremely helpful and occasionally sassy. Here is the conversation so far... /n"
 conversation.forEach((line) => {
  sum= `${sum}
  ${line}`
 });
 return sum;
}

function saveApiKey(key) {
 fs.writeFile(datapath, `{"apiKey":"${key}"}`, function(err) {
  if(err) {return console.log(err);}
 });}

function getSavedApiKey() {
 let data = fs.readFileSync(datapath,function(err,data){console.log(data);return data});
 return data&&JSON.parse(data)["apiKey"]
}

function buckySpeak(text) {
 consoleColor("purple")
 console.log(text)
}


function consoleColor(color) {
 let colors ={purple:"\x1b[35m",reset:"\x1b[0m"}
 console.log(colors[color])
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// FgGray = "\x1b[90m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
// BgGray = "\x1b[100m"
}

