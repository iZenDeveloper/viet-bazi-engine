import { defineConfig,devices } from '@playwright/test';

const e2ePort=Number(process.env.VIET_BAZI_E2E_PORT??4173);

export default defineConfig({
  testDir:'./e2e',
  testMatch:'**/*.e2e.mjs',
  fullyParallel:true,
  forbidOnly:Boolean(process.env.CI),
  retries:process.env.CI?1:0,
  workers:process.env.CI?3:undefined,
  reporter:process.env.CI?'line':'list',
  use:{baseURL:`http://127.0.0.1:${e2ePort}`,trace:'on-first-retry'},
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    {name:'firefox',use:{...devices['Desktop Firefox']}},
    {name:'webkit',use:{...devices['Desktop Safari']}}
  ],
  webServer:{
    command:'npm run build && node scripts/serve-demo.mjs',
    url:`http://127.0.0.1:${e2ePort}/demo/`,
    env:{VIET_BAZI_DEMO_PORT:String(e2ePort)},
    reuseExistingServer:!process.env.CI,
    timeout:120000
  }
});
