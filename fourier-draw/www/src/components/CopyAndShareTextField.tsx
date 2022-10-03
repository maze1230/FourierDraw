import { IconButton, InputAdornment, OutlinedInput, Stack, Tooltip } from "@mui/material";
import { ContentCopy, Twitter } from "@mui/icons-material";
import React, { useState } from "react";
import { TwitterShareButton } from "react-share";

const CopyTextField = ({
  text
}: {
  text: string
}) => {
  const [copied, setCopied] = useState(false);
  const isSupported = !!navigator.clipboard;

  const onClick = () => {
    if (isSupported) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <OutlinedInput
      type="text"
      value={text}
      readOnly
      fullWidth
      multiline
      rows={5}
      endAdornment={
        <InputAdornment position="end">
          <Stack direction="column" spacing={3}>
            {isSupported ? (
              <Tooltip
                arrow
                placement="top"
                title={copied ? "Copied!" : "Copy"}
              >
                <IconButton onClick={onClick}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            ) : ""}
            <IconButton>
              <TwitterShareButton
                url="https://maze1230.github.io/FourierDraw/"
                title={text}
              >
                <Twitter />
              </TwitterShareButton>
            </IconButton>
          </Stack>
        </InputAdornment>
      }
    />
  );
};

export default CopyTextField;