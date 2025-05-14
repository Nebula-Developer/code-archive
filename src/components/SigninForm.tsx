import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Button } from "@/components/ui/button";

const SigninForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchButton = (<Button variant="secondary" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </Button>);

  return (
    <div className="space-y-4">
      {isLogin ? <LoginForm buttons={switchButton} /> : <RegisterForm buttons={switchButton} />}
      
    </div>
  );
};

export default SigninForm;
