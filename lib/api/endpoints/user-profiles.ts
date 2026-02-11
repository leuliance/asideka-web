import { clientApiClient } from "../client";

export interface UserProfile {
  firstname: string;
  lastname: string;
  profilePicture: string;
  bio: string;
  bannerImage: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  profession: string;
  category: string;
  skills: string[];
  languages: string[];
  certifications: string[];
}

export const userProfileApi = {
  getProfile: () =>
    clientApiClient<UserProfile>("/user-profiles", {
      method: "GET",
    }),

  updateProfile: (data: Partial<UserProfile>) =>
    clientApiClient<UserProfile>("/user-profiles", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
