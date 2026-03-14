"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const adjustmentSchema = z.object({
    reason: z.string().min(2, { message: "Adjustment reason is required" }),
    locationId: z.string().min(1, { message: "Location is required" }),
    notes: z.string().optional(),
    items: z.array(
        z.object({
            productId: z.string().min(1, { message: "Product is required" }),
            countedQuantity: z.coerce.number().min(0, { message: "Counted quantity must be 0 or more" }),
        })
    ).min(1, { message: "At least one item is required for adjustment" })
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export function AdjustmentForm({ initialData }: { initialData?: any }) {
    const router = useRouter();

    const form = useForm<AdjustmentFormValues>({
        resolver: zodResolver(adjustmentSchema) as any,
        defaultValues: initialData || {
            reason: "",
            locationId: "",
            notes: "",
            items: [{ productId: "", countedQuantity: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "items",
        control: form.control,
    });

    const onSubmit = (values: AdjustmentFormValues) => {
        toast.success("Adjustment saved successfully!");
        router.push("/adjustments");
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Link href="/adjustments">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">
                    {initialData ? `Edit Adjustment ${initialData.id}` : "New Adjustment"}
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Adjustment Header</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Reason</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Physical inventory count" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="locationId"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="WH-Main">Main HQ Warehouse</SelectItem>
                                                    <SelectItem value="WH-East">East Coast Distribution</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Internal Notes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Any additional details..." className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Counted Items</CardTitle>
                                <CardDescription>Enter the real, physical quantity found</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", countedQuantity: 0 })}>
                                <Plus className="mr-2 h-4 w-4" /> Add Line
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="w-[150px]">Counted Qty</TableHead>
                                            <TableHead className="w-[80px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.productId`}
                                                        render={({ field }: { field: any }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select product" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="PRD-001">Wireless Keyboard [KB-WR-01]</SelectItem>
                                                                    <SelectItem value="PRD-045">USB-C Hub [HB-USBC-45]</SelectItem>
                                                                    <SelectItem value="PRD-102">Ergonomic Mouse [MS-ERG-02]</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.countedQuantity`}
                                                        render={({ field }: { field: any }) => (
                                                            <FormControl>
                                                                <Input type="number" min="0" {...field} />
                                                            </FormControl>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {fields.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                    No items added. Click 'Add Line' to start.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {form.formState.errors.items?.root && (
                                <p className="text-sm font-medium text-destructive mt-2">
                                    {form.formState.errors.items.root.message}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button">
                            <Link href="/adjustments">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Adjustment
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
