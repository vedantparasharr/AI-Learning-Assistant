import mongoose from "mongoose";
import dns from "dns";

const REQUIRED_ENV_VARS = [
  "MONGODB_URL",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "EMAIL_FROM",
  "BREVO_API_KEY",
];

const connectDB = async () => {
  // Validate environment variables on startup
  const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    console.error(
      `FATAL STARTUP ERROR: The following required environment variables are missing:\n${missingVars.join(
        ", ",
      )}\nServer shutting down.`,
    );
    process.exit(1);
  }

  try {
    // Set DNS servers to Google and Cloudflare to resolve SRV querySrv issues
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
