import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    {/* <AppContext.Provider value={{ ...appData }}> */}
    <App />
    {/* </AppContext.Provider> */}
  </QueryClientProvider>
);
