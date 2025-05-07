
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure optimizeDeps to ensure proper handling of problematic dependencies
  optimizeDeps: {
    include: ['exceljs', 'file-saver', 'docx']
  },
  // Fix Rollup warning for external modules
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      external: ['exceljs'],
      output: {
        globals: {
          exceljs: 'ExcelJS'
        }
      }
    }
  }
}));
