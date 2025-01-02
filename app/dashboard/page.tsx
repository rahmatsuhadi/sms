import { DialogCreateItem } from "@/components/modal/create_item";
import { DataTableDemo } from "@/components/table/produk";

export default function Main(){
    return(
        <div className="w-full">

            <h1 className="text-xl mt-10">List Produk</h1>

            <DialogCreateItem/>

            <DataTableDemo/>
        </div>
    )
}