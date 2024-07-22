import supertest from "supertest";
import { app } from "../src/applicaion/app";
import { logger } from "../src/applicaion/logging";
import { UserTest } from "./test.util";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should not create new user if request is invalid", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should create new user if request is valid", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should login user ", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.token).toBeDefined();
  });

  it("should reject login user if request is invalid ", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "salah",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject login user if password is invalid ", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "salah",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should get current user", async () => {
    const response = await supertest(app)
      .get("/api/users/current")
      .set("X-API-TOKEN", "test");
    logger.debug(response.body);
    expect(response.status).toBe(200);

    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });

  it("should reject get current user if token is invalid", async () => {
    const response = await supertest(app)
      .get("/api/users/current")
      .set("X-API-TOKEN", "salah");

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject update current user", async () => {
    const response = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        password: "",
        name: "",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject update current user if token is invalid", async () => {
    const response = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "salah")
      .send({
        password: "benar",
        name: "benar",
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should update current user, username", async () => {
    const response = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        name: "benar",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("benar");
  });

  it("should update current user, password", async () => {
    const response = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        password: "benar",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);

    const user = await UserTest.get();
    expect(await bcrypt.compare("benar", user.password)).toBe(true);
  });
});

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
      await UserTest.create();
    });

    afterEach(async () => {
      await UserTest.delete();
    });

    it('should logout current user', async () => {
      const response = await supertest(app)
      .delete('/api/users/current')
      .set('X-API-TOKEN', 'test');
      logger.debug(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe("OK");
    
      const user = await UserTest.get();
      expect(user.token).toBeNull();
    
    });
    
    it('should reject logout current user if token is wrong', async () => {
      const response = await supertest(app)
      .delete('/api/users/current')
      .set('X-API-TOKEN', 'salah');

      logger.debug(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
});

