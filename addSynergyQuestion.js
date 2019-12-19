const fs = require("fs");
var fuzzy = require("fuzzy");
const prettier = require("prettier");
const downloadImage = require("./downloadImage");

const uniformData = JSON.parse(fs.readFileSync("./uniformData.json"));

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

const uniformName = {
  type: "autocomplete",
  name: "uniformId",
  message: "What is the uniform name",
  source: filterUnis,
  filter: getUniId
};
const synergyUniformName = {
  type: "input",
  name: "synergy[0]",
  message: "What is the synergy uniform name",
  filter: val => val.toUpperCase()
};
const synergyUniformCode = {
  type: "input",
  name: "synergy[1]",
  message: "What is the synergy uniform potrait code",
  default: answers => uniformData[answers.uniformId].potrait_code
};

const questions = [uniformName, synergyUniformName, synergyUniformCode];
const resolveAnswers = answers => {
  console.log(answers);
  downloadImage(
    `https://mheroesgb.gcdn.netmarble.com/mheroesgb/DIST/Forum/${answers.synergy[1]}.png`,
    `./images/${answers.synergy[1]}.png`
  );
  uniformData[answers.uniformId].synergy = answers.synergy;
  fs.writeFileSync(
    "./uniformData.json",
    prettier.format(JSON.stringify(uniformData), { parser: "json" })
  );
};
module.exports = { questions, resolveAnswers };
