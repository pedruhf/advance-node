export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? "",
    clientSecret: process.env.FB_CLIENT_SECRET ?? "",
  },
  s3: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.AWS_S3_BUCKET ?? "",
  },
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? "abc123",
};
