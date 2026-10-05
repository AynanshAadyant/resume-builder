import { describe, it } from "node:test";
import assert from "node:assert";
import cookie from "../../src/utils/cookie.js";

describe("Cookie Utility", () => {
    it("should generate a valid JWT token and decrypt it accurately", async () => {
        process.env.JWT_SECRET = "test-secret-key-12345";
        const payload = { id: "test-user-id-abc" };

        const token = await cookie.generateCookie(payload);
        assert.ok(token);
        assert.strictEqual(typeof token, "string");

        const decoded = await cookie.decryptCookie(token);
        assert.ok(decoded);
        assert.strictEqual(decoded.id, "test-user-id-abc");
    });

    it("should provide secure cookieOptions in DEV mode", () => {
        process.env.STATUS = "DEV";
        const options = cookie.cookieOptions;

        assert.strictEqual(options.httpOnly, true);
        assert.strictEqual(options.secure, false);
        assert.strictEqual(options.sameSite, "lax");
        assert.strictEqual(options.maxAge, 10 * 1000 * 60 * 60 * 24);
    });

    it("should enforce secure and httpOnly in PROD mode", () => {
        process.env.STATUS = "PROD";
        const options = cookie.cookieOptions;

        assert.strictEqual(options.httpOnly, true);
        assert.strictEqual(options.secure, true);
        assert.strictEqual(options.sameSite, "none");
    });
});
