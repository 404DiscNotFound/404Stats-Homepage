import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { getServerToken, setServerToken, clearServerToken } from "@/lib/serverAuth";

export function useServerPassword(slug) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const check = async () => {
      setStatus("checking");
      try {
        const res = await base44.functions.invoke("verifyServerPassword", { server_slug: slug });
        if (res.data.password_required) {
          if (getServerToken(slug)) {
            setStatus("ready");
          } else {
            setStatus("needsPassword");
          }
        } else {
          setStatus("ready");
        }
      } catch {
        setStatus("ready");
      }
    };
    check();
  }, [slug]);

  const verifyPassword = async (password) => {
    try {
      const res = await base44.functions.invoke("verifyServerPassword", { server_slug: slug, password });
      if (res.data.access_token) {
        setServerToken(slug, res.data.access_token);
        setStatus("ready");
        return { success: true };
      }
      return { success: false, error: "Falsches Passwort" };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Fehler beim Verifizieren" };
    }
  };

  const handlePasswordError = (err) => {
    const errMsg = (err?.response?.data?.error || err?.data?.error || "").toLowerCase();
    if (err?.response?.data?.password_required || errMsg.includes("password")) {
      clearServerToken(slug);
      setStatus("needsPassword");
      return true;
    }
    return false;
  };

  return { status, verifyPassword, handlePasswordError };
}