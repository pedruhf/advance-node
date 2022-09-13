export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? "479160247150571",
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? "d2e7c31c1641f3a90f342f3b7c2aa39e",
  },
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? "abc123"
};
