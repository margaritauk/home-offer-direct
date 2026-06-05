export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  /* ── Auth ── */
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── Parse multipart form ── */
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const type = formData.get("type") as string | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (type !== "id" && type !== "proof_of_funds") {
    return NextResponse.json(
      { error: "type must be 'id' or 'proof_of_funds'" },
      { status: 400 }
    );
  }

  /* ── Validate file type ── */
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and PDF files are accepted" },
      { status: 400 }
    );
  }

  /* ── Validate file size ── */
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be 10 MB or smaller" },
      { status: 400 }
    );
  }

  /* ── Determine storage path and DB column ── */
  const ext =
    file.type === "application/pdf"
      ? "pdf"
      : file.type === "image/png"
      ? "png"
      : "jpg";

  const fileName = type === "id" ? `government-id.${ext}` : `proof-of-funds.${ext}`;
  const storagePath = `${user.id}/${fileName}`;
  const dbColumn = type === "id" ? "id_document_path" : "proof_of_funds_path";

  /* ── Upload using service role to bypass storage RLS on upload ── */
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await serviceClient.storage
    .from("identity-documents")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("[upload-id] Storage upload failed", uploadError);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }

  /* ── Update users table ── */
  const { error: updateError } = await supabase
    .from("users")
    .update({ [dbColumn]: storagePath })
    .eq("id", user.id);

  if (updateError) {
    console.error("[upload-id] Failed to update user record", updateError);
    return NextResponse.json(
      { error: "Failed to save document path" },
      { status: 500 }
    );
  }

  /* ── Fetch current state of both columns ── */
  const { data: profile } = await supabase
    .from("users")
    .select("id_document_path, proof_of_funds_path, id_verified_at")
    .eq("id", user.id)
    .single();

  const idUploaded = !!(profile?.id_document_path);
  const proofUploaded = !!(profile?.proof_of_funds_path);

  /* ── If both uploaded and not yet verified, set id_verified_at ── */
  let verified = !!(profile?.id_verified_at);
  if (idUploaded && proofUploaded && !verified) {
    const { error: verifyError } = await supabase
      .from("users")
      .update({ id_verified_at: new Date().toISOString() })
      .eq("id", user.id);

    if (!verifyError) {
      verified = true;
    } else {
      console.error("[upload-id] Failed to set id_verified_at", verifyError);
    }
  }

  return NextResponse.json({ verified, idUploaded, proofUploaded });
}
