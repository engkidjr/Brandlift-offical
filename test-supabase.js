import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ffrcwebadrtwspsmagdn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcmN3ZWJhZHJ0d3Nwc21hZ2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDEyOTIsImV4cCI6MjA5MjExNzI5Mn0.S5fUO_k0M3qrUcA3m02CucVxYlKQCzH8Ak5s8UhQaL8";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testAuth() {
  console.log("Testing auth...");
  const { data, error } = await supabase.auth.signUp({
    email: "liftbrand0@gmail.com",
    password: "AbsoluteSecure!2025"
  });

  console.log("Sign up result:", JSON.stringify({ data, error }, null, 2));

  if (!error) {
    console.log("Trying to sign in...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: "liftbrand0@gmail.com",
      password: "AbsoluteSecure!2025"
    });
    console.log("Sign in result:", JSON.stringify({ data: signInData, error: signInError }, null, 2));
  }
}

testAuth();
