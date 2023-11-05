"use client";

import NoInternet from "@/src/components/connectivity/NoInternet ";
import Events from "@/src/components/events/events";
import Sidebar from "@/src/components/topBar-Comp/Sidebar";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const drawerWidth = 240;

const page = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Add event listeners to update online status
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <div>
      {isOnline ? (
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box
            sx={{
              flexGrow: 1,
              my: 5,
              mx: 1,
              mt: 5,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <div className="mt-10">
              <div className="text-[#000] text-xl font-semibold m-3">
                Wellcome to Events Dashboard
              </div>
              <div className="my-5">
                <Events />
              </div>
            </div>
          </Box>
        </Box>
      ) : (
        <NoInternet />
      )}
    </div>
  );
};

export default page;
