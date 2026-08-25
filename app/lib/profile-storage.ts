import type { CurrentUserProfile } from "../data";

export const PROFILE_STORAGE_KEY =
  "yuno_current_user_profile";

export const PROFILE_STORAGE_EVENT =
  "yuno-profile-storage-change";

export const ONBOARDING_COMPLETED_STORAGE_KEY =
  "yuno_onboarding_completed";

export function writeCurrentUserProfile(
  profile: CurrentUserProfile,
) {
  window.localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );

  window.dispatchEvent(
    new Event(PROFILE_STORAGE_EVENT),
  );
}

export function markOnboardingCompleted() {
  window.localStorage.setItem(
    ONBOARDING_COMPLETED_STORAGE_KEY,
    "true",
  );
}
