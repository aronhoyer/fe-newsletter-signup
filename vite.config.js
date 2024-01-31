import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        nested: path.resolve(__dirname, "success.html"),
      },
    },
  },
})
