import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"

import { router } from "@/router"
import "./index.css"
import "./theme.css"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>

  </StrictMode>
)
