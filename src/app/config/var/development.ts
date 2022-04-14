export default {
  port: process.env.PORT || 8000,
  appName: "flight-app",
  databaseUrl:
    "postgres://postgres:Yassine2298@localhost:5432/finance?schema=public",
	apiDocsUsername: "username",
  apiDocsPassword: "password",
  mailService: "sendgrid",
  mailServiceApiKey:
    "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",
  mailServiceSender: "yassine.chouk@softup.co",
  jwtSecretKey: "process.env.JWT_SECRET_KEY",
};
