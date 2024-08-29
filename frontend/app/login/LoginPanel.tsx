'use client';

import {useState} from "react";

function LoginInput({value, setValue, placeholder}) {
    return (
        <div className="flex flex-col space-y-1">
            <div className="text-xl text-gray-500">{placeholder}</div>
            <input type="text" className="border border-gray-300 rounded-lg shadow-xl px-5 py-4 text-black outline-none" value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
    )
}

export default function LoginPanel() {
    const [toggle, setToggle] = useState(false)

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function authenticate() {
        if (!toggle) {
            fetch("localhost:3000/api/login", {
                method: "POST",
                body: JSON.stringify({
                    email, password
                })
            }).then((res) => {
                console.log(res);
            }).catch((res) => {
                console.error(res);
            });
        }
    }

    return (
        <div className="border border-gray-300 flex flex-col p-5 sm:p-12 sm:shadow-2xl rounded-xl w-full sm:w-[700px] bg-white mb-12 space-y-5">
            <div className="text-xl mb-3 sm:text-2xl lg:text-3xl">{toggle ? "Register" : "Login"}</div>

            {/*<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name.." />*/}
            {toggle && (
                <>
                    <LoginInput value={firstName} setValue={setFirstName} placeholder="First Name"/>
                    <LoginInput value={lastName} setValue={setLastName} placeholder="Last Name"/>
                </>
            )}

            <LoginInput value={email} setValue={setEmail} placeholder="Email"/>
            <LoginInput value={password} setValue={setPassword} placeholder="Password"/>

            <button onClick={authenticate} className="w-full p-4 bg-sky-500 hover:bg-sky-400 text-white rounded-md">
                {toggle ? "Register" : "Login"}
            </button>


            <button className="text-sky-500" onClick={() => setToggle(!toggle)}>
                {
                    toggle ?
                        "Already have an account? Login" :
                        "Don't have an account? Register"
                }
            </button>
        </div>
    )
}
