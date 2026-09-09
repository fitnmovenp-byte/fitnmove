import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { uploadFile } from "@/server/services/r2";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FOLDERS = ["documents", "progress-photos", "avatars"];
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const rawFolder = formData.get("folder") as string | null;
  const folder = rawFolder && ALLOWED_FOLDERS.includes(rawFolder) ? rawFolder : "documents";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop() || "bin";
  const key = `${folder}/${session.user.id}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;
  try {
    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME && process.env.R2_PUBLIC_URL) {
      url = await uploadFile(key, buffer, file.type);
    } else {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceRoleKey) {
        return NextResponse.json({ error: "File storage is not configured. Add R2 credentials or Supabase service-role credentials." }, { status: 503 });
      }
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const storagePath = `${folder}/${session.user.id}/${randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(storagePath, buffer, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(storagePath);
      url = data.publicUrl;
    }
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed. Check the configured storage bucket and credentials." }, { status: 502 });
  }

  return NextResponse.json({
    url,
    key,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
}
