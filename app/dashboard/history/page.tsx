import { DialogCheckStock } from "@/components/modal/check_stock_total";
import { DataTableHistory } from "@/components/table/history";

export default function CategoryPage(){
    return(
        <div className="w-full">

            <h1 className="text-xl mt-10">History Items Transaction</h1>
            

            <DialogCheckStock/>

            <div className="">                
                <DataTableHistory/>
            </div>
        </div>
    )
}