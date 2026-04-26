import { Router, type IRouter } from "express";
import { db, sessionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

function getISOWeekBounds(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  sun.setHours(23, 59, 59, 999);
  return { start: mon, end: sun };
}

function formatWeekLabel(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

function isoDateToDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

router.get("/stats/weekly-summary", async (req, res): Promise<void> => {
  const allSessions = await db
    .select()
    .from(sessionsTable)
    .orderBy(desc(sessionsTable.date));

  const now = new Date();
  const { start, end } = getISOWeekBounds(now);

  const weekSessions = allSessions.filter((s) => {
    const d = isoDateToDate(s.date);
    return d >= start && d <= end;
  });

  const totalSessions = weekSessions.length;
  const totalMinutes = weekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const daysSet = new Set(weekSessions.map((s) => s.date));
  const daysRead = daysSet.size;
  const weekLabel = formatWeekLabel(start, end);

  res.json({ totalSessions, totalMinutes, daysRead, weekLabel });
});

router.get("/stats/weekly-history", async (req, res): Promise<void> => {
  const allSessions = await db
    .select()
    .from(sessionsTable)
    .orderBy(desc(sessionsTable.date));

  const now = new Date();
  const weeks: Array<{
    weekLabel: string;
    totalSessions: number;
    totalMinutes: number;
    daysRead: number;
  }> = [];

  for (let i = 7; i >= 0; i--) {
    const weekDate = new Date(now);
    weekDate.setDate(now.getDate() - i * 7);
    const { start, end } = getISOWeekBounds(weekDate);

    const weekSessions = allSessions.filter((s) => {
      const d = isoDateToDate(s.date);
      return d >= start && d <= end;
    });

    weeks.push({
      weekLabel: formatWeekLabel(start, end),
      totalSessions: weekSessions.length,
      totalMinutes: weekSessions.reduce((acc, s) => acc + s.durationMinutes, 0),
      daysRead: new Set(weekSessions.map((s) => s.date)).size,
    });
  }

  res.json(weeks);
});

router.get("/stats/insights", async (req, res): Promise<void> => {
  const allSessions = await db
    .select()
    .from(sessionsTable)
    .orderBy(desc(sessionsTable.date));

  const totalSessions = allSessions.length;
  const totalMinutes = allSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const averageDurationMinutes =
    totalSessions > 0 ? totalMinutes / totalSessions : 0;

  const uniqueDays = Array.from(new Set(allSessions.map((s) => s.date))).sort();

  let currentStreak = 0;
  let longestStreak = 0;

  if (uniqueDays.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    const daySet = new Set(uniqueDays);
    const sortedDays = [...uniqueDays].sort().reverse();

    let streak = 0;
    let checkDate = new Date(today);
    if (!daySet.has(todayStr)) {
      checkDate = yesterdayDate;
    }
    while (true) {
      const checkStr = checkDate.toISOString().slice(0, 10);
      if (daySet.has(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = streak;

    let tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = isoDateToDate(uniqueDays[i - 1]);
      const curr = isoDateToDate(uniqueDays[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 1;
      }
    }
  }

  res.json({
    averageDurationMinutes: Math.round(averageDurationMinutes * 10) / 10,
    currentStreak,
    longestStreak,
    totalSessions,
    totalMinutes,
  });
});

export default router;
