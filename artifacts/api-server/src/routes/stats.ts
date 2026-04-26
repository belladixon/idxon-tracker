import { Router, type IRouter } from "express";
import { supabase, type SessionRow } from "../lib/supabase";

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
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    req.log.error({ error }, "Failed to fetch sessions for weekly summary");
    res.status(500).json({ error: error.message });
    return;
  }

  const allSessions = (data as SessionRow[]) ?? [];
  const now = new Date();
  const { start, end } = getISOWeekBounds(now);

  const weekSessions = allSessions.filter((s) => {
    const d = isoDateToDate(s.date);
    return d >= start && d <= end;
  });

  res.json({
    totalSessions: weekSessions.length,
    totalMinutes: weekSessions.reduce((acc, s) => acc + s.duration_minutes, 0),
    daysRead: new Set(weekSessions.map((s) => s.date)).size,
    weekLabel: formatWeekLabel(start, end),
  });
});

router.get("/stats/weekly-history", async (req, res): Promise<void> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    req.log.error({ error }, "Failed to fetch sessions for weekly history");
    res.status(500).json({ error: error.message });
    return;
  }

  const allSessions = (data as SessionRow[]) ?? [];
  const now = new Date();
  const weeks = [];

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
      totalMinutes: weekSessions.reduce((acc, s) => acc + s.duration_minutes, 0),
      daysRead: new Set(weekSessions.map((s) => s.date)).size,
    });
  }

  res.json(weeks);
});

router.get("/stats/insights", async (req, res): Promise<void> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    req.log.error({ error }, "Failed to fetch sessions for insights");
    res.status(500).json({ error: error.message });
    return;
  }

  const allSessions = (data as SessionRow[]) ?? [];
  const totalSessions = allSessions.length;
  const totalMinutes = allSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const averageDurationMinutes =
    totalSessions > 0
      ? Math.round((totalMinutes / totalSessions) * 10) / 10
      : 0;

  const uniqueDays = Array.from(new Set(allSessions.map((s) => s.date))).sort();

  let currentStreak = 0;
  let longestStreak = uniqueDays.length > 0 ? 1 : 0;

  if (uniqueDays.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const daySet = new Set(uniqueDays);

    let checkDate = new Date(today);
    if (!daySet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const checkStr = checkDate.toISOString().slice(0, 10);
      if (daySet.has(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    let tempStreak = 1;
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
    averageDurationMinutes,
    currentStreak,
    longestStreak,
    totalSessions,
    totalMinutes,
  });
});

export default router;
