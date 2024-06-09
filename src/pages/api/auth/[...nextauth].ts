import NextAuth, { Session } from "next-auth";
import { OAuthUserConfig } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const credentialsProviderOption = {
  id: "login-credentials",
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: Record<string, string> | undefined) {
    if (credentials) {
      try {
        const response = await fetch("https://syncd-backend.dev.i-dear.org/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });

        const data = await response.json();
        console.log("Server response:", data); // 서버 응답 로그 출력

        if (response.ok && data.token) {
          return {
            id: data.userId || "1",
            login: data.email || "",
            name: data.name || "관리자",
            email: data.email || "",
            image: data.image || "",
            token: data.token,
          };
        } else {
          throw new Error(data.message || "로그인 실패");
        }
      } catch (error: any) {
        console.error("로그인 중 오류가 발생했습니다:", error);
        throw new Error(error.message || "로그인 중 오류가 발생했습니다.");
      }
    }

    return null;
  },
};

const googleProviderOption: OAuthUserConfig<{}> = {
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  profile: (profile: any) => ({ ...profile, id: profile.sub, login: profile.email, image: profile.picture }),
};

const githubProviderOption: OAuthUserConfig<{}> = {
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  profile: (profile: any) => ({ ...profile, image: profile.avatar_url }),
};

export default NextAuth({
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=1",
    error: "/login",
  },
  providers: [
    CredentialsProvider(credentialsProviderOption),
    GoogleProvider(googleProviderOption),
    GithubProvider(githubProviderOption),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as Session["user"]).id;
        token.login = (user as Session["user"]).login;
        token.token = (user as any).token; // JWT 토큰 저장
      }
      return token;
    },
    session({ session, token }) {
      session.user = { ...session.user, id: token.id as string, login: token.login as string, token: token.token as string };
      return session;
    },
  },
});
