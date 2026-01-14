import ratelimit from "../upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-limit");

    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  } catch (error) {
    console.log("Error in rateLimiter middleware: ", error);
    next(error);
  }
};

export default rateLimiter