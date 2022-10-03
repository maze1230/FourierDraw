/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { createRoot } from "react-dom/client";

import { SnackbarProvider } from "notistack";

import App from "./App";

const root = createRoot(document.getElementById("app")!);

root.render((
  <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
));
