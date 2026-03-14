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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const locationSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    code: z.string().min(2, { message: "Code must be at least 2 characters" }),
    warehouseId: z.string().min(1, { message: "Please select a warehouse" }),
    type: z.string().min(1, { message: "Please select a location type" }),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationFormProps {
    initialData?: LocationFormValues & { id: string };
}

export function LocationForm({ initialData }: LocationFormProps) {
    const router = useRouter();

    const form = useForm<LocationFormValues>({
        resolver: zodResolver(locationSchema) as any,
        defaultValues: initialData || {
            name: "",
            code: "",
            warehouseId: "",
            type: "",
        },
    });

    const onSubmit = (values: LocationFormValues) => {
        toast.success(initialData ? "Location updated successfully!" : "Location created successfully!");
        router.push("/locations");
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Link href="/locations">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">
                    {initialData ? "Edit Location" : "New Location"}
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Location Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Shelf A1" {...field} />
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
                                                <Input placeholder="WH1-A1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="warehouseId"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Warehouse</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select warehouse" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="WH-Main">Main HQ Warehouse</SelectItem>
                                                    <SelectItem value="WH-East">East Coast Distribution</SelectItem>
                                                    <SelectItem value="WH-West">West Coast Transit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Location Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="shelf">Shelf</SelectItem>
                                                    <SelectItem value="rack">Rack</SelectItem>
                                                    <SelectItem value="room">Room</SelectItem>
                                                    <SelectItem value="dock">Dock</SelectItem>
                                                    <SelectItem value="bin">Bin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button">
                            <Link href="/locations">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData ? "Save Changes" : "Create Location"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
