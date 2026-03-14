import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password | Core Inventory",
    description: "Set a new password for your account",
};

export default function ResetPasswordPage() {
    return <ResetPasswordForm />;
}
