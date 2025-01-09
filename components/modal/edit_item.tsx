"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Item } from "@prisma/client";
import { useEditItem } from "@/hooks/useDataItem";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Item Name must be at least 2 characters.",
  }),
  lowStockThreshold: z.number().nonnegative(),
  // desciption: z.string(),
});

export function DialogEditItem({isOpen, onClose, data, refetch}:{data:Partial<Item>,isOpen:boolean, onClose:() => void, refetch:()=>void}) {
  const {mutate} = useEditItem();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // desciption: "",
      lowStockThreshold: data.lowStockThreshold,
      name: data.name,
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!data.id) return
    const request = await mutate(data.id,{
      name:values.name,
      lowStockThreshold: values.lowStockThreshold
    });
    if (request) {
      onClose();
      refetch();
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Edit item to management stock in the application.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Alert</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Low Stock Alert"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                    <FormDescription>Set this value for alert threshold Stock  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="desciption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Button type="submit" className="w-full">
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Save Item"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
