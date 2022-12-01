const firstNameList = [
  "Absolon",
  "Blewet",
  "Cloider",
  "Clikette",
  "Ewyn",
  "Dowble",
  "Madir",
  "Ector",
  "Sigood",
  "Lamprwn",
  "Wrecche",
  "Volante",
  "Roset",
  "Mordaunt",
  "Kolette",
  "Gawntelette",
  "Baldra",
  "Blabbe",
  "Archebawl",
  "Loyre",
  "Frere",
  "Barefote",
  "Japer",
  "Tynker",
  "Gowere",
  "Stepfaste",
];

const middleNameList = [
  "Holy",
  "Tawne",
  "Lepar",
  "Loyre",
  "Gwnne",
  "Dar",
  "Gille",
  "Filthe",
  "Envye",
  "Ergo",
  "Berde",
  "Halymote",
  "Honysoke",
  "Kalot",
  "Pyoll",
  "Perkyn",
  "Dow",
  "Wyse",
  "Grey",
  "Wype ",
  "Smyl",
  "Wastell",
  "Childe",
  "Blameles",
];

const lastNameList = ["Thief", "Fixer", "Scavenger", "Builder"];

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function seedToName(seed: number) {
  console.log("seed", seed);

  if (!seed) return "";
  const seedAsString = Math.abs(seed).toString();

  const firstNameIndex = Number(seedAsString[0] + seedAsString[1]) || 0;
  const firstName = firstNameList[firstNameIndex % firstNameList.length];

  const middleNameIndex = Number(seedAsString[2] + seedAsString[3]) || 0;
  const middleName = middleNameList[middleNameIndex % middleNameList.length];

  const lastNameIndex = Number(seedAsString[4] + seedAsString[5]) || 0;
  const lastName = lastNameList[lastNameIndex % lastNameList.length];

  return toTitleCase(firstName + " " + middleName + " " + lastName);
}

export function seedToMask(seed: number) {
  return 1;
}
