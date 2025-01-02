import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


const formSchema = z.object({
    name: z.string().min(2, {
      message: "Item Name must be at least 2 characters.",
    }),
    category_id: z.string(),
    desciption: z.string(),
    stock: z.number().min(0, {message: "minimal 0 number"})
  })

export default function CreateItemForm(){
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            desciption: '',
            name: '',
            stock: 0
        },
      })

      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
      }

    return(
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
                <Select {...field}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Elektronik</SelectItem>
                    <SelectItem value="2">Furniture</SelectItem>
                  </SelectContent>
                </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
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
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock First Time</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Stock Item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Add Item</Button>
        </form>
      </Form>
    )
}