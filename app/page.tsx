import FormLogin from "@/components/form/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export default async function Home() {

  
  const token = await cookies();
  if (token.get("token-sms")) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full justify-center items-center h-screen flex-col flex">

      <div className="flex flex-col w-[70%] md:w-[25%]  p-4 border-zinc-200 border rounded-md">
        <h1 className="text-xl text-center font-bold">Inventory <span className="text-blue-600">System</span></h1>
        <FormLogin />
      </div>
    </div>
  );
}
