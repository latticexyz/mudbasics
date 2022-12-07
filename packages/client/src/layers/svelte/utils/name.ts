const firstNameList = [
  "Absolon",
  "Clikette",
  "Dowble",
  "Sigood",
  "Roset",
  "Mordaunt",
  "Kolette",
  "Archebawl",
  "Loyre",
  "Frere",
  "Barefote",
  "Tynker",
  "Stepfaste",
  "Holy",
  "Filthe",
  "Envye",
  "Wyse",
  "Grey",
  "Wype ",
  "Smol",
  "Wastell",
  "Childe",
  "Blameles",
  "Gege",
  "E.Z.",
];

const middleNameList = [
  "Mirthquake",
  "Follyhard",
  "Foolfire",
  "Jesteron",
  "Tricksterion",
  "Foolhardy",
  "Jesteria",
  "Prankstor",
  "Jesterious",
  "Foolferno",
  "Foolmarch",
  "Fooltar",
];

const lastNameList = ["I", "II", "III", "IV"];

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function seedToName(seed: number) {
  if (!seed) return "";
  const seedAsString = Math.abs(seed).toString();

  const firstNameIndex = Number(seedAsString[0] + seedAsString[1]) || 0;
  const firstName = firstNameList[firstNameIndex % firstNameList.length];

  const middleNameIndex = Number(seedAsString[2] + seedAsString[3]) || 0;
  const middleName = middleNameList[middleNameIndex % middleNameList.length];

  const lastNameIndex = Number(seedAsString[4] + seedAsString[5]) || 0;
  const lastName = lastNameList[lastNameIndex % lastNameList.length];

  return firstName + " " + middleName + " " + lastName;
}

export function seedToMask(seed: number) {
  if (!seed) return 0;
  const seedAsString = Math.abs(seed).toString();
  return (Number(seedAsString[4] + seedAsString[5]) || 0) % 4;
}

export function seedToMaskTileOverlay(seed: number) {
  const index = seedToMask(seed);
  return `mask-${index}`;
}
