
"use client";
import { Item } from "@prisma/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useDeleteItem } from "@/hooks/useDataItem";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export function DialogDeleteItem({isOpen,data, onClose, refetch}:{data:Partial<Item>,isOpen:boolean, onClose:() => void, refetch:()=>void}) {
  const {mutate} = useDeleteItem();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onCommit() {
    setIsLoading(true);
    if (!data.id) return
    const request = await mutate(data.id);
    if (request) {
      onClose();
      refetch();
    }
    setIsLoading(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onCommit}>{isLoading ? <LoaderCircle className="animate-spin" /> : "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>

  );
}
