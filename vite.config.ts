import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Only load the optional Lovable plugin in development to avoid build-time module errors
  const devPlugins = [] as unknown[];

  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      devPlugins.push(componentTagger());
    } catch (error) {
      console.warn('lovable-tagger not installed; skipping dev-only tagger plugin');
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      ...devPlugins,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

  
