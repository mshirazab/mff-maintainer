const fs = require("fs");
var fuzzy = require("fuzzy");
const downloadImage = require("./downloadImage");
const uniformData = JSON.parse(fs.readFileSync("./uniformData.json"));
const charecterData = JSON.parse(fs.readFileSync("./charecterData.json"));

const filterUnis = async (_, input) => {
  input = input || "";
  const uniformNames = Object.values(uniformData).map(elem => elem.name);
  var fuzzyResult = fuzzy.filter(input, uniformNames);
  return fuzzyResult.map(el => el.original);
};
const getUniId = val => {
  return Object.keys(uniformData).find(
    uniformId => uniformData[uniformId].name === val
  );
};
const filterCharecters = async (_, input) => {
  input = input || "";
  const charecterNames = Object.values(charecterData).map(elem => elem.name);
  var fuzzyResult = fuzzy.filter(input, charecterNames);
  return fuzzyResult.map(el => el.original);
};
const getCharecterId = val => {
  return (
    Object.keys(charecterData).find(
      uniformId => charecterData[uniformId].name === val
    ) || val
  );
};
const charName = {
  type: "autocomplete",
  name: "charecterId",
  message: "What is the name of charecter",
  suggestOnly: true,
  source: filterCharecters,
  filter: getCharecterId
};
const name = {
  type: "input",
  name: "name",
  message: "What is the name of uniform",
  filter: val => val.toUpperCase()
};
const cost = {
  type: "list",
  name: "cost",
  message: "How much does it cost",
  choices: ["1250 Crystals", "1750 Crystals", "2500 Crystals", "Other"]
};
const specialCost = {
  type: "input",
  name: "cost",
  message: "What is the cost",
  when: answers => answers.cost === "Other"
};
const uniformOptionQuestions = [...Array(5)].map((_, index) => ({
  type: "autocomplete",
  name: `options[${index}]`,
  message: `What is the uniform option ${index + 1}`,
  source: filterUnis,
  filter: getUniId
}));

const potraitCode = {
  type: "input",
  name: "potrait_code",
  message: "What is the potrait code"
};

const questions = [
  charName,
  name,
  cost,
  specialCost,
  potraitCode,
  ...uniformOptionQuestions
];
const resolveAnswers = answers => {
  console.log(answers, Object.keys(uniformData).length);
  uniformData[`${Object.keys(uniformData).length}`] = answers;
  downloadImage(
    `https://mheroesgb.gcdn.netmarble.com/mheroesgb/DIST/Forum/${answers.potrait_code}.png`,
    `./images/${answers.potrait_code}.png`
  );
  fs.writeFileSync("./uniformData.temp.json", JSON.stringify(uniformData));
};
module.exports = { questions, resolveAnswers };
