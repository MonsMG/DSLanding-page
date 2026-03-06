import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Info");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Supabase error:", error.message);
  } else {
    console.log(
      "Buckets:",
      data.map((b) => b.name),
    );
  }
}

checkBuckets();
