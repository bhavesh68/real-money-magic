import { makeVar } from "@apollo/client";

// Reactive variable to manage auth state
export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem("token"));
