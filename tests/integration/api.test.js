import { describe, it } from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../../app.js";

describe("Backend API Integration Tests", () => {
    it("GET /api/wakeup should return 200 with success status", async () => {
        const res = await request(app).get("/api/wakeup");
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.success, true);
        assert.ok(res.body.message.includes("Backend up and running"));
    });

    it("GET /api/unknown-route should return 404", async () => {
        const res = await request(app).get("/api/non-existent-route");
        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.success, false);
    });

    it("POST /api/auth/login with missing email should return 400 Bad Request", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ password: "somePassword" });

        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.success, false);
        assert.strictEqual(res.body.message, "Email is required");
    });

    it("POST /api/auth/register with short password should return 400 Bad Request", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "123"
            });

        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.success, false);
        assert.ok(res.body.message.includes("at least 8 characters"));
    });

    it("GET /api/profile/get without token should return 401 Unauthorized", async () => {
        const res = await request(app).get("/api/profile/get");
        assert.strictEqual(res.status, 401);
        assert.strictEqual(res.body.success, false);
    });

    it("GET /api/resume without token should return 401 Unauthorized", async () => {
        const res = await request(app).get("/api/resume");
        assert.strictEqual(res.status, 401);
        assert.strictEqual(res.body.success, false);
    });

    it("should include rate limit headers on /api requests", async () => {
        const res = await request(app).get("/api/wakeup");
        assert.ok(res.headers["ratelimit-limit"] !== undefined);
        assert.ok(res.headers["ratelimit-remaining"] !== undefined);
    });
});
