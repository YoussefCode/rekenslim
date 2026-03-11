import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const devPlugins: PluginOption[] = [];

  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      devPlugins.push(componentTagger());
    } catch {
      // lovable-tagger not installed
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
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
