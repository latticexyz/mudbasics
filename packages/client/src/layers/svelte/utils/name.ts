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

function reverseString(str: string): string {
  if (str === "") return "";
  else return reverseString(str.substr(1)) + str.charAt(0);
}

export function seedToName(seed: number) {
  if (!seed) return "";
  const seedAsString = reverseString(Math.abs(seed).toString());

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
  const seedAsString = reverseString(Math.abs(seed).toString());
  return (Number(seedAsString[4] + seedAsString[5]) || 0) % 4;
}

export function seedToMaskTileOverlay(seed: number) {
  const index = seedToMask(seed);
  return `mask-${index}`;
}

const fireFirstNames = [
  "The Fire of",
  "The Star of",
  "The Blaze of",
  "The Great Recyler of",
  "The Semaphor of",
  "The Calling of",
  "The Warmth of",
  "The Light of",
  "The Comforter of",
  "The Sign of",
];

const fireSecondNames = [
  "Tereris",
  "Juffo",
  "Justyz",
  "Kano",
  "Barchtel",
  "Barkins",
  "The Hound",
  "The Fool",
  "Syn",
  "Violette",
  "Noon",
  "Joliboye",
  "Jogeler",
  "Camphor",
  "Stalk",
  "Dawnse",
  "Gord",
  "Foly",
  "Kardu",
  "Bolka",
];

export function seedToFireName(seed: number) {
  if (!seed) return "";
  const seedAsString = reverseString(Math.abs(seed).toString());

  const firstNameIndex = Number(seedAsString[0]) || 0;
  const firstName = fireFirstNames[firstNameIndex % fireFirstNames.length];

  const secondNameIndex = Number(seedAsString[1] + seedAsString[2]) || 0;
  const secondName = fireSecondNames[secondNameIndex % fireSecondNames.length];

  return firstName + " " + secondName;
}
