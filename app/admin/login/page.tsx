"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@nextui-org/react";

export default function Login() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWD) {
            localStorage.setItem("adminLoggedIn", "true");
            router.push("/admin/dashboard");
        } else {
            setError(true);
        }
    };

    return (
        <Card className="mx-auto mt-16 w-80 p-6">
            <h2 className="text-2xl">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <Button type="submit" fullWidth>Login</Button>
            </form>
            {error && <p style={{ color: "red" }}>Incorrect password</p>}
        </Card>
    );
}
