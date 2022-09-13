const fs = require('fs');

const puppeteer = require('puppeteer-extra')
const chromePaths = require("chrome-paths");

module.exports = async function login(accountDetails, jar, ua) {
  let state;

  console.log('Signing in');

  try {
    let cookies = jar.getCookies(`https://amazon.com/`).map(_ => ({
      name: _.key,
      value: _.value,
      domain: _.domain
    }))

    const browser = await puppeteer.launch({
      headless: false,
      ignoreDefaultArgs: ["--enable-automation"],
      executablePath: chromePaths.chrome,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--window-size=500,650",
        "--use-mobile-user-agent",
        "--ignore-certificate-errors",
        `--user-agent=${ua}`
      ]
    });
  
    const page = await browser.newPage();
    
    await page.setCookie(...cookies);

    await page.setViewport({
      width: 500,
      height: 650
    })

    await page.goto(`https://www.amazon.com/ap/signin?showRememberMe=true&openid.pape.max_auth_age=0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=anywhere_us&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fref%3Dap_frn_logo%2F%3F_encoding%3DUTF8%26ref_%3Dnavm_hdr_signin&prevRID=0G780CP7WHQASQ1A16ET&openid.assoc_handle=anywhere_v2_us&openid.mode=checkid_setup&prepopulatedLoginId=eyJjaXBoZXIiOiIzbkM4aEd5M3hrSWpGMmdHUy9PNTJyaXhMNzMwK2l5RVU4VHkyYTNQUmhvPSIsInZlcnNpb24iOjEsIklWIjoiZUZ1WmdTNmUwMVZtRFgvM08vd3U0UT09In0%3D&failedSignInCount=0&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&timestamp=${Date.now()}&email=${accountDetails.email}`)

    await page.waitForSelector('#continue', {
      timeout: 60000
    })

    await page.mouse.click(244, 278, {
      button: "left",
    })

    await page.waitForSelector('#ap_password', {
      timeout: 60000
    })

    await page.type('#ap_password', accountDetails.password);

    await page.mouse.click(244, 300, {
      button: "left",
    })

    await page.waitForSelector('#twotabsearchtextbox', {
      timeout: 60000
    })

    const cookieObj = {};

    (await page.cookies()).forEach(cookie => {
      if (["session-id", "ubid-main", "x-main", "at-main", "sess-at-main"].includes(cookie.name)) {
        cookieObj[cookie.name] = cookie.value;
      }
    })

    fs.writeFile(`./src/modules/Amazon/cookies/${accountDetails.email}.json`, JSON.stringify(cookieObj), (err) => {
      if (err)
        console.log(err);
      else {
        // console.log("File written successfully");
      }
    });
  
    await browser.close();  
    
    state = true;
  } catch (e) {
    state = false;

    console.log(e)

    console.log('Error signing in');
  }

  return state;
}