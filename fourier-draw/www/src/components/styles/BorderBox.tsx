import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const BorderBox = styled(Box)(({ theme }) => ({
  width: "100%",
  border: "1px solid",
  borderColor: theme.palette.primary.main,
}));

export default BorderBox;