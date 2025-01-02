"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import CreateItemForm from "../form/create_item"

export function DialogCreateItem() {


  
  // const form = useForm()


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-3">New Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new Item</DialogTitle>
          <DialogDescription>
            Create item to management stock in the application.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="flex items-center space-x-2"> */}

          <CreateItemForm/>

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
  )
}
