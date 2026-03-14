import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Core Inventory",
    description: "Sign in to your account",
};

export default function LoginPage() {
    return <LoginForm />;
}
