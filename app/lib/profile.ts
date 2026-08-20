import type { CurrentUserProfile } from "../data";

export function calculateProfileCompletion(
  profile: CurrentUserProfile,
) {
  let score = 0;

  if (profile.name.trim() && profile.age >= 18) {
    score += 10;
  }

  if (profile.city.trim() && profile.country.trim()) {
    score += 10;
  }

  if (profile.bio.trim().length >= 20) {
    score += 15;
  }

  if (
    profile.image &&
    profile.image !== "/people/anna.jpg"
  ) {
    score += 15;
  }

  if (profile.teaches.length > 0) {
    score += 15;
  }

  if (profile.learns.length > 0) {
    score += 15;
  }

  if (profile.languages.length > 0) {
    score += 5;
  }

  if (profile.modes.length > 0) {
    score += 5;
  }

  if (profile.availability.length > 0) {
    score += 5;
  }

  if (
    profile.bio.trim().length >= 60 &&
    profile.teaches.length >= 2 &&
    profile.learns.length >= 2
  ) {
    score += 5;
  }

  return Math.min(score, 100);
}
