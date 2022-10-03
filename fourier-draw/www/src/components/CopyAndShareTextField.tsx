import { IconButton, InputAdornment, OutlinedInput, Stack, Tooltip } from "@mui/material";
import { ContentCopy, Twitter } from "@mui/icons-material";
import React, { useRef, useState } from "react";
import { TwitterShareButton } from "react-share";

const CopyTextField = ({
  text
}: {
  text: string
}) => {
  const [copied, setCopied] = useState(false);
  const isSupported = !!navigator.clipboard;
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);

  const onClick = () => {
    if (isSupported) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const onClickShare = () => {
    shareButtonRef.current!.click();
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
            <IconButton
              onClick={onClickShare}
            >
              <Twitter />
            </IconButton>
            <TwitterShareButton
              url="https://maze1230.github.io/FourierDraw/"
              title={text}
              ref={shareButtonRef}
              style={{ display: "none" }}
            >
              NOSIZE
            </TwitterShareButton>
          </Stack>
        </InputAdornment>
      }
    />
  );
};

export default CopyTextField;