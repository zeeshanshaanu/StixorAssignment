import React from "react";
import Lottie from "lottie-react";
import { Box } from "@mui/material";

import animationData from "../../../public/Assets/LottieFile/No-Internet.json";

const NoInternet: React.FC = () => {
  const options = {
    animationData: animationData, // Make sure animationData is the actual animation data
    loop: true,
  };

  return (
    <div className="">
      <div className="CenterDiv">
        <Box width={170} height={170}>
          <Lottie animationData={options.animationData} loop={options.loop} />
        </Box>
        <h2 className="mt-5 font-semibold">Looks like you're offline</h2>
        <small>please check your internet connection and try again.</small>
      </div>
    </div>
  );
};

export default NoInternet;
