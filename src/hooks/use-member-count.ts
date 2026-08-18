import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const useMemberCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase.rpc("get_member_count");
      if (!cancelled && !error && typeof data === "number") {
        setCount(data);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
};
