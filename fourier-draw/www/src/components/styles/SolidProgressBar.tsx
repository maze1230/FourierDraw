import { styled } from "@mui/material/styles";
import { LinearProgress } from "@mui/material";

const SolidProgressBar = styled(LinearProgress)(() => ({
  "& .MuiLinearProgress-bar": {
    transition: "none"
  }
}));

export default SolidProgressBar;