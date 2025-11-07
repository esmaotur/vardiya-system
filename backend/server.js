
const cors = require("cors");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");



const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Helpers
const timeToMinutes = (t) => {
  // t: "HH:MM"
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const isOverlap = (aStart, aEnd, bStart, bEnd) => {
  // [start,end) mantığıyla çakışma kontrolü
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
};

// Health
app.get("/health", (_, res) => res.status(200).json({ status: "ok" }));

// ========= Employees =========
const employeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional(),
});


app.post("/employees", async (req, res) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  try {
    const emp = await prisma.employee.create({ data: parsed.data });
    res.status(201).json(emp);
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ message: "Email zaten kayıtlı" });
    }
    res.status(500).json({ message: "Beklenmeyen hata", detail: String(e) });
  }
});

app.get("/employees", async (_req, res) => {
  const all = await prisma.employee.findMany({ orderBy: { createdAt: "desc" } });
  res.json(all);
});

// ========= Shifts =========
const shiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),  // YYYY-MM-DD
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().optional(),
  maxEmployees: z.number().int().min(1).max(50).default(1),
});

app.post("/shifts", async (req, res) => {
  const parsed = shiftSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { date, start, end, location, maxEmployees } = parsed.data;
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  if (endMin <= startMin) return res.status(400).json({ message: "Bitiş saati başlangıçtan sonra olmalı" });

  const created = await prisma.shift.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      start,
      end,
      location,
      maxEmployees,
    },
  });
  res.status(201).json(created);
});

app.get("/shifts", async (req, res) => {
  const { date } = req.query;
  let where = {};
  if (date) {
    const d = new Date(`${date}T00:00:00.000Z`);
    const dNext = new Date(d);
    dNext.setDate(d.getDate() + 1);
    where = { date: { gte: d, lt: dNext } };
  }
  const list = await prisma.shift.findMany({
    where,
    orderBy: [{ date: "asc" }, { start: "asc" }],
  });
  res.json(list);
});

// ========= Assignments =========
const assignmentSchema = z.object({
  employeeId: z.string().min(1),
  shiftId: z.string().min(1),
});

app.post("/assignments", async (req, res) => {
  const parsed = assignmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { employeeId, shiftId } = parsed.data;

  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift) return res.status(404).json({ message: "Shift bulunamadı" });

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) return res.status(404).json({ message: "Employee bulunamadı" });

  // Max kontenjan
  const count = await prisma.assignment.count({ where: { shiftId } });
  if (count >= shift.maxEmployees) {
    return res.status(409).json({ message: "Kontenjan dolu" });
  }

  // Çakışma kontrolü: aynı gün çalışan için saat çakışmasın
  const sameDayShifts = await prisma.assignment.findMany({
    where: { employeeId },
    include: { shift: true },
  });

  const sStart = timeToMinutes(shift.start);
  const sEnd = timeToMinutes(shift.end);
  let overlap = false;

  for (const a of sameDayShifts) {
    if (
      a.shift.date.toISOString().slice(0, 10) === shift.date.toISOString().slice(0, 10)
    ) {
      const aStart = timeToMinutes(a.shift.start);
      const aEnd = timeToMinutes(a.shift.end);
      if (isOverlap(sStart, sEnd, aStart, aEnd)) {
        overlap = true;
        break;
      }
    }
  }

  if (overlap) {
    return res.status(409).json({ message: "Çalışan için saat çakışması var" });
  }

  try {
    const asg = await prisma.assignment.create({ data: { employeeId, shiftId } });
    res.status(201).json({ ...asg, overlap: false });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ message: "Bu çalışan bu vardiyaya zaten atanmış" });
    }
    res.status(500).json({ message: "Beklenmeyen hata", detail: String(e) });
  }
});

app.delete("/assignments/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.assignment.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

// ========= Schedule (date range) =========
app.get("/schedule", async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ message: "from ve to zorunlu (YYYY-MM-DD)" });

  const fromD = new Date(`${from}T00:00:00.000Z`);
  const toD = new Date(`${to}T00:00:00.000Z`);
  const list = await prisma.shift.findMany({
    where: { date: { gte: fromD, lt: toD } },
    include: {
      assignments: { include: { employee: true } },
    },
    orderBy: [{ date: "asc" }, { start: "asc" }],
  });

  res.json(
    list.map(s => ({
      id: s.id,
      date: s.date.toISOString().slice(0, 10),
      start: s.start,
      end: s.end,
      location: s.location,
      maxEmployees: s.maxEmployees,
      employees: s.assignments.map(a => ({
        id: a.employee.id,
        name: a.employee.name,
        email: a.employee.email,
        role: a.employee.role
      }))
    }))
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Vardiya Sistemi API dinlemede:", PORT);
});
