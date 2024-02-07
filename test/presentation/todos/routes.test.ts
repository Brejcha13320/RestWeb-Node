import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../src/data/postgres";

describe("Todo route testing", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: "Test 1" };
  const todo2 = { text: "Test 2" };

  test("should return TODOS api/todos", async () => {
    await prisma.todo.createMany({ data: [todo1, todo2] });

    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
  });

  test("should return a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test("should return a new Todo api/todos", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send(todo1)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test("should return an error if text is not present api/todos", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({})
      .expect(400);

    expect(body).toEqual({ error: "Text property is requited" });
  });

  test("should return an error if text is empty api/todos", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({ text: "" })
      .expect(400);

    expect(body).toEqual({ error: "Text property is requited" });
  });

  test("should return an update TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: "New test update" })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: "New test update",
      completedAt: null,
    });
  });

  test("should delete a TODO api/todos/:id", async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      deletedTodo: {
        id: todo.id,
        text: todo.text,
        completedAt: todo.completedAt,
      },
    });
  });
});
