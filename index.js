/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let asyncawait = true;
try {
    new Function('async function test(){await 1}');
} catch (error) {
    asyncawait = false;
}

if (asyncawait) {
    const {
        helper
    } = require('./lib/helper');
    const api = require('./lib/api');
    for (const className in api) {
        // Puppeteer-web excludes certain classes from bundle, e.g. BrowserFetcher.
        if (typeof api[className] === 'function')
            helper.installAsyncStackHooks(api[className]);
    }
}

// If node does not support async await, use the compiled version.
const Puppeteer = asyncawait ? require('./lib/Puppeteer') : require('./node6/lib/Puppeteer');
const packageJson = require('./package.json');
const preferredRevision = packageJson.puppeteer.chromium_revision;
const isPuppeteerCore = packageJson.name === 'puppeteer-core';

module.exports = new Puppeteer(__dirname, preferredRevision, isPuppeteerCore);

// Project requirements:
const puppeteer = require('puppeteer');
const LOGIN = require('./login');

async function run() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();

    // Potetial Login Feature - Load from login.js:
    await page.goto(LOGIN.LOGIN_URL);
    await page.click(LOGIN.USERNAME_SELECTOR);
    await page.keyboard.type(LOGIN.username);
    await page.click(LOGIN.PASSWORD_SELECTOR);
    await page.keyboard.type(LOGIN.password);
    await page.click(LOGIN.BUTTON_SELECTOR);
	await navigationPromise; 

	// SingleFile URL - Command Line Interface:
    await page.goto('https://github.com/gildas-lormeau/SingleFile/');

    // SingleFile Execute JS - Command Line Interface:
    await page.evaluate('window.scrollBy(0, 1000)')

    // SingleFile Download Website - Command Line Interface:
    await page.screenshot({
        path: 'screenshots/github.png'
    });

    browser.close();
}

run();