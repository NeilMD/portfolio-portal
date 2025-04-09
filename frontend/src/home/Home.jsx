import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/api";
import { tc } from "@/lib/tc";
import data from "@/src/home/data.json";
import { ProfileForm } from "@/components/profile-form";

const Home = () => {
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const [response, error] = await tc(() =>
      api.post("/api/user/profile/get", { userId })
    );
    setUserInfo(response.data.objData);
    console.log(response);
  };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar userInfo={userInfo} variant="inset" />
        <SidebarInset>
          <SiteHeader title="Home" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <h1 className="text-4xl">
                    Welcome back, {userInfo?.name || userInfo?.username}!
                  </h1>
                </div>
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Home;
