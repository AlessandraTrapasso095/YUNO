export type YunoProfile = {
  id: number;
  key: "giulia" | "marco" | "sofia" | "luca";
  name: string;
  age: number;
  match: number;
  image: string;
  teaches: SkillId[];
  learns: SkillId[];
};

export type SkillId =
  | "coding"
  | "photography"
  | "guitar"
  | "spanish"
  | "cooking"
  | "excel"
  | "yoga"
  | "marketing"
  | "piano"
  | "design"
  | "videoEditing"
  | "italian"
  | "graphicDesign"
  | "lightroom"
  | "portraits"
  | "portuguese"
  | "uxWriting"
  | "brandDesign"
  | "figma"
  | "react"
  | "typeScript"
  | "webDesign"
  | "german"
  | "english";

export const profiles: YunoProfile[] = [
  {
    id: 1,
    key: "giulia",
    name: "Giulia",
    age: 24,
    match: 96,
    image: "/people/giulia.jpg",
    teaches: ["italian", "photography", "cooking"],
    learns: ["graphicDesign", "spanish", "piano"],
  },
  {
    id: 2,
    key: "marco",
    name: "Marco",
    age: 29,
    match: 91,
    image: "/people/marco.jpg",
    teaches: ["photography", "lightroom", "portraits"],
    learns: ["portuguese", "guitar", "uxWriting"],
  },
  {
    id: 3,
    key: "sofia",
    name: "Sofia",
    age: 26,
    match: 89,
    image: "/people/sofia.jpg",
    teaches: ["spanish", "brandDesign", "figma"],
    learns: ["italian", "videoEditing", "yoga"],
  },
  {
    id: 4,
    key: "luca",
    name: "Luca",
    age: 31,
    match: 86,
    image: "/people/luca.jpg",
    teaches: ["react", "typeScript", "webDesign"],
    learns: ["german", "piano", "cooking"],
  },
];

export const floatingSkills: SkillId[] = [
  "coding",
  "photography",
  "guitar",
  "spanish",
  "cooking",
  "excel",
  "yoga",
  "marketing",
  "piano",
  "design",
  "videoEditing",
];
