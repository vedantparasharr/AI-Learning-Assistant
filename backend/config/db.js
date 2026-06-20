import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
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
