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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Category, Item } from "@prisma/client";
import { useEditCategory } from "@/hooks/useCategories";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category Name must be at least 2 characters.",
  }),
  // desciption: z.string(),
});

export function DialogEditCategory({
  isOpen,
  onClose,
  data,
  refetch,
}: {
  refetch: () => void;
  data: Category;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // desciption: "",
      name: data.name,
    },
  });

  const { mutate } = useEditCategory(data.id);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const request = await mutate({
      name: values.name,
    });
    if (request) {
      onClose();
      refetch();
    }
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Edit category to grouping item stock in the application.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item Name" {...field} />
                  </FormControl>
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
              {loading ? <LoaderIcon className="animate-spin"/> : "Save Item"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
