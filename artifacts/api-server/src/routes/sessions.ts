import { Router, type IRouter } from "express";
import { supabase, type SessionRow } from "../lib/supabase";
import {
  CreateSessionBody,
  GetSessionParams,
  UpdateSessionParams,
  UpdateSessionBody,
  DeleteSessionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toApiSession(row: SessionRow) {
  return {
    id: row.id,
    date: row.date,
    durationMinutes: row.duration_minutes,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

router.get("/sessions", async (req, res): Promise<void> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    req.log.error({ error }, "Failed to list sessions");
    res.status(500).json({ error: error.message });
    return;
  }

  res.json((data as SessionRow[]).map(toApiSession));
});

router.post("/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      date: parsed.data.date,
      duration_minutes: parsed.data.durationMinutes,
      notes: parsed.data.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    req.log.error({ error }, "Failed to create session");
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(toApiSession(data as SessionRow));
});

router.get("/sessions/:id", async (req, res): Promise<void> => {
  const params = GetSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", params.data.id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(toApiSession(data as SessionRow));
});

router.patch("/sessions/:id", async (req, res): Promise<void> => {
  const params = UpdateSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.date !== undefined) updates.date = parsed.data.date;
  if (parsed.data.durationMinutes !== undefined)
    updates.duration_minutes = parsed.data.durationMinutes;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const { data, error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", params.data.id)
    .select()
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(toApiSession(data as SessionRow));
});

router.delete("/sessions/:id", async (req, res): Promise<void> => {
  const params = DeleteSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", params.data.id);

  if (error) {
    req.log.error({ error }, "Failed to delete session");
    res.status(500).json({ error: error.message });
    return;
  }

  res.sendStatus(204);
});

export default router;
