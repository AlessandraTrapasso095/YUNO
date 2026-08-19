export type YunoProfile = {
  id: number;
  name: string;
  age: number;
  city: string;
  country: string;
  match: number;
  image: string;
  bio: string;
  teaches: string[];
  learns: string[];
  availability: string;
};

export const profiles: YunoProfile[] = [
  {
    id: 1,
    name: "Giulia",
    age: 24,
    city: "Milan",
    country: "Italy",
    match: 96,
    image: "/people/giulia.jpg",
    bio: "Visual storyteller, weekend pasta maker, and incurably curious human.",
    teaches: ["Italian", "Photography", "Cooking"],
    learns: ["Graphic Design", "Spanish", "Piano"],
    availability: "Usually free after 18:00",
  },
  {
    id: 2,
    name: "Marco",
    age: 29,
    city: "Lisbon",
    country: "Portugal",
    match: 91,
    image: "/people/marco.jpg",
    bio: "Product photographer who believes the best lessons start with good coffee.",
    teaches: ["Photography", "Lightroom", "Portraits"],
    learns: ["Portuguese", "Guitar", "UX Writing"],
    availability: "Weekends & Tuesday evenings",
  },
  {
    id: 3,
    name: "Sofia",
    age: 26,
    city: "Barcelona",
    country: "Spain",
    match: 89,
    image: "/people/sofia.jpg",
    bio: "Brand designer, analog music collector, and patient Spanish conversation partner.",
    teaches: ["Spanish", "Brand Design", "Figma"],
    learns: ["Italian", "Video Editing", "Yoga"],
    availability: "Available this Thursday",
  },
  {
    id: 4,
    name: "Luca",
    age: 31,
    city: "Berlin",
    country: "Germany",
    match: 86,
    image: "/people/luca.jpg",
    bio: "Frontend developer, sourdough beginner, and very amateur jazz pianist.",
    teaches: ["React", "TypeScript", "Web Design"],
    learns: ["German", "Piano", "Cooking"],
    availability: "Free Friday afternoons",
  },
];

export const floatingSkills = [
  "Coding",
  "Photography",
  "Guitar",
  "Spanish",
  "Cooking",
  "Excel",
  "Yoga",
  "Marketing",
  "Piano",
  "Design",
  "Video Editing",
];

