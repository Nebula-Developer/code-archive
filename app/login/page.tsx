"use client";

import { useState } from "react";

function LoginForm({ setLogin, state, setState }: { setLogin: (login: boolean) => void; state: any; setState: (state: any) => void }) {
  const [error, setError] = useState("");

  function submit() {
    if (!state.email || !state.password) {
      setError("All fields are required");
      return;
    }

    setError("Not implemented");
  }

  return (
    <>
      <div className="text-lg mb-5">Login</div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Email</div>
          <input
            type="text"
            className="border border-gray-300 outline-none p-3 text-sm rounded-lg shadow-md"
            placeholder="username@example.com"
            onChange={(e) => setState({ ...state, email: e.target.value })}
            value={state.email}
          />
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Password</div>
          <input
            type="password"
            className="border border-gray-300 outline-none p-3 text-sm rounded-lg shadow-md"
            placeholder="..."
            onChange={(e) => setState({ ...state, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            value={state.password}
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button className="p-3 bg-sky-500 hover:bg-sky-400 text-white rounded-lg shadow-md" onClick={submit}>
          Login
        </button>

        <button
          className="mt-3 text-sky-400 text-sm bg-none outline-none border-none"
          onClick={() => setLogin(false)}
        >
          Haven&apos;t got an account? Register
        </button>
      </div>
    </>
  );
}

function RegisterForm({ setLogin, state, setState }: { setLogin: (login: boolean) => void; state: any; setState: (state: any) => void }) {
  const [error, setError] = useState("");

  function submit() {
    if (
      !state.name ||
      !state.email ||
      !state.password ||
      !state.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (state.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (state.password !== state.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("Not implemented");
  }

  return (
    <>
      <div className="text-lg mb-5">Register</div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Name</div>
          <input
            type="text"
            className="border border-gray-300 outline-none p-3 text-sm rounded-lg shadow-md"
            placeholder="John Doe"
            onChange={(e) => setState({ ...state, name: e.target.value })}
            value={state.name}
          />
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Email</div>
          <input
            type="text"
            className="border border-gray-300 outline-none p-3 text-sm rounded-lg shadow-md"
            placeholder="username@example.com"
            onChange={(e) => setState({ ...state, email: e.target.value })}
            value={state.email}
          />
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Password</div>
          <input
            type="password"
            className="border border-gray-300 outline-none p-3 text-sm rounded-lg shadow-md"
            placeholder="..."
            onChange={(e) => setState({ ...state, password: e.target.value })}
            value={state.password}
          />
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Confirm Password</div>
          <input
            type="password"
            className="border border-gray-300 outline-none p-3 text-sm rounded-lg shadow-md"
            placeholder="..."
            onChange={(e) =>
              setState({ ...state, confirmPassword: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && submit()}
            value={state.confirmPassword}
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          className="p-3 bg-sky-500 hover:bg-sky-400 text-white rounded-lg shadow-md"
          onClick={submit}
        >
          Register
        </button>

        <button
          className="mt-3 text-sky-400 text-sm bg-none outline-none border-none"
          onClick={() => setLogin(true)}
        >
          Already have an account? Login
        </button>
      </div>
    </>
  );
}

export default function Page() {
  const [login, setLogin] = useState(true);
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="flex justify-center mt-12 mx-12">
      <div className="rounded-lg shadow-xl border border-gray-300 p-6 max-w-xl w-full">
        {login ? (
          <LoginForm setLogin={setLogin} state={state} setState={setState} />
        ) : (
          <RegisterForm setLogin={setLogin} state={state} setState={setState} />
        )}
      </div>
    </div>
  );
}
