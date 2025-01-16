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
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Item } from "@prisma/client";
import { useManageStock } from "@/hooks/useDataItem";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";




const formSchema = z.object({
    amount: z.number(),
    type: z.enum(["reduce", "add"]),
  })


export function DialogManageStock({isOpen,data, onClose, refetch}:{isOpen:boolean,data:Item, onClose:() =>void, refetch:()=>void}) {
  const {mutate} = useManageStock();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [afterStock, setAfterStock] = useState<number>(data.stock)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: "add"
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!data.id) return
    const request = await mutate(data.id, {
      amount: values.amount,
      type: values.type == "add" ? "IN" : "OUT"
    });
    if (request) {
      form.reset()
      onClose();
      refetch();
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        <Button variant="default" className="mt-3">
          New Item
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Stock</DialogTitle>
          <DialogDescription>
            This form to manipulation stock Add or Reduce Stock Item
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Amount" 
                    {...field} 
                    value={field.value} 
                    onChange={(e) => {
                      field.onChange(Number(e.target.value))
                      const type = form.getValues("type");                    
                      if(type=="add"){
                        setAfterStock(data.stock + Number(e.target.value))
                      }
                      else{
                        setAfterStock(data.stock - Number(e.target.value))
                      }

                    }
                  }/>
                </FormControl>
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
                    
                    field.onChange(value)
                    const amount = form.getValues("amount");                    
                      if(value=="add"){
                        setAfterStock(data.stock + Number(amount))
                      }
                      else{
                        setAfterStock(data.stock - Number(amount))
                      }                  
                  }
                  }
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="reduce">Reduce Stock</SelectItem>
                  </SelectContent>
                </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <div>
            <Label>Before</Label>
            <h4 className="mb-4">{data.stock}</h4>
            <Label>After</Label>
            <h4>{afterStock}</h4>
          </div>

          <Button type="submit" className="w-full">{isLoading ? <LoaderIcon className="animate-spin"/> : "Process"}</Button>
        </form>
      </Form>
        

      </DialogContent>
    </Dialog>
  );
}
