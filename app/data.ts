export type YunoProfile = {
  id: number;
  key: "giulia" | "marco" | "sofia" | "luca";
  name: string;
  age: number;
  match: number;
  image: string;
  teaches: SkillId[];
  learns: SkillId[];
  modes: LearningMode[];
  languages: LanguageId[];
  availability: AvailabilityId[];
  distanceKm: number;
};

export type LearningMode = "online" | "inPerson";

export type LanguageId =
  | "italian"
  | "english"
  | "spanish"
  | "portuguese"
  | "german";

export type AvailabilityId =
  | "weekdays"
  | "evenings"
  | "weekends";

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
    modes: ["inPerson"],
    languages: ["italian"],
    availability: ["weekends"],
    distanceKm: 4,
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
    modes: ["online"],
    languages: ["portuguese", "english"],
    availability: ["weekdays"],
    distanceKm: 18,
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
    modes: ["inPerson"],
    languages: ["spanish", "english"],
    availability: ["evenings"],
    distanceKm: 7,
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
    modes: ["online"],
    languages: ["german"],
    availability: ["weekends"],
    distanceKm: 26,
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
