import jwt from "jsonwebtoken";

export function createTestToken(userId, email = "test@test.com") {
  return jwt.sign({ userId, email }, process.env.JWT_ACCESS_SECRET);
}