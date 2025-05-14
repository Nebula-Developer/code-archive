import { useRef, useState } from "react";
import { account } from "@/lib/appwrite";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { $user, $userState } from "@/state/userStore";

const LoginForm = ({ buttons }: { buttons: React.ReactNode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  
  let passwordRef = useRef<HTMLInputElement>(null);
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await account.createEmailPasswordSession(email, password);
      $userState.set("loading");
    } catch (error: any) {
      setError(error.message);
    }
  };


  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            passwordRef.current?.focus();
        }}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ref={passwordRef}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            handleLogin();
        }}
      />

      <div className="flex gap-4">
        <Button onClick={handleLogin}>Login</Button>
        {buttons}
      </div>
    </div>
  );
};

export default LoginForm;
