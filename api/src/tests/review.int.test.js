import request from "supertest";
import app from "../index.js";
import pool from "../database.js";
import { setupTestDB } from "./helper/setup-testdb.js";

const TEST_USER = { email: "review@test.com", password: "Password123" };
let accessToken;
let reviewId;

beforeAll(async () => {
  await setupTestDB();

  // Rekisteröidytään ja kirjaudutaan testejä varten
  await request(app).post("/user/register").send(TEST_USER);
  const loginRes = await request(app).post("/user/login").send(TEST_USER);
  accessToken = loginRes.body.accessToken;
});

afterAll(async () => {
  await pool.end();
});

describe("REVIEWS API", () => {
  const mediaId = 1;

  // CREATE
  test("POST /review/:mediaId without token -> 401", async () => {
    const res = await request(app)
      .post(`/review/${mediaId}`)
      .send({ review_text: "Great!", rating: 5 });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Access token required");
  });

  test("POST /review/:mediaId -> 201", async () => {
    const res = await request(app)
      .post(`/review/${mediaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ review_text: "Awesome movie", rating: 5 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("review_id");
    reviewId = res.body.review_id;
  });

  //  GET REVIEWS
  test("GET /review -> 200", async () => {
    const res = await request(app).get("/review");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("GET /review/:reviewId/detail without token -> 401", async () => {
    const res = await request(app).get(`/review/${reviewId}/detail`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Access token required");
  });

  test("GET /review/:reviewId/detail -> 200", async () => {
    const res = await request(app)
      .get(`/review/${reviewId}/detail`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("review_id", reviewId);
    expect(res.body).toHaveProperty("review_text", "Awesome movie");
  });

  test("GET /review/:mediaId -> 200", async () => {
    const res = await request(app).get(`/review/${mediaId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("media_id", mediaId);
  });

  test("GET /review/user without token -> 401", async () => {
    const res = await request(app).get("/review/user");
    expect(res.status).toBe(401);
  });

  test("GET /review/user -> 200", async () => {
    const res = await request(app)
      .get("/review/user")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("user_id");
  });

  // EDIT
  test("PATCH /review/:reviewId -> 200", async () => {
    const res = await request(app)
      .patch(`/review/${reviewId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ text: "Changed review", rating: 4 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("review_text", "Changed review");
    expect(res.body).toHaveProperty("rating", 4);
  });

  // DELETE
  test("DELETE /review/:reviewId without token -> 401", async () => {
    const res = await request(app).delete(`/review/${reviewId}`);
    expect(res.status).toBe(401);
  });

  test("DELETE /review/:reviewId -> 204", async () => {
    const res = await request(app)
      .delete(`/review/${reviewId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(204);
  });

});
