import { api, setStoredToken, removeStoredToken } from "@/lib/axios";
import {
  UserResponse,
  UserInCreate,
  UserInSignIn,
  User,
  SignInApiResponse,
  UserInfoApiResponse,
} from "@/types/auth";

export const authService = {
  async signin(credentials: UserInSignIn): Promise<UserResponse> {
    const response = await api.post<SignInApiResponse>(
      "/api/v1/auth/signin",
      credentials
    );
    const userData = response.data.data;
    const accessToken = userData.token.access_token;
    setStoredToken(accessToken);
    return { user: userData, token: userData.token, access_token: accessToken };
  },

  async signup(userData: UserInCreate): Promise<UserResponse> {
    const response = await api.post<SignInApiResponse>(
      "/api/v1/auth/signup",
      userData
    );
    const userResponseData = response.data.data;
    const accessToken = userResponseData.token.access_token;
    setStoredToken(accessToken);
    return {
      user: userResponseData,
      token: userResponseData.token,
      access_token: accessToken,
    };
  },

  async getUserInfo(): Promise<User> {
    const response = await api.get<UserInfoApiResponse>("/api/v1/auth/info");
    return response.data.data;
  },

  signout(): void {
    removeStoredToken();
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  },
};
