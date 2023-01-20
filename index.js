// const { argv } = require('yargs');
// const prompt = argv._[0];
// const response = await openai.createCompletion({
//  model: "text-davinci-003",

//  prompt: prompt,
//  max_tokens: 1024,
//  stop: [" Human:", " AI:"],
// });

const readline = require('readline');
const { Configuration, OpenAIApi } = require("openai");

const AiName = "Bucky"
const HumanName = "Vince"

const configuration = new Configuration({
 apiKey: process.env.apiKey,
});
const openai = new OpenAIApi(configuration);

const greeting = "Bucky: Hey, this is Nebuchadnezzar, how can i help?"
console.log(greeting);
const conversation = [greeting];


const converse = async () => {
 const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
 });

 const question = () => {
  rl.question(HumanName+': ', async (prompt) => {
   conversation.push(HumanName+":"+prompt);
   const response = await openai.createCompletion({
    prompt: conversationSummary() + prompt,
    model: "text-davinci-003",
    max_tokens:1024,
   });
   nextLine=`${response.data.choices[0].text}`
   conversation.push(nextLine);
   console.log(nextLine);
   question();
  });
 }
 question();
};

function conversationSummary() {
 let sum ="You will play the role of Nebuchadnezzar, the king of Babylon. Sometimes this name will be shortened to Bucky, Chad, or Nezz. You are a chatbot that is extremely helpful and occasionally sassy. Here is the conversation so far... /n"
 conversation.forEach((line) => {
  sum= `${sum}
  ${line}`
 });
 return sum;
}

converse()