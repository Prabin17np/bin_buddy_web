export const API = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    UPDATE_PROFILE: "/auth/update-profile",
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
    RESET_PASSWORD: "/auth/reset-password", // append token if needed
  },
  ADMIN: {
    USERS: {
      CREATE: "/admin/users",
      GET_ALL: "/admin/users",
      GET_BY_ID: "/admin/users/",   // append :id
      UPDATE: "/admin/users/",      // append :id
      DELETE: "/admin/users/",      // append :id
    },
  },
};
