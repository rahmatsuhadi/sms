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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Item Name must be at least 2 characters.",
  }),
  category_id: z.string().min(1, {
    message: "Category must Selected",
  }),
  // desciption: z.string(),
  stock: z.number().nonnegative(),
});

export function DialogCreateItem({refetch}:{refetch:() =>void}) {
  const { mutate } = useCreateItem();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: categories } = useCategories();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // desciption: '',
      name: "",
      stock: 1,
      category_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const request = await mutate({
      categoryId: values.category_id,
      name: values.name,
      stock: values.stock,
    });
    if (request) {
      setIsOpen(false);
      refetch()
    }
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => setIsOpen(true)}
          className="mt-3"
        >
          New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new Item</DialogTitle>
          <DialogDescription>
            Create item to management stock in the application.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="flex items-center space-x-2"> */}

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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Textarea placeholder="Description" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock First Time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Stock Item"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {loading ? <LoaderCircle className="animate-spin" /> : "Add Item"}
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
