import { DataTableCategory } from "@/components/table/category";

export default function CategoryPage(){
    return(
        <div className="w-full">

            <h1 className="text-xl mt-10">List Category</h1>

            <div className="">
                
            <DataTableCategory/>
            </div>
        </div>
    )
}