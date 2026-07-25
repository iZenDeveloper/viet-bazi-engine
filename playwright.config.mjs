import { defineConfig,devices } from '@playwright/test';

export default defineConfig({
  testDir:'./e2e',
  testMatch:'**/*.e2e.mjs',
  fullyParallel:true,
  forbidOnly:Boolean(process.env.CI),
  retries:process.env.CI?1:0,
  workers:process.env.CI?3:undefined,
  reporter:process.env.CI?'line':'list',
  use:{baseURL:'http://127.0.0.1:4173',trace:'on-first-retry'},
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    {name:'firefox',use:{...devices['Desktop Firefox']}},
    {name:'webkit',use:{...devices['Desktop Safari']}}
  ],
  webServer:{
    command:'npm run build && node scripts/serve-demo.mjs',
    url:'http://127.0.0.1:4173/demo/',
    env:{VIET_BAZI_DEMO_PORT:'4173'},
    reuseExistingServer:!process.env.CI,
    timeout:120000
  }
});
