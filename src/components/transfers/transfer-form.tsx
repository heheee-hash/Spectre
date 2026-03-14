"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Plus, Trash2, ArrowRight } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const transferSchema = z.object({
    reference: z.string().optional(),
    sourceId: z.string().min(1, { message: "Source location is required" }),
    destinationId: z.string().min(1, { message: "Destination location is required" }),
    items: z.array(
        z.object({
            productId: z.string().min(1, { message: "Product is required" }),
            quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
        })
    ).min(1, { message: "At least one item is required" })
}).refine(data => data.sourceId !== data.destinationId, {
    message: "Source and Destination cannot be the same",
    path: ["destinationId"],
});

type TransferFormValues = z.infer<typeof transferSchema>;

export function TransferForm({ initialData }: { initialData?: any }) {
    const router = useRouter();

    const form = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema) as any,
        defaultValues: initialData || {
            reference: "",
            sourceId: "",
            destinationId: "",
            items: [{ productId: "", quantity: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "items",
        control: form.control,
    });

    const onSubmit = (values: TransferFormValues) => {
        toast.success("Transfer saved successfully!");
        router.push("/transfers");
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Link href="/transfers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">
                    {initialData ? `Edit Transfer ${initialData.id}` : "New Transfer"}
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer Routing</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <FormField
                                control={form.control}
                                name="reference"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Internal Reference</FormLabel>
                                        <FormControl>
                                            <Input placeholder="INT-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sourceId"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Source Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select origin" />
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
                                name="destinationId"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Destination Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select destination" />
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Transfer Items</CardTitle>
                                <CardDescription>Products designated to move</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1 })}>
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="w-[150px]">Quantity</TableHead>
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
                                                        name={`items.${index}.quantity`}
                                                        render={({ field }: { field: any }) => (
                                                            <FormControl>
                                                                <Input type="number" min="1" {...field} />
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
                                                    No items added. Click 'Add Item' to start.
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
                            <Link href="/transfers">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Transfer
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
