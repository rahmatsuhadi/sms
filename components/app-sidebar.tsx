import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { CandlestickChart, History,PackagePlus } from "lucide-react"


  
// Menu items.
const items = [
  {
    title: "Items",
    url: "/dashboard",
    icon: CandlestickChart,
  },
  {
    title: "Category",
    url: "/dashboard/category",
    icon: PackagePlus,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
]

  
  export function AppSidebar() {
    return (
      <Sidebar className="">
         <SidebarHeader className="py-5 pl-10">
          <h2 className="font-bold text-xl">
          SMS Aplication
          </h2>
          </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <SidebarGroupLabel>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-5">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    )
  }
  