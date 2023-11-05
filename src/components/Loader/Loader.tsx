import * as React from "react";
import { useLottie } from "lottie-react";
import { Box } from "@mui/material";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////      CUSTOM IMPORTS              ////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
import animationData from "../../../public/Assets/LottieFile/LoaderFile.json";

export default function Loader() {
  const options = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(options);
  return (
    <Box width={100} height={100}>
      <div className="text-center">{View}</div>
    </Box>
  );
}
