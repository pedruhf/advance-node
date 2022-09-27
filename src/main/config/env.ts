export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? "479160247150571",
    clientSecret: process.env.FB_CLIENT_SECRET ?? "d2e7c31c1641f3a90f342f3b7c2aa39e",
  },
  s3: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? "any_access_key_id",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? "any_secret_access_key",
    bucket: process.env.AWS_S3_BUCKET ?? "any_bucket",
  },
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? "abc123",
};
