import type {
  CustomSkillId,
  ProfileSkillId,
  SkillId,
} from "../data";

export const skillOptions: SkillId[] = [
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
  "italian",
  "graphicDesign",
  "lightroom",
  "portraits",
  "portuguese",
  "uxWriting",
  "brandDesign",
  "figma",
  "react",
  "typeScript",
  "webDesign",
  "german",
  "english",
  "french",
  "japanese",
  "chinese",
  "arabic",
  "publicSpeaking",
  "drawing",
  "painting",
  "illustration",
  "canva",
  "photoshop",
  "illustrator",
  "uiDesign",
  "uxDesign",
  "wordpress",
  "nextJs",
  "nodeJs",
  "python",
  "java",
  "javascript",
  "dataAnalysis",
  "sql",
  "projectManagement",
  "copywriting",
  "socialMedia",
  "seo",
  "sewing",
  "knitting",
  "baking",
  "gardening",
  "fitness",
  "pilates",
  "running",
  "meditation",
  "chess",
  "singing",
  "drums",
  "musicProduction",
  "personalFinance",
  "math",
  "physics",
];

export function normalizeSkillName(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createCustomSkillId(
  value: string,
): CustomSkillId | null {
  const normalized = normalizeSkillName(value);

  if (!normalized) return null;

  return `custom:${normalized}`;
}

export function isCustomSkillId(
  skill: ProfileSkillId,
): skill is CustomSkillId {
  return skill.startsWith("custom:");
}

export function getCustomSkillLabel(skill: CustomSkillId) {
  const value = skill.slice("custom:".length);

  return value
    .split("-")
    .filter(Boolean)
    .map((part, index) =>
      index === 0
        ? part.charAt(0).toLocaleUpperCase() + part.slice(1)
        : part,
    )
    .join(" ");
}
