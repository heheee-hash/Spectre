"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const warehouseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    code: z.string().min(2, { message: "Code must be at least 2 characters" }),
    address: z.string().optional(),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
    initialData?: WarehouseFormValues & { id: string };
}

export function WarehouseForm({ initialData }: WarehouseFormProps) {
    const router = useRouter();

    const form = useForm<WarehouseFormValues>({
        resolver: zodResolver(warehouseSchema) as any,
        defaultValues: initialData || {
            name: "",
            code: "",
            address: "",
        },
    });

    const onSubmit = (values: WarehouseFormValues) => {
        toast.success(initialData ? "Warehouse updated successfully!" : "Warehouse created successfully!");
        router.push("/warehouses");
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Link href="/warehouses">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">
                    {initialData ? "Edit Warehouse" : "New Warehouse"}
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Warehouse Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Warehouse Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Main HQ Warehouse" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Short Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="WH-01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Physical Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Storage St, City, Country" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button">
                            <Link href="/warehouses">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData ? "Save Changes" : "Create Warehouse"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
