"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema) as any,
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
        // Simulated forgot password request
        toast.success("Recovery email sent!");
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <Card className="w-full shadow-lg border-0 bg-background/50 backdrop-blur-sm text-center py-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription className="text-base pt-2">
                        We've sent password reset instructions to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full mt-4">
                        <Link href="/login">Return to log in</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center">Reset password</CardTitle>
                <CardDescription className="text-center">
                    Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@company.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-4 transition-all hover:scale-[1.02]"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Sending link..." : "Send reset link"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col border-t bg-muted/20 px-6 py-4">
                <Button variant="ghost" className="w-full justify-center gap-2">
                    <Link href="/login">
                        <ArrowLeft className="h-4 w-4" />
                        Back to log in
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
