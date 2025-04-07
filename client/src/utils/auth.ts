import { isLoggedInVar } from "../graphql/cache";

export const onLogin = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    isLoggedInVar(true);
  };
  
  export const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    isLoggedInVar(false);
  };
  