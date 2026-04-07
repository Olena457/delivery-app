import React, { forwardRef } from "react";
import { Fade } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

 const FadeTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} timeout={{ enter: 500, exit: 400 }} />;
});

export default FadeTransition;