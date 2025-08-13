import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

router.get("/todos", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

router.post("/todos", async (req, res) => {
  try {
    const { title } = req.body || {};
    if (!title)
      return res
        .status(400)
        .json({ status: "error", error: "Title is required" });

    const todo = await prisma.todo.create({
      data: {
        title,
      },
    });
    res.status(201).json(todo);
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

router.post("/todos/:id/toggle", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const item = await prisma.todo.findUnique({ where: { id } });
    if (!item) return req.status(400).json({ error: "not found" });

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !item.completed },
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

export default router;
