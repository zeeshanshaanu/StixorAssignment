import React from "react";
import { useLottie } from "lottie-react";
import { Box } from "@mui/material";
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////      CUSTOM IMPORTS              ////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
import animationData from "../../../public/Assets/LottieFile/Nodata.json";

const NoData = () => {
  const options = {
    animationData: animationData,
    loop: true,
  };
  const { View } = useLottie(options);

  return (
    <div className="">
      <div className="CenterDiv">
        <Box width={170} height={170}>
          <div className="text-center">{View}</div>
          <h2 className="mt-2 text-center font-semibold text-red-400">
            No Data Found.
          </h2>
        </Box>
      </div>
    </div>
  );
};

export default NoData;
