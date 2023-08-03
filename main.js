import App from './App'
import { createSSRApp } from 'vue'
import router from '@/router' 

export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
	router  
  }
}