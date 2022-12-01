const firstNameList: string[] = [
  "billo",
  "bolka",
  "skim",
  "scol",
  "pigmang",
  "surto",
  "skree",
  "scarp",
  "xaura",
  "bitwis",
];
const lastNameList: string[] = ["arbi", "cartor", "whilt", "bork", "begor", "snok", "kantr", "uzko", "sverg", "sunwik"];

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function seedToName(seed: number) {
  if (!seed) return "";
  const seedAsString: string = Math.abs(seed).toString();
  const firstNameIndex: number = Number(seedAsString[0]) || 0;
  const lastNameIndex: number = Number(seedAsString[1]) || 0;
  const firstName: string = firstNameList[firstNameIndex];
  const lastName: string = lastNameList[lastNameIndex];
  const fullName = firstName + " " + lastName;
  return toTitleCase(fullName);
}

export function seedToMask(seed: number) {
  return 1;
}
