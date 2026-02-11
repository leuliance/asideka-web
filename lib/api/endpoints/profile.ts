import { clientApiClient } from "../client";
import type { User, UpdateUserProfileRequestDto } from "../types";

export const profileApi = {
  // Update user profile
  update: (data: UpdateUserProfileRequestDto) =>
    clientApiClient<User>("/user-profiles", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
