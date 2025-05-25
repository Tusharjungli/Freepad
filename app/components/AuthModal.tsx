"use client";
import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { X } from "lucide-react";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Register user (hash password and store in Prisma)
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setIsLogin(true);
      } else {
        const data = await res.json();
        setError(data.error || "Error registering.");
      }
    } catch {
      setError("Error registering.");
    }
  }

  // Login with credentials
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) setError(result.error);
    if (result?.ok) onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-200 dark:border-gray-700 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" onClick={onClose}>
          <X />
        </button>
        {session ? (
          <>
            <div className="mb-4">
              <span className="font-bold text-lg">Hi, {session.user?.name || session.user?.email}!</span>
            </div>
            <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
              onClick={() => signOut({ callbackUrl: "/" })}
            >Sign Out</button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{isLogin ? "Sign In" : "Sign Up"}</h2>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
              <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition">
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <div className="my-2 text-gray-400">or</div>
            <button
              className="w-full py-2 mb-2 rounded bg-blue-600 text-white font-semibold"
              onClick={() => signIn("google")}
            >
              Continue with Google
            </button>
            <div className="mt-2 text-sm">
              {isLogin
                ? (
                  <>
                    No account?{" "}
                    <button className="underline text-blue-600" onClick={() => setIsLogin(false)}>
                      Sign up
                    </button>
                  </>
                )
                : (
                  <>
                    Already have an account?{" "}
                    <button className="underline text-blue-600" onClick={() => setIsLogin(true)}>
                      Log in
                    </button>
                  </>
                )
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
