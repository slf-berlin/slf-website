import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// En dev : quand un projet est modifié dans le CMS (content/projekte/*.yml),
// regénère src/data/projects.js → Vite recharge la page automatiquement.
// (Les JSON de content/pages/ sont importés directement et déjà suivis par Vite.)
function contentRebuild() {
  let timer = null
  const rebuild = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      execFile('node', [join(__dirname, 'scripts/build-projects-from-content.mjs')], (err, stdout, stderr) => {
        if (err) console.error('[content] rebuild failed:', stderr || err.message)
        else console.log('[content]', stdout.trim())
      })
    }, 150)
  }
  return {
    name: 'slf-content-rebuild',
    configureServer(server) {
      const dir = join(__dirname, 'content/projekte')
      server.watcher.add(dir)
      const onChange = (file) => { if (file.startsWith(dir)) rebuild() }
      server.watcher.on('change', onChange)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

export default defineConfig({
  plugins: [react(), contentRebuild()],
  base: '/slf-website/',
  server: {
    port: 5173,
    strictPort: true,
  },
})
