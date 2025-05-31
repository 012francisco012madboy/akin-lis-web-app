import type { AppProps } from "next/app";
import { FormProvider } from "../context/FormContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider>
        <Component {...pageProps} />
      </FormProvider>
    </QueryClientProvider>
  );
}
