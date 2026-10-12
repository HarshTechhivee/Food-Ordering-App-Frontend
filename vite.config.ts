import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    define: {
      "process.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL),
      "process.env.SERVER_URL": JSON.stringify(env.SERVER_URL),
      "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify(
        env.STRIPE_PUBLISHABLE_KEY
      ),
    },

    server: {
      port: 5174,
      strictPort: true,
    },
  };
});