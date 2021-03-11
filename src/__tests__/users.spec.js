const request = require("supertest");
const { validate } = require("uuid");

const app = require("..");

describe("Users", () => {
  it("should be able to list all users", async () => {
    const response = await request(app).get("/users");
    expect(200);

    expect(response.body).toMatchObject([]);
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      username: "johndoe",
    });
    expect(201);

    expect(validate(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      name: "John Doe",
      username: "johndoe",
      todos: [],
    });
  });

  it("should not be able to create a new user when username already exists", async () => {
    await request(app).post("/users").send({
      name: "John Doe",
      username: "johndoe",
    });

    const response = await request(app)
      .post("/users")
      .send({
        name: "John Doe",
        username: "johndoe",
      })
      .expect(400);

    expect(response.body.error).toBeTruthy();
  });

  it("should be able to list one user", async () => {
    await request(app).post("/users").send({
      name: "John Doe",
      username: "24871",
    });
    const response = await request(app).get("/user").set("username", "24871");
    expect(200);

    expect(response.body).toMatchObject({
      name: "John Doe",
      username: "24871",
      todos: [],
    });
  });

  it("should not be able to list a non-existent user ", async () => {
    const response = await request(app).get("/user").set("username", "aaaa");
    expect(400);

    expect(response.body.error).toBeTruthy();
  });

  it("should be able to update user", async () => {
    await request(app).post("/users").send({
      name: "John Doe",
      username: "johndoe",
    });

    const response = await request(app)
      .put("/users")
      .set("username", "johndoe")
      .send({
        name: "John Connor",
      });
    expect(201);

    expect(response.body).toMatchObject({
      name: "John Connor",
      username: "johndoe",
      todos: [],
    });
  });

  it("should be able to delete user", async () => {
    await request(app).post("/users").send({
      name: "John Doe",
      username: "johndoe",
    });

    const response = await request(app)
      .delete("/users")
      .set("username", "johndoe");
    expect(204);

    expect(response.body).toMatchObject({});
  });
});
