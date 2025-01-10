"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateItem } from "@/hooks/useDataItem";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LoaderCircle } from "lucide-react";
import { ItemStock, useCheckStockTotal } from "@/hooks/useHistory";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

const formSchema = z.object({
  //   name: z.string().min(2, {
  //     message: "Item Name must be at least 2 characters.",
  //   }),
  //   category_id: z.string().min(1, {
  //     message: "Category must Selected",
  //   }),
  // desciption: z.string(),
  stock: z.number().nonnegative(),
  type: z.enum(["OUT", "IN"]),
  //   lowStockThreshold: z.number().nonnegative(),
});

export function DialogCheckStock() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [data, setData] = useState<ItemStock[]>([]);

  const { mutate, loading } = useCheckStockTotal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // desciption: '',
      //   name: "",
      stock: 1,
      type: "OUT",

      //   lowStockThreshold: 10,
      //   category_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await mutate({
      stock: values.stock,
      type: values.type,
    });
    if (response?.data) {
      setData(response.data);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => setIsOpen(true)}
          className="mt-3"
        >
          Check Stock History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checking Total Stock</DialogTitle>
          <DialogDescription>
            This feature is designed to calculate the total expenditure or input
            of stock for goods valued at a certain threshold or higher.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="flex items-center space-x-2"> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Value"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    This input is used to determine the minimum total stock that
                    will be searched.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OUT">OUT</SelectItem>
                        <SelectItem value="IN">IN</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                      <ScrollArea className="max-h-[200px]">
                  <table className="w-full">
                    <thead>

                    <tr>
                      <th>
                        Item
                      </th>
                      <th>Total Stock</th>
                      <th>-</th>
                    </tr>
                    </thead>
                    <tbody>

                        
                    
                    {data.map((item, i) => (
                      <tr key={i} className="border-b border pb-2">
                      <td >{item.name}</td>
                      <td >{item.total}</td>
                      <td ><Link href={"/dashboard/item/" + item.id} className="text-sm underline">Check</Link></td>
                    </tr>
                    ))}

                    </tbody>
                  </table>
                      </ScrollArea>
                  
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              {loading ? <LoaderCircle className="animate-spin" /> : "Check"}
            </Button>
          </form>
        </Form>

        {/* </div> */}
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
