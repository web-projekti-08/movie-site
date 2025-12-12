import request from "supertest";
import app from "../index.js";
import pool from "../database.js";
import { setupTestDB } from "./helper/setup-testdb.js";

const TEST_USER = { email: "test@test.com", password: "Password123" };
let accessToken, refreshCookie;

// Alusta tietokanta ennen testejä
beforeAll(async () => {
  await setupTestDB();
});

// Nollaa tietokanta ja sulje yhteys testien jälkeen
afterAll(async () => {
  await pool.query(
    "TRUNCATE users, groups, group_members, review, favorite RESTART IDENTITY CASCADE"
  );
  await pool.end();
});

describe("AUTH API", () => {

  // REGISTER
  test("POST /user/register with missing password -> 400", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ email: TEST_USER.email, password: "" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Email and password required");
  });

  test("POST /user/register -> 201", async () => {
    const res = await request(app).post("/user/register").send(TEST_USER);
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("email", TEST_USER.email);
    expect(res.body.user).toHaveProperty("userId");
  });

  test("POST /user/register with duplicate email -> 409", async () => {
    const res = await request(app).post("/user/register").send(TEST_USER);
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error", "Email already exists");
  });

  // LOGIN
  test("POST /user/login with wrong password -> 401", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: TEST_USER.email, password: "WrongPassword" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  test("POST /user/login -> 200", async () => {
    const res = await request(app).post("/user/login").send(TEST_USER);
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("email", TEST_USER.email);
    expect(res.body.user).toHaveProperty("userId");
    expect(res.body).toHaveProperty("accessToken");

    accessToken = res.body.accessToken;
    refreshCookie = res.headers["set-cookie"].find(c => c.startsWith("refreshToken"));
    expect(refreshCookie).toBeDefined();
  });

  // PROFILE
  test("GET /user/profile without token -> 401", async () => {
    const res = await request(app).get("/user/profile");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Access token required");
  });

  test("GET /user/profile with invalid token -> 403", async () => {
    const res = await request(app)
      .get("/user/profile")
      .set("Authorization", "Bearer INVALID_TOKEN");
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid or expired access token");
  });

  test("GET /user/profile -> 200", async () => {
    const res = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", TEST_USER.email);
    expect(res.body).toHaveProperty("userId");
    expect(res.body.groups).toEqual([]);
  });

  // LOGOUT
  test("POST /user/logout without refresh token -> 200", async () => {
    const res = await request(app).post("/user/logout");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logout successful");
  });

  test("POST /user/logout with refresh token cookie -> 200", async () => {
    const res = await request(app)
      .post("/user/logout")
      .set("Cookie", refreshCookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logout successful");
  });

  // DELETE
  test("DELETE /user/delete without token -> 401", async () => {
    const res = await request(app).delete("/user/delete");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Access token required");
  });

  test("DELETE /user/delete with invalid token -> 403", async () => {
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", "Bearer INVALID_TOKEN");
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid or expired access token");
  });

  test("DELETE /user/delete -> 200", async () => {
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Account deleted successfully");
  });
});
