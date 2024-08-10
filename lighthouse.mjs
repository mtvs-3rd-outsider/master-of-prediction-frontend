import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';
import open from 'open';

const runLighthouse = async (url, options, config, reportName) => {
  const chrome = await launch({ chromeFlags: ['--headless'] });
  options.port = chrome.port;

  const runnerResult = await lighthouse(url, options, config);

  const reportHtml = runnerResult.report;
  const reportPath = `${reportName}.html`;
  fs.writeFileSync(reportPath, reportHtml);

  console.log(`Lighthouse ${reportName} performance score: ${runnerResult.lhr.categories.performance.score * 100}`);

  await chrome.kill();

  // 리포트를 브라우저에서 엽니다.
  await open(reportPath);
};

const desktopOptions = {
  output: 'html',
  onlyCategories: ['performance'],
  throttlingMethod: 'simulate',
  throttling: {
    rttMs: 40,
    throughputKbps: 10240,
    cpuSlowdownMultiplier: 4,
  },
  formFactor: 'desktop', // formFactor를 desktop으로 설정
  screenEmulation: {
    mobile: false, // 데스크톱이므로 mobile을 false로 설정
    width: 1920, // 데스크톱 너비
    height: 1080, // 데스크톱 높이
    deviceScaleFactor: 1,
    disabled: false,
  },
};

const mobileOptions = {
  output: 'html',
  onlyCategories: ['performance'],
  throttlingMethod: 'simulate',
  throttling: {
    rttMs: 150,
    throughputKbps: 1600,
    cpuSlowdownMultiplier: 4,
  },
  formFactor: 'mobile', // formFactor를 mobile로 설정
  screenEmulation: {
    mobile: true, // 모바일이므로 mobile을 true로 설정
    width: 375, // 모바일 너비
    height: 812, // 모바일 높이
    deviceScaleFactor: 2,
    disabled: false,
  },
};

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    skipAudits: ['uses-http2', 'uses-long-cache-ttl'],
  },
};

const url = 'http://localhost:8080';

const runTests = async () => {
  // 데스크톱 테스트 실행
  await runLighthouse(url, desktopOptions, config, 'lighthouse-desktop-report');

  // 모바일 테스트 실행
  await runLighthouse(url, mobileOptions, config, 'lighthouse-mobile-report');
};

runTests();
