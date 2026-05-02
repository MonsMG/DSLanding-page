import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const CLOUD_SUPABASE_URL = process.env.CLOUD_SUPABASE_URL;
const CLOUD_SERVICE_ROLE_KEY = process.env.CLOUD_SERVICE_ROLE_KEY;

const LOCAL_SUPABASE_URL =
  process.env.LOCAL_SUPABASE_URL ?? "http://127.0.0.1:54321";
const LOCAL_SERVICE_ROLE_KEY = process.env.LOCAL_SERVICE_ROLE_KEY;

if (!CLOUD_SUPABASE_URL) {
  throw new Error("Missing CLOUD_SUPABASE_URL");
}

if (!CLOUD_SERVICE_ROLE_KEY) {
  throw new Error("Missing CLOUD_SERVICE_ROLE_KEY");
}

if (!LOCAL_SERVICE_ROLE_KEY) {
  throw new Error("Missing LOCAL_SERVICE_ROLE_KEY");
}

const cloud = createClient(CLOUD_SUPABASE_URL, CLOUD_SERVICE_ROLE_KEY);
const local = createClient(LOCAL_SUPABASE_URL, LOCAL_SERVICE_ROLE_KEY);

const buckets = ["images", "landpages-media"];

async function migrateBucket(bucket: string) {
  const { data: objects, error: listError } = await cloud.storage
    .from(bucket)
    .list("", {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (listError) {
    throw listError;
  }

  for (const object of objects ?? []) {
    if (!object.name) continue;

    const { data: fileBlob, error: downloadError } = await cloud.storage
      .from(bucket)
      .download(object.name);

    if (downloadError) {
      console.error(
        `[DOWNLOAD FAILED] ${bucket}/${object.name}`,
        downloadError.message,
      );
      continue;
    }

    const { error: uploadError } = await local.storage
      .from(bucket)
      .upload(object.name, fileBlob, {
        upsert: true,
        contentType: object.metadata?.mimetype,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(
        `[UPLOAD FAILED] ${bucket}/${object.name}`,
        uploadError.message,
      );
      continue;
    }

    console.log(`[OK] ${bucket}/${object.name}`);
  }
}

async function main() {
  for (const bucket of buckets) {
    await migrateBucket(bucket);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
