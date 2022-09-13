var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const adyenEncrypt = require("node-adyen-encrypt")(25);
var tough = require("tough-cookie");
const Countries = require("./Countries/index");
var btoa = require("btoa");
const { turnt } = require("../modules/DSG/turnt/turnt");
const uuid = require("uuid-v4");
const { Howl, Howler } = require("howler");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const { firefox } = require("playwright");
const eventEmmiter = require("./events").eventEmmiter;
const fs = require("fs");
const axios = require("axios");
const got = require("got");
const nodeFetch = require("node-fetch");
const fetchCookie = require("fetch-cookie");
const fetch = fetchCookie(nodeFetch, new fetchCookie.toughCookie.CookieJar());
const rp = require("request-promise");
var url = require("url");
const { CookieJar } = require("tough-cookie");
var https = require("https");
const HttpsProxyAgent = require("https-proxy-agent");
const apiKey = "96284b7a1977a12e50ca4eb45f104fe1";
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";

//const DSGInitial = require('../modules/DSG/initial');

/** @deprecated */
const siteFunctionsObj = {
  Footsites: async (taskId, task) => {},
  EndClothing: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎇 Starting Entry",
      "#f19cac"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const browser = await firefox.launch({
      headless: true,
      //    proxy: siteFunctionsObj.getProxy(task),
    });
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**CopBoxAIO Runer for **" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    const context = await browser.newContext();
    const cookies = fs.readFileSync(`${dbPath}/cookie.json`, "utf8");

    const deserializedCookies = JSON.parse(cookies);
    await context.addCookies(deserializedCookies);

    const page = await context.newPage();
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎈 Logging in...",
      "#f19cac"
    );
    await page.goto("https://www.endclothing.com");
    await page.click('//*[@id="header"]/div[1]/div[1]/div');
    let r = Math.random().toString(36).substring(7);
    await siteFunctionsObj.sleep(1000);
    const emaild = task.profile.shipEmail;
    await page.type("#email", "katranji123@gmail.com");
    await siteFunctionsObj.sleep(400);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Creating Account..",
      "#eb647e"
    );
    await page.dblclick(
      ':is(button:has-text("Log in"), button:has-text("Continue"))'
    );
    await siteFunctionsObj.sleep(800);
    await page.type("#password", task.taskColor);
    await siteFunctionsObj.sleep(400);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Logging in...",
      "#ff97c0"
    );
    await page.dblclick(
      ':is(button:has-text("Log in"), button:has-text("Continue"))'
    );
    await page.waitForResponse(
      (response) =>
        response
          .url()
          .includes("https://www.endclothing.com/us/customer/ajax/login") &&
        response.status() === 200
    );
    await siteFunctionsObj.sleep(1111);
    await page.click("text=Footwear");
    await page.mouse.move(1111, 500);
    await page.mouse.down();
    await page.mouse.move(1111, 500);
    await page.mouse.move(444, 510);
    await page.mouse.move(500, 313);
    await page.mouse.move(500, 500);
    await page.mouse.up();
    await siteFunctionsObj.sleep(1111);
    await page.goto(
      "https://www.endclothing.com/us/catalogsearch/results?q=sock"
    );
    await page.click("text=2 Pack");
    await page.click(
      '//*[@id="__page_wrapper"]/div/div[1]/div[3]/div/div[2]/div/div[3]'
    );
    await page.click("text=Add to Wishlist");
    await siteFunctionsObj.sleep(600);
    page.click(
      '//*[@id="__page_wrapper"]/div/div[1]/div[3]/div/div[4]/div[2]/button'
    );
    await siteFunctionsObj.sleep(4444);
    var flag = 0;
    while (flag == 0) {
      if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
        /** Check If Task Not Running Then Exit Task Handle */
        return;
      }
      console.log("here1");
      try {
        await page.goto(task.taskMonitorInput);
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "Getting Product",
          "#50F9A4"
        );
        await siteFunctionsObj.sleep(1000);
        page.setDefaultTimeout(3040);
        let sizei = await page.$("text=Sold Out");
        try {
          while (sizei) {
            if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
              /** Check If Task Not Running Then Exit Task Handle */
              return;
            }
            sizei = await page.$("text=Sold Out");
            await siteFunctionsObj.sleep(700);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "Waiting for restock",
              "#50F9A4"
            );
            page.click("text=Sold Out");
            await page.reload();
          }
        } catch (err) {
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "Adding Proudct",
            "#50F9A4"
          );
        }
        try {
          var incart = 0;
          while (incart == 0) {
            try {
              await page.reload();
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "Waiting for restock!",
                "#50F9A4"
              );
              const x = task.taskSize;
              await siteFunctionsObj.sleep(1100);
              await page.mouse.move(1111, 500);
              await siteFunctionsObj.sleep(50);
              await page.mouse.move(932, 500);
              await siteFunctionsObj.sleep(50);
              await page.mouse.move(555, 500);
              await siteFunctionsObj.sleep(50);
              page.click("text=" + "UK " + task.taskSize);
              page.click("text=" + "UK " + task.taskSize);
              await siteFunctionsObj.sleep(700);
              await page.click("text=Add To Cart");
              page.click("text=Add To Cart");
              await siteFunctionsObj.sleep(2000);
              await page.click("text=Checkout Securely");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "Proccessing Order",
                "#50F9A4"
              );
              page.setDefaultTimeout(35040);
              await page.goto("https://www.endclothing.com/checkout");
              await siteFunctionsObj.sleep(11000);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "Intialize Last",
                "#50F9A4"
              );
              await page.click("text=Pay With");
              await page.keyboard.press("Tab");
              await page.keyboard.press("Tab");
              await siteFunctionsObj.sleep(300);
              await page.keyboard.type(task.profile.profileCVV);
              await siteFunctionsObj.sleep(300);
              await page.click("text=Place Order");
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL(task.taskMonitorInput)
                .addField(
                  "EndClothing Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "Checked Out!",
                "#50F9A4"
              );
              let incart = 1;
            } catch (e) {}
          }
          if (incart == 1) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "Proccessing Order",
              "#50F9A4"
            );
            page.setDefaultTimeout(35040);
            await page.goto("https://www.endclothing.com/checkout");
            await siteFunctionsObj.sleep(11000);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "Intialize Last",
              "#50F9A4"
            );
            await page.click('//*[@id="braintree-hosted-field-cvv"]');
            await siteFunctionsObj.sleep(300);
            await page.type(
              '//*[@id="braintree-hosted-field-cvv"]',
              task.profile.profileCvv
            );
            await siteFunctionsObj.sleep(300);
            //await page.click("text=Place Order");
            const hook = new Webhook(
              "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
            );
            const embed = new MessageBuilder()
              .setTitle(`**ElephantAIO Success! 🥳**`)
              .setAuthor(
                "ElephantAIO",
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setURL(task.taskMonitorInput)
              .addField(
                "EndClothing Success!",
                "A user cooked " + task.taskMonitorInput + " :fire:",
                true
              )
              .setColor("#bcffff")
              .setThumbnail(
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setDescription(":rocket: Very exited to announce a")
              .setImage(
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setFooter(
                "@ElephantAIO Success :fire:",
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setTimestamp();

            hook.send(embed);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "Checked Out!",
              "#50F9A4"
            );
          }
        } catch (e) {}

        flag = 1;
      } catch (err) {
        console.log("error");
        //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, err, "#50F9A4");
      }
    }
  },

  EndCookies: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎇 Starting task",
      "#f19cac"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const browser = await firefox.launch({
      headless: false,
      //    proxy: siteFunctionsObj.getProxy(task),
    });
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.endclothing.com/");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎈 Please browse around!",
      "#f19cac"
    );
    await siteFunctionsObj.sleep(25000);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎈 Add/Remove products to gen!",
      "#f19cac"
    );
    await siteFunctionsObj.sleep(35000);
    const cookies = await context.cookies();
    const cookieJson = JSON.stringify(cookies);
    fs.writeFileSync(`${dbPath}/end.json`, cookieJson);
    await browser.close();
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎈 Saved cookie!",
      "#f19cac"
    );
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  YeezySupply: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    console.log(task);
    console.log("task : ", task);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "📚 Starting Task",
      "#FAD2E1"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const browser = await firefox.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: true,
      proxy: siteFunctionsObj.getProxy(task),
    });
    const context = await browser.newContext();
    const cookies = fs.readFileSync("cookies.json", "utf8");

    const deserializedCookies = JSON.parse(cookies);
    await context.addCookies(deserializedCookies);

    const page = await context.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    page.setDefaultTimeout(222222222);
    await page.goto(
      "https://www.yeezysupply.com/product/" + task.taskMonitorInput
    );
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "⌛ Waiting in queue",
      "#DFE7FD"
    );
    await page.selectOption(".gl-dropdown-native__select-element", {
      label: task.taskSize,
    });
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🛒 Added to cart",
      "#FFEA00"
    );
    await siteFunctionsObj.sleep(500);
    await page.dblclick(".gl-cta__content");
    await page.waitForResponse(
      (response) =>
        response
          .url()
          .includes("https://www.yeezysupply.com/api/checkout/basket") &&
        response.status() === 200
    );
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😬 Sending Billing",
      "#F0EFEB"
    );
    await page.goto("https://www.yeezysupply.com/delivery");
    await page.type('[name="firstName"]', task.profile.shipFirstName);
    await page.type('[name="lastName"]', task.profile.shipLastName);
    await page.type(
      '[name="address1"]',
      task.profile.shipAddress + " " + task.profile.shipAddress2
    );
    await page.type('[name="city"]', task.profile.shipCity);
    await page.selectOption(".gl-dropdown-native__select-element", {
      label: "Michigan",
    });
    await page.type('[name="zipcode"]', task.profile.shipZipCode);
    await page.type('[name="phoneNumber"]', task.profile.shipPhone);
    await page.type('[name="emailAddress"]', task.profile.shipEmail);
    await page.dblclick(".gl-cta__content");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😬 Sending Billing",
      "#FAD2E1"
    );
    await page.waitForResponse(
      (response) =>
        response.url().includes("payment_methods") && response.status() === 200
    );
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😬 Sending Payment!",
      "#C0FDFF"
    );
    await page.type('[name="card-number"]', task.profile.profileCardNo);
    await page.type(
      '[name="name"]',
      task.profile.shipFirstName + " " + task.profile.shipLastName
    );
    await page.type(
      '[name="expiry"]',
      task.profile.profileExpMonth + task.profile.profileExpYear
    );
    await page.type("#security-number-field", task.profile.profileCVV);
    await page.dblclick(".gl-cta__content");
    await page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            "https://www.yeezysupply.com/api/checkout/payment-verification/"
          ) && response.status() === 200
    );
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😊 Yaaay! We checked out! ",
      "#FFB3C1"
    );
    const hook = new Webhook(
      "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
    );
    const embed = new MessageBuilder()
      .setTitle(`**ElephantAIO Success! 🥳**`)
      .setAuthor(
        "ElephantAIO",
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setURL(task.taskMonitorInput)
      .addField(
        "YeezySupply Success!",
        "A user cooked " + task.taskMonitorInput + " :fire:",
        true
      )
      .setColor("#bcffff")
      .setThumbnail(
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setDescription(":rocket: Very exited to announce a")
      .setImage(
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setFooter(
        "@ElephantAIO Success :fire:",
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setTimestamp();

    hook.send(embed);
    siteFunctionsObj.checkout(task);

    await siteFunctionsObj.sleep(99999);

    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  SNSCart: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    console.log(task);
    console.log("task : ", task);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#50F9A4"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const browser = await firefox.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: false,
      //proxy: siteFunctionsObj.getProxy(task),
    });
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    const context = await browser.newContext();
    const cookies = fs.readFileSync(`${dbPath}/sns.json`, "utf8");

    const deserializedCookies = JSON.parse(cookies);
    await context.addCookies(deserializedCookies);

    const page = await context.newPage();
    await page.goto("https://www.sneakersnstuff.com/");
    await siteFunctionsObj.sleep(9999999999999999999);
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  Casio: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    console.log(task);
    console.log("task : ", task);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Adding Soon",
      "#50F9A4"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const faker = require("faker");
    const delay = require("delay");
    const axios = require("axios");
    const tough = require("tough-cookie");
    const querystring = require("query-string");
    const fetch = require("node-fetch");

    const axiosCookieJarSupport = require("axios-cookiejar-support").default;

    axiosCookieJarSupport(axios);

    class Casio {
      constructor(taskId, setStatusFunction, task) {
        this.taskId = taskId;

        this.setStatusFunction = setStatusFunction;

        this.ua = faker.internet.userAgent();

        this.jar = new tough.CookieJar();

        this.profile = task.profile;

        this.input = task.taskMonitorInput;

        this.mode = safe;

        this.errorDelay = "1000";

        this.monitorDelay = "1000";

        this.webhook = webhook;

        let proxy;

        this.proxy = task.proxy;

        if (task.proxy !== "none") {
          proxy = {
            protocol: "http",
            host: task.proxy.ip,
            port: task.proxy.port,
            auth:
              task.proxy.user && task.proxy.pass
                ? {
                    username: task.proxy.user,
                    password: task.proxy.pass,
                  }
                : undefined,
          };
        }

        this.instance = axios.create({
          baseURL: `https://www.casio.com/`,
          headers: {
            Accept:
              "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "accept-language: en-US,en;q=0.9",
            "Accept-Encoding": "identity",
            "Content-Type": "application/x-www-form-urlencoded",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": 1,
            "User-Agent": this.ua,
          },
          jar: this.jar,
          withCredentials: true,
          proxy,
        });

        this.flow();
      }

      setStatus(message, color) {
        this.setStatusFunction(`taskStatus_${this.taskId}`, message, color);
      }

      async flow() {
        const s = Date.now();

        let getProductState = await this.getProduct();
        while (!getProductState) {
          getProductState = await this.getProduct();
        }

        let getCheckoutState = await this.getCheckout();
        while (!getCheckoutState) {
          getCheckoutState = await this.getCheckout();
        }

        if (this.mode == "cc") {
          let loginState = await this.login();
          while (!loginState) {
            loginState = await this.login();
          }
        } else {
          let getPaypalState = await this.getPaypal();
          while (!getPaypalState) {
            getPaypalState = await this.getPaypal();
          }

          const e = Date.now();

          this.checkoutTime = Number((e - s) / 1000).toFixed(2);

          console.log("Checked out in:", this.checkoutTime, "s");

          let successState = await this.cartSuccess();
          while (!successState) {
            successState = await this.cartSuccess();
          }
        }
      }

      async getProduct() {
        let state;

        console.log("Getting product");
        this.setStatus("Getting product ⌚", "#50F9A4");

        try {
          const resp = await this.instance({
            method: "GET",
            url: this.input,
            headers: {
              "User-Agent": this.ua,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          this.SKU = resp.data
            .split('class="t-size-x-large text-positioning">')[1]
            .split("<")[0];
          this.image = `https://images.casiocdn.com/fit-in/${
            resp.data
              .split('data-img-normal="https://images.casiocdn.com/fit-in/')[1]
              .split('" data-img-')[0]
          }`;
          this.price = resp.data
            .split('class="price t-size-large text-positioning">')[1]
            .split("</")[0]
            .replace(/\r?\n|\r/g, "")
            .trim()
            .replace(" ", "");
          this.checkoutUrl = `https://shop.casio.com${
            resp.data.split('<a href="https://shop.casio.com')[1].split('"')[0]
          }`;

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 404:
                this.setStatus("Product not loaded. Retrying 💔", "#eb4034");
                break;
              case 429:
                this.setStatus("Rate limited 💔", "#eb4034");
                break;
              default:
                console.log("Error:", e.response.status);
                this.setStatus(`Error: ${e.response.status} 💔`, "#eb4034");
            }
          } else {
            console.log(e);
            console.log("Error getting product");
            this.setStatus("Error getting product 💔", "#eb4034");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async getCheckout() {
        let state;

        console.log("Getting checkout 💵");
        //this.setStatus("Getting checkout 💵", "#b1eb34");

        try {
          const resp = await this.instance({
            method: "GET",
            url: this.checkoutUrl,
            headers: {
              "User-Agent": this.ua,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          this.csrf = resp.data
            .split('name="CSRFAuthKey" type="hidden" value="')[1]
            .split('"')[0];

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 404:
                this.setStatus("Product not loaded. Retrying 😢", "#eb4034");
                break;
              case 429:
                this.setStatus("Rate limited 😢", "#eb4034");
                break;
              default:
                console.log("Error:", e.response.status);
                this.setStatus(`Error: ${e.response.status} 😢`, "#eb4034");
            }
          } else {
            console.log(e);
            console.log("Error getting checkout 😢");
            this.setStatus(`Error getting checkout 😢`, "#eb4034");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async getPaypal() {
        let state;

        console.log("Getting paypal link 😈");
        this.setStatus("Getting paypal link 😈", "#34b1eb");

        try {
          const resp = await this.instance({
            method: "GET",
            url: "https://shop.casio.com/DRHM/store?Action=PrePaypalECRedirectionPageRule&SiteID=casiousa&Locale=en_US&ThemeID=4859878000&Env=BASE&isRapidCheckoutFromCart=true",
          });

          this.payPalUrl = resp.config.url;

          state = true;
        } catch (e) {
          console.log(e);
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 404:
                this.setStatus("Product not loaded. Retrying 💔", "#eb4034");
                break;
              case 429:
                this.setStatus("Rate limited 💔", "#eb4034");
                break;
              default:
                console.log("Error:", e.response.status);
                this.setStatus(`Error: ${e.response.status} 💔`, "#eb4034");
            }
          } else {
            console.log("Error getting paypal link");
            this.setStatus(`Error getting paypal link 💔`, "#eb4034");
          }

          await delay(this.errorDelay);
        }

        return state;
      }

      async login() {
        let state;

        console.log("Logging in");

        try {
          const resp = await this.instance({
            method: "POST",
            url: "https://shop.casio.com/store/",
            headers: {
              Origin: "https://shop.casio.com",
              Referer: this.checkoutUrl,
            },
            body: querystring.stringify({
              Action: "ShopperDetermineCheckoutTypePage",
              SiteID: "casiousa",
              Locale: "en_US",
              Form: "com.digitalriver.template.form.checkout.CheckoutTypeForm",
              CallingPageID: "QuickBuyCartPage",
              CSRFAuthKey: this.csrf,
              checkoutType: "ANONYMOUS",
              checkout_as_guest: "",
            }),
          });

          state = true;
        } catch (e) {
          console.log(e);
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 404:
                this.setStatus("Product not loaded. Retrying 💔", "#eb4034");
                break;
              case 429:
                this.setStatus("Rate limited 💔", "#eb4034");
                break;
              default:
                console.log("Error:", e.response.status);
                this.setStatus(`Error: ${e.response.status} 💔`, "#eb4034");
            }
          } else {
            console.log("Error logging in");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async cartSuccess() {
        let state;
        this.setStatus("Success! 😎", "#47f575");
        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "Successful Cart :shopping_cart:",
                  url: this.payPalUrl,
                  color: 16774400,
                  fields: [
                    {
                      name: "Site",
                      value: "Casio",
                      inline: true,
                    },
                    {
                      name: "Profile",
                      value: this.profile.name,
                      inline: true,
                    },
                    {
                      name: "Proxies",
                      value: this.proxy.name ? this.proxy.name : "None",
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: this.mode == "paypal" ? "PayPal" : "Card",
                      inline: true,
                    },
                    {
                      name: "Price",
                      value: this.price,
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}s`,
                      inline: true,
                    },
                  ],
                  author: {
                    name: "Click Below to Complete Purchase",
                  },
                  footer: {
                    text: "Polygon AIO",
                    icon_url:
                      "https://media.discordapp.net/attachments/776610739553173545/877653549541101608/guVqTKaG_400x400.jpg",
                  },
                  timestamp: new Date().toISOString(),
                  thumbnail: {
                    url: this.image,
                  },
                },
              ],
              username: "PolygonAIO",
              avatar_url:
                "https://cdn.discordapp.com/attachments/776610739553173545/877653549541101608/guVqTKaG_400x400.jpg",
            }),
          });

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                this.setStatus("Error sending webhook 💔", "#eb4034");
                break;
              case 404:
                this.setStatus("Webhook doesn't exist 💔", "#eb4034");
                break;
              case 429:
                this.setStatus("Rate limited 💔", "#eb4034");
                break;
              case 502:
                this.setStatus("Discord server error 💔", "#eb4034");
                break;
              default:
                console.log("Error:", e.response.status);
                this.setStatus(`Error: ${e.response.status} 💔`, "#eb4034");
            }
          } else {
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async cardSuccess() {
        let state;
        this.setStatus("Success! 😎", "#47f575");
        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "🐘 Successful Checkout!",
                  url: this.input,
                  color: 65423,
                  fields: [
                    {
                      name: "Site",
                      value: "Casio",
                      inline: true,
                    },
                    {
                      name: "Profile",
                      value: this.profile.name,
                      inline: true,
                    },
                    {
                      name: "Proxies",
                      value: this.proxy.name ? this.proxy.name : "None",
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: this.mode == "paypal" ? "PayPal" : "Card",
                      inline: true,
                    },
                    {
                      name: "Price",
                      value: this.price,
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}s`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url:
                      "https://media.discordapp.net/attachments/776610739553173545/877653549541101608/guVqTKaG_400x400.jpg",
                  },
                  timestamp: new Date().toISOString(),
                  thumbnail: {
                    url: this.image,
                  },
                },
              ],
              username: "PolygonAIO",
              avatar_url:
                "https://cdn.discordapp.com/attachments/776610739553173545/877653549541101608/guVqTKaG_400x400.jpg",
            }),
          });

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                this.setStatus("Error sending webhook 💔", "#eb4034");
                break;
              case 404:
                this.setStatus("Webhook doesn't exist 💔", "#eb4034");
                break;
              case 429:
                this.setStatus("Rate limited 💔", "#eb4034");
                break;
              case 502:
                this.setStatus("Discord server error 💔", "#eb4034");
                break;
              default:
                console.log("Error:", e.response.status);
                this.setStatus(`Error: ${e.response.status} 💔`, "#eb4034");
            }
          } else {
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }
    }

    module.exports = Casio;

    // new Casio('1', console.log, {
    //   input: "https://www.casio.com/products/watches/vintage/a100wepc-1b",
    //   errorDelay: 5000,
    //   monitorDelay: 5000,
    //   mode: 'paypal',
    //   catchall: 'galena.dev',
    //   webhook: "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
    //   proxy: {
    //     listName: "Webshare DCs",
    //     ip: '104.227.13.136',
    //     port: '8695',
    //     user: 'galena',
    //     pass: 'dd58f6z9jpj5'
    //   },
    //   proxy: 'none',
    //   profile: {
    //     name: "Test",
    //     email: 'sameel.m.arif@gmail.com',
    //     firstName: 'Sameel',
    //     lastName: 'Arif',
    //     shipping: {
    //       address1: '1 Osprey Drive',
    //       address2: '',
    //       city: 'Old Bridge',
    //       country: 'United States',
    //       countryCode: 'US',
    //       state: 'New Jersey',
    //       stateCode: 'NJ',
    //       zip: '08857',
    //       phone: '7327715727'
    //     },
    //     billing: {
    //       firstName: 'Sameel',
    //       lastName: 'Arif',
    //       address1: '1 Osprey Drive',
    //       address2: '',
    //       city: 'Old Bridge',
    //       country: 'United States',
    //       countryCode: 'US',
    //       state: 'New Jersey',
    //       stateCode: 'NJ',
    //       zip: '08857',
    //       phone: '7327715727',
    //       payment: {
    //         card: '379766324397180',
    //         expM: '01',
    //         expY: '27',
    //         cvv: '123'
    //       }
    //     },
    //     sameBillingShipping: false
    //   }
    // })

    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  Walmart: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    console.log(task);
    console.log("task : ", task);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#50F9A4"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const browser = await firefox.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: true,
      //proxy: siteFunctionsObj.getProxy(task),
    });
    const context = await browser.newContext();
    const cookies = fs.readFileSync(`${dbPath}/walmart.json`, "utf8");

    const deserializedCookies = JSON.parse(cookies);
    await context.addCookies(deserializedCookies);

    const page = await context.newPage();
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    page.setDefaultTimeout(22222);
    await page.goto("https://www.walmart.com/account");
    //await siteFunctionsObj.sleep(55555)
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😄 Checking Sign In",
      "#DCEDC2"
    );
    try {
      page.setDefaultTimeout(2222);
      await page.click("text=Profile & password");
    } catch (e) {
      await page.goto("https://walmart.com/login");
      const f = task.taskItemAmount;
      const g = task.profile.shipEmail;
      await page.evaluate(`
    document.getElementById('email').value= "${g}"
    document.getElementById('password').value= "${f}"
    `);
      await siteFunctionsObj.sleep(150);
      await page.dblclick(
        ':is(button:has-text("Log in"), button:has-text("Sign in"))'
      );
      await siteFunctionsObj.sleep(1000);
      let damn = await page.$(
        "text=Help us keep your account safe by clicking on the checkbox below."
      );
      try {
        page.setDefaultTimeout(2222);

        let pxcap = await page.$("#px-captcha");
        page.setDefaultTimeout(1111);
        while (pxcap) {
          await page.click("#px-captcha");
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Handle..",
            "#73E3FC"
          );
          page.setDefaultTimeout(6555);
          await page.mouse.move(670, 382);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Handle..",
            "#73E3FC"
          );
          await page.mouse.down();
          await siteFunctionsObj.sleep(777);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Handle..",
            "#73E3FC"
          );
          await page.mouse.up();
          await page.mouse.down();
          await page.mouse.move(600, 302);
          await siteFunctionsObj.sleep(777);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Handle..",
            "#73E3FC"
          );
          await page.mouse.move(600, 372);
          await siteFunctionsObj.sleep(777);
          await page.mouse.move(600, 320);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Handle..",
            "#73E3FC"
          );
          await siteFunctionsObj.sleep(777);
          await page.mouse.move(600, 302);
          await siteFunctionsObj.sleep(777);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Handle..",
            "#73E3FC"
          );
          await page.mouse.up();
          await page.mouse.move(633, 602);
          await page.mouse.down();
          await page.mouse.up();
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✍️ PX Verify..",
            "#73E3FC"
          );
          await siteFunctionsObj.sleep(6800);
          await page.goto("https://www.walmart.com/cart");
        } //PX
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "😄 Signing in..",
          "#DCEDC2"
        );
        page.setDefaultTimeout(22222);
        await page.click("text=Profile & password");
      } catch (e) {
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "🧨 NEED LOGIN COOKIE..",
          "#FF0000"
        );
      }
    }
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**CopBoxAIO Runer for **" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    var flag = 0;
    while (flag == 0) {
      try {
        let incart = 0;
        while (incart == 0) {
          let pxcap = await page.$("#px-captcha");
          page.setDefaultTimeout(1111);
          while (pxcap) {
            await page.click("#px-captcha");
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Handle..",
              "#73E3FC"
            );
            page.setDefaultTimeout(6555);
            await page.mouse.move(570, 280);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Handle..",
              "#73E3FC"
            );
            await page.mouse.down();
            await siteFunctionsObj.sleep(777);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Handle..",
              "#73E3FC"
            );
            await page.mouse.up();
            await page.mouse.down();
            await page.mouse.move(570, 280);
            await siteFunctionsObj.sleep(777);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Handle..",
              "#73E3FC"
            );
            await page.mouse.move(550, 280);
            await siteFunctionsObj.sleep(777);
            await page.mouse.move(550, 280);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Handle..",
              "#73E3FC"
            );
            await siteFunctionsObj.sleep(777);
            await page.mouse.move(550, 280);
            await siteFunctionsObj.sleep(777);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Handle..",
              "#73E3FC"
            );
            await page.mouse.up();
            await page.mouse.move(553, 280);
            await page.mouse.down();
            await page.mouse.up();
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ PX Verify..",
              "#73E3FC"
            );
            await siteFunctionsObj.sleep(3333);
            await page.goto("https://www.walmart.com/cart");
          } //PX

          let verifys = await page.$(".g-recaptcha");
          if (verifys) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ Sumbiting Cookie..",
              "#FFD3B5"
            );
            let var2;
            let sites = page.url();
            console.log("lets go");
            async function submitCaptcha() {
              try {
                const options = {
                  method: "POST",
                  url: "https://api.capmonster.cloud/createTask",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: {
                    clientKey: "46c36a27f4c7f5209f2f64fa726a7690",
                    task: {
                      type: "NoCaptchaTaskProxyless",
                      websiteURL: sites,
                      websiteKey: "6Lc8-RIaAAAAAPWSm2FVTyBg-Zkz2UjsWWfrkgYN",
                    },
                  },
                  json: true,
                };

                //request(options, function (error, response, body) {
                //    if (error) throw new Error(error);

                //    console.log(body);
                ///   });
                //
                const response = await rp(options);
                console.log("body");
                const responseJson = JSON.stringify(response);
                console.log(responseJson);
                const r2 = JSON.parse(responseJson);
                console.log(r2.taskId);
                return r2.taskId;

                //   throw new Error(responseJson.error_text);
              } catch (err) {
                throw err;
              }
            }

            async function getCaptchaResult(captchaId) {
              try {
                const options = {
                  method: "POST",
                  url: "https://api.capmonster.cloud/getTaskResult",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: {
                    clientKey: "46c36a27f4c7f5209f2f64fa726a7690",
                    taskId: `${captchaId}`,
                  },
                  json: true,
                };

                //request(options, function (error, response, body) {
                //if (error) throw new Error(error);

                //console.log(body);
                // });

                const response = await rp(options);
                const responseJson = JSON.stringify(response);
                console.log(responseJson);
                const r2 = JSON.parse(responseJson);
                console.log(r2.solution.gRecaptchaResponse);
                return r2.solution.gRecaptchaResponse;
                //throw new Error(responseJson.error_text);
              } catch (err) {
                console.log(err);
              }
            }

            async function main() {
              try {
                if (!apiKey) {
                  throw new Error("No api key");
                }
                const captcha = await submitCaptcha();
                const captchaId = captcha;
                console.log("token is " + captchaId);
                await siteFunctionsObj.sleep(30000);
                const result = await getCaptchaResult(captchaId);
                console.log(`${result}`);
                var2 = result;
              } catch (err) {
                throw err;
              }
            }
            main();
            main().then(() => {
              //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, var2, "#F8B195")
              page.evaluate(`
            document.getElementById("g-recaptcha-response").innerHTML="${var2}"
            `);
            });

            await siteFunctionsObj.sleep(35000);
            page.evaluate(`
            document.getElementById("g-recaptcha-response").innerHTML="${var2}"
            `);
            page.setDefaultTimeout(1500);
            try {
              let verifyid = await page.$("text=Verify your identity");
              while (verifyid) {
                await page.goto("https://www.walmart.com/");
                await page.evaluate(`
          document.getElementById("g-recaptcha-response").innerHTML="${var2}"
          `);
                await page.mouse.move(625, 55);
                await page.mouse.down();
                await page.mouse.up();
                await siteFunctionsObj.sleep(2222);
                await page.click("text=Verify your identity");
              }
            } catch (e) {}
            page.setDefaultTimeout(22222);
            //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "here", "#F8B195")
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "💡 Passed",
              "#F8B195"
            );
            await page.goto("https://www.walmart.com/cart");
          }
          page.setDefaultTimeout(111111);
          await page.goto(
            "https://affil.walmart.com/cart/buynow?items=" +
              task.taskMonitorInput
          );
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "🖖 Restock",
            "#FFAAA6"
          );
          await page.waitForResponse(
            (response) =>
              response
                .url()
                .includes("https://walmart-app.quantummetric.com") &&
              response.status() === 200
          );
          let test = "200";

          if (test == "200") {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ Proccessing",
              "#FFD3B5"
            );
            page.setDefaultTimeout(2222);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ Proccessing",
              "#FFD3B5"
            );
            var price = await page.innerText(".f4-l");
            var res = price.replace(",", "");
            var ressa = res.replace("$", "");
            var pr = ressa;
            var y = task.taskItemAmount;
            console.log(y);
            console.log(ressa);
            if (Number(pr) > Number(y)) {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "⛔ Price too high",
                "#d96459"
              );
              await page.dblclick("text=Remove");
              await page.click("er,m;ngres;,mn.grsjen,gj,.regkj.");
            }
            page.setDefaultTimeout(22222);

            await page.dblclick(
              ':is(button:has-text("Continue to checkout"), button:has-text("Continue"))'
            );
            //var price1 = await page.innerText('.price-characteristic')
            //var e = task.taskColor
            //if (Number(price1) > Number(e)) {
            let out = await page.$("text=Out of Stock");
            if (out) {
              let incart = 0;
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "⛔ Item OOS",
                "#FFAAA6"
              );
              page.setDefaultTimeout(22222);
              await page.goto("https://www.walmart.com/cart");
              page.setDefaultTimeout(2222);
              await page.click('.button-wrapper :text("Remove")');
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "⛔ Item Removed",
                "#FFAAA6"
              );
              await siteFunctionsObj.sleep(777);
              await page.click("wg;lkreg;lkjred;jlged;llj;egre");
            }

            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "✍️ Proccessing #2..",
              "#FFD3B5"
            );
            const a = task.profile.profileCVV;
            page.setDefaultTimeout(2222);
            try {
              const { Howl, Howler } = require("howler");

              var sound = new Howl({
                src: ["./tr.mp3"],
              });

              sound.play();
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL("https://walmart.com/" + task.taskMonitorInput)
                .addField(
                  "Walmart Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              let checkout = await page.$("text=Checkout");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🔥 Verifying Checkout",
                "#FF8C94"
              );
              siteFunctionsObj.checkout(task);
              while (checkout) {
                page.type("#ld_select_1", a);
                await siteFunctionsObj.sleep(555);
                page.dblclick("text=Place Order");
                await siteFunctionsObj.sleep(555);
                page.click(
                  ':is(button:has-text("Review Your Order"), button:has-text("Continue"))'
                );
                page.dblclick("text=Place Order");
                await siteFunctionsObj.sleep(555);
                page.click(
                  ':is(button:has-text("Place order"), button:has-text("Continue"))'
                );
                await siteFunctionsObj.sleep(555);
                page.type("#ld_select_1", a);
                await siteFunctionsObj.sleep(555);
                page.click(
                  ':is(button:has-text("Review Your Order"), button:has-text("Continue"))'
                );
                await page.click("text=Review");
              }
            } catch (e) {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "✔️ Checkout Verfied!",
                "#A8E6CE"
              );
            }
            await siteFunctionsObj.sleep(999999);
          } //found
        } //foubd
      } catch (err) {
        var flag = 0;
      }
    }
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  EndRaffle: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#E1F5C4"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: false,
      // proxy: siteFunctionsObj.getProxy(task),
    });
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**CopBoxAIO Runer for **" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    const context = await browser.newContext();
    const cookies = fs.readFileSync(`${dbPath}/end.json`, "utf8");

    const deserializedCookies = JSON.parse(cookies);
    await context.addCookies(deserializedCookies);

    const page = await context.newPage();
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎈 Logging in...",
      "#f19cac"
    );
    await page.goto("https://www.endclothing.com");
    await page.click('//*[@id="header"]/div[1]/div[1]/div');
    let r = Math.random().toString(36).substring(7);
    siteFunctionsObj.setStatus(`taskStatus_${taskId}`, r, "#f19cac");
    await siteFunctionsObj.sleep(1000);
    const emaild = r + task.profile.shipEmail;
    await page.type("#email", emaild);
    await siteFunctionsObj.sleep(400);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Creating Account..",
      "#eb647e"
    );
    await page.dblclick(
      ':is(button:has-text("Log in"), button:has-text("Continue"))'
    );
    await siteFunctionsObj.sleep(800);
    await page.type("#firstName", r + task.profile.shipFirstName);
    await page.type("#lastName", task.profile.shipFirstName + r);
    await page.type("#password", task.taskColor);
    await siteFunctionsObj.sleep(400);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Logging in retry...",
      "#ff97c0"
    );
    await page.dblclick(
      ':is(button:has-text("Log in"), button:has-text("Continue"))'
    );
    await page.waitForResponse(
      (response) =>
        response
          .url()
          .includes("https://www.endclothing.com/us/customer/ajax/login") &&
        response.status() === 200
    );
    await siteFunctionsObj.sleep(1111);
    await page.goto(task.taskMonitorInput);
    await page.click("text=Select a size");
    page.setDefaultTimeout(1040);
    let againd = await page.$("#email");
    if (againd) {
      await page.type("#email", emaild);
      await page.dblclick(
        ':is(button:has-text("Log in"), button:has-text("Continue"))'
      );
      await page.type("#password", task.taskColor);
      await page.dblclick(
        ':is(button:has-text("Log in"), button:has-text("Continue"))'
      );
      await siteFunctionsObj.sleep(1400);
    }
    //inject other
    page.setDefaultTimeout(30400);
    await siteFunctionsObj.sleep(777);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "💡 Creating Shipping!",
      "#ff97c0"
    );
    await page.dblclick("text=" + task.taskSize);
    await siteFunctionsObj.sleep(777);
    //await page.selectOption('/html/body/div[1]/div[1]/div[3]/div/div[3]/div[3]/div[2]/div[2]/ul', {label: "UK 10"})
    await page.click("text=Choose a shipping address");
    await page.click("text=Contact number");
    await siteFunctionsObj.sleep(444);
    await page.click("text=Contact number");
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(444);
    await page.keyboard.type(task.profile.shipPhone);
    await page.dblclick(
      ':is(button:has-text("Log in"), button:has-text("Continue"))'
    );
    await page.click("text=Address Line 1");
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(222);
    await page.keyboard.type(r + " " + task.profile.shipAddress);
    await page.click("text=Address Line 2");
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(222);
    await page.keyboard.type(task.profile.shipAddress2);
    await page.click("text=Town / City");
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(222);
    await page.keyboard.type(task.profile.shipCity);
    await page.click("text=Postcode");
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(222);
    await page.keyboard.type(task.profile.shipZipCode);
    await page.click("text=state*");
    await siteFunctionsObj.sleep(444);
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(444);
    await page.keyboard.type(task.profile.shipState);
    await siteFunctionsObj.sleep(222);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "💡 Creating Billing!",
      "#ff97c0"
    );
    await page.click("text=Done");
    await siteFunctionsObj.sleep(222);
    await page.click("text=Choose a payment method");
    await page.click("text=Credit / Debit Card");
    await page.click("text=Card Number");
    await page.keyboard.press("Tab");
    await siteFunctionsObj.sleep(777);
    await page.keyboard.type(task.profile.profileCardNo);
    await page.click("text=Expires");
    await page.keyboard.press("Tab");
    await page.keyboard.type(
      task.profile.profileExpMonth + "20" + task.profile.profileExpYear
    );
    await page.keyboard.press("Tab");
    await page.keyboard.type(task.profile.profileCVV);
    await page.dblclick(
      ':is(button:has-text("Log in"), button:has-text("Continue"))'
    );
    await siteFunctionsObj.sleep(1111);
    await page.dblclick("text=Done");
    await siteFunctionsObj.sleep(1444);
    await page.click(
      "text=I understand that if I win the draw, the item will be dispatched and will be automatically charged"
    );
    await siteFunctionsObj.sleep(444);
    await page.click("text=Enter Draw");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎉 Awaiting enter!",
      "#f19cac"
    );
    await siteFunctionsObj.sleep(2444);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🥳 Entered draw!",
      "#ff8cb9"
    );
    const hook = new Webhook(
      "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
    );
    const embed = new MessageBuilder()
      .setTitle(`**ElephantAIO Success! 🥳**`)
      .setAuthor(
        "ElephantAIO",
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setURL(task.taskMonitorInput)
      .addField(
        "End Raffle Enter!",
        "A user entered for the " +
          task.taskMonitorInput +
          " :fire: wish them luck! :fingers_crossed:",
        true
      )
      .setColor("#bcffff")
      .setThumbnail(
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setDescription(":rocket: Very exited to announce a")
      .setImage(
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setFooter(
        "@ElephantAIO Success :fire:",
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setTimestamp();

    hook.send(embed);
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  WalmartAcc: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Initializing",
      "#E1F5C4"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: true,
      //proxy: siteFunctionsObj.getProxy(task),
    });
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**CopBoxAIO Runer for **" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    const context = await browser.newContext();
    const page = await context.newPage();
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Creating Account",
      "#ebe9fa"
    );
    let r = Math.random().toString(36).substring(7) + task.profile.shipEmail;
    const fetch = require("node-fetch");
    this.r = r;
    this.r = this.r;
    let pas = task.taskColor;
    this.pas = pas;
    await page.goto("https://www.walmart.com/account/signup");
    await page.type("#first-name-su", task.profile.shipFirstName);
    await page.type("#last-name-su", task.profile.shipLastName);
    await page.type("#email-su", r);
    await page.type("#password-su", pas + "1Aa");
    await page.keyboard.press("Enter");
    await siteFunctionsObj.sleep(1888);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Setting Billing",
      "#e1dbf3"
    );
    await page.goto("https://www.walmart.com/account/deliveryaddresses");
    await page.type("#firstName", task.profile.shipFirstName);
    await page.type("#lastName", task.profile.shipLastName);
    await page.type("#addressLineOne", task.profile.shipAddress + "-----");
    await page.type("#addressLineTwo", task.profile.shipAddress2);
    await page.type("#city", task.profile.shipCity);
    await page.type("#phone", task.profile.shipPhone);
    await page.selectOption("#state", "MI");
    await page.type("#postalCode", task.profile.shipZipCode);
    await siteFunctionsObj.sleep(111);
    await page.dblclick(".spin-button-children");
    await siteFunctionsObj.sleep(777);
    await page.dblclick(".spin-button-children");
    await page.goto("https://www.walmart.com/account/creditcards");
    await page.click("text=Add a credit or debit card");
    await page.type("#firstName", task.profile.shipFirstName);
    await page.type("#lastName", task.profile.shipLastName);
    await page.type("#phone", task.profile.shipPhone);
    await page.type("#creditCard", task.profile.profileCardNo);
    await page.selectOption("#month-chooser", task.profile.profileExpMonth);
    await page.selectOption(
      "#year-chooser",
      "20" + task.profile.profileExpYear
    );
    await page.type("#cvv", task.profile.profileCVV);
    await page.dblclick("text=Save");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "💡 Account Created Start tasks",
      "#c9d9d2"
    );
    const cookies = await context.cookies();
    const cookieJson = JSON.stringify(cookies);
    fs.writeFileSync(`${dbPath}/walmart.json`, cookieJson);
    const hook = new Webhook(webhook);
    const embed = new MessageBuilder()
      .setTitle(`**ElephantAIO Makes Accounts?! 🥳**`)
      .setAuthor(
        "ElephantAIO",
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setURL("https://walmart.com/login")
      .addField(
        "Your new account information!",
        "Email: ||" + r + "|| Password: ||" + pas + "||",
        true
      )
      .setColor("#bcffff")
      .setThumbnail(
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setImage(
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setFooter(
        "@ElephantAIO Success :fire:",
        "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
      )
      .setTimestamp();

    hook.send(embed);
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  JD: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#E1F5C4"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: true,
      proxy: siteFunctionsObj.getProxy(task),
    });
    const page = await browser.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "✔️ Loading Page!",
      "#50F9A4"
    );
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**Elephant Runer for**" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    page.setDefaultTimeout(32111);
    await page.goto(
      "https://www.jdsports.com/store/product/jordan-break-slide-sandals/prod2787043?styleId=AR6374&colorId=016"
    );
    await page.dblclick("text=M 9.0 / W 10.5");
    await page.dblclick("text=M 9.0 / W 10.5");
    await page.dblclick("#buttonAddToCart");
    await page.waitForResponse(
      (response) =>
        response
          .url()
          .startsWith(
            "https://www.jdsports.com/store/browse/addToCartResponse.jsp"
          ) && response.status()
    );
    await siteFunctionsObj.sleep(2222);
    await page.dblclick("text=Proceed to ");
    await siteFunctionsObj.sleep(2222);
    await page.selectOption("#shippingState", {
      label: task.profile.shipState,
    });
    const a = task.profile.shipFirstName;
    const b = task.profile.shipLastName;
    const c = task.profile.shipAddress + task.profile.shipAddress2;
    const d = task.profile.shipZipCode;
    const e = task.profile.shipCity;
    const f = task.profile.shipPhone;
    const g = task.profile.shipEmail;
    const h = task.profile.profileCardNo;
    const i = task.profile.profileCVV;
    await page.evaluate(`
        document.getElementById('firstName').value = "${a}"
        document.getElementById('shippingLastName').value = "${b}"
        document.getElementById('shippingAddress1').value = "${c}" 
        document.getElementById('shippingZip').value = "${d}"
        document.getElementById('shippingCity').value = "${e}"
        document.getElementById('shippingPhone').value = "${f}" 
        document.getElementById('email').value = "${g}" 
    
        `);
    await siteFunctionsObj.sleep(111);
    await page.click('//*[@id="shippingContinueButton"]');
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Sending Cookie #2",
      "#73E3FC"
    );
    await siteFunctionsObj.sleep(555);
    page.setDefaultTimeout(3333);
    try {
      let verify = page.$("text=Verify Your Address");
      while (verify) {
        await page.click('//*[@id="addressSubmitButton"]');
        await siteFunctionsObj.sleep(1111);
        await page.click("text=Verify Your Address");
      }
    } catch (err) {
      page.setDefaultTimeout(32111);
    }
    page.setDefaultTimeout(32111);
    await siteFunctionsObj.sleep(555);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Sumbiting Cookie #3!",
      "#73E3FC"
    );
    await page.selectOption(
      "#billingExpirationMonth",
      task.profile.profileExpMonth
    );
    await siteFunctionsObj.sleep(111);
    await page.selectOption(
      "#billingExpirationYear",
      "20" + task.profile.profileExpYear
    );
    await siteFunctionsObj.sleep(111);
    await page.type("#billingCardNumber", task.profile.profileCardNo, {
      delay: 150,
    });
    await page.evaluate(`
      document.getElementById('billingSecurityCode').value = "${i}"
      `);
    await page.click('//*[@id="billingContinueButton"]');
    await siteFunctionsObj.sleep(4000);
    await page.goto("https://www.jdsports.com/store/cart/cart.jsp");
    await page.click("#removeAllModalButton");
    await siteFunctionsObj.sleep(700);
    await page.dblclick(
      ':is(button:has-text("Remove All Items"), button:has-text("Remove"))'
    );
    await siteFunctionsObj.sleep(3333);
    //await page.waitForResponse(response => response.url().includes('remove') && response.status());

    var flag = 0;
    while (flag == 0) {
      try {
        await page.goto(task.taskMonitorInput);
        await siteFunctionsObj.sleep(111);
        try {
          page.setDefaultTimeout(1500);
          let roon = await page.$(
            "text=#Shoessofresh you've gotta wait to get them"
          );
          while (room) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "📺 Queue..",
              "#73E3FC"
            );
            await page.click(
              "text=#Shoessofresh you've gotta wait to get them"
            );
            await siteFunctionsObj.sleep(1222);
          }
        } catch (err) {}
        await siteFunctionsObj.sleep(111);
        try {
          let closeit = page.$(".modal-close");
          while (closeit) {
            await page.click(".modal-close");
          }
        } catch (err) {}
        try {
          page.setDefaultTimeout(30500);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "😶 Setting Product",
            "#73E3FC"
          );
          let oos2 = await page.$(".no-results-container");
          while (oos2) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🤭 Waiting for restock..",
              "#73E3FC"
            );
            await siteFunctionsObj.sleep(3333);
            await page.click(".no-results-container");
            await page.reload();
          }
        } catch (e) {}
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "👞 Getting Size",
          "#73E3FC"
        );
        const o = task.taskSize;
        let incart = 0;
        try {
          let instock = await page.$(
            '//*[@id="mainSlide"]/div/div/div[1]/div/img'
          );
          while (incart == 0) {
            try {
              let roon = await page.$("#wr");
              while (room) {
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "📺 Queue..",
                  "#73E3FC"
                );
                await page.click("#wr");
                await siteFunctionsObj.sleep(1222);
              }
            } catch (err) {}
            try {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "⌚ Restock..",
                "#73E3FC"
              );
              page.click(".modal-close");
              await page.dblclick('button:has-text("' + task.taskSize + '")');
              await siteFunctionsObj.sleep(222);
              page.dblclick("#buttonAddToCart");
              page.setDefaultTimeout(3333);
              var finalResponse = await page.waitForResponse(
                (response) =>
                  response
                    .url()
                    .startsWith(
                      "https://www.jdsports.com/store/browse/addToCartResponse.jsp"
                    ) && response.status()
              );
              var code = finalResponse.status();
              var test = code.toString();
              page.setDefaultTimeout(30500);
            } catch (e) {
              page.setDefaultTimeout(30500);
              await page.reload();
              await siteFunctionsObj.sleep(2500);
            }
            if (test == "302") {
              let incart = 1;
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🔥 Proccessing..",
                "#73E3FC"
              );
              await page.goto(
                "https://www.jdsports.com/store/checkout/review.jsp?_requestid=239513"
              );
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "Placed Order! 🥳",
                "#73E3FC"
              );
              siteFunctionsObj.checkout(task);
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL(task.taskMonitorInput)
                .addField(
                  "JDSPorts Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              await page.dblclick("#submitOrder");
              await siteFunctionsObj.sleep(3000);
              await siteFunctionsObj.sleep(999999);
            }
          }
        } catch (err) {}
        await siteFunctionsObj.sleep(999999);
        flag = 1;
      } catch (err) {
        siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "Error", "#FF4E4E");
      }
    }
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  AmazonLogin: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#E1F5C4"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: false,
      //proxy: siteFunctionsObj.getProxy(task),
    });
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
    });
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "✔️ Awating login..!",
      "#E1F5C4"
    );
    const context = await browser.newContext();
    const page = await context.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });
    await page.goto(
      "https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26action%3Dsign-out%26path%3D%252Fgp%252Fyourstore%252Fhome%26ref_%3Dnav_AccountFlyout_signout%26signIn%3D1%26useRedirectOnSuccess%3D1"
    );
    await page.setDefaultTimeout(100000);
    await page.click("text=Hello,");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Saved Login 1!",
      "#E1F5C4"
    );
    const cookies = await context.cookies();
    const cookieJson = JSON.stringify(cookies);
    fs.writeFileSync(`${dbPath}/cookie.json`, cookieJson);

    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  NeweggLogin: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#E1F5C4"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: false,
      //proxy: siteFunctionsObj.getProxy(task),
    });
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
    });
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "✔️ Awating login..!",
      "#E1F5C4"
    );
    const context = await browser.newContext();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });
    const pagethree = await context.newPage();
    await pagethree.goto("https://www.newegg.com/");
    await pagethree.setDefaultTimeout(100000);
    await pagethree.click("text=Sign in / Register");
    await pagethree.click("text=Welcome");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Saved Login!",
      "#E1F5C4"
    );
    const cookies = await context.cookies();
    const cookieJson = JSON.stringify(cookies);
    fs.writeFileSync(`${dbPath}/newa.json`, cookieJson);
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  FNL: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#50F9A4"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: true,
      proxy: siteFunctionsObj.getProxy(task),
    });
    //    await  siteFunctionsObj.sleep(999999)
    const page = await browser.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Getting Cookie!",
      "#50F9A4"
    );
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**Elephant Runer for**" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    page.setDefaultTimeout(32111);
    await page.goto(
      "https://www.finishline.com/store/product/jordan-break-slide-sandals/prod2787043?styleId=AR6374&colorId=016"
    );
    await page.dblclick("text=M 9.0 / W 10.5");
    await page.dblclick("text=M 9.0 / W 10.5");
    await page.dblclick("#buttonAddToCart");
    await page.waitForResponse(
      (response) =>
        response
          .url()
          .startsWith(
            "https://www.finishline.com/store/browse/addToCartResponse.jsp"
          ) && response.status()
    );
    await siteFunctionsObj.sleep(2222);
    await page.dblclick("text=Proceed to ");
    await siteFunctionsObj.sleep(2222);
    await page.selectOption("#shippingState", {
      label: task.profile.shipState,
    });
    const a = task.profile.shipFirstName;
    const b = task.profile.shipLastName;
    const c = task.profile.shipAddress + task.profile.shipAddress2;
    const d = task.profile.shipZipCode;
    const e = task.profile.shipCity;
    const f = task.profile.shipPhone;
    const g = task.profile.shipEmail;
    const h = task.profile.profileCardNo;
    const i = task.profile.profileCVV;
    await page.evaluate(`
        document.getElementById('firstName').value = "${a}"
        document.getElementById('shippingLastName').value = "${b}"
        document.getElementById('shippingAddress1').value = "${c}" 
        document.getElementById('shippingZip').value = "${d}"
        document.getElementById('shippingCity').value = "${e}"
        document.getElementById('shippingPhone').value = "${f}" 
        document.getElementById('email').value = "${g}" 
    
        `);
    await siteFunctionsObj.sleep(111);
    await page.click('//*[@id="shippingContinueButton"]');
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Sending Cookie #2",
      "#73E3FC"
    );
    await siteFunctionsObj.sleep(555);
    page.setDefaultTimeout(3333);
    try {
      let verify = page.$("text=Verify Your Address");
      while (verify) {
        await page.click('//*[@id="addressSubmitButton"]');
        await siteFunctionsObj.sleep(1111);
        await page.click("text=Verify Your Address");
      }
    } catch (err) {
      page.setDefaultTimeout(32111);
    }
    page.setDefaultTimeout(32111);
    await siteFunctionsObj.sleep(555);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🍪 Sumbiting Cookie #3!",
      "#73E3FC"
    );
    await page.selectOption(
      "#billingExpirationMonth",
      task.profile.profileExpMonth
    );
    await siteFunctionsObj.sleep(111);
    await page.selectOption(
      "#billingExpirationYear",
      "20" + task.profile.profileExpYear
    );
    await siteFunctionsObj.sleep(111);
    await page.type("#billingCardNumber", task.profile.profileCardNo, {
      delay: 150,
    });
    await page.evaluate(`
      document.getElementById('billingSecurityCode').value = "${i}"
      `);
    await page.click('//*[@id="billingContinueButton"]');
    await siteFunctionsObj.sleep(4000);
    await page.goto("https://www.finishline.com/store/cart/cart.jsp");
    await page.click("#removeAllModalButton");
    await siteFunctionsObj.sleep(700);
    await page.dblclick(
      ':is(button:has-text("Remove All Items"), button:has-text("Remove"))'
    );
    await siteFunctionsObj.sleep(3333);
    //await page.waitForResponse(response => response.url().includes('remove') && response.status());

    var flag = 0;
    while (flag == 0) {
      try {
        await page.goto(task.taskMonitorInput);
        await siteFunctionsObj.sleep(111);
        try {
          page.setDefaultTimeout(1500);
          let roon = await page.$(
            "text=#Shoessofresh you've gotta wait to get them"
          );
          while (room) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "📺 Queue..",
              "#73E3FC"
            );
            await page.click(
              "text=#Shoessofresh you've gotta wait to get them"
            );
            await siteFunctionsObj.sleep(1222);
          }
        } catch (err) {}
        await siteFunctionsObj.sleep(111);
        try {
          let closeit = page.$(".modal-close");
          while (closeit) {
            await page.click(".modal-close");
          }
        } catch (err) {}
        try {
          page.setDefaultTimeout(30500);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "😶 Setting Product",
            "#73E3FC"
          );
          let oos2 = await page.$(".no-results-container");
          while (oos2) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🤭 Waiting for restock..",
              "#73E3FC"
            );
            await siteFunctionsObj.sleep(3333);
            await page.click(".no-results-container");
            await page.reload();
          }
        } catch (e) {}
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "👞 Getting Size",
          "#73E3FC"
        );
        const o = task.taskSize;
        let incart = 0;
        try {
          let instock = await page.$(
            '//*[@id="mainSlide"]/div/div/div[1]/div/img'
          );
          while (incart == 0) {
            try {
              let roon = await page.$("#wr");
              while (room) {
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "📺 Queue..",
                  "#73E3FC"
                );
                await page.click("#wr");
                await siteFunctionsObj.sleep(1222);
              }
            } catch (err) {}
            try {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "⌚ Restock..",
                "#73E3FC"
              );
              page.click(".modal-close");
              await page.dblclick('button:has-text("' + task.taskSize + '")');
              await siteFunctionsObj.sleep(222);
              page.dblclick("#buttonAddToCart");
              page.setDefaultTimeout(3333);
              var finalResponse = await page.waitForResponse(
                (response) =>
                  response
                    .url()
                    .startsWith(
                      "https://www.finishline.com/store/browse/addToCartResponse.jsp"
                    ) && response.status()
              );
              var code = finalResponse.status();
              var test = code.toString();
              page.setDefaultTimeout(30500);
            } catch (e) {
              page.setDefaultTimeout(30500);
              await page.reload();
              await siteFunctionsObj.sleep(2500);
            }
            if (test == "302") {
              let incart = 1;
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🔥 Proccessing..",
                "#73E3FC"
              );
              await page.goto(
                "https://www.finishline.com/store/checkout/review.jsp?_requestid=239513"
              );
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "Placed Order! 🥳",
                "#73E3FC"
              );
              siteFunctionsObj.checkout(task);
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL(task.taskMonitorInput)
                .addField(
                  "FNL Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              await page.dblclick("#submitOrder");
              await siteFunctionsObj.sleep(3000);
              await siteFunctionsObj.sleep(999999);
            }
          }
        } catch (err) {}
        await siteFunctionsObj.sleep(999999);
        flag = 1;
      } catch (err) {
        siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "Error", "#FF4E4E");
      }
    }
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  HolyPopStore: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😇 Starting Task",
      "#F9E784"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: false,
      proxy: siteFunctionsObj.getProxy(task),
    });
    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**CopBoxAIO Runer for**" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    const page = await browser.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    var flag = 0;
    while (flag == 0) {
      if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
        /** Check If Task Not Running Then Exit Task Handle */
        return;
      }
      console.log("here1");
      try {
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "🚧 Logging in!",
          "#F1E8B8"
        );
        await page.goto("https://www.holypopstore.com/en/account/");
        await siteFunctionsObj.sleep(1111);
        await page.mouse.move(500, 232);
        await page.mouse.down();
        await siteFunctionsObj.sleep(1111);
        await page.mouse.move(340, 100);
        await siteFunctionsObj.sleep(1111);
        await page.mouse.move(555, 1000);
        await siteFunctionsObj.sleep(1111);
        await page.mouse.move(100, 400);
        await siteFunctionsObj.sleep(1111);
        await page.mouse.move(632, 242);
        await page.mouse.up();
        await siteFunctionsObj.sleep(4444);
        const amail = task.profile.shipEmail;
        const apass = task.taskItemAmount;

        try {
          let login = await page.$("#login-btn");
          if (login) {
            await page.evaluate(`
      document.getElementById('accessEmail').value = "${amail}"
      document.getElementById('accessPassword').value = "${apass}"
      `);
            await page.dblclick("#login-btn");
            await page.waitForResponse(
              (response) =>
                response
                  .url()
                  .startsWith("https://www.holypopstore.com/en/account") &&
                response.status()
            );
          }
        } catch (e) {
          await page.waitForResponse(
            (response) =>
              response
                .url()
                .startsWith("https://www.holypopstore.com/en/account") &&
              response.status()
          );
        }

        let incart = 0;
        try {
          while (incart == 0) {
            try {
              page.setDefaultTimeout(7000);
              await page.goto(task.taskMonitorInput);
              await page.$("#item-action-btn");
              const a = task.taskSize;
              page.click(".close");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "⌚ Restock..",
                "#E58F65"
              );
              await siteFunctionsObj.sleep(222);
              await page.evaluate(`
      var sizes = document.getElementsByClassName('attribute-toggler');
      for (i = 0; i < sizes.length; i++) {
          var lowerCaseSize = (sizes[i].innerText).toLowerCase().replace(/\s/g, '');
          if (lowerCaseSize.includes("${a}")) {
              var oosValue = false;
              var sizeClassList = sizes[i].parentElement.parentElement.classList;
              sizeClassList.forEach(element => {
                  if (element == "swatch-disabled") {
                      oosValue = true;
                  }
              });
              if (oosValue != true) {
                  sizes[i].click();
                  console.log("addedtocart")
                  //return "addedtocart";
              } else {
                  console.log("oos")
                  //return (!oosValue);
              }
          }
      }
      `);
              await page.click("#item-action-btn");
              page.setDefaultTimeout(1111);
              var finalResponse = await page.waitForResponse(
                (response) =>
                  response
                    .url()
                    .startsWith("https://www.holypopstore.com/index.php") &&
                  response.status()
              );
              var code = finalResponse.status();
              var test = code.toString();
              page.setDefaultTimeout(30500);
            } catch (e) {
              page.setDefaultTimeout(30500);
              await page.reload();
              await siteFunctionsObj.sleep(2000);
            }
            if (test == 200) {
              let incart = 1;
              await page.goto("https://www.holypopstore.com/en/orders/review");
              let var2;
              console.log("lets go");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🙃 Checkout Secure..",
                "#D05353"
              );
              async function submitCaptcha() {
                try {
                  const options = {
                    method: "POST",
                    url: "https://api.capmonster.cloud/createTask",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: {
                      clientKey: "46c36a27f4c7f5209f2f64fa726a7690",
                      task: {
                        type: "NoCaptchaTaskProxyless",
                        websiteURL:
                          "https://www.holypopstore.com/en/orders/review",
                        websiteKey: "6Lc8GBUUAAAAAKMfe1S46jE08TvVKNSnMYnuj6HN",
                      },
                    },
                    json: true,
                  };

                  //request(options, function (error, response, body) {
                  //    if (error) throw new Error(error);

                  //    console.log(body);
                  ///   });
                  //
                  const response = await rp(options);
                  console.log("body");
                  const responseJson = JSON.stringify(response);
                  console.log(responseJson);
                  const r2 = JSON.parse(responseJson);
                  console.log(r2.taskId);
                  return r2.taskId;

                  //   throw new Error(responseJson.error_text);
                } catch (err) {
                  throw err;
                }
              }

              async function getCaptchaResult(captchaId) {
                try {
                  const options = {
                    method: "POST",
                    url: "https://api.capmonster.cloud/getTaskResult",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: {
                      clientKey: "46c36a27f4c7f5209f2f64fa726a7690",
                      taskId: `${captchaId}`,
                    },
                    json: true,
                  };

                  //request(options, function (error, response, body) {
                  //if (error) throw new Error(error);

                  //console.log(body);
                  // });

                  const response = await rp(options);
                  const responseJson = JSON.stringify(response);
                  console.log(responseJson);
                  const r2 = JSON.parse(responseJson);
                  console.log(r2.solution.gRecaptchaResponse);
                  return r2.solution.gRecaptchaResponse;
                  //throw new Error(responseJson.error_text);
                } catch (err) {
                  console.log(err);
                }
              }

              async function main() {
                try {
                  if (!apiKey) {
                    throw new Error("No api key");
                  }
                  const captcha = await submitCaptcha();
                  const captchaId = captcha;
                  console.log("token is " + captchaId);
                  await siteFunctionsObj.sleep(40000);
                  const result = await getCaptchaResult(captchaId);
                  console.log(`${result}`);
                  var2 = result;
                } catch (err) {
                  throw err;
                }
              }
              main();
              main().then(() => {
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  var2,
                  "#F8B195"
                );
                page.evaluate(`
          document.getElementById("g-recaptcha-response").innerHTML="${var2}";`);
              });
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "😍 Proccessing #1!",
                "#F97068"
              );
              await siteFunctionsObj.sleep(45000);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "😍 Proccessing #2!",
                "#F97068"
              );
              await page.click("text=Secure pay now");
              await page.dblclick("#ctl00_ContentPlaceHolder1_SwitPayment");
              await siteFunctionsObj.sleep(5000);
              const a =
                task.profile.shipFirstName + " " + task.profile.shipLastName;
              const c = task.profile.shipAddress + task.profile.shipAddress2;
              const d = task.profile.shipZipCode;
              const e = task.profile.shipCity;
              const f = task.profile.shipPhone;
              const g = task.profile.shipEmail;
              const h = task.profile.profileCardNo;
              const i = task.profile.profileCVV;
              const j = task.profile.profileExpMonth;
              const k = task.profile.profileExpYear;
              await page.evaluate(`
        document.getElementById('ctl00_ContentPlaceHolder1_textPAY1_CHNAME').value = "${a}"
        document.getElementById('ctl00_ContentPlaceHolder1_textPAY1_CARDNUMBER').value = "${h}"
        document.getElementById('ctl00_ContentPlaceHolder1_textPAY1_CVV').value = "${i}"
        document.getElementById('ctl00_ContentPlaceHolder1_textPAY1_CHEMAIL').value = "${g}"
        document.getElementById('ctl00_ContentPlaceHolder1_txtPAY1_EXPMONTH').value = "${j}"
        document.getElementById('ctl00_ContentPlaceHolder1_txtPAY1_EXPYEAR').value = "${k}"
        `);
              await page.dblclick("#ctl00_ContentPlaceHolder1_btnProcedi");
              await page.dblclick("#ctl00_ContentPlaceHolder1_btnProceedi");
              //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "🙃 didnt work..", "#F8B195")
              await siteFunctionsObj.sleep(7000);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "😜 Checked out!",
                "#E1F5C4"
              );
              siteFunctionsObj.checkout(task);
              const { Howl, Howler } = require("howler");
              var sound = new Howl({ src: ["./tr.mp3"] });
              sound.play();
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL(task.taskMonitorInput)
                .addField(
                  "HolyPopStore Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              await siteFunctionsObj.sleep(9999999);

              await siteFunctionsObj.sleep(20000);
            }
          }
        } catch (err) {
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "Error",
            "#FF4E4E"
          );
        }
      } catch (e) {}
    }
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  SNS: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🌇 Starting Task",
      "#F67280"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: false,
      //proxy: siteFunctionsObj.getProxy(task),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setDefaultTimeout(33333);
    await page.goto(task.taskMonitorInput);
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🌇 Parsing CloudFlare",
      "#f2a4a0"
    );
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    await siteFunctionsObj.sleep(1111);
    await page.mouse.move(500, 0);
    await page.mouse.down();
    await siteFunctionsObj.sleep(1111);
    await page.mouse.move(0, 100);
    await siteFunctionsObj.sleep(1111);
    await page.mouse.move(100, 100);
    await siteFunctionsObj.sleep(1111);
    await page.mouse.move(100, 0);
    await siteFunctionsObj.sleep(1111);
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await siteFunctionsObj.sleep(1111);
    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
    });
    let incart = 0;
    const z = task.taskSize;
    try {
      while (incart == 0) {
        try {
          //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "😥 Rate Limited", "#FF0000")
          await page.setDefaultTimeout(33333);
          //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "😥 Rate Limited", "#FF0000")
          await page.goto(task.taskMonitorInput);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "🙃 Going Cart..",
            "#F8B195"
          );

          await page.evaluate(`
          var sizes = document.getElementsByClassName("product-sizes__label")
                for (i = 0; i < sizes.length; i++) {
                    var lowerCaseSize = (sizes[i].innerText).toLowerCase().replace(/\s/g, '');
                    if (lowerCaseSize.includes("${z}")) {
                        var oosValue = false;
                        var sizeClassList = sizes[i].parentElement.parentElement.classList;
                        sizeClassList.forEach(element => {
                            if (element == "swatch-disabled") {
                                oosValue = true;
                            }
                        });
                        if (oosValue != true) {
                            sizes[i].click();
                            console.log("addedtocart")
                            //return "addedtocart";
                        } else {
                            console.log("oos")
                            //return (!oosValue);
                        }
                    }
                }
          `);
          await siteFunctionsObj.sleep(300);
          page.click("text=Add to cart");
          await siteFunctionsObj.sleep(500);
          await page.setDefaultTimeout(1111);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "🙃 Awaiting Cart...",
            "#F8B195"
          );
          const response = await page.waitForResponse(
            (response) =>
              response.url().includes("add") && response.status() === 200
          );
          const headers = response.headers();
          console.log(headers);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✨ Carted!",
            "#F8B195"
          );
          let test = "200";
          if (test == "200") {
            const cookies = await context.cookies();
            const cookieJson = JSON.stringify(cookies);
            console.log(cookieJson);
            let parsedJson = JSON.parse(cookieJson);
            const c = parsedJson.filter((_) => _.name == "png.state")[0];
            const d = c.value;
            const h3 = new Webhook(webhook);
            const es = new MessageBuilder()
              .setTitle(`**ElephantAIO Success! 🥳**`)
              .setAuthor(
                "ElephantAIO",
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setURL(task.taskMonitorInput)
              .addField("SNS Cart!", "**png.state: " + d + "**", true)
              .setColor("#bcffff")
              .setThumbnail(
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setImage(
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setFooter(
                "@ElephantAIO Success :fire:",
                "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
              )
              .setTimestamp();

            h3.send(es);
            fs.writeFileSync(`${dbPath}/sns.json`, cookieJson);
            let incart = 1;
            try {
              while (incart == 1) {
                try {
                  const random =
                    Math.floor(Math.random() * 221) +
                    1262 +
                    task.profile.shipEmail;
                  siteFunctionsObj.setStatus(
                    `taskStatus_${taskId}`,
                    "✨ Proccessing Order...",
                    "#6C5B7B"
                  );
                  await page.setDefaultTimeout(11111);
                  await siteFunctionsObj.sleep(1111);
                  await page.goto(
                    "https://www.sneakersnstuff.com/en/cart/view"
                  );
                  await page.selectOption("#shipping-country", {
                    label: "United States",
                  });
                  await page.click("#checkout-code");
                  await page.type("#checkoutcode", "SNEAKERS");
                  await page.click("text=Validate");
                  await siteFunctionsObj.sleep(1000);
                  await page.type("#email-address-input", random);
                  await page.click("#login-continue");
                  await siteFunctionsObj.sleep(1111);
                  const a = task.profile.shipFirstName;
                  const b = task.profile.shipLastName;
                  const c =
                    task.profile.shipAddress + task.profile.shipAddress2;
                  const d = task.profile.shipZipCode;
                  const e = task.profile.shipCity;
                  const f = task.profile.shipPhone;
                  await page.evaluate(`
            document.getElementById('first-name-input').value = "${a}"
            document.getElementById('last-name-input').value = "${b}"
            document.getElementById('address-line-2-input').value = "${c}" 
            document.getElementById('postal-code-input').value = "${d}"
            document.getElementById('city-input').value = "${e}"
            document.getElementById('phone-number-input').value = "${f}" 
          `);
                  await page.click("#region-US");
                  await siteFunctionsObj.sleep(60);
                  await page.selectOption("#region-US", {
                    label: task.profile.shipState,
                  });
                  await siteFunctionsObj.sleep(60);
                  await page.click('//*[@id="payment"]/li[2]');
                  await siteFunctionsObj.sleep(1000);
                  await page.evaluate(`
                  document.getElementsByClassName('method-option__label')[2].click()`);
                  await siteFunctionsObj.sleep(1400);
                  await page.keyboard.press("Tab");
                  await siteFunctionsObj.sleep(111);
                  await page.keyboard.type(task.profile.profileCardNo);
                  await siteFunctionsObj.sleep(440);
                  await page.keyboard.press("Tab");
                  await page.keyboard.type(task.profile.profileExpMonth);
                  await siteFunctionsObj.sleep(111);
                  await page.keyboard.type(task.profile.profileExpYear);
                  await siteFunctionsObj.sleep(111);
                  await page.keyboard.type(task.profile.profileCVV);
                  await siteFunctionsObj.sleep(888);
                  await page.evaluate(`
           document.getElementsByClassName('btn checkout-btn')[0].click()
          `);
                  siteFunctionsObj.checkout(task);
                  siteFunctionsObj.setStatus(
                    `taskStatus_${taskId}`,
                    "Placed Order! 🥳",
                    "#355C7D"
                  );
                  siteFunctionsObj.setStatus(
                    `taskStatus_${taskId}`,
                    "🥳 Placed Order!",
                    "#ffb4b4"
                  );
                  const { Howl, Howler } = require("howler");

                  var sound = new Howl({
                    src: ["./tr.mp3"],
                  });

                  sound.play();
                  siteFunctionsObj.checkout(task);
                  const hook = new Webhook(
                    "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
                  );
                  const embed = new MessageBuilder()
                    .setTitle(`**ElephantAIO Success! 🥳**`)
                    .setAuthor(
                      "ElephantAIO",
                      "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                    )
                    .setURL(task.taskMonitorInput)
                    .addField(
                      "SNS Success!",
                      "A user cooked " + task.taskMonitorInput + " :fire:",
                      true
                    )
                    .setColor("#bcffff")
                    .setThumbnail(
                      "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                    )
                    .setDescription(":rocket: Very exited to announce a")
                    .setImage(
                      "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                    )
                    .setFooter(
                      "@ElephantAIO Success :fire:",
                      "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                    )
                    .setTimestamp();

                  hook.send(embed);
                  await siteFunctionsObj.sleep(99999);
                  //checkout + sleep
                } catch (e) {
                  siteFunctionsObj.setStatus(
                    `taskStatus_${taskId}`,
                    "💡 Payment Retry",
                    "#A3FDFD"
                  );
                }
              }
            } catch (e) {}
          }
        } catch (e) {
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "💡 Retry",
            "#A3FDFD"
          );
        }
      }
    } catch (err) {}
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  Pacsun: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "👀 Starting Task",
      "#FFD7FC"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      headless: false,
      proxy: siteFunctionsObj.getProxy(task),
    });
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
    });
    const page = await browser.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });
    try {
      let dead = await page.$("text=502");
      while (dead) {
        await page.reload();
        await page.click("text=502 Bad Gateway");
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "🤺 Site dead retrying",
          "#f4e0cb"
        );
        await siteFunctionsObj.sleep(1111);
      }
    } catch (e) {}
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🌇 Fixing Shipping",
      "#f4e0cb"
    );
    page.setDefaultTimeout(22222);
    await page.goto("https://www.pacsun.com/");
    //const a = `cartAction=add&Quantity=${task.taskColor}&pid=${task.taskMonitorInput}`;
    //this.a = a;
    let incart = 0;
    try {
      while (incart == 0) {
        try {
          let dead = await page.$("text=502 Bad Gateway");
          while (dead) {
            await page.click("text=502 Bad Gateway");
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🤺 Site dead retrying",
              "#f4e0cb"
            );
            await siteFunctionsObj.sleep(1111);
            await page.reload();
          }
        } catch (e) {}
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "😜 Loding ATC",
          "#f4e0cb"
        );
        this.sku = task.taskMonitorInput;
        await siteFunctionsObj.sleep(2222);
        await page.evaluate((x) => {
          fetch(
            "https://www.pacsun.com/on/demandware.store/Sites-pacsun-Site/default/Cart-AddProduct",
            {
              credentials: "include",
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
                Accept: "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
              },
              referrer:
                "https://www.pacsun.com/colour-range/eco-oversized-washed-hoodie-3280153.html?tileCgid=unisex-all",
              body: `pid=3280211&quantity=1&tileCgid=unisex-all&options=%5B%5D`,
              method: "POST",
              mode: "cors",
            }
          );
        });
        var finalResponse = await page.waitForResponse(
          (response) =>
            response.url() ===
              "https://www.pacsun.com/on/demandware.store/Sites-pacsun-Site/default/Cart-AddProduct" &&
            response.status()
        );
        var code = finalResponse.status();
        var test = code.toString();
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "🙃 FORCE ATC.",
          "#3b5a9d"
        );
        await siteFunctionsObj.sleep(1111);
        await page.reload();
        if (test == "200") {
          page.setDefaultTimeout(44444);
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "✨ Paying",
            "#ffa633"
          );
          await siteFunctionsObj.sleep(1111);
          await page.dblclick(".checkoutbtn");
          await siteFunctionsObj.sleep(777);
          await page.type(
            "#dwfrm_billing_billingAddress_addressFields_email_emailAddress",
            task.profile.shipEmail
          );
          await page.type(
            "#dwfrm_billing_billingAddress_addressFields_phone",
            task.profile.shipPhone
          );
          await page.type(
            "#dwfrm_singleshipping_shippingAddress_addressFields_firstName",
            task.profile.shipFirstName
          );
          await page.type(
            "#dwfrm_singleshipping_shippingAddress_addressFields_lastName",
            task.profile.shipLastName
          );
          await page.type(
            "#dwfrm_singleshipping_shippingAddress_addressFields_address1",
            task.profile.shipAddress
          );
          await page.type(
            "#dwfrm_singleshipping_shippingAddress_addressFields_address2",
            task.profile.shipAddress2
          );
          await page.type(
            "#dwfrm_singleshipping_shippingAddress_addressFields_city",
            task.profile.shipCity
          );
          await page.selectOption(
            '//*[@id="dwfrm_singleshipping_shippingAddress_addressFields_states_state"]',
            {
              label: "MI",
            }
          );
          await page.type(
            "#dwfrm_singleshipping_shippingAddress_addressFields_postal",
            task.profile.shipZipCode
          );
          await page.type(
            "#dwfrm_billing_paymentMethods_creditCard_number",
            task.profile.profileCardNo
          );
          await page.type(
            "#dwfrm_billing_paymentMethods_creditCard_cvn",
            task.profile.profileCVV
          );
          await page.type(
            "#dwfrm_billing_paymentMethods_creditCard_owner",
            task.profile.shipFirstName + task.profile.shipLastName
          );
          await page.click("#expDate");
          await page.type(
            "#expDate",
            task.profile.profileExpMonth + task.profile.profileExpYear
          );
          //await page.click("#dwfrm_billing_save");
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "😍 Placed Order!",
            "#e8d3a3"
          );
          siteFunctionsObj.checkout(task);
          const { Howl, Howler } = require("howler");

          var sound = new Howl({
            src: ["./tr.mp3"],
          });

          sound.play();
          const hook = new Webhook(
            "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
          );
          const embed = new MessageBuilder()
            .setTitle(`**ElephantAIO Success! 🥳**`)
            .setAuthor(
              "ElephantAIO",
              "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
            )
            .setURL(task.taskMonitorInput)
            .addField(
              "Pacsun Success!",
              "A user cooked " + task.taskMonitorInput + " :fire:",
              true
            )
            .setColor("#bcffff")
            .setThumbnail(
              "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
            )
            .setDescription(":rocket: Very exited to announce a")
            .setImage(
              "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
            )
            .setFooter(
              "@ElephantAIO Success :fire:",
              "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
            )
            .setTimestamp();

          hook.send(embed);
          await siteFunctionsObj.sleep(99999);
          let incart = 1;
          await siteFunctionsObj.sleep(22222);
        }
      }
    } catch (e) {
      console.log(e);
    }
  },

  AmazonFree: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🎇 Starting Tasks",
      "#f19cac"
    );
    const request = require("request-promise");
    const fetch = require("node-fetch");
    const fs = require("fs");
    const tough = require("tough-cookie");
    const delay = require("delay");
    const faker = require("faker");

    const login = require("./login");

    class amazon {
      constructor(account, ASIN, OID, delays, webhook) {
        this.accountDetails = account;

        this.ASIN = ASIN;

        this.OID = OID;

        this.delays = delays;

        this.webhook = webhook;

        this.jar = request.jar();

        this.ua = faker.internet.userAgent();

        this.request = request.defaults({
          followAllRedirects: true,
          resolveWithFullResponse: true,
          jar: this.jar,
          withCredentials: true,
        });

        this.taskData = {
          product: {
            name: null,
            OID: OID,
            image: null,
            price: null,
          },
        };

        this.flow();
      }

      async flow() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        let checkout = 0;
        await this.prepare();
        try {
          while (checkout == 0) {
            this.s = Date.now();
            try {
              let cart = 0;
              this.cart = cart;
              try {
                //CLOUD MONITORING
                let monitors = 0;
                this.monitors = monitors;
                //ATC
                let carted = 0;
                this.carted = carted;
                while (this.carted == 0) {
                  while (this.monitors == 0) {
                    await this.cloud();
                    await sleep(100);
                    siteFunctionsObj.setStatus(
                      `taskStatus_${taskId}`,
                      "☁️ Cloud Monitoring",
                      "#A6F1EC"
                    );
                  }

                  siteFunctionsObj.setStatus(
                    `taskStatus_${taskId}`,
                    "😊 Adding to Cart!",
                    "#FFCBFC"
                  );
                  await this.initiateCheckout(); //atc

                  //SUBMIT WITH CALL BACK TO ATC
                  while (this.carted == 1) {
                    siteFunctionsObj.setStatus(
                      `taskStatus_${taskId}`,
                      "🥰 Sumbting Checkout!",
                      "#FF3333"
                    );
                    await this.coupon();
                    await this.getCheckout();
                    let co = 0;
                    this.co = co;
                    await this.submitCheckout();
                    siteFunctionsObj.setStatus(
                      `taskStatus_${taskId}`,
                      "🥳 Check Email! 🥳",
                      "#42FF00"
                    ); //should be a W or L
                    if (this.carted == 2) {
                      await this.prepare();
                    }
                  }
                }
              } catch (e) {}
            } catch (e) {}
          }
        } catch (e) {
          console.log("restarting");
        }

        //flow
      }

      async prepare() {
        if (fs.existsSync(`${this.accountDetails.email}.json`)) {
          const loginCookies = JSON.parse(
            fs.readFileSync(`${this.accountDetails.email}.json`, "utf8")
          );
          console.log(loginCookies);
          Object.entries(loginCookies).forEach((cookie) => {
            this.jar.setCookie(
              new tough.Cookie({
                key: cookie[0],
                value: cookie[1],
                domain: "amazon.com",
              }),
              `https://amazon.com`
            );
          });
        } else {
          console.log("Refreshing login");

          await login(this.accountDetails, this.jar, this.ua);
        }
        this.loginre = this.loginre + 1;
      }

      async monitor() {
        let state;

        console.log(`Monitoring ${this.ASIN}`);

        try {
          const resp = await this.request({
            method: "GET",
            url: "https://www.amazon.com/portal-migration/aod",
            qs: {
              asin: this.ASIN,
            },
            headers: {
              accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-encoding": "identity",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "max-age=0",
              "if-modified-since": "Mon, 26 Apr 2021 16:10:06 GMT",
              "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
              "sec-ch-ua-mobile": "?0",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "none",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1",
              "user-agent": this.ua,
            },
          });

          this.taskData.product = {
            name: html
              .split(
                '<h5 id="aod-asin-title-text" class="aod-asin-title-text-class">'
              )[1]
              .split("</h5>")[0]
              .replace(/(\r\n|\n|\r)/gm, ""),
            price: html.split('class="a-offscreen">')[1].split("<")[0],
            image: html
              .split('<img alt="" src="')[1]
              .split('" id="aod-asin-image-id"')[0],
          };

          state = true;
        } catch (e) {
          state = false;

          if (!(await this.handleError(e))) {
            console.log("Error monitoring");
          }

          await delay(this.errorDelay);
        }

        return state;
      }

      async cloud() {
        const resp = await this.request({
          method: "GET",
          url: `https://cloudapii.herokuapp.com/amazonapifree`,
        });

        const data = JSON.parse(resp.body);

        const availableSKUList = data.filter(
          (_) => 20 >= (Date.now() - _.timestamp) / 1000
        );
        if (Number(availableSKUList.length) > 0) {
          const thesku2 = JSON.stringify(availableSKUList);
          const mm = thesku2.split(`,`);
          const thesku = mm[0].replace(`[{"SKU":"`, "").replace(`"`, "");
          console.log(thesku);
          this.thesku = thesku;
          const code = mm[1].replace(`"Code":"`, "").replace(`"`, "");
          this.code = code;
          //console.log(availableSKUList)
          this.monitors = 1;
          this.retry = 20;
          console.log(this.monitors);
        }
        console.log(this.monitors);
      }

      async coupon() {
        const options = {
          method: "POST",
          url: "https://www.amazon.com/gp/buy/spc/handlers/add-giftcard-promotion.html/ref=ox_pay_page_gc_add",
          headers: {
            "Accept-Encoding": "identity",
            "User-Agent": this.ua,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "identity",
            "Accept-Language": "en-US,en;q=0.5",
            Referer: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.thesku}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            TE: "trailers",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            cookie:
              'aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-target-static-id=1587083778506-611983; aws-target-data=%7B%22support%22%3A%221%22%7D; s_fid=4524CEAC41A653AC-0E6B321CFD79A919; ubid-main=130-9939383-8398064; aws-target-visitor-id=1587083778511-133740.35_0; regStatus=registering; aws-ubid-main=666-2317524-8157251; x-amz-captcha-1=1619251514827903; x-amz-captcha-2=deZrp32+0uUXKYqro1WwRQ==; lc-main=en_US; s_vnum=2038195881086%26vn%3D3; s_nr=1630518673173-Repeat; s_dslv=1630518673174; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiZWY3NDhlIiwia2V5IjoiZzZCRzhxeGZGT1dzVWlpdnRaSHUxdCswL3QwRi9tbXlVZFg2TytqeXVJNUc3WCtuMnlqcVpvdXRXRlBsNGEvV2tGalI5ajRhK3MrYnZpSS9raVNSWFNGZTIyTURNbzg0bVhROFV1NCtpcjVzdWFxNmFZYXJCRTFJcTBPMnd2U3lnR1pRRktJVko4NkkwYjZxKzFtWkF4WEM3em0yN2h1N2hzOXJsTHFlUWZxYTRRa1QzWWNDaHdOU0ROMCthRGxTaHhMZjRKYVA0SitpVnQxNlZ2NVhidDd2UmVDODUvSWp5TnZ5VUVNd0szNHJ5Y3JGN2MzSHNWQXM1TGJWVU1vUGtuN3dKY0pUT1FCaDZQR0thRU4zcGRsQ0RMV0E0SGFlRWNITDJpajR4N2F4YnlYZ3J1bWdsM1VmWDdIUFh6OTJhT2VjdWlxZXNXUEpLOS9Vd2NKclZnPT0ifQ==; x-main="ax9wbupKpCzoEh3PY7kqJdcls@Frq1W4CkRygQMKadkd0pk0Jz4fd?iMDNbqLU8M"; at-main=Atza|IwEBIFQOCBofGOHvafMd07xNTihF4mX1eqe5WF9SuQKWIOXew19uR2znPhORV0PCrRKHgumck13MtrpXnGjme-7kqcEpEA_m_GNwfvwA4t-mAz0fBikeKQhMcJk_0tBkHeClYciaz_kA_f6Mg0bzMAomT9ZDJO562wAevt0Nt5AkALhop4fAOxJo-4306nigagSkBLHg9EsqST3wKkj6AtTAwWDd; sess-at-main="F9rDv3GS44jGELwwOhP2PP23d+I+UYHgF7vda2vtitc="; sst-main=Sst1|PQFJvDOg2wBsuzz29pBctJyVCUc1AzrspnSJzaFRd2TQh-mPyrXDrYz6uUdxVKPh3GFv9taYGSZ9XWzr2xxH6Lf_pn5Hx_AYn5RGBXvsIr3-qIemzxHqP3NBgqylsCLiV239V3s43B5veDU-sV1a8N-Qa9HZ2OwwxJkoC8VT84bdbqJUuHPwjUshrzWofa6UwitTMpENp6X7TVbt-oI6w3MWeJXQxdfWIIYVpp8t4A0hbgtvgsg23-TqzjBfTpBbJXzgGkv7yKh3drxSVZI3kfLdjq7ZwvM3g7GCfrtgZmxE4LM; session-id-time=2082787201l; i18n-prefs=USD; session-id-apay=260-0514690-1580011; session-id=139-8777044-2954127; session-token="iMxIHCJNdwTZTO0Y6ACZ9PbsU3D5ZFDW5q0IE6jcV1wfUk+S3m2b2V/JgdOi2vj/XFtOSxRxrv8Z7iC0VFU5du2Qdsjbzx1o2l61YqJHgHwEPDomGJmiTvkJyEjU2VPDu0dqblINUE1+ea0m1Qt1Ssd3ZhvhYaL8WL3jT8mZVGo7Sjcb3m8OafaTBW8s/i0wJu4SUmbW7dPwDb8tiWWlkQ=="; csm-hit=tb:6BQA27TS6ZDEWMHWE3TE+s-KD1BNRWHS3FAJ8TPSJP5|1631318490314&t:1631318490314&adb:adblk_no',
          },
          form: {
            claimcode: `${this.code}`,
            disablegc: "",
            returnjson: "1",
            returnFullHTML: "1",
            hasWorkingJavascript: "1",
            fromAnywhere: "0",
          },
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          //.console.log(body2);his.co = 1
        });
      }

      async initiateCheckout() {
        let state;

        console.log("Adding to cart");

        try {
          const cookies = this.jar.getCookieString("https://amazon.com");

          this.verificationSessionID = cookies
            .split("session-id=")[1]
            .split(";")[0];

          const resp = await this.request({
            method: "GET",
            url: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.thesku}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
            headers: {
              "User-Agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "identity",
              "Accept-Language": "en-US,en;q=0.5",
              Referer: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.thesku}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              "Sec-Fetch-User": "?1",
              TE: "trailers",
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
            },
          });

          this.cartId = Date.now();

          const html = resp.body;

          if (html.toLowerCase().includes("cart is empty")) {
            console.log("Product OOS");

            this.carted = 0;
            this.retry = this.retry - 1;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
            return state;
          }
          this.PID = html.match(
            new RegExp('currentPurchaseId":"(.*)","pipelineType')
          );

          this.csrfT = html.match(
            new RegExp(`anti-csrftoken-a2z' value='(.*)' /></head>`)
          );
        } catch (e) {
          this.carted = 0;

          if (!(await this.handleError(e))) {
            console.log("Error adding to cart");
            this.carted = 0;
            this.retry = this.retry - 1;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
          }

          await delay(this.errorDelay);
        }
        this.carted = 1;
        return state;
      }

      async getCheckout() {
        let state;

        console.log("Getting checkout");

        try {
          const resp = await this.request({
            method: "POST",
            url: "https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sc_proceed",
            qs: {
              isToBeGiftWrappedBefore: "0",
              proceedToRetailCheckout: "Proceed to checkout",
              proceedToCheckout: "1",
              cartInitiateId: this.cartInitiateId,
            },
            headers: {
              authority: "www.amazon.com",
              rtt: "50",
              downlink: "10",
              ect: "4g",
              "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
              "sec-ch-ua-mobile": "?1",
              "upgrade-insecure-requests": "1",
              dnt: "1",
              "user-agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "identity",
              "sec-fetch-site": "same-origin",
              "sec-fetch-mode": "navigate",
              "sec-fetch-user": "?1",
              "sec-fetch-dest": "document",
              referer: "https://www.amazon.com/gp/cart/view.html?ref_=nav_cart",
              "accept-language": "en-US,en;q=0.9,ar-SY;q=0.8,ar;q=0.7",
            },
          });

          this.body = resp.body;
          //console.log(this.body)
          this.carted = 1;
        } catch (e) {
          console.log("Error getting checkout");
          this.carted = 0;
        }

        return state;
      }

      async submitCheckout() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        let state;

        console.log("Submitting checkout");

        if (this.body.toLowerCase().includes("no longer available")) {
          console.log("Product OOS");
          this.retry = this.retry - 1;
          console.log(this.retry);
          if (0 > Number(this.retry)) {
            this.monitors = 0;
          }
          this.carted = 0;
          return false;
        }
        try {
          // const fasttrackExpiration = this.body.split('name="fasttrackExpiration" value="')[1].split('"')[0];
          //const countdownThreshold = this.body.split('name="countdownThreshold" value="')[1].split('"')[0];
          //const showSimplifiedCountdown = this.body.split('name="showSimplifiedCountdown" value="')[1].split('"')[0];
          // const shippingofferingid0 = this.body.split('name="shippingofferingid0.0" value="')[1].split('"')[0];
          // const dupOrderCheckArgs = this.body.split('name="dupOrderCheckArgs" value="')[1].split('"')[0];
          // const shippingofferingid01 = this.body.split('name="shippingofferingid0.1" value="')[1].split('"')[0];
          const previousshippingofferingid0 = this.body
            .split('name="previousshippingofferingid0" value="')[1]
            .split('"')[0];
          const lineitemids0 = this.body
            .split('name="lineitemids0" value="')[1]
            .split('"')[0];
          const shiptrialprefix = this.body
            .split('name="shiptrialprefix" value="')[1]
            .split('"')[0];
          const csrfToken = this.body
            .split('name="csrfToken" value="')[1]
            .split('"')[0];
          const purchaseTotal = this.body
            .split('name="purchaseTotal" value="')[1]
            .split('"')[0];
          if (Number(purchaseTotal) > Number("1")) {
            this.carted = 0;
            e;
          }
          const purchaseTotalCurrency = this.body
            .split('name="purchaseTotalCurrency" value="')[1]
            .split('"')[0];
          const purchaseID = this.body
            .split('name="purchaseID" value="')[1]
            .split('"')[0];
          const purchaseCustomerId = this.body
            .split('name="purchaseCustomerId" value="')[1]
            .split('"')[0];
          const scopeId = this.body
            .split('name="scopeId" value="')[1]
            .split('"')[0];
          //const promiseAsin = this.body.split('name="promiseAsin-0" value="')[1].split('"')[0];
          const selectedPaymentPaystationId = this.body
            .split('name="selectedPaymentPaystationId" value="')[1]
            .split('"')[0];

          const options = {
            method: "POST",
            url: "https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html/ref=ox_spc_place_order",
            qs: {
              partialCheckoutCart: "1",
              isToBeGiftWrappedBefore: "0",
              proceedToRetailCheckout: "Proceed to checkout",
              proceedToCheckout: "1",
              cartInitiateId: this.cartId,
            },
            headers: {
              "User-Agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/x-www-form-urlencoded",
              Origin: "https://www.amazon.com",
              Connection: "keep-alive",
              Referer:
                "https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1",
              "Upgrade-Insecure-Requests": "1",
              TE: "Trailers",
            },
            form: {
              claimcode: `${this.code}`,
              submitFromSPC: "1",
              countdownId: "countdownId-0",
              order0: "next-1dc",
              "guaranteetype0.0": "GUARANTEED",
              "issss0.0": "0",
              "shipsplitpriority0.0": "shipWhenever",
              "isShipWhenCompleteValid0.0": "0",
              "isShipWheneverValid0.0": "1",
              "guaranteetype0.1": "GUARANTEED",
              "issss0.1": "0",
              "shipsplitpriority0.1": "shipWhenever",
              "isShipWhenCompleteValid0.1": "0",
              "isShipWheneverValid0.1": "1",
              previousshippingofferingid0: previousshippingofferingid0,
              previousguaranteetype0: "GUARANTEED",
              previousissss0: "0",
              previousshippriority0: "shipWhenever",
              lineitemids0: lineitemids0,
              currentshippingspeed: "next-1dc",
              previousShippingSpeed0: "next-1dc",
              currentshipsplitpreference: "shipWhenever",
              "shippriority.0.shipWhenever": "shipWhenever",
              groupcount: "1",
              shiptrialprefix: shiptrialprefix,
              csrfToken: csrfToken,
              fromAnywhere: "0",
              redirectOnSuccess: "0",
              purchaseTotal: purchaseTotal,
              purchaseTotalCurrency: purchaseTotalCurrency,
              purchaseID: purchaseID,
              purchaseCustomerId: purchaseCustomerId,
              useCtb: "1",
              scopeId: scopeId,
              isQuantityInvariant: "",
              //'promiseTime-0': promiseTime,
              //'promiseAsin-0': promiseAsin,
              selectedPaymentPaystationId: selectedPaymentPaystationId,
              hasWorkingJavascript: "1",
              placeYourOrder1: "1",
              isfirsttimecustomer: "0",
              isTFXEligible: "",
              isFxEnabled: "",
              isFXTncShown: "",
            },
          };

          const resp = await this.request(options);

          this.checkoutTime = `${(Date.now() - this.s) / 1000}s`;

          if (199 < resp.statusCode < 210) {
            console.log("Order placed");
            this.carted = 2;
            this.cardSuccess();
          } else {
            console.log("Order failed");
            this.cardDecline();
          }

          state = true;
        } catch (e) {
          this.checkoutTime = `${(Date.now() - this.s) / 1000}s`;

          if (this.body.includes("Sign-In")) {
            console.log("Login expired");
            console.log(this.loginre);
            this.loginre = this.loginre - 1;
            if (Number(this.loginre) < 0) {
              await login(this.accountDetails, this.jar, this.ua);
              this.loginre = this.loginre + 2;
              await sleep(1500);
            }

            this.retry = this.retry - 3;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
            this.carted = 0;
          } else {
            console.log(e);
          }

          console.log("Error submitting checkout - OOS");

          this.cardDecline();

          this.carted = 0;
        }

        return state;
      }

      async cardSuccess() {
        let state;

        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "🐘 Successful Checkout!",
                  url: `https://www.amazon.com/dp/${this.skus}`,
                  color: 3066993,
                  fields: [
                    {
                      name: "Site",
                      value: "Amazon US",
                      inline: true,
                    },
                    {
                      name: "Proxy",
                      value: `||${this.proxy ? this.proxy : "None"}||`,
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: "Safe",
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
              username: "PolygonAIO",
              avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
            }),
          });

          const resp1 = await fetch(
            "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: null,
                embeds: [
                  {
                    title: "🐘 Successful Checkout!",
                    url: `https://www.amazon.com/dp/${this.thesku}`,
                    color: 3066993,
                    fields: [
                      {
                        name: "Site",
                        value: "Amazon US",
                        inline: true,
                      },
                      {
                        name: "Proxy",
                        value: `||${this.proxy ? this.proxy : "None"}||`,
                        inline: true,
                      },
                      {
                        name: "Mode",
                        value: "Safe",
                        inline: true,
                      },
                      {
                        name: "Time Elapsed",
                        value: `${this.checkoutTime}`,
                        inline: true,
                      },
                    ],
                    footer: {
                      text: "Polygon AIO",
                      icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
                username: "PolygonAIO",
                avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
              }),
            }
          );

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                console.log("Error sending webhook 💔");
                break;
              case 404:
                console.log("Webhook doesn't exist 💔");
                break;
              case 429:
                console.log("Rate limited 💔");
                break;
              case 502:
                console.log("Discord server error 💔");
                break;
              default:
                console.log("Error:", e.response.status);
            }
          } else {
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async cardDecline() {
        let state;

        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "Checkout Failure :x:",
                  url: `https://www.amazon.com/dp/${this.thesku}`,
                  color: 15158332,
                  fields: [
                    {
                      name: "Site",
                      value: "Amazon US",
                      inline: true,
                    },
                    {
                      name: "Proxy",
                      value: `||${this.proxy ? this.proxy : "None"}||`,
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: "Safe",
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
              username: "PolygonAIO",
              avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
            }),
          });

          const resp1 = await fetch(
            "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: null,
                embeds: [
                  {
                    title: "Checkout Failure :x:",
                    url: `https://www.amazon.com/dp/${this.ASIN}`,
                    color: 15158332,
                    fields: [
                      {
                        name: "Site",
                        value: "Amazon US",
                        inline: true,
                      },
                      {
                        name: "Mode",
                        value: "Safe",
                        inline: true,
                      },
                      {
                        name: "Time Elapsed",
                        value: `${this.checkoutTime}`,
                        inline: true,
                      },
                    ],
                    footer: {
                      text: "Polygon AIO",
                      icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
                username: "PolygonAIO",
                avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
              }),
            }
          );

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                console.log("Error sending webhook 💔");
                break;
              case 404:
                console.log("Webhook doesn't exist 💔");
                break;
              case 429:
                console.log("Rate limited 💔");
                break;
              case 502:
                console.log("Discord server error 💔");
                break;
              default:
                console.log("Error:", e.response.status);
            }
          } else {
            console.log(e);
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async handleError(e) {
        let state;

        if (typeof e.response !== "undefined") {
          state = true;

          switch (e.response.status) {
            case 400:
              console.log("Payload error");
              break;
            case 401:
              console.log("Blocked");
              break;
            case 404:
              console.log("Product not found");
              break;
            case 407:
              console.log("Proxy authentication missing");
              break;
            case 408:
              console.log("Slow proxy");
              break;
            case 429:
              console.log("Rate limited");
              break;
            case 500:
              console.log("Server error");
              break;
            default:
              console.log("Error:", e.response.statusCode);
              break;
          }
        } else {
          state = false;
        }

        return state;
      }
    }

    new amazon(
      {
        email: `${task.profile.shipEmail}`,
        password: `${task.taskColor}`,
      },
      "B096KKV67Y",
      "8Ka7gYc5Dbuq8iOrb2uIjGGDLUT3WLyfiXKWjTulyrZgOfzPgHsAzr1K7ZHFcm0gsmU%2Ba0Mvn8ESG1WT6tdpyYELlgkAEhDFpwcd98w8AFyfU8w8lrktDiqfzEq8t%2F9i4Z9JJXo8fgovM3nB1hI3sGUbalP270YvmAzpj6oFTQUoGVcF05QXJq6XBSt0hBjE",
      {
        error: 3333,
        monitor: 3333,
      },
      `${webhook}`
    );
  },

  DSG: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#FFD7FC"
    );
    document.getElementById(`taskStatus_${taskId}`);
    var Http = require("http");
    const { CookieJar } = require("tough-cookie");
    const request = require("request");
    const fetch = require("node-fetch");
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const got = require("got");
    const { URLSearchParams } = require("url");
    const http = require("https");
    const cheerio = require("cheerio");
    const htmlparser2 = require("htmlparser2");
    const HttpsProxyAgent = require("https-proxy-agent");
    const delay = require("delay");
    const encodedParams = new URLSearchParams();
    class ss {
      constructor() {
        console.log(task);
        this.CookieJar = new CookieJar();
        const proxy = siteFunctionsObj.getProxy(task);
        this.proxy = proxy;
        const proxysite = proxy.server.replace("http://", "");
        const proxyA = `http://${proxy.username}:${proxy.password}@${proxysite}`;
        this.proxyA = proxyA;
        console.log(proxyA);
        let size = task.taskMonitorInput;
        this.size = size;
        // good

        const fn = task.profile.shipFirstName;
        this.fn = fn;
        const ln = task.profile.shipLastName;
        this.ln = ln;
        const ja = task.profile.shipAddress; //+ //" " //s+ task.profile.shipAddress2;
        var ad = ja.replace("Lane", "Ln");
        ad = ad.replace("lane", "Ln");
        ad = ad.replace("road", "Rd");
        ad = ad.replace("Drive", "Dr");
        ad = ad.replace("drive", "Dr");
        ad = ad.replace("Road", "Rd");
        ad = ad.replace("Common", "Cmn");
        this.ad = ad;
        const zip = task.profile.shipZipCode;
        this.zip = zip;
        const cit = task.profile.shipCity;
        this.cit = cit;
        const ph = task.profile.shipPhone;
        this.ph = ph;
        const em = task.profile.shipEmail;
        this.em = em;
        const nn = task.profile.profileCardNo;
        this.nn = nn;
        const i = task.profile.profileCVV;
        this.i = i;
        const st = task.shipState;
        this.st = st;
        const eem = task.profile.profileExpMonth;
        this.eem = eem;
        const yye = task.profile.profileExpYear;
        this.yye = yye;
      }
      async request(url, options = {}) {
        options.cookieJar = this.cookieJar;
        if (!options.hasOwnProperty("timeout")) options.timeout = 7000;
        return got(url, options);
      }

      async atc() {
        //So what we need to do is loop this + most bots don't have find my product ID and just use SKUs, up to you if you wanna do that
        const proxyAgent = new HttpsProxyAgent(`${this.proxyA}`);
        await fetch(
          `https://www.dickssportinggoods.com/api/v1/carts/contents/${this.size}?qty=1`,
          {
            agent: proxyAgent,
            credentials: "same-origin",
            headers: {
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9,ar-SY;q=0.8,ar;q=0.7",
              "sec-ch-ua":
                '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
              "sec-ch-ua-mobile": "?0",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              //"Cookie": `_abck=0257D46E48FCB48C69E1CC31A4AAC95A~-1~YAAQv6g4F3vyirF6AQAAi4RFxAZpXpk64FAddWRBUS9fRA8A5vKK+swI6hVnPAMUUOvmKe9UqHnv0ZOAujvRX8OsAAtEAE1f2+u5RmvgJ/eGkAlId31N/oQUeprGXdrV7MOAuvijJyWWgkKbBfXRv2UFJyFjSdyarMrp5qB5/g6dChPhjdyZomadiFgl9rjvv+cRcFkFEV/haklVBi9+nnCkMEDcc/KzXlZrlhYTRPT6VmJ9m9jxQbhAXjgWUAPXWyBLgFtXOr1SmUo5E4NULcmnibYT5vNw2/PhAy2OAdlNwjEu5IhF7IAzCpaXtJSPVudtdLcsFPIbQRsbSOWKWFxcmdGJIplr7+3KAa0xeAuRTVta2jIq3ZoOX8P2x78alqLPiOAR4H/k7sabkzuTvwTTyhYvg75f3mAWjdoMzkEc4fI5gG8DbE+eeyZX1oxYSo3X8CtUf7/n4qBkOXTmf0rmMELDOSCXBBZLv175VwJO7LjUjhxH~-1~-1~1626724698; akaas_AS_EXP_DSG=2147483647~rv=36~id=7b6a260fe4c4c38aacdb3bd6f6c544ce; swimlane_as_exp_dsg=36; AMCV_989E1CFE5329630F0A490D45%40AdobeOrg=1585540135%7CMCIDTS%7C18828%7CMCMID%7C45053808345465664584415649941119482793%7CMCAID%7CNONE%7CMCOPTOUT-1626797429s%7CNONE%7CMCAAMLH-1627395029%7C7%7CMCAAMB-1627395029%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CMCSYNCSOP%7C411-18835%7CvVersion%7C4.4.0; utag_main=v_id:01763ed12ad0001db26e6ce9f70c0004e00e900d00bd0$_sn:38$_se:2$_ss:0$_st:1626792327058$ses_id:1626790226590%3Bexp-session$_pn:2%3Bexp-session; s_ecid=MCMID%7C45053808345465664584415649941119482793; s_pers=%20cvp_v91TEST%3D%255B%255B%2527DRT%2527%252C%25271610132380038%2527%255D%255D%7C1767898780038%3B%20s_tb%3D1%7C1626792029508%3B%20s_v92gvo%3DDRT%257Cdrt%257Cn%252Fa%257Cdickssportinggoods.com%252F%7C1626792029509%3B%20cvp_v91%3D%255B%255B%2527DRT%2527%252C%25271625631357099%2527%255D%252C%255B%2527DRT%2527%252C%25271625839810445%2527%255D%252C%255B%2527DRT%2527%252C%25271625876540697%2527%255D%252C%255B%2527DRT%2527%252C%25271625925166802%2527%255D%252C%255B%2527SEO%2527%252C%25271625925203916%2527%255D%252C%255B%2527DRT%2527%252C%25271626138309152%2527%255D%252C%255B%2527DRT%2527%252C%25271626718891398%2527%255D%252C%255B%2527DRT%2527%252C%25271626790229514%2527%255D%255D%7C1784556629514%3B%20lv%3D1626790229515%7C1721398229515%3B%20lv_c%3D1626790229515%7C1626833429515%3B%20lv_s%3D0%7C1626792029515%3B; RES_TRACKINGID=335744990125752; adcloud={%22_les_v%22:%22y%2Cdickssportinggoods.com%2C1626792029%22}; _scid=b088c21e-092e-411e-a337-6f4109866f48; kampyle_userid=a117-c82e-f747-081b-ef25-ba5d-6063-5f8f; kampyleUserSession=1626790230154; kampyleSessionPageCounter=1; kampyleUserSessionsCount=50; lastRskxRun=1626790229861; rskxRunCookie=0; rCookie=uj864ollz1weh795f1a4akiezl6ly; cd_user_id=1763ed130522ee-09a2a308a940d6-4c3f2779-1fa400-1763ed1305330e; _pin_unauth=dWlkPU1EUTJZemc1TmpJdE56STRPQzAwTUdKbExXSmhaRFF0WTJVM05tWmlaREE0TWpNMw; IR_PI=5073a820-3853-11eb-a5ca-025ecbc6e250%7C1626876629932; _sctr=1|1626667200000; _fbp=fb.1.1607371666356.1846170316; cto_bundle=l7MIQV9ESEVvSSUyQmFDcWJvdUtwOU5sVmxVV3FPT2NzQXZ5NVBxa3hZcWlVM3g2U1JKZHJZRHU2RTh3V09nZkNOeXV2NUtiWHB1Zm91RXdyQVIlMkJOOVVwSzZNc0F2NjdSRE5DemI0OUN0cG1sZVY5TnA2aU1sWlFQQldzUXVVWWxUQk1VanclMkJvamFCSzllNU9DU0FpTng2djM3eUtySUlxSkpudndiZm5JVE9NaTFnbUElM0Q; kampylePageLoadedTimestamp=1625895966727; mbox=PC#bc8304e8d3b74134950f8e6b417cff7e.34_0#1690035328|session#bdcfa1ff1f8a49859fb770b2fb0a7321#1626792087; DSG_UID=1fec065d-872a-47bf-ab38-28189605ddc0; tracker_device=0c02b7ab-c411-4251-8f18-a049764b4392; BVBRANDID=f2bfb967-0e0d-49d3-b2a5-7d35df6bad1f; tfc-l=%7B%22u%22%3A%7B%22v%22%3A%22n1qp4uqq3m2rf4e66vm8sok7mg%22%2C%22e%22%3A1688739289%7D%2C%22s%22%3A%7B%22v%22%3A%22session.params%3D%257C1670271353%22%2C%22e%22%3A1688739289%7D%2C%22k%22%3A%7B%22v%22%3A%22n1qp4uqq3m2rf4e66vm8sok7mg%22%2C%22e%22%3A1688739289%7D%2C%22a%22%3A%7B%22v%22%3A%22b781a73c-52fa-497f-b1a1-fd6df56f3072%22%2C%22e%22%3A1626805309%7D%7D; _mibhv=anon-1620971519311-3446867368_4453; aam_site=segID%3D10295117%3B10295170%3B10295300%3B10295335; aam_uuid=35284877155032994033690256961112221144; cartCount=1; DCSG_NGX_CART_COUNT=1; DSG_CartQTY=1; locationAllowed=Y; DCSG_NGX_CUST_STORE=48864_OKEMOS_438; setStoreCookie=48864_OKEMOS_438; myStoreAddress=48864; swColor=Black%2FWhite; DECLINED_DATE=1625876664942; _derived_epik=dj0yJnU9bVRFdE94a3pYUDVUNVdVNVJwakdrRjRxZ2tEcC1jUWwmbj10YlVUNUtndWdTMVozblhkaExKd3BRJm09NCZ0PUFBQUFBR0QyMlZZJnJtPTQmcnQ9QUFBQUFHRDIyVlk; mdLogger=false; _gcl_au=1.1.511500273.1624581001; hl_p=3457bb00-fc94-4f7f-9449-64d11ea62afc; styliticsWidgetData={%22cohortType%22:%22test%22%2C%22visitor_id%22:1700754126}; DCSG_NGX_CUST=%7B%22accountType%22%3A%22loyalty%22%2C%22isScoreCardGold%22%3Afalse%2C%22sessionId%22%3A%22b065b366-807b-432b-90f3-4a5aa4954089%22%2C%22userId%22%3A%22-1002%22%2C%22visitCount%22%3A1%2C%22expires%22%3A%222021-08-19T14%3A10%3A27.457Z%22%7D; RT="z=1&dm=dickssportinggoods.com&si=7ad16434-72f0-42ca-a3d6-7f495468a89d&ss=krawqagr&sl=1&tt=1tm&bcn=%2F%2Fb855d720.akstat.io%2F&ld=2m3&nu=8111089a59212f97e9fed01085c6e6e5&cl=fic&ul=fim&hd=flx"; CRTOABE=0; styliticsWidgetSession=69b37ce8-4f38-4589-b6b7-e6aa11018b3f; whereabouts=48813; dih=desktop; NNC=2; HEADER_REDESIGN=true; dsg_perf_analysis=NB-0; akaalb_Customer_Engagement_ALB=~op=AE_DSG_MONO_Home_East:Odyssey_DSG_Mono_homepage_AP|~rv=73~m=Odyssey_DSG_Mono_homepage_AP:0|~os=b834769be1dd4d72381443d311536027~id=65e8b30810396559a216b258f848a0f5; ak_bmsc=FC4C1B33B97145E738A6654924E42CE3~000000000000000000000000000000~YAAQv6g4F3WvirF6AQAAU+ZAxAzFL0jaNJ+bCaPNk91/XkEbmvD5GEnxNZDo0uIW2ZTJhphFJ7+JhVmTxejqyk0iuhqbm49yYvVzsGxH6QLFYST7xAtnzIPyPKWvzWRefDe1W+7EblvJA0/bnxd6l+OOngudxXuEkSW5/756FQpZZVZbbQygYrfBceO01eHluE2w8zXU2IIA2ZELu2AIjuHoH88PRIudnR4V8TJVlRDIzYVrZgwBKf1SC+yVIGk8wgirLI9ubi4JLvY4I85v87y8LdM5u6GG8JTLWCV7/8Ff/PM3VC7+NbF3et2i7yc/OIUMPZ5t4NYS3dnfJlJ9zfq/mZ9xJxDlRsfcpBgtfQ8EkENYIlg7zUh60gH+iSdXLvhn5eXxJXFf46HkljRpIGLuBbt8j3Y=; bm_sz=BA28C12610A979591910BD6E74091965~YAAQv6g4F3avirF6AQAAVOZAxAwlzuefhYF6gR23L4DuDhdq6hZAJ7fBoCvJKgMIdz7Vl9VJNpBHAQq69df30azvV3bjdssSGj4a0t8sj0rP5hPKz59FXYL6o124yjZ4tCSBRhJzxfUpSaK4KbgmrrTdkH96vBOOs+kE1CTqhLhtuuPGkeX2HgwPmw7X/h9DofcKDDy6UUIjsXEZNF+4AiK7bMNZtORl9Cy0uZIS1NKiV7sZbTWd2cyXEvZbUmkO7fuum4Kj5uvvyRCVcewIA/QVuPBA/XN93K76sw6A0oelOz4rh8A5qYk302pvWdsD4SeNl1JMjJ1bOGShN5yorlwvXU9XREXQ0cVCajYiIRAuUXUxziS6v0ImrLT9CB+T0018qwLBX3hbQHuD3pl8X+tOJeZA24HFpkpDW+4=~4473154~3683910; at_check=true; DSG_VH=111; bm_sv=CEF67BADFE76A8BED87244E9095445E2~E2GnATUQllRUuce2A6DMSTwaIT2i5o7FV77ofwCOLh4VunA8t7qWnsaoMW76woyUHGApDdwOG/hBgmrIQh5nsJJHhWSWOe2RMQslR+/aG59Gbzxt8vRi+0iu4VE+Twu3vWEVtUZTsrkBRNFvJtZDIxHdtwkAfGDDP3QQHKgJNXM=; mboxEdgeCluster=34; akaalb_DAPI_ALB=~op=DAPI_ALB:DAPI_AP|~rv=94~m=DAPI_AP:0|~os=b834769be1dd4d72381443d311536027~id=436ba306811302597cde399810f5e8e3; TAG_Direct=1626790229627; MedalliaAB2=DELETE; _uetsid=7ccefbe0e8b711eb9ad903e4eff04950; _uetvid=801d9250b47811eb8c0b7d2415151d94; AMCVS_989E1CFE5329630F0A490D45%40AdobeOrg=1; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3Ddsgusprd%253D%252526c.%252526a.%252526activitymap.%252526page%25253DDSG%2525253A%25252520Home%25252520Page%2525253A%25252520Home%252526link%25253D1%25252520Cart%252526region%25253Dresponsive-header%252526pageIDType%25253D1%252526.activitymap%252526.a%252526.c%252526pid%25253DDSG%2525253A%25252520Home%25252520Page%2525253A%25252520Home%252526pidt%25253D1%252526oid%25253Dhttps%2525253A%2525252F%2525252Fwww.dickssportinggoods.com%2525252FOrderItemDisplay%252526ot%25253DA%3B; IR_gbd=dickssportinggoods.com; IR_4835=1626790229932%7C327728%7C1626790229932%7C%7C; kampyleUserPercentile=71.44603644446293; akaalb_DSG_CART_ALB=~op=DSG_CART_ALB_UI:DSG_CART_Azure_UI|~rv=95~m=DSG_CART_Azure_UI:0|~os=b834769be1dd4d72381443d311536027~id=4b4e840b762a7939d50af7932489efeb`
            },
            referrer:
              "https://www.dickssportinggoods.com/p/birkenstock-womens-arizona-essentials-eva-sandals-16birwrznssntlsvpfot/16birwrznssntlsvpfot?recid=home_PageElement_home3_rr_2_19280_&rrec=true",
            referrerPolicy: "no-referrer-when-downgrade",
            body: null,
            method: "PUT",
            mode: "cors",
            credentials: "include",
          }
        )
          .then((response) => response)
          .then((data) => {
            console.log(data);
            let a = data.headers.get("set-cookie");
            //console.log(a)
            //Mourn if ur here bro pls dont steal i swear to God Im just tryna pay for medical school
            let b = a.split(`;`).slice(0);
            let c = b[0];
            var d = c.replace("DCSG-CART=", "");
            //console.log(d)
            this.d = d;
            //console.log(data.ok)
            let good = data.ok;
            //console.log(this.proxy)
            if (good) {
              this.cart = 1;
              //console.log(this.CookieJar)
            }
          });
      }
      async tokens() {
        var str = `[{"sku":"${this.size}"}]`;
        var enc = window.btoa(str);

        var res = enc;
        console.log(res);
        const proxyAgent = new HttpsProxyAgent(`${this.proxyA}`);
        await fetch("https://www.dickssportinggoods.com/api/v1/checkouts", {
          agent: proxyAgent,
          credentials: "same-origin",
          credentials: "include",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
            Accept: "application/json",
            Referer: "https://www.dickssportinggoods.com/DSGBillingAddressView",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache,no-store,must-revalidate,max-age=0",
            Pragma: "no-cache",
            Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            Cookie: `DCSG-CART=${res}`,
          },
          referrer: "https://www.dickssportinggoods.com/DSGBillingAddressView",
          method: "POST",
          mode: "cors",
        })
          .then((response) => response)
          .then((data) => {
            //console.log(data)
            let a = data.headers.get("set-cookie");
            // console.log(a)
            //console.log(a)
            //Mourn if ur here bro pls dont steal i swear to God Im just tryna pay for medical school
            let b = a.split(`;`).slice(0);
            // console.log(b)
            let c = b[0];
            //DSCSG - CHECKOUT

            var dc = c.replace("X-DCSG-CHECKOUT=", "");
            //console.log(dc)
            this.dc = dc;
            //  console.log(this.dc)
            //Checkout Access
            var e = b[4];
            var ee = e.replace(" Secure, DCSG-CHECKOUT-ACCESS=", "");
            //console.log(ee)
            this.ee = ee;
            //  console.log(this.ee)

            //Checkout session
            let j = b[8];
            var cs = j.replace(" Secure, CHECKOUTSESSION=", "");
            //console.log(cs)
            this.cs = cs;
            let d = res;
            this.d = d;
            console.log(this.d);
          });
      }

      async address() {
        const proxyAgent = new HttpsProxyAgent(`${this.proxyA}`);
        const state = Countries.getState(task.profile.shipState).state_code;
        const a = task.profile.shipPhone;
        const b = a;
        const c = b.split("");
        let numbd;
        if (b.length === 11) {
          numbd =
            "(" +
            c[1] +
            c[2] +
            c[3] +
            ") " +
            c[4] +
            c[5] +
            c[6] +
            "-" +
            c[7] +
            c[8] +
            c[9] +
            c[10];
        } else {
          numbd =
            "(" +
            c[0] +
            c[1] +
            c[2] +
            ") " +
            c[3] +
            c[4] +
            c[5] +
            "-" +
            c[6] +
            c[7] +
            c[8] +
            c[9];
        }

        console.log(numbd);
        const bda = `{"first_name":"${this.fn}","last_name":"${this.ln}","address":"${this.ad}","city":"${this.cit}","state":"${state}","zipcode":"${this.zip}-8854","country":"US","phone":"${numd}","email":"${this.em}"}`;
        this.bda = bda;
        console.log(bda);
        let urs = `https://www.dickssportinggoods.com/api/v1/checkouts/${this.dc}/addresses`;
        await fetch(urs, {
          agent: proxyAgent,
          credentials: "same-origin",
          credentials: "include",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Referer: "https://www.dickssportinggoods.com/DSGBillingAddressView",
            "Cache-Control": "no-cache,no-store,must-revalidate,max-age=0",
            Pragma: "no-cache",
            Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            Cookie: `DCSG-CART=${this.d}; CHECKOUTSESSION=${this.cs}; DCSG-CHECKOUT-ACCESS=${this.ee}; X-DCSG-CHECKOUT=${this.dc}`,
            // This MAY HAVE SOME AKAMAI stuff^^ but as of now removed and usinng the above "Cookie": `_abck=0257D46E48FCB48C69E1CC31A4AAC95A~-1~YAAQ16g4F8VQBKB6AQAAh+Nv6wbZ+q9vGoWr8sKL6U1jZ5pbRsYxlYO0M9w1XERiPyQYYzEugXD1OOObCyyf3jdR5bZDkLboY1eJlSw52k19NazVEGXgS/CF1VeCFtE20PiTQPwjk8qQawd3aP61otmwxH0Ch5f3vuRXJAsuq5LWkuzeF0lQNMhPR7QS2dFTH+HrT2evcSlnMOSfUw6Ep6FkTjsDMaReCcqxSBsySuQJwwBeLmP5Qvs1LLvFuPM87a0SmGcXXiDntnJo3i+SMjNruK/iMTYKEfy2b9MJncJAQD5u/C/jYDMN9ag9B7/91Qs2jvQaFSUcFJI3wlO+YSTjMUEKPV8DlFt7UYkvIBgX857hdD9ota8oU9YhveYYAksjZDFmcHRKQV94drqn0zN8qtMcnLoBLcFqz/K6c/QaNy3gVwUAhRT/jPFYVjlBbZ5jrjzKS5D5u55fwyYPhNzXpFQwNXGVXfZACxYpeNRgodP0ybXl~-1~-1~1627451207; akaas_AS_EXP_DSG=2147483647~rv=36~id=7b6a260fe4c4c38aacdb3bd6f6c544ce; swimlane_as_exp_dsg=36; AMCV_989E1CFE5329630F0A490D45%40AdobeOrg=1585540135%7CMCIDTS%7C18836%7CMCMID%7C45053808345465664584415649941119482793%7CMCAID%7CNONE%7CMCOPTOUT-1627450219s%7CNONE%7CMCAAMLH-1628047819%7C7%7CMCAAMB-1628047819%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CMCSYNCSOP%7C411-18842%7CvVersion%7C4.4.0; utag_main=v_id:01763ed12ad0001db26e6ce9f70c0004e00e900d00bd0$_sn:55$_se:7$_ss:0$_st:1627449402973$ses_id:1627446554831%3Bexp-session$_pn:7%3Bexp-session; s_ecid=MCMID%7C45053808345465664584415649941119482793; s_pers=%20cvp_v91TEST%3D%255B%255B%2527DRT%2527%252C%25271610132380038%2527%255D%255D%7C1767898780038%3B%20cvp_v91%3D%255B%255B%2527DRT%2527%252C%25271627159399099%2527%255D%252C%255B%2527DRT%2527%252C%25271627159427131%2527%255D%252C%255B%2527DRT%2527%252C%25271627159429832%2527%255D%252C%255B%2527DRT%2527%252C%25271627159457831%2527%255D%252C%255B%2527DRT%2527%252C%25271627159460655%2527%255D%252C%255B%2527DRT%2527%252C%25271627159488789%2527%255D%252C%255B%2527DRT%2527%252C%25271627159491328%2527%255D%252C%255B%2527DRT%2527%252C%25271627159520032%2527%255D%252C%255B%2527DRT%2527%252C%25271627159522172%2527%255D%252C%255B%2527DRT%2527%252C%25271627159550976%2527%255D%252C%255B%2527DRT%2527%252C%25271627159552979%2527%255D%252C%255B%2527DRT%2527%252C%25271627159582088%2527%255D%252C%255B%2527DRT%2527%252C%25271627159583681%2527%255D%252C%255B%2527DRT%2527%252C%25271627159612784%2527%255D%252C%255B%2527DRT%2527%252C%25271627159614448%2527%255D%252C%255B%2527DRT%2527%252C%25271627159644817%2527%255D%252C%255B%2527DRT%2527%252C%25271627159645145%2527%255D%252C%255B%2527DRT%2527%252C%25271627159686332%2527%255D%252C%255B%2527DRT%2527%252C%25271627274935373%2527%255D%252C%255B%2527DRT%2527%252C%25271627275993234%2527%255D%255D%7C1785042393234%3B%20lv_c%3D1627446557668%7C1627489757668%3B%20s_tb%3D1%7C1627449405612%3B%20lv%3D1627447607387%7C1722055607387%3B%20lv_s%3D0%7C1627449407387%3B; RES_TRACKINGID=335744990125752; adcloud={%22_les_v%22:%22y%2Cdickssportinggoods.com%2C1627449403%22}; _scid=b088c21e-092e-411e-a337-6f4109866f48; kampyle_userid=a117-c82e-f747-081b-ef25-ba5d-6063-5f8f; kampyleUserSession=1627404283866; kampyleSessionPageCounter=14; kampyleUserSessionsCount=55; lastRskxRun=1627447604064; rskxRunCookie=0; rCookie=uj864ollz1weh795f1a4akiezl6ly; cd_user_id=1763ed130522ee-09a2a308a940d6-4c3f2779-1fa400-1763ed1305330e; _pin_unauth=dWlkPU4yVXdNVE15TkRrdE1ERmlNQzAwT0Rka0xXRmlPV0V0TXpKbFl6Tm1ZMkZtTkRabQ; IR_PI=5073a820-3853-11eb-a5ca-025ecbc6e250%7C1627362393384; _sctr=1|1627272000000; _fbp=fb.1.1607371666356.1846170316; cto_bundle=uuIeil9ESEVvSSUyQmFDcWJvdUtwOU5sVmxVV3Y0MXhqeG4xN21XT3U1WGQlMkZmWWxvSU0zJTJGMFB4UUF5VzIlMkZTSnNKV1RDbVVqa0V4bkF2RFZzbVA3VExxJTJGV2wlMkZJQlZCYW1kNHg5VlJteWZBYjA3am1nMjclMkZLZ1l4Y3JTZUhLakpReVVmTm1STEljRGdRT1pGcmJjcHpTbU5VazVqanRiJTJGSE5lUzVId2pDbDd0dFZUMGFVJTNE; kampylePageLoadedTimestamp=1625895966727; mbox=PC#bc8304e8d3b74134950f8e6b417cff7e.34_0#1690692404|session#4e9e2a44381d448da0761b0f11db9940#1627448415; DSG_UID=1fec065d-872a-47bf-ab38-28189605ddc0; tracker_device=0c02b7ab-c411-4251-8f18-a049764b4392; BVBRANDID=f2bfb967-0e0d-49d3-b2a5-7d35df6bad1f; tfc-l=%7B%22u%22%3A%7B%22v%22%3A%22lqp55aic51h1s3ansi2bf03etn%22%2C%22e%22%3A1688739289%7D%2C%22s%22%3A%7B%22v%22%3A%22session.params%3D%257C1670271353%22%2C%22e%22%3A1688739289%7D%2C%22k%22%3A%7B%22v%22%3A%22lqp55aic51h1s3ansi2bf03etn%22%2C%22e%22%3A1688739289%7D%2C%22a%22%3A%7B%22v%22%3A%227a0ac4b7-25e5-43be-ad3a-7afdfc84b563%22%2C%22e%22%3A1627246077%7D%7D; _mibhv=anon-1620971519311-3446867368_4453; aam_site=segID%3D10295117%3B10295170%3B10295300%3B10295335; aam_uuid=35284877155032994033690256961112221144; cartCount=1; DCSG_NGX_CART_COUNT=1; DSG_CartQTY=1; locationAllowed=Y; DCSG_NGX_CUST_STORE=48864_OKEMOS_438; setStoreCookie=48864_OKEMOS_438; myStoreAddress=48864; swColor=Black%2FBlack; DECLINED_DATE=1625876664942; _derived_epik=dj0yJnU9UjItSmFhNGNLSzI5Mm9wVmhDb1FxSktIdS1COTFPSFgmbj1rWFBKX3h3TDNBOFFLVDN5eVV4TjZnJm09NCZ0PUFBQUFBR0VBNFRRJnJtPTQmcnQ9QUFBQUFHRUE0VFE; mdLogger=false; _gcl_au=1.1.511500273.1624581001; styliticsWidgetData={%22cohortType%22:%22test%22%2C%22visitor_id%22:1700754126}; DCSG_NGX_CUST=%7B%22accountType%22%3A%22loyalty%22%2C%22sessionId%22%3A%2216238d94-02b5-4571-be49-e1c977542eaf%22%7D; RT="z=1&dm=dickssportinggoods.com&si=7ad16434-72f0-42ca-a3d6-7f495468a89d&ss=kri6xa01&sl=rs&tt=kuak&bcn=%2F%2F173e255b.akstat.io%2F&ld=idv14&ul=ie21q&hd=ie251"; DCSG-CART=${this.d}; styliticsWidgetSession=d1a55800-87f8-4247-a7f4-c1793e8315eb; hl_p=5626c8cc-2a66-4d24-bc04-79381210ceff; whereabouts=48813; dih=desktop; NNC=2; HEADER_REDESIGN=true; dsg_perf_analysis=NB-0; akaalb_Customer_Engagement_ALB=~op=AE_DSG_MONO_Home_East:Odyssey_DSG_Mono_homepage_AP|~rv=14~m=Odyssey_DSG_Mono_homepage_AP:0|~os=b834769be1dd4d72381443d311536027~id=6b8eca6d82dd9f0812706da2f472f502; at_check=true; DSG_VH=111; AMCVS_989E1CFE5329630F0A490D45%40AdobeOrg=1; akaalb_DAPI_ALB=~op=DAPI_ALB:DAPI_AP|~rv=63~m=DAPI_AP:0|~os=b834769be1dd4d72381443d311536027~id=cef748eb1c07a674563974b5d57ec8cc; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3Ddsgusprd%253D%252526c.%252526a.%252526activitymap.%252526page%25253DDSG%2525253A%25252520Checkout%2525253A%25252520Step1%25252520-%25252520Billing%25252520%25252526%25252520Shipping%252526link%25253DCONTINUE%25252520TO%25252520PAYMENT%252526region%25253Dapp-container%252526pageIDType%25253D1%252526.activitymap%252526.a%252526.c%252526pid%25253DDSG%2525253A%25252520Checkout%2525253A%25252520Step1%25252520-%25252520Billing%25252520%25252526%25252520Shipping%252526pidt%25253D1%252526oid%25253DCONTINUE%25252520TO%25252520PAYMENT%252526oidt%25253D3%252526ot%25253DSUBMIT%3B; kampyleUserPercentile=20.253673868505885; akaalb_DSG_CART_ALB=~op=DSG_CART_ALB_API:DSG_CART_Azure_API|DSG_CART_ALB_UI:DSG_CART_Azure_UI|~rv=79~m=DSG_CART_Azure_API:0|DSG_CART_Azure_UI:0|~os=b834769be1dd4d72381443d311536027~id=e767b1b8c831c365eb2aa3d67b58e6ed; authPromoId-BTSLoyaltyEvent_22072021=10442051; IR_gbd=dickssportinggoods.com; IR_4835=1627447605672%7C0%7C1627447605672%7C%7C; CHECKOUTSESSION=${this.cs}; akaalb_CHK_ALB=~op=CHK_ALB:CHK_Azure|CHK_API_ALB:CHK_Azure_API|~rv=44~m=CHK_Azure_API:0|~os=b834769be1dd4d72381443d311536027~id=a36b72e669e9f1da171c4747caa37cd4; DSG_CLR_ADDRESS=Y; ak_bmsc=6BB767728CB5487379FBEB5B50BCACE6~000000000000000000000000000000~YAAQv6g4FwH7B+F6AQAAkKIp6wxhbd6lxJJv1dpKaF3ZLJC0f1b/a0a/08e4GjLhuSkYsMBycTYHRpM1y+thXzOUDx7fQQj9L02zfT7JYZDUBv1zCy0oJ7XWYaMDhMM9g+rzIC+YZ7lFUaBymi8ui8gVy9GbnBQnjmBkwmiIBP+/bARqIYDN3YV4/lnFnYUtXIo/e3iVtAs0t/uqmEwm9Dgf5aA+rllPkttpXhOEej9Q+PBk9DWT7mU/8L97RRe+q9bO0Jffvqd6Ws1cuuzMp+sizWyVQIcKMZqMgzWN8HnJ7t2ZQkwI2ZydIne3O5TidSgNM6CZ4mokODQzqTN24jmbo+03gMHftlIm3juV+1VBdC2n+8eSdgcG7CZaETWWjlFmMXuYKys8IJz8rYXboV2FoBHzuoE=; bm_sz=A22773678754289766F84228C7DA88BA~YAAQv6g4FwL7B+F6AQAAkKIp6wwdy726TJ7AjNNVf6tRtPGjBU1FuWIMAwpHOeGHGsbF5bwAqtB1Pt7+sfrpsoZ29YFLkYmdC94B+5DOlyS2QwF89tqUE3bfOVB/erkdl20D/TtemSiruOqLe6NWkYof7ZM7NvA1CkUFTKOBFK3vLsHqhODXvmtSa+l4kHfbtt5PfxkCMkPfvbVbSu5EQwPq8peeppMt/blE7JwIQyhm60Z/KlcTgb1BHGKzTyf1I/O8JnaM01e9rMOW76n4vpiQy5lg9TF2Srk9JRvtIgwupeH/Vv7WyLNHOyxGRCFyP5fSTawz52gNv8cgtIEjXqYPNXaupjSZK66/8gfSme6OIFIfNacDw5Pyw+GzXv9iatV2WNGaxFfDPmK+rvFlG000rcSesVlBbYIu71o=~3556151~3616824; bm_sv=C3178FFBE1E2169BEA73A0CDB32DF9D1~iAtD44vjcK5slQpXDFjswZRgdbIaCbtKGN/WplkGTG7hBpzxhxfHg/FKmxvlnyY4qqiMdBwYoPTR/JZOiMXnKRlm/Jrx7qRT9A3NRdlKxtWyYVi+lwHa7GvSpP1WQNJtwnxh0/j6Hhnubs+Vtre9MN4PfFWw6ZsBIkLUTKg1Uos=; X-DCSG-CHECKOUT=${this.dc}; DCSG-CHECKOUT-ACCESS=${this.ee}; authPromoId-BTSLoyaltyEvent2_22072021=10443070; authPromoId-header2=10443070; modal86c2ff2521b92021-05-14T15:46:06=; mboxEdgeCluster=34; TAG_Direct=1627447607386; _uetsid=dc4e4160ecb811eb9ec27718ef91ed2e; _uetvid=801d9250b47811eb8c0b7d2415151d94`
          },
          referrer: "https://www.dickssportinggoods.com/DSGBillingAddressView",
          body: this.bda,
          method: "PUT",
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            //Mourn if ur here bro pls dont steal i swear to God Im just tryna pay for medical school
            //let addstat = data.status
            //this.addstat = addstat
            //console.log(data)
          });

        await fetch(
          `https://www.dickssportinggoods.com/api/v1/checkouts/${this.dc}/addresses`,
          {
            agent: proxyAgent,
            credentials: "same-origin",
            credentials: "include",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
              Accept: "application/json",
              Referer:
                "https://www.dickssportinggoods.com/DSGBillingAddressView",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-cache,no-store,must-revalidate,max-age=0",
              Pragma: "no-cache",
              Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
              Cookie: `DCSG-CART=${this.d}; CHECKOUTSESSION=${this.cs}; DCSG-CHECKOUT-ACCESS=${this.ee}; X-DCSG-CHECKOUT=${this.dc}`,
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
            },
            referrer:
              "https://www.dickssportinggoods.com/DSGBillingAddressView",
            method: "POST",
            mode: "cors",
          }
        )
          .then((response) => response.json())
          //let addstatt = data.status
          //this.addstatt = addstatt
          .then((data) => {
            console.log(data);
            if (data.status > "390") {
              this.carted = 0;
              this.cart = 0;
            } else {
              this.carted = 1;
            }
          });
      }
      async RSAgen() {
        const proxyAgent = new HttpsProxyAgent(`${this.proxyA}`);
        await fetch(
          `https://www.dickssportinggoods.com/api/v1/checkouts/${this.dc}/payment/payment-processor/cybersource/public-key`,
          {
            agent: proxyAgent,
            credentials: "include",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
              Accept: "application/json",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-cache,no-store,must-revalidate,max-age=0",
              Pragma: "no-cache",
              Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "no-cors",
              Referer:
                "https://www.dickssportinggoods.com/DSGPaymentViewCmd?catalogId=12301&langId=-1&storeId=15108",
              "Sec-Fetch-Site": "same-origin",
              Cookie: `DCSG-CART=${this.d}; CHECKOUTSESSION=${this.cs}; DCSG-CHECKOUT-ACCESS=${this.ee}; X-DCSG-CHECKOUT=${this.dc}`,
            },
            method: "GET",
            mode: "cors",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            //   let rstat = data.status
            //  this.rstat = rstat
            //console.log(data)
            //console.log(data.key_id)
            let keyid = data.key_id;
            this.keyid = keyid;
            let RSAToken = data.der.public_key;
            this.RSAToken = RSAToken;

            //console.log(RSAToken)
            // console.log(data.jwk.kid)
            // console.log(data.jwk.n)
            let n = data.jwk.n;
            this.n = n;
            let kid = data.jwk.kid;
            this.kid = kid;
          });
      }

      async paymentone() {
        console.log("here");
        //this was pain in the ass to code stg
        const dc = this.dc;
        const crypto = require("crypto");
        const { CookieJar } = require("tough-cookie");
        const got = require("got").default;
        const delay = require("delay");
        const enc = require("./enc");
        class t {
          constructor(
            key_id,
            publicKey,
            ccnum,
            cardType,
            cardExpirationMonth,
            cardExpirationYear
          ) {
            this.cookieJar = new CookieJar();
            this.cc_info = {
              keyId: key_id,
              cardInfo: {
                cardNumber: enc(ccnum, publicKey),
                cardType: cardType,
                cardExpirationMonth: cardExpirationMonth,
                cardExpirationYear: cardExpirationYear,
              },
            };
          }
          async request(url, options = {}) {
            options.cookieJar = this.cookieJar;
            return got(url, options);
          }
          enc(cardNumber, publicKey) {
            let formatPublicKey;
            const dataBuffer = Buffer.from(cardNumber);
            if (!publicKey.includes("-BEGIN PUBLIC KEY-")) {
              formatPublicKey = `-----BEGIN PUBLIC KEY-----
                        ${publicKey}
                -----END PUBLIC KEY-----`;
            } else {
              formatPublicKey = publicKey;
            }
            const encryptedCardBuffer = crypto.publicEncrypt(
              {
                key: formatPublicKey,
                oaepHash: "sha256",
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              },
              (buffer = dataBuffer)
            );
            return encryptedCardBuffer.toString("base64");
          }
          async op() {
            const options = {
              method: "OPTIONS",
              credentials: "same-origin",
              headers: {
                Connection: "keep-alive",
                Accept: "*/*",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
                Origin: "https://www.dickssportinggoods.com",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Fetch-Dest": "empty",
                Referer: "https://www.dickssportinggoods.com/",
                "Accept-Language": "en-US,en;q=0.9",
                //cookie: '__cfruid=b04142b14ad48b33d01cd099a18642a78dc4318e-1627337475; '
              },
            };
            await this.request(
              "https://flex.cybersource.com/cybersource/flex/v1/tokens",
              options
            );
            //console.log("this is this")
          }
          async send() {
            //console.log('try')
            const options = {
              method: "POST",
              credentials: "same-origin",
              headers: {
                Connection: "keep-alive",
                "sec-ch-ua":
                  '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "sec-ch-ua-mobile": "?0",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Content-Type": "application/json; charset=UTF-8",
                Accept: "*/*",
                Origin: "https://www.dickssportinggoods.com",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                Referer: "https://www.dickssportinggoods.com/",
                "Accept-Language": "en-US,en;q=0.9",
                //cookie: '__cfruid=b04142b14ad48b33d01cd099a18642a78dc4318e-1627337475; '
              },
              body: JSON.stringify(this.cc_info),
            };
            const res = await this.request(
              "https://flex.cybersource.com/cybersource/flex/v1/tokens",
              options
            );
            //console.log(res.body)
            let a = res.body;
            let b = a.split(`,`).slice(0);
            //console.log(b)
            //token
            let c = b[1];
            var d = c.replace(`"token":"`, "");
            var token = d.replace(`"`, "");

            this.token = token;
            //console.log(this.token)
            //masked
            let e = b[2];
            var f = e.replace(`"maskedPan":"`, "");
            var masked = f.replace(`"`, "");
            this.masked = masked;
            //console.log(this.masked)

            //signature
            let g = b[9];
            var h = g.replace(`"signature":"`, "");
            var signatures = h.replace(`"`, "");
            this.signatures = signatures;
            //                console.log(this.signatures)

            //requestid
            let i = b[11];
            var j = i.replace(`"_embedded":{"icsReply":{"requestId":"`, "");
            var requestid = j.replace(`"`, "");
            this.requestid = requestid;
            //console.log(this.requestid)

            //timestampe
            let k = b[4];
            //console.log(k)
            var l = k.replace(`"timestamp":`, "");
            var timestamp = l.replace(`"`, "");
            this.timestamp = timestamp;
            //console.log(timestamp)
          }
          async ayden() {
            console.log("good");
            var tough = require("tough-cookie");
            const adyenEncrypt = require("node-adyen-encrypt")(25);
            const adyenKey =
              "10001|B4EFFCD06C8D17BEE3B02C9B87B7803C957EAA3A2DF6B03EC834A6A3C4A70657C7A0771EC408BC9F572538EB05308CEDB4CABD0872279A46B764F59EFADB215EF2654816F4BDA187AC17591208F5837955435DC4AEEED36296E1AA8A51B3873D034A67547EA3387B1520A3D08972EE57BE0ACCA5D532C86D00CEC631CCAD45EFB8068C7C3320F220AFC6557D16C5B4EF0D856EA31EC34419F1AE01829FAC9B3B4E283A0C4A775FA5723ED90BB5C772C94E2AFCAC8825FD0499BDAFF48A6165929CE32E76F9843894E49C19D469A050791183D73E33ADC844B9363031948AF85DEF97941979741670EFEA592B49A2CF073D04D212BDB2B18A541381BECEC11BEF";
            const options = {};
            const cseInstance = adyenEncrypt.createEncryption(
              adyenKey,
              options
            );

            /*
            var CARD_EXP = {
                number: "4238171468024380",       // 'xxxx xxxx xxxx xxxx'
                expiryMonth: "02", //'MM'
                cvc: "265",                 //'xxx'
                holderName: 'John Doe',   // 'John Doe'
                expiryYear: "2024",   // 'YYYY'
                generationtime: new Date().toISOString()
            };
            */
            //cseInstance.encrypt
            const between = (min, max, l) => {
              let s = "";
              for (var i = 0; i < l; i++) {
                s += `${Math.floor(Math.random() * (max - min) + min)}`;
              }
              return s;
            };
            const get_ip = () => {
              return `${between(0, 9, 3)}.${between(0, 9, 2)}.${between(
                0,
                9,
                3
              )}.${between(0, 9, 3)}`;
            };
            const rip = get_ip();
            this.rip = rip;
            const a = cc;
            const b = a;
            const c = b.split("");
            let numbd;
            if (b.length === 15) {
              numbd =
                c[0] +
                c[1] +
                c[2] +
                c[3] +
                " " +
                c[4] +
                c[5] +
                c[6] +
                c[7] +
                c[8] +
                c[9] +
                " " +
                c[10] +
                c[11] +
                c[12] +
                c[13] +
                c[14];
              //console.log(b)
            } else {
              numbd =
                c[0] +
                c[1] +
                c[2] +
                c[3] +
                " " +
                c[4] +
                c[5] +
                c[6] +
                c[7] +
                " " +
                c[8] +
                c[9] +
                c[10] +
                c[11] +
                " " +
                c[12] +
                c[13] +
                c[14] +
                c[15];
            }
            console.log(numbd);
            this.numbd = numbd;
            const main = (expiryMonth, expiryYear, cvv, account) => {
              const time = new Date().toISOString();
              //console.log(cvv)
              var body = {
                paygateReference: "",
                expireMonth: cseInstance.encrypt({
                  expiryMonth: expiryMonth,
                  generationtime: time,
                }),
                expireYear: cseInstance.encrypt({
                  expiryYear: expiryYear,
                  generationtime: time,
                }),
                cvv: cseInstance.encrypt({
                  cvc: cvv,
                  generationtime: time,
                }),
                account: cseInstance.encrypt({
                  number: `${this.numbd}`,
                  generationtime: `${time}`,
                  initializeCount: "1",
                  numberBind: "1",
                  activate: "9",
                  referrer:
                    "https://checkoutshopper-live-us.adyen.com/checkoutshopper/securedfields/live_YJLFKT47JJG2RI7QIYX6HTKKDEDOEGOH/3.5.3/securedFields.html?type=card&d=aHR0cHM6Ly93d3cuZGlja3NzcG9ydGluZ2dvb2RzLmNvbQ==",
                  numberFieldFocusCount: "9",
                  numberFieldLog:
                    "fo@30,cl@31,KU@39,bl@41,fo@49,bl@57,fo@73,cl@82,KU@87,KL@88,ch@120,bl@120,fo@221,cl@222,cl@230,Kb@233,KN@234,fo@3414,bl@3414,fo@3526,cl@3527,bl@3539,fo@4054,cl@4055,cl@4057,cl@4058,KU@4059,KL@4060,cl@4064,cl@4066,cl@4067,KU@4068,KL@4068,fo@4249,cl@4250,cl@4251,cl@4253,KU@4253,KL@4254,cl@4257,cl@4258,cl@4260,bl@4266,fo@4379,cl@4381,cl@4382,cl@4384,KU@4385,KL@4386,cl@4389,cl@4391,cl@4392,KU@4394,KL@4395",
                  numberFieldClickCount: "23",
                  numberFieldKeyCount: "15",
                  numberUnkKeysFieldLog:
                    "91@39,91@87,91@4059,91@4068,91@4253,91@4385,91@4394",
                  numberFieldBlurCount: "6",
                  deactivate: "6",
                  sjclStrength: "10",
                  numberFieldChangeCount: "1",
                  numberFieldEvHa: "total=0",
                }),
                threeDSPayload: "",
                device: {
                  browser: {
                    acceptHeader: "*/*",
                    colorDepth: between(10, 25, 1),
                    language: "en-US",
                    javaEnabled: false,
                    screenHeight: between(1000, 1920, 1),
                    screenWidth: between(1000, 1920, 1),
                    userAgent:
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
                    timeZoneOffset: between(100, 999, 1),
                  },
                  ipAddress: `${this.rip}`,
                },
              };
              const colord = body.device.browser.colorDepth;
              this.colord = colord;
              const screen = body.device.browser.screenWidth;
              this.screen = screen;
              const screenh = body.device.browser.screenHeight;
              this.screenh = screenh;
              const timez = body.device.browser.timeZoneOffset;
              this.timez = timez;
              const amn = body.expireMonth;
              this.amn = amn;
              const by = body.expireYear;
              this.by = by;
              const cdv = body.cvv;
              this.cdv = cdv;
              const dac = body.account;
              this.dac = dac;
              return body;
            };
            const doia = main("02", "2024", "265", "4238 1714 6802 4380");
            //console.log(doia)
            let cookieJar = new fetchCookie.toughCookie.CookieJar();

            const fetch = fetchCookie(nodeFetch, cookieJar);
            const pt = `{"paygateReference":"","expireMonth":"${this.amn}","expireYear":"${this.by}","cvv":"${this.cdv}","account":"${this.dac}","type":"visa","threeDSPayload":"","device":{"browser":{"acceptHeader":"*/*","colorDepth":${this.colord},"language":"en-US","javaEnabled":false,"screenHeight":${this.screenh},"screenWidth":${this.screen},"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0","timeZoneOffset":240},"ipAddress":"${this.rip}"}}`;
            await fetch(
              `https://www.dickssportinggoods.com/api/v1/checkouts/${dc}/payment/payment-processor`,
              {
                credentials: "include",
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
                  Referer:
                    "https://www.dickssportinggoods.com/DSGPaymentViewCmd?catalogId=12301&langId=-1&storeId=15108",
                  Accept: "application/json",
                  "Accept-Language": "en-US,en;q=0.5",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Cache-Control":
                    "no-cache,no-store,must-revalidate,max-age=0",
                  Pragma: "no-cache",
                  Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
                  "X-INSTANA-T": "675f393f655aa4f0",
                  "X-INSTANA-S": "675f393f655aa4f0",
                  "X-INSTANA-L":
                    "1,correlationType=web;correlationId=675f393f655aa4f0",
                  "elastic-apm-traceparent":
                    "00-1ce459987642658112241d9d561b31d7-b64d3f5d44b705e3-01",
                  "Sec-Fetch-Dest": "empty",
                  "Sec-Fetch-Mode": "cors",
                  "Sec-Fetch-Site": "same-origin",
                  Cookie: `CHECKOUTSESSION=${cs}; DCSG-CHECKOUT-ACCESS=${ee}; X-DCSG-CHECKOUT=${dc}; DCSG-CART=${d}`,
                },
                body: pt,
                method: "PUT",
                mode: "cors",
              }
            )
              .then((response) => response.json())
              .then((data) => {
                let sts = data.status;
                this.sts = sts;
                console.log(sts);
                //let cstat = data.status
                //this.cstat = cstat
                console.log("oka");

                //console.log(data.checkout_key)
                let finalcs = data.checkout_key;
                this.finalcs = finalcs;
              });
            /*try{
              
            var Cookie = tough.Cookie;
            cookieJar.setCookie(new Cookie({
              key: "CHECKOUTSESSION",
              value: cs,
              domain: "dickssportinggoods.com"
            }, "https://www.dickssportinggoods.com"))
            cookieJar.setCookie(new Cookie({
              key: "DCSG-CHECKOUT-ACCESS",
              value: ee,
              domain: "dickssportinggoods.com"
            }, "https://www.dickssportinggoods.com"))
            cookieJar.setCookie(new Cookie({
              key: "X-DCSG-CHECKOUT",
              value: d,
              domain: "dickssportinggoods.com"
            }, "https://www.dickssportinggoods.com"))
            cookieJar.setCookie(new Cookie({
              key: "DCSG-CART",
              value: dc,
              domain: "dickssportinggoods.com"
            }, "https://www.dickssportinggoods.com"))
            
            const cookiess = cookieJar.getCookies(`https://www.dickssportinggoods.com/`)
            }
            catch(e){
              console.log(e)
            }
            */
            if (this.sts > "399") {
              const toja = cookieJar.toJSON();
              console.log(toja.cookies);
              const acoo = toja.cookies;
              this.acoo = acoo;
              const browser = await firefox.launch({
                args: [
                  "--no-sandbox",
                  "--disable-setuid-sandbox",
                  "--disable-dev-shm-usage",
                  "--disable-accelerated-2d-canvas",
                  "--no-first-run",
                  "--no-zygote",
                  "--single-process", // <- this one doesn't works in Windows
                  "--disable-gpu",
                ],
                headless: true,
                proxy: siteFunctionsObj.getProxy(task),
              });
              console.log(
                `CHECKOUTSESSION=${cs}`,
                `DCSG-CHECKOUT-ACCESS=${ee}`,
                `X-DCSG-CHECKOUT=${dc}`,
                `DCSG-CART=${d}`
              );
              const context = await browser.newContext();
              //const deserializedCookies = JSON.parse(stringed);
              try {
                console.log(this.acoo);
                await context.addCookies(
                  this.acoo.map((_) => ({
                    name: _.key ? _.key : undefined,
                    value: _.value ? _.value : undefined,
                    domain: _.domain ? _.domain : undefined,
                    path: _.path ? _.path : undefined,
                  }))
                );
              } catch (e) {
                console.log(e);
              }
              const page = await context.newPage();
              page.setDefaultTimeout(33333);
              await page.goto(
                "https://www.dickssportinggoods.com/DSGBillingAddressView"
              );
              await siteFunctionsObj.sleep(5000);
              //await page.click('//*[@id="app-container"]/app-billing-address/div/form/div/div/div[1]/app-order-number')
              //var order = await page.innerText('.orderNumber')
              //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, order, "#C3FFC2");
              try {
                page.setDefaultTimeout(3333);
                await page.click('//*[@id="firstName"]');
                let first = await page.$('//*[@id="firstName"]');
                if (first) {
                  //just make the try while error function quucker no needs to do what you did in python lol
                  await page.type(
                    '//*[@id="firstName"]',
                    task.profile.shipFirstName
                  ); //adjust to profile name ofc  shipZipCode
                  await page.type("#lastName", task.profile.shipLastName);
                  await page.type("#phone", task.profile.shipPhone);
                  await page.type("#email", task.profile.shipEmail);
                  await page.type("#mat-input-5", task.profile.shipAddress);
                  await page.type("#mat-input-6", task.profile.shipAddress2);
                  await page.type("#mat-input-7", task.profile.shipZipCode);

                  await page.click(".mat-button-wrapper");
                  await siteFunctionsObj.sleep(3333);
                }
              } catch (err) {
                page.click("text=Continue to Payment");
                page.setDefaultTimeout(3333);
              }
              page.setDefaultTimeout(30000);
              await page.click("text=Credit/Debit Card");
              await page.type("", task.profile.profileCardNo);
              await siteFunctionsObj.sleep(122);
              await page.type(
                '//*[@id="cc-exp-date"]',
                task.profile.profileExpMonth + task.profile.profileExpYear
              );
              await page.type('//*[@id="cc-cvc"]', task.profile.profileCVV);
              await siteFunctionsObj.sleep(111);
              await page.click('//*[@id="placeOrder"]');
            }
          }
          async proccess() {
            const pt = `{"expireMonth":"${cc_exp_m}","expireYear":"${cc_exp_y}","decisionParameter":"170.103.31.158","cvv":"${cvv}","accountDisplay":null,"cardType":"${cc_type}","flexPublicKey":{"key_id":"${key_id}","der":{"format":"X.509","algorithm":"RSA","public_key":"${publicKey}"},"jwk":{"kty":"RSA","use":"enc","kid":"${kid}","n":"${n}","e":"AQAB"}},"token":{"keyId":"${key_id}","token":"${this.token}","maskedPan":"${this.masked}","cardType":"${cc_type}","timestamp":${this.timestamp},"signedFields":"token,cardType,maskedPan,timestamp","signature":"${this.signatures}","discoverableServices":{},"_embedded":{"icsReply":{"requestId":"${this.requestid}","_links":{"self":{"href":"/cybersource/flex/search/v1/logs/tokenProvider/${this.requestid}"}}}}}}`;
            //console.log(pt)
            await fetch(
              `https://www.dickssportinggoods.com/api/v1/checkouts/${dc}/payment/payment-processor`,
              {
                credentials: "same-origin",
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
                  Accept: "application/json",
                  "Accept-Language": "en-US,en;q=0.5",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Cache-Control":
                    "no-cache,no-store,must-revalidate,max-age=0",
                  Pragma: "no-cache",
                  Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
                  Referer:
                    "https://www.dickssportinggoods.com/DSGPaymentViewCmd?catalogId=12301&langId=-1&storeId=15108",
                  "Sec-4238171468024380Fetch-Dest": "empty",
                  "Sec-Fetch-Mode": "cors",
                  "Sec-Fetch-Site": "same-origin",
                  Cookie: `CHECKOUTSESSION=${cs}; DCSG-CHECKOUT-ACCESS=${ee}; X-DCSG-CHECKOUT=${dc}; DCSG-CART=${d}`,
                },

                body: pt,
                method: "PUT",
                mode: "cors",
              }
            )
              .then((response) => response.json())
              .then((data) => {
                //let cstat = data.status
                //this.cstat = cstat
                // console.log(data)
                //console.log(data.checkout_key)
                let finalcs = data.checkout_key;
                this.finalcs = finalcs;
              });
          }

          async pay() {
            await fetch(
              `https://www.dickssportinggoods.com/api/v1/checkouts/${this.finalcs}`,
              {
                credentials: "same-origin",
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
                  Accept: "application/json",
                  "Accept-Language": "en-US,en;q=0.5",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Cache-Control":
                    "no-cache,no-store,must-revalidate,max-age=0",
                  Pragma: "no-cache",
                  Referer:
                    "https://www.dickssportinggoods.com/DSGPaymentViewCmd?catalogId=12301&langId=-1&storeId=15108",
                  Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
                  "Sec-Fetch-Dest": "empty",
                  "Sec-Fetch-Mode": "cors",
                  "Sec-Fetch-Site": "same-origin",
                  Cookie: `CHECKOUTSESSION=${cs}; DCSG-CHECKOUT-ACCESS=${ee}; X-DCSG-CHECKOUT=${dc}; DCSG-CART=${d}`,
                },

                method: "POST",
                mode: "cors",
              }
            )
              .then((response) => response)
              .then((data) => {
                //   let pstat = data.status
                //  this.pstat = pstat
                console.log(data);
                //202
              });
          }
          async main() {
            try {
              function sleep(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
              }

              await this.op();
              console.log("good");
              await this.send();
              console.log("also");
              await this.ayden();
              console.log("hmm");

              //await this.proccess()
              //await this.pay()
            } catch (error) {
              if (error.response) {
                console.log(error.response.body);
              }
            }
          }
        }
        // just get key id and public key for the request becuase they change if they are wrong they give u a 400
        const key_id = `${this.keyid}`;
        const cs = `${this.cs}`;
        const ee = `${this.ee}`;
        const publicKey = `${this.RSAToken}`;
        const cc = `${this.nn}`;
        var digit = cc.toString()[0];
        //console.log(digit)
        let cc_type;
        if (digit == "3") {
          cc_type = `003`;
        }
        if (digit == "4") {
          cc_type = `001`;
        }
        if (digit == "5") {
          cc_type = `002`;
        }
        if (digit == "6") {
          cc_type = `004`;
        }
        //console.log(cc_type + "HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        //console.log(cc_type + "this 1")
        const cc_exp_m = `${this.eem}`;
        // console.log(cc_exp_m + "this 2")
        const cvv = `${this.i}`;
        //console.log(cvv + "this 3")
        const cc_exp_y = "20" + this.yye;
        const d = `${this.d}`;
        const n = `${this.n}`;
        const kid = `${this.kid}`;
        const base = new t(key_id, publicKey, cc, cc_type, cc_exp_m, cc_exp_y);
        base.main();
      }

      async aydenmain() {
        console.log("good");
        var tough = require("tough-cookie");
        const adyenEncrypt = require("node-adyen-encrypt")(25);
        const adyenKey =
          "10001|B4EFFCD06C8D17BEE3B02C9B87B7803C957EAA3A2DF6B03EC834A6A3C4A70657C7A0771EC408BC9F572538EB05308CEDB4CABD0872279A46B764F59EFADB215EF2654816F4BDA187AC17591208F5837955435DC4AEEED36296E1AA8A51B3873D034A67547EA3387B1520A3D08972EE57BE0ACCA5D532C86D00CEC631CCAD45EFB8068C7C3320F220AFC6557D16C5B4EF0D856EA31EC34419F1AE01829FAC9B3B4E283A0C4A775FA5723ED90BB5C772C94E2AFCAC8825FD0499BDAFF48A6165929CE32E76F9843894E49C19D469A050791183D73E33ADC844B9363031948AF85DEF97941979741670EFEA592B49A2CF073D04D212BDB2B18A541381BECEC11BEF";
        const options = {};
        const cseInstance = adyenEncrypt.createEncryption(adyenKey, options);

        /*
        var CARD_EXP = {
            number: "4238171468024380",       // 'xxxx xxxx xxxx xxxx'
            expiryMonth: "02", //'MM'
            cvc: "265",                 //'xxx'
            holderName: 'John Doe',   // 'John Doe'
            expiryYear: "2024",   // 'YYYY'
            generationtime: new Date().toISOString()
        };
        */
        //cseInstance.encrypt
        const between = (min, max, l) => {
          let s = "";
          for (var i = 0; i < l; i++) {
            s += `${Math.floor(Math.random() * (max - min) + min)}`;
          }
          return s;
        };
        const get_ip = () => {
          return `${between(0, 9, 3)}.${between(0, 9, 2)}.${between(
            0,
            9,
            3
          )}.${between(0, 9, 3)}`;
        };
        const rip = get_ip();
        this.rip = rip;
        const a = this.nn;
        const b = a;
        const c = b.split("");
        let numbd;
        if (b.length === 15) {
          numbd =
            c[0] +
            c[1] +
            c[2] +
            c[3] +
            " " +
            c[4] +
            c[5] +
            c[6] +
            c[7] +
            c[8] +
            c[9] +
            " " +
            c[10] +
            c[11] +
            c[12] +
            c[13] +
            c[14];
          //console.log(b)
        } else {
          numbd =
            c[0] +
            c[1] +
            c[2] +
            c[3] +
            " " +
            c[4] +
            c[5] +
            c[6] +
            c[7] +
            " " +
            c[8] +
            c[9] +
            c[10] +
            c[11] +
            " " +
            c[12] +
            c[13] +
            c[14] +
            c[15];
        }
        console.log(numbd);
        this.numbd = numbd;
        const main = (expiryMonth, expiryYear, cvv, account) => {
          const time = new Date().toISOString();
          //console.log(cvv)
          var body = {
            paygateReference: "",
            expireMonth: cseInstance.encrypt({
              expiryMonth: expiryMonth,
              generationtime: time,
            }),
            expireYear: cseInstance.encrypt({
              expiryYear: expiryYear,
              generationtime: time,
            }),
            cvv: cseInstance.encrypt({
              cvc: cvv,
              generationtime: time,
            }),
            account: cseInstance.encrypt({
              number: `${this.numbd}`,
              generationtime: `${time}`,
              initializeCount: "1",
              numberBind: "1",
              activate: "9",
              referrer:
                "https://checkoutshopper-live-us.adyen.com/checkoutshopper/securedfields/live_YJLFKT47JJG2RI7QIYX6HTKKDEDOEGOH/3.5.3/securedFields.html?type=card&d=aHR0cHM6Ly93d3cuZGlja3NzcG9ydGluZ2dvb2RzLmNvbQ==",
              numberFieldFocusCount: "9",
              numberFieldLog:
                "fo@30,cl@31,KU@39,bl@41,fo@49,bl@57,fo@73,cl@82,KU@87,KL@88,ch@120,bl@120,fo@221,cl@222,cl@230,Kb@233,KN@234,fo@3414,bl@3414,fo@3526,cl@3527,bl@3539,fo@4054,cl@4055,cl@4057,cl@4058,KU@4059,KL@4060,cl@4064,cl@4066,cl@4067,KU@4068,KL@4068,fo@4249,cl@4250,cl@4251,cl@4253,KU@4253,KL@4254,cl@4257,cl@4258,cl@4260,bl@4266,fo@4379,cl@4381,cl@4382,cl@4384,KU@4385,KL@4386,cl@4389,cl@4391,cl@4392,KU@4394,KL@4395",
              numberFieldClickCount: "23",
              numberFieldKeyCount: "15",
              numberUnkKeysFieldLog:
                "91@39,91@87,91@4059,91@4068,91@4253,91@4385,91@4394",
              numberFieldBlurCount: "6",
              deactivate: "6",
              sjclStrength: "10",
              numberFieldChangeCount: "1",
              numberFieldEvHa: "total=0",
            }),
            threeDSPayload: "",
            device: {
              browser: {
                acceptHeader: "*/*",
                colorDepth: between(10, 25, 1),
                language: "en-US",
                javaEnabled: false,
                screenHeight: between(1000, 1920, 1),
                screenWidth: between(1000, 1920, 1),
                userAgent:
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
                timeZoneOffset: between(100, 999, 1),
              },
              ipAddress: `${this.rip}`,
            },
          };
          const colord = body.device.browser.colorDepth;
          this.colord = colord;
          const screen = body.device.browser.screenWidth;
          this.screen = screen;
          const screenh = body.device.browser.screenHeight;
          this.screenh = screenh;
          const timez = body.device.browser.timeZoneOffset;
          this.timez = timez;
          const amn = body.expireMonth;
          this.amn = amn;
          const by = body.expireYear;
          this.by = by;
          const cdv = body.cvv;
          this.cdv = cdv;
          const dac = body.account;
          this.dac = dac;
          return body;
        };
        const doia = main("02", "2024", "265", "1234 1234 1234 1234");
        //console.log(doia)
        let cookieJar = new fetchCookie.toughCookie.CookieJar();

        const fetch = fetchCookie(nodeFetch, cookieJar);
        const pt = `{"paygateReference":"","expireMonth":"${this.amn}","expireYear":"${this.by}","cvv":"${this.cdv}","account":"${this.dac}","type":"visa","threeDSPayload":"","device":{"browser":{"acceptHeader":"*/*","colorDepth":${this.colord},"language":"en-US","javaEnabled":false,"screenHeight":${this.screenh},"screenWidth":${this.screen},"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0","timeZoneOffset":240},"ipAddress":"${this.rip}"}}`;
        await fetch(
          `https://www.dickssportinggoods.com/api/v1/checkouts/${this.dc}/payment/payment-processor`,
          {
            credentials: "include",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
              Referer:
                "https://www.dickssportinggoods.com/DSGPaymentViewCmd?catalogId=12301&langId=-1&storeId=15108",
              Accept: "application/json",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-cache,no-store,must-revalidate,max-age=0",
              Pragma: "no-cache",
              Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
              "X-INSTANA-T": "675f393f655aa4f0",
              "X-INSTANA-S": "675f393f655aa4f0",
              "X-INSTANA-L":
                "1,correlationType=web;correlationId=675f393f655aa4f0",
              "elastic-apm-traceparent":
                "00-1ce459987642658112241d9d561b31d7-b64d3f5d44b705e3-01",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              Cookie: `CHECKOUTSESSION=${this.cs}; DCSG-CHECKOUT-ACCESS=${this.ee}; X-DCSG-CHECKOUT=${this.dc}; DCSG-CART=${this.d}`,
            },
            body: pt,
            method: "PUT",
            mode: "cors",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            let sts = data.status;
            this.sts = sts;
            //console.log(sts)
            //let cstat = data.status
            //this.cstat = cstat
            //console.log("oka")

            //console.log(data.checkout_key)
            let finalcs = data.checkout_key;
            this.finalcs = finalcs;
          });
        /*try{
          
        var Cookie = tough.Cookie;
        cookieJar.setCookie(new Cookie({
          key: "CHECKOUTSESSION",
          value: cs,
          domain: "dickssportinggoods.com"
        }, "https://www.dickssportinggoods.com"))
        cookieJar.setCookie(new Cookie({
          key: "DCSG-CHECKOUT-ACCESS",
          value: ee,
          domain: "dickssportinggoods.com"
        }, "https://www.dickssportinggoods.com"))
        cookieJar.setCookie(new Cookie({
          key: "X-DCSG-CHECKOUT",
          value: d,
          domain: "dickssportinggoods.com"
        }, "https://www.dickssportinggoods.com"))
        cookieJar.setCookie(new Cookie({
          key: "DCSG-CART",
          value: dc,
          domain: "dickssportinggoods.com"
        }, "https://www.dickssportinggoods.com"))
        
        const cookiess = cookieJar.getCookies(`https://www.dickssportinggoods.com/`)
        }
        catch(e){
          console.log(e)
        }
        */
        if (this.sts > "399") {
          const toja = cookieJar.toJSON();
          //console.log(toja.cookies)
          const acoo = toja.cookies;
          this.acoo = acoo;
          const browser = await firefox.launch({
            headless: true,
            proxy: siteFunctionsObj.getProxy(task),
          });
          //console.log(`CHECKOUTSESSION=${this.cs}`, `DCSG-CHECKOUT-ACCESS=${this.ee}`, `X-DCSG-CHECKOUT=${this.dc}`, `DCSG-CART=${this.d}`)
          const context = await browser.newContext();
          //const deserializedCookies = JSON.parse(stringed);
          try {
            console.log(this.acoo);
            await context.addCookies(
              this.acoo.map((_) => ({
                name: _.key ? _.key : undefined,
                value: _.value ? _.value : undefined,
                domain: _.domain ? _.domain : undefined,
                path: _.path ? _.path : undefined,
              }))
            );
          } catch (e) {
            console.log(e);
          }
          const page = await context.newPage();
          page.setDefaultTimeout(33333);
          await page.goto(
            "https://www.dickssportinggoods.com/DSGBillingAddressView"
          );
          await siteFunctionsObj.sleep(5000);
          //await page.click('//*[@id="app-container"]/app-billing-address/div/form/div/div/div[1]/app-order-number')
          //var order = await page.innerText('.orderNumber')
          //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, order, "#C3FFC2");
          try {
            page.setDefaultTimeout(3333);
            await page.click('//*[@id="firstName"]');
            let first = await page.$('//*[@id="firstName"]');
            if (first) {
              //just make the try while error function quucker no needs to do what you did in python lol
              await page.type(
                '//*[@id="firstName"]',
                task.profile.shipFirstName
              ); //adjust to profile name ofc  shipZipCode
              await page.type("#lastName", task.profile.shipLastName);
              await page.type("#phone", task.profile.shipPhone);
              await page.type("#email", task.profile.shipEmail);
              await page.type("#mat-input-5", task.profile.shipAddress);
              await page.type("#mat-input-6", task.profile.shipAddress2);
              await page.type("#mat-input-7", task.profile.shipZipCode);

              page.setDefaultTimeout(30000);
              await page.click(".mat-button-wrapper");
            }
          } catch (err) {
            page.click("text=Continue to Payment");
          }
          page.setDefaultTimeout(30000);
          await siteFunctionsObj.sleep(8000);
          await page.click("text=Credit/Debit Card");
          await page.keyboard.press("Tab");
          await siteFunctionsObj.sleep(500);
          await page.keyboard.type(task.profile.profileCardNo);
          await page.keyboard.press("Tab");
          await siteFunctionsObj.sleep(500);
          await page.keyboard.type(
            task.profile.profileExpMonth + task.profile.profileExpYear
          );
          await page.keyboard.press("Tab");
          await siteFunctionsObj.sleep(500);
          await page.keyboard.type(task.profile.profileCVV);
          await page.click('//*[@id="placeOrder"]');
        }
      }

      async main() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        try {
          let cart = 0;
          this.cart = cart;
          //if this is a W rest of this will flow
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "🌼 Sumbitng Payment",
            "#fc5552"
          );
          try {
            let carted = 0;
            this.carted = carted;
            while (this.carted == 0) {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🥀 Force",
                "#f89b29"
              );
              await this.tokens();
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🌼 Sumbitng Payment",
                "#fc5552"
              );
              await this.address();
            }

            if (this.carted == 1) {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🌺 Proccessing order",
                "#fc5552"
              );
              //await this.RSAgen()
              console.log("go");
              await this.aydenmain();
              console.log("W");
              const { Howl, Howler } = require("howler");

              var sound = new Howl({
                src: ["./tr.mp3"],
              });

              sound.play();
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "💐 Checked Out! 💐",
                "#a8e6cf"
              );
              siteFunctionsObj.checkout(task);
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL(
                  `https://www.dickssportinggoods.com/p/jordan-kids-toddler-jordan-1-mid-basketball-shoes-19nikyjrdn1mdblkrhlya/19nikyjrdn1mdblkrhlya` +
                    task.taskMonitorInput
                )
                .addField(
                  "DSG Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              const hook2 = new Webhook(webhook);
              hook2.send(embed);
              await sleep(111111111111111);
            }
          } catch (e) {}

          //await sleep(2222)
          //await this.co()
        } catch (e) {}
      }
    }
    let a = new ss();
    a.main();
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  DSGIntial: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#FFD7FC"
    );
    document.getElementById(`taskStatus_${taskId}`);
    let a = new ss();
    a.main();
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  DSGIntialBypass: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#FFD7FC"
    );
    document.getElementById(`taskStatus_${taskId}`);

    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  Newegg: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "😎 Starting Task (In a cool way)",
      "#ff6f69"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: false,
      proxy: siteFunctionsObj.getProxy(task),
    });
    const context = await browser.newContext();
    const cookies = fs.readFileSync(`${dbPath}/newa.json`, "utf8");

    const deserializedCookies = JSON.parse(cookies);
    await context.addCookies(deserializedCookies);

    const page = await context.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "🏖️ Initializing Session",
      "#ffcc5c"
    );
    await page.goto("https://secure.newegg.com/orders/list");

    page.setDefaultTimeout(22222);
    var flag = 0;
    while (flag == 0) {
      try {
        page.setDefaultTimeout(30500);
        await page.goto(
          "https://www.newegg.com/omni-gear-3-ft-hdmi-cables/p/N82E16886161008?Description=hdmi&cm_re=hdmi-_-86-161-008-_-Product"
        );
        const a = task.taskMonitorInput;
        await page.click("text=Add to cart");
        let responsse = await page.waitForResponse(
          (response) =>
            response.url().includes("https://www.newegg.com/api/Add2Cart") &&
            response.status() === 201
        );
        let response = await responsse;
        let request = response.request();
        let here = request.postData();
        const again = JSON.stringify(here);
        var res = again.substr(110, 110);
        var w = res.substr(41, 42);
        console.log(w);
        var cs = w.substr(7, 34);
        var strs = cs.replace(/\\/g, "");
        var str = strs.replace(`"`, "");
        console.log(str);
        await page.goto("https://secure.newegg.com/shop/cart");
        await page.click("text=Remove All");
        await page.click("text=Yes, Remove all of them.");
        await page.waitForResponse(
          (response) =>
            response
              .url()
              .includes("https://secure.newegg.com/shop/api/InitCartApi") &&
            response.status() === 200
        );
        //customer token
        let incart = 0;
        try {
          while (incart == 0) {
            try {
              await page.goto(
                "https://www.newegg.com/amd-ryzen-7-3700x/p/N82E16819113567?Item=N82E16819113567&quicklink=true"
              );
              const ID = task.taskMonitorInput;
              this.a = `{"ItemList":[{"ItemGroup":"Single","ItemNumber":"${ID}","Quantity":1,"OptionalInfos":null,"SaleType":"Sales"}],"CustomerNumber":"${str}"}`;
              this.a = this.a;
              await page.evaluate((x) => {
                fetch("https://www.newegg.com/api/Add2Cart", {
                  credentials: "include",
                  headers: {
                    "User-Agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
                    Accept: "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/json",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                  },
                  referrer:
                    "https://www.newegg.com/jyx-16-portable-bluetooth-speaker-karaoke-machine-black/p/2MA-06NX-00001?Item=9SIAWRKEUC5900&cm_sp=Homepage_dailydeals-_-P2_9SIAWRKEUC5900-_-07202021&quicklink=true&RandomID=366441701033115820210720094045",
                  body: `${x}`,
                  method: "POST",
                  mode: "cors",
                });
              }, this.a);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🐚 Atempting ATC",
                "#ffeead"
              );
              page.setDefaultTimeout(2222);
              await page.waitForResponse(
                (response) =>
                  response
                    .url()
                    .includes("https://www.newegg.com/api/Add2Cart") &&
                  response.status() === 201
              );
              page.setDefaultTimeout(30500);
              //just do sumbit here ig
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🌴 Submiting Payment",
                "#f2ae72"
              );
              await page.goto("https://secure.newegg.com/shop/cart");
              page.setDefaultTimeout(30500);
              var price = await page.innerText(
                '//*[@id="app"]/div[1]/section/div/div/form/div[2]/div[3]/div/div/div[3]/ul/li/span/strong'
              );
              var res = price.replace(",", "");
              var pr = res;
              var y = task.taskColor;
              console.log(y);
              console.log(res);
              if (Number(pr) > Number(y)) {
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "⛔ Price too high",
                  "#d96459"
                );
                await page.click("text=Remove All");
                await page.click("text=Yes, Remove all of them.");
                await page.click("er,m;ngres;,mn.grsjen,gj,.regkj.");
              }
              await page.dblclick("text=Secure Checkout");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🌴 Submiting Payment",
                "#f2ae72"
              );
              await siteFunctionsObj.sleep(3333);
              page.setDefaultTimeout(1111);
              let signin = await page.$("text=Sign In");
              try {
                if (signin) {
                  let ee = task.profile.shipEmail;
                  let pp = "Abd132abdal";
                  await page.evaluate(`
            document.getElementById('labeled-input-signEmail').value = "${ee}"
            `);
                  await siteFunctionsObj.sleep(1111);
                  await page.evaluate(`
                  document.getElementById('signInSubmit').click()
                  `);
                  console.log("opk");
                  await siteFunctionsObj.sleep(1111);
                  await page.evaluate(`
            document.getElementById('labeled-input-password').value = "${pp}"
            `);
                  await siteFunctionsObj.sleep(1111);
                  await page.evaluate(`
            document.getElementById('signInSubmit').click()
            `);
                }
              } catch (e) {
                console.log(e);
              }
              page.setDefaultTimeout(22222);
              await page.dblclick("text=Credit Card");
              page.click("text=Continue to delivery");
              await page.dblclick("text=Credit Card");
              await page.keyboard.press("Tab");
              await page.keyboard.type(task.profile.profileCVV);
              await page.click("text=Place Order");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🐬 Placed Order",
                "#96ceb4"
              );
              siteFunctionsObj.checkout(task);
              const { Howl, Howler } = require("howler");

              var sound = new Howl({
                src: ["./tr.mp3"],
              });

              sound.play();
              const hook = new Webhook(
                "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
              );
              const embed = new MessageBuilder()
                .setTitle(`**ElephantAIO Success! 🥳**`)
                .setAuthor(
                  "ElephantAIO",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setURL(task.taskMonitorInput)
                .addField(
                  "Newegg Success!",
                  "A user cooked " + task.taskMonitorInput + " :fire:",
                  true
                )
                .setColor("#bcffff")
                .setThumbnail(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setDescription(":rocket: Very exited to announce a")
                .setImage(
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setFooter(
                  "@ElephantAIO Success :fire:",
                  "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                )
                .setTimestamp();

              hook.send(embed);
              await siteFunctionsObj.sleep(999999);
            } catch (e) {
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🐚 Atempting ATC",
                "#ffeead"
              );
              await siteFunctionsObj.sleep(1000);
            }
          }
        } catch (e) {}

        flag = 1;
      } catch (err) {
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "⛔ Error",
          "#d96459"
        );
      }
    }
    if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
      /** Check If Task Not Running Then Exit Task Handle */
      return;
    }
  },

  GolfGalaxy: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);

    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#b9fcd5"
    );
    document.getElementById(`taskStatus_${taskId}`); //.classList.add("blink");
    const browser = await firefox.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: true,
      proxy: siteFunctionsObj.getProxy(task),
    });
    const page = await browser.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    var request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
      true
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
      JSON.stringify({
        content:
          "**CopBoxAIO Runer for**" +
          task.taskMonitorInput +
          " Hope they cook! <3 :)",
      })
    );
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      task.taskColor,
      "#13d0e5"
    );
    var flag = 0;
    while (flag == 0) {
      console.log("here1");
      try {
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          task.taskColor,
          "#13d0e5"
        );
        await page.goto(task.taskMonitorInput); //ok but whats the product url my g
        try {
          let lost2 = await page.$("text=Access Denied");
          while (lost2) {
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "😴 Waiting For Product..",
              "#bc6945"
            );
            await page.click("text=Access Denied");
            await siteFunctionsObj.sleep(3000);
            await page.reload();
          }
        } catch (err) {}

        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "👀 Setting Product",
          "#84f395"
        );
        try {
          let lost = await page.$(
            "text=The product you're looking for is not available at this time."
          );
          while (lost) {
            await page.click(
              "text=The product you're looking for is not available at this time."
            );
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "😶 Waiting For Product..",
              "#000000"
            );
            await page.reload();
            await siteFunctionsObj.sleep(2200);
          }
        } catch (err) {}
        try {
          let queue = await page.$(".sub-copy");
          while (queue) {
            await page.click(".sub-copy");
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🤔 Waiting in queue",
              "#b9fcd5"
            );
            await siteFunctionsObj.sleep(3000);
          }
        } catch (err) {
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "🥶 Passed Queue",
            "#b9fcd5"
          );
        }
        page.setDefaultTimeout(1500);
        page.click('//*[@id="homr-modal"]/div/div');
        page.setDefaultTimeout(30500);
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "🎨" + task.taskColor,
          "#50F9A4"
        );
        const x = task.taskSize;
        const a = task.taskColor;
        let incart = 0;
        try {
          while (incart == 0) {
            try {
              page.setDefaultTimeout(8000);
              await page.goto(task.taskMonitorInput);
              await siteFunctionsObj.sleep(1222);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🙃 Waiting For Restock/Atempting ATC..",
                "#13d0e5"
              );
              page.click('//*[@id="homr-modal"]/div/div');
              try {
                let queue = await page.$(".sub-copy");
                while (queue) {
                  await page.click(".sub-copy");
                  siteFunctionsObj.setStatus(
                    `taskStatus_${taskId}`,
                    "🧐 Waiting in queue",
                    "#ffffff"
                  );
                  await siteFunctionsObj.sleep(555);
                }
              } catch (err) {}
              page.click(`css=img[alt*='${a}']`);
              await page.evaluate(`
                var sizes = document.getElementById("block-attributes").getElementsByTagName('span');
                for (i = 0; i < sizes.length; i++) {
                    var lowerCaseSize = (sizes[i].innerText).toLowerCase().replace(/\s/g, '');
                    if (lowerCaseSize.includes("${x}")) {
                        var oosValue = false;
                        var sizeClassList = sizes[i].parentElement.parentElement.classList;
                        sizeClassList.forEach(element => {
                            if (element == "swatch-disabled") {
                                oosValue = true;
                            }
                        });
                        if (oosValue != true) {
                            sizes[i].click();
                            console.log("addedtocart")
                            //return "addedtocart";
                        } else {
                            console.log("oos")
                            //return (!oosValue);
                        }
                    }
                }
              `);
              await page.click(
                '//*[@id="shippingOptionsV3"]/div[1]/label/div[1]'
              );
              await siteFunctionsObj.sleep(40);
              page.setDefaultTimeout(2250);
              page.click("text=ADD TO CART");
              await page.waitForResponse(
                (response) =>
                  response
                    .url()
                    .includes(
                      "https://www.golfgalaxy.com/api/v1/carts/contents"
                    ) && response.status()
              );
              let incart = 1;
              let test = 200;
              if (test == 200) {
                let incart = 1;
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "🏌️‍♂️ Proccessing Order..",
                  "#597ba0"
                );
                page.setDefaultTimeout(33333);
                await page.goto(
                  "https://www.golfgalaxy.com/DSGBillingAddressView"
                );
                await siteFunctionsObj.sleep(5000);
                await page.click(
                  '//*[@id="app-container"]/app-billing-address/div/form/div/div/div[1]/app-order-number'
                );
                var order = await page.innerText(".orderNumber");
                //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, order, "#C3FFC2");
                try {
                  await page.click('//*[@id="firstName"]');
                  let first = await page.$('//*[@id="firstName"]');
                  if (first) {
                    //just make the try while error function quucker no needs to do what you did in python lol
                    await page.type(
                      '//*[@id="firstName"]',
                      task.profile.shipFirstName
                    ); //adjust to profile name ofc  shipZipCode
                    await page.type("#lastName", task.profile.shipLastName);
                    await page.type("#email", task.profile.shipEmail);
                    await page.type("#phone", task.profile.shipPhone);
                    await page.type("#mat-input-5", task.profile.shipAddress);
                    await page.type("#mat-input-6", task.profile.shipAddress2);
                    await page.type("#mat-input-7", task.profile.shipZipCode);
                    await page.click(".mat-button-wrapper");
                    await siteFunctionsObj.sleep(3333);
                  }
                } catch (err) {
                  await page.click("text=Continue to Payment");
                  page.setDefaultTimeout(30000);
                }
                page.click("text=Continue to Payment");
                page.setDefaultTimeout(30000);
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "...",
                  "#F4FFB0"
                );
                try {
                  let queue = await page.$(".sub-copy");
                  while (queue) {
                    await siteFunctionsObj.sleep(666);
                    siteFunctionsObj.setStatus(
                      `taskStatus_${taskId}`,
                      "😶 Waiting in checkout queue",
                      "#F4FFB0"
                    );
                    await page.click(".sub-copy");
                  }
                } catch (err) {}
                page.setDefaultTimeout(30000);
                await siteFunctionsObj.sleep(1550);
                await page.click("#cc-number");
                await siteFunctionsObj.sleep(122);
                await page.keyboard.type(task.profile.profileCardNo);
                await siteFunctionsObj.sleep(122);
                await page.type(
                  '//*[@id="cc-exp-date"]',
                  task.profile.profileExpMonth + task.profile.profileExpYear
                );
                await page.type('//*[@id="cc-cvc"]', task.profile.profileCVV);
                await siteFunctionsObj.sleep(111);
                await page.click('//*[@id="placeOrder"]');
                siteFunctionsObj.checkout(task);
                const hook = new Webhook(
                  "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
                );
                const embed = new MessageBuilder()
                  .setTitle(`**ElephantAIO Success! 🥳**`)
                  .setAuthor(
                    "ElephantAIO",
                    "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                  )
                  .setURL(task.taskMonitorInput)
                  .addField(
                    "GolfGalaxy Success!",
                    "A user cooked " + task.taskMonitorInput + " :fire:",
                    true
                  )
                  .setColor("#bcffff")
                  .setThumbnail(
                    "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                  )
                  .setDescription(":rocket: Very exited to announce a")
                  .setImage(
                    "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                  )
                  .setFooter(
                    "@ElephantAIO Success :fire:",
                    "https://pbs.twimg.com/profile_images/1402255887553662985/kHGiXQdM_400x400.jpg"
                  )
                  .setTimestamp();

                hook.send(embed);
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "⛳ Placed Order!",
                  "#e9ecf1"
                );
                await siteFunctionsObj.sleep(60330);
              }
            } catch (e) {}
          }
          if (test == 200) {
            let incart = 1;
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "😬 Proccessing Order..",
              "#e9ecf1"
            );
            page.setDefaultTimeout(33333);
            await page.goto("https://www.golfgalaxy.com/DSGBillingAddressView");
            await siteFunctionsObj.sleep(5000);
            try {
              let first = await page.$('//*[@id="firstName"]');
              if (first) {
                //just make the try while error function quucker no needs to do what you did in python lol
                await page.type(
                  '//*[@id="firstName"]',
                  task.profile.shipFirstName
                ); //adjust to profile name ofc  shipZipCode
                await page.type("#lastName", task.profile.shipLastName);
                await page.type("#email", task.profile.shipEmail);
                await page.type("#phone", task.profile.shipPhone);
                await page.type("#mat-input-5", task.profile.shipAddress);
                await page.type("#mat-input-6", task.profile.shipAddress2);
                await page.type("#mat-input-7", task.profile.shipZipCode);
                await page.click(".mat-button-wrapper");
                await siteFunctionsObj.sleep(3333);
              }
            } catch (err) {
              await page.click("text=Continue to Payment");
              page.setDefaultTimeout(30000);
            }
            page.click("text=Continue to Payment");
            page.setDefaultTimeout(30000);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "...",
              "#F4FFB0"
            );
            try {
              let queue = await page.$(".sub-copy");
              while (queue) {
                await siteFunctionsObj.sleep(666);
                siteFunctionsObj.setStatus(
                  `taskStatus_${taskId}`,
                  "😶 Waiting in checkout queue",
                  "#ffffff"
                );
                await page.click(".sub-copy");
              }
            } catch (err) {}
            page.setDefaultTimeout(30000);
            await siteFunctionsObj.sleep(1550);
            await page.click("#cc-number");
            await siteFunctionsObj.sleep(122);
            await page.keyboard.type(task.profile.profileCardNo);
            await siteFunctionsObj.sleep(122);
            await page.type(
              '//*[@id="cc-exp-date"]',
              task.profile.profileExpMonth + task.profile.profileExpYear
            );
            await page.type('//*[@id="cc-cvc"]', task.profile.profileCVV);
            await siteFunctionsObj.sleep(111);
            await page.click('//*[@id="placeOrder"]');
            var request = new XMLHttpRequest();
            request.open("POST", webhook);
            // again, replace the url in the open method with yours
            request.setRequestHeader(
              "Content-Type",
              "application/json;charset=UTF-8"
            );

            var myEmbed = {
              author: {
                name: "CopBoxAIO Success 🔥",
              },
              title: "CopBoxAIO Success!",
              description:
                "🥳 **CopBoxAIO just hit **" +
                task.taskMonitorInput +
                "! Congrats on the cook 😎",
              color: hexToDecimal("#597ba0"),
            };

            var params = {
              username: "ElephantAIO Success",
              embeds: [myEmbed],
            };

            request.send(JSON.stringify(params));

            // function that converts a color HEX to a valid Discord color
            var request = new XMLHttpRequest();
            request.open(
              "POST",
              "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
            );
            // again, replace the url in the open method with yours
            request.setRequestHeader(
              "Content-Type",
              "application/json;charset=UTF-8"
            );

            var myEmbed = {
              author: {
                name: "CopBoxAIO",
              },
              title: "GolfGalaxy",
              description:
                "🥳 Successfully checked out! " + task.taskMonitorInput,
              color: hexToDecimal("#597ba0"),
            };

            var params = {
              username: "CopBoxAIO Success",
              embeds: [myEmbed],
            };

            request.send(JSON.stringify(params));

            // function that converts a color HEX to a valid Discord color
            function hexToDecimal(hex) {
              return parseInt(hex.replace("#", ""), 16);
            }
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🥳 Placed Order!",
              "#012169"
            );
            await siteFunctionsObj.sleep(20000);
          }

          flag = 1;
        } catch (err) {
          siteFunctionsObj.setStatus(
            `taskStatus_${taskId}`,
            "Error",
            "#c8102e"
          );
        }
      } catch (e) {}
    }
  },

  AmazonCloud: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    console.log("task : ", task);
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#50F9A4"
    );
    const request = require("request-promise");
    const fetch = require("node-fetch");
    const fs = require("fs");
    const tough = require("tough-cookie");
    const delay = require("delay");
    const faker = require("faker");

    const login = require("./login");

    class amazon {
      constructor(account, ASIN, OID, delays, webhook) {
        this.accountDetails = account;

        this.ASIN = ASIN;

        this.OID = OID;

        this.delays = delays;

        this.webhook = webhook;

        this.jar = request.jar();

        this.ua = faker.internet.userAgent();

        this.request = request.defaults({
          followAllRedirects: true,
          resolveWithFullResponse: true,
          jar: this.jar,
          withCredentials: true,
        });

        this.taskData = {
          product: {
            name: null,
            OID: OID,
            image: null,
            price: null,
          },
        };

        this.flow();
      }

      async flow() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        let checkout = 0;
        await this.prepare();
        try {
          while (checkout == 0) {
            // let monitorState = await this.monitor();
            // while (!monitorState) {
            //   await delay(this.delays.monitor);
            //   monitorState = await this.monitor();
            // }
            this.loginre = 1;
            this.s = Date.now();
            try {
              let cart = 0;
              this.cart = cart;
              try {
                //CLOUD MONITORING
                let monitors = 0;
                this.monitors = monitors;
                while (this.monitors == 0) {
                  await this.cloud();
                  await sleep(100);
                }

                //ATC
                let carted = 0;
                this.carted = carted;
                while (this.carted == 0) {
                  while (this.monitors == 0) {
                    await this.cloud();
                    await sleep(100);
                  }

                  await this.initiateCheckout(); //atc

                  //SUBMIT WITH CALL BACK TO ATC
                  while (this.carted == 1) {
                    await this.getCheckout();
                    let co = 0;
                    this.co = co;
                    await this.submitCheckout(); //should be a W or L
                    if (this.carted == 2) {
                      await this.prepare();
                    }
                  }
                }
              } catch (e) {}
            } catch (e) {}
          }
        } catch (e) {
          console.log("restarting");
        }
      }

      async prepare() {
        if (fs.existsSync(`${this.accountDetails.email}.json`)) {
          const loginCookies = JSON.parse(
            fs.readFileSync(`${this.accountDetails.email}.json`, "utf8")
          );
          console.log(loginCookies);
          Object.entries(loginCookies).forEach((cookie) => {
            this.jar.setCookie(
              new tough.Cookie({
                key: cookie[0],
                value: cookie[1],
                domain: "amazon.com",
              }),
              `https://amazon.com`
            );
          });
        } else {
          console.log("Refreshing login");

          await login(this.accountDetails, this.jar, this.ua);
        }
        this.loginre = this.loginre + 1;
      }

      async monitor() {
        let state;

        console.log(`Monitoring ${this.ASIN}`);

        try {
          const resp = await this.request({
            method: "GET",
            url: "https://www.amazon.com/portal-migration/aod",
            qs: {
              asin: this.ASIN,
            },
            headers: {
              accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-encoding": "identity",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "max-age=0",
              "if-modified-since": "Mon, 26 Apr 2021 16:10:06 GMT",
              "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
              "sec-ch-ua-mobile": "?0",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "none",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1",
              "user-agent": this.ua,
            },
          });

          this.taskData.product = {
            name: html
              .split(
                '<h5 id="aod-asin-title-text" class="aod-asin-title-text-class">'
              )[1]
              .split("</h5>")[0]
              .replace(/(\r\n|\n|\r)/gm, ""),
            price: html.split('class="a-offscreen">')[1].split("<")[0],
            image: html
              .split('<img alt="" src="')[1]
              .split('" id="aod-asin-image-id"')[0],
          };

          state = true;
        } catch (e) {
          state = false;

          if (!(await this.handleError(e))) {
            console.log("Error monitoring");
          }

          await delay(this.errorDelay);
        }

        return state;
      }

      async cloud() {
        const resp = await this.request({
          method: "GET",
          url: `https://cloudapii.herokuapp.com/amazonapi`,
        });

        const data = JSON.parse(resp.body);

        const availableSKUList = data.filter(
          (_) => 20 >= (Date.now() - _.timestamp) / 1000
        );
        if (Number(availableSKUList.length) > 0) {
          const thesku2 = JSON.stringify(availableSKUList);
          const mm = thesku2.split(`,`);
          console.log(mm);
          if (thesku2.toLowerCase().includes(`${task.taskMonitorInput}`)) {
            const price = mm[3].replace(`"price":"`, "").replace(`"`, "");
            this.price = price;
            console.log(price);

            if (Number(this.price) < Number("14444")) {
              const thesku = mm[1].replace(`"sitesku":"`, "").replace(`"`, "");
              console.log(thesku);
              this.ASIN = thesku;
              //SKU

              const offerid = mm[0]
                .replace(`[{"offerid":"\\"`, "")
                .replace(`\\""`, "");
              this.OID = offerid;
              //OFFERID

              this.monitors = 1;
              this.retry = 20;
              console.log(this.monitors);
            }
          }
        }
        console.log(this.monitors);
      }

      async coupon() {
        const options = {
          method: "POST",
          url: "https://www.amazon.com/gp/buy/spc/handlers/add-giftcard-promotion.html/ref=ox_pay_page_gc_add",
          headers: {
            "Accept-Encoding": "identity",
            "User-Agent": this.ua,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "identity",
            "Accept-Language": "en-US,en;q=0.5",
            Referer: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.thesku}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            TE: "trailers",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            cookie:
              'aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-target-static-id=1587083778506-611983; aws-target-data=%7B%22support%22%3A%221%22%7D; s_fid=4524CEAC41A653AC-0E6B321CFD79A919; ubid-main=130-9939383-8398064; aws-target-visitor-id=1587083778511-133740.35_0; regStatus=registering; aws-ubid-main=666-2317524-8157251; x-amz-captcha-1=1619251514827903; x-amz-captcha-2=deZrp32+0uUXKYqro1WwRQ==; lc-main=en_US; s_vnum=2038195881086%26vn%3D3; s_nr=1630518673173-Repeat; s_dslv=1630518673174; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiZWY3NDhlIiwia2V5IjoiZzZCRzhxeGZGT1dzVWlpdnRaSHUxdCswL3QwRi9tbXlVZFg2TytqeXVJNUc3WCtuMnlqcVpvdXRXRlBsNGEvV2tGalI5ajRhK3MrYnZpSS9raVNSWFNGZTIyTURNbzg0bVhROFV1NCtpcjVzdWFxNmFZYXJCRTFJcTBPMnd2U3lnR1pRRktJVko4NkkwYjZxKzFtWkF4WEM3em0yN2h1N2hzOXJsTHFlUWZxYTRRa1QzWWNDaHdOU0ROMCthRGxTaHhMZjRKYVA0SitpVnQxNlZ2NVhidDd2UmVDODUvSWp5TnZ5VUVNd0szNHJ5Y3JGN2MzSHNWQXM1TGJWVU1vUGtuN3dKY0pUT1FCaDZQR0thRU4zcGRsQ0RMV0E0SGFlRWNITDJpajR4N2F4YnlYZ3J1bWdsM1VmWDdIUFh6OTJhT2VjdWlxZXNXUEpLOS9Vd2NKclZnPT0ifQ==; x-main="ax9wbupKpCzoEh3PY7kqJdcls@Frq1W4CkRygQMKadkd0pk0Jz4fd?iMDNbqLU8M"; at-main=Atza|IwEBIFQOCBofGOHvafMd07xNTihF4mX1eqe5WF9SuQKWIOXew19uR2znPhORV0PCrRKHgumck13MtrpXnGjme-7kqcEpEA_m_GNwfvwA4t-mAz0fBikeKQhMcJk_0tBkHeClYciaz_kA_f6Mg0bzMAomT9ZDJO562wAevt0Nt5AkALhop4fAOxJo-4306nigagSkBLHg9EsqST3wKkj6AtTAwWDd; sess-at-main="F9rDv3GS44jGELwwOhP2PP23d+I+UYHgF7vda2vtitc="; sst-main=Sst1|PQFJvDOg2wBsuzz29pBctJyVCUc1AzrspnSJzaFRd2TQh-mPyrXDrYz6uUdxVKPh3GFv9taYGSZ9XWzr2xxH6Lf_pn5Hx_AYn5RGBXvsIr3-qIemzxHqP3NBgqylsCLiV239V3s43B5veDU-sV1a8N-Qa9HZ2OwwxJkoC8VT84bdbqJUuHPwjUshrzWofa6UwitTMpENp6X7TVbt-oI6w3MWeJXQxdfWIIYVpp8t4A0hbgtvgsg23-TqzjBfTpBbJXzgGkv7yKh3drxSVZI3kfLdjq7ZwvM3g7GCfrtgZmxE4LM; session-id-time=2082787201l; i18n-prefs=USD; session-id-apay=260-0514690-1580011; session-id=139-8777044-2954127; session-token="iMxIHCJNdwTZTO0Y6ACZ9PbsU3D5ZFDW5q0IE6jcV1wfUk+S3m2b2V/JgdOi2vj/XFtOSxRxrv8Z7iC0VFU5du2Qdsjbzx1o2l61YqJHgHwEPDomGJmiTvkJyEjU2VPDu0dqblINUE1+ea0m1Qt1Ssd3ZhvhYaL8WL3jT8mZVGo7Sjcb3m8OafaTBW8s/i0wJu4SUmbW7dPwDb8tiWWlkQ=="; csm-hit=tb:6BQA27TS6ZDEWMHWE3TE+s-KD1BNRWHS3FAJ8TPSJP5|1631318490314&t:1631318490314&adb:adblk_no',
          },
          form: {
            claimcode: `${this.code}`,
            disablegc: "",
            returnjson: "1",
            returnFullHTML: "1",
            hasWorkingJavascript: "1",
            fromAnywhere: "0",
          },
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          //.console.log(body2);his.co = 1
        });
      }

      async initiateCheckout() {
        let state;

        console.log("Adding to cart");

        try {
          const cookies = this.jar.getCookieString("https://amazon.com");

          this.verificationSessionID = cookies
            .split("session-id=")[1]
            .split(";")[0];

          const resp = await this.request({
            method: "GET",
            url: `https://www.amazon.com/gp/aws/cart/add.html?&OfferListingId.1=${this.OID}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
            headers: {
              "User-Agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "identity",
              "Accept-Language": "en-US,en;q=0.5",
              Referer: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.ASIN}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              "Sec-Fetch-User": "?1",
              TE: "trailers",
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
            },
          });

          this.cartId = Date.now();

          const html = resp.body;

          if (html.toLowerCase().includes("cart is empty")) {
            console.log("Product OOS");

            this.carted = 0;
            this.retry = this.retry - 1;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
            return state;
          }
          this.PID = html.match(
            new RegExp('currentPurchaseId":"(.*)","pipelineType')
          );

          this.csrfT = html.match(
            new RegExp(`anti-csrftoken-a2z' value='(.*)' /></head>`)
          );
        } catch (e) {
          this.carted = 0;

          if (!(await this.handleError(e))) {
            console.log("Error adding to cart");
            this.carted = 0;
            this.retry = this.retry - 1;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
          }

          await delay(this.errorDelay);
        }
        this.carted = 1;
        return state;
      }

      async getCheckout() {
        let state;

        console.log("Getting checkout");

        try {
          const resp = await this.request({
            method: "POST",
            url: "https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sc_proceed",
            qs: {
              isToBeGiftWrappedBefore: "0",
              proceedToRetailCheckout: "Proceed to checkout",
              proceedToCheckout: "1",
              cartInitiateId: this.cartInitiateId,
            },
            headers: {
              authority: "www.amazon.com",
              rtt: "50",
              downlink: "10",
              ect: "4g",
              "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
              "sec-ch-ua-mobile": "?1",
              "upgrade-insecure-requests": "1",
              dnt: "1",
              "user-agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "identity",
              "sec-fetch-site": "same-origin",
              "sec-fetch-mode": "navigate",
              "sec-fetch-user": "?1",
              "sec-fetch-dest": "document",
              referer: "https://www.amazon.com/gp/cart/view.html?ref_=nav_cart",
              "accept-language": "en-US,en;q=0.9,ar-SY;q=0.8,ar;q=0.7",
            },
          });

          this.body = resp.body;
          //console.log(this.body)
          this.carted = 1;
        } catch (e) {
          console.log("Error getting checkout");
          this.carted = 0;
        }

        return state;
      }

      async submitCheckout() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        let state;

        console.log("Submitting checkout");

        if (this.body.toLowerCase().includes("no longer available")) {
          console.log("Product OOS");
          this.retry = this.retry - 1;
          console.log(this.retry);
          if (0 > Number(this.retry)) {
            this.monitors = 0;
          }
          this.carted = 0;
          return false;
        }
        try {
          // const fasttrackExpiration = this.body.split('name="fasttrackExpiration" value="')[1].split('"')[0];
          //const countdownThreshold = this.body.split('name="countdownThreshold" value="')[1].split('"')[0];
          //const showSimplifiedCountdown = this.body.split('name="showSimplifiedCountdown" value="')[1].split('"')[0];
          // const shippingofferingid0 = this.body.split('name="shippingofferingid0.0" value="')[1].split('"')[0];
          // const dupOrderCheckArgs = this.body.split('name="dupOrderCheckArgs" value="')[1].split('"')[0];
          // const shippingofferingid01 = this.body.split('name="shippingofferingid0.1" value="')[1].split('"')[0];
          const previousshippingofferingid0 = this.body
            .split('name="previousshippingofferingid0" value="')[1]
            .split('"')[0];
          const lineitemids0 = this.body
            .split('name="lineitemids0" value="')[1]
            .split('"')[0];
          const shiptrialprefix = this.body
            .split('name="shiptrialprefix" value="')[1]
            .split('"')[0];
          const csrfToken = this.body
            .split('name="csrfToken" value="')[1]
            .split('"')[0];
          const purchaseTotal = this.body
            .split('name="purchaseTotal" value="')[1]
            .split('"')[0];
          const purchaseTotalCurrency = this.body
            .split('name="purchaseTotalCurrency" value="')[1]
            .split('"')[0];
          const purchaseID = this.body
            .split('name="purchaseID" value="')[1]
            .split('"')[0];
          const purchaseCustomerId = this.body
            .split('name="purchaseCustomerId" value="')[1]
            .split('"')[0];
          const scopeId = this.body
            .split('name="scopeId" value="')[1]
            .split('"')[0];
          //const promiseAsin = this.body.split('name="promiseAsin-0" value="')[1].split('"')[0];
          const selectedPaymentPaystationId = this.body
            .split('name="selectedPaymentPaystationId" value="')[1]
            .split('"')[0];

          const options = {
            method: "POST",
            url: "https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html/ref=ox_spc_place_order",
            qs: {
              partialCheckoutCart: "1",
              isToBeGiftWrappedBefore: "0",
              proceedToRetailCheckout: "Proceed to checkout",
              proceedToCheckout: "1",
              cartInitiateId: this.cartId,
            },
            headers: {
              "User-Agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/x-www-form-urlencoded",
              Origin: "https://www.amazon.com",
              Connection: "keep-alive",
              Referer:
                "https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1",
              "Upgrade-Insecure-Requests": "1",
              TE: "Trailers",
            },
            form: {
              submitFromSPC: "1",
              // fasttrackExpiration: fasttrackExpiration,
              //countdownThreshold: countdownThreshold,
              //showSimplifiedCountdown: showSimplifiedCountdown,
              countdownId: "countdownId-0",
              //'quantity.A0934985K7TVIYW58IQ8%3A': '1',
              // dupOrderCheckArgs: dupOrderCheckArgs,
              order0: "next-1dc",
              // 'shippingofferingid0.0': shippingofferingid0,
              "guaranteetype0.0": "GUARANTEED",
              "issss0.0": "0",
              "shipsplitpriority0.0": "shipWhenever",
              "isShipWhenCompleteValid0.0": "0",
              "isShipWheneverValid0.0": "1",
              // 'shippingofferingid0.1': shippingofferingid01,
              "guaranteetype0.1": "GUARANTEED",
              "issss0.1": "0",
              "shipsplitpriority0.1": "shipWhenever",
              "isShipWhenCompleteValid0.1": "0",
              "isShipWheneverValid0.1": "1",
              previousshippingofferingid0: previousshippingofferingid0,
              previousguaranteetype0: "GUARANTEED",
              previousissss0: "0",
              previousshippriority0: "shipWhenever",
              lineitemids0: lineitemids0,
              currentshippingspeed: "next-1dc",
              previousShippingSpeed0: "next-1dc",
              currentshipsplitpreference: "shipWhenever",
              "shippriority.0.shipWhenever": "shipWhenever",
              groupcount: "1",
              shiptrialprefix: shiptrialprefix,
              csrfToken: csrfToken,
              fromAnywhere: "0",
              redirectOnSuccess: "0",
              purchaseTotal: purchaseTotal,
              purchaseTotalCurrency: purchaseTotalCurrency,
              purchaseID: purchaseID,
              purchaseCustomerId: purchaseCustomerId,
              useCtb: "1",
              scopeId: scopeId,
              isQuantityInvariant: "",
              //'promiseTime-0': promiseTime,
              //'promiseAsin-0': promiseAsin,
              selectedPaymentPaystationId: selectedPaymentPaystationId,
              hasWorkingJavascript: "1",
              placeYourOrder1: "1",
              isfirsttimecustomer: "0",
              isTFXEligible: "",
              isFxEnabled: "",
              isFXTncShown: "",
            },
          };

          const resp = await this.request(options);

          this.checkoutTime = `${(Date.now() - this.s) / 1000}s`;

          if (199 < resp.statusCode < 210) {
            console.log("Order placed");
            this.carted = 2;
            this.cardSuccess();
          } else {
            console.log("Order failed");
            this.cardDecline();
          }

          state = true;
        } catch (e) {
          this.checkoutTime = `${(Date.now() - this.s) / 1000}s`;

          if (this.body.includes("Sign-In")) {
            console.log("Login expired");
            console.log(this.loginre);
            this.loginre = this.loginre - 1;
            if (Number(this.loginre) < 0) {
              await login(this.accountDetails, this.jar, this.ua);
              this.loginre = this.loginre + 2;
              await sleep(1500);
            }

            this.retry = this.retry - 3;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
            this.carted = 0;
          } else {
            console.log(e);
          }

          console.log("Error submitting checkout - OOS");

          this.cardDecline();

          this.carted = 0;
        }

        return state;
      }

      async cardSuccess() {
        let state;

        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "🐘 Successful Checkout!",
                  url: `https://www.amazon.com/dp/${this.ASIN}`,
                  color: 3066993,
                  fields: [
                    {
                      name: "Site",
                      value: "Amazon US",
                      inline: true,
                    },
                    {
                      name: "Proxy",
                      value: `||${this.proxy ? this.proxy : "None"}||`,
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: "Safe",
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
              username: "PolygonAIO",
              avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
            }),
          });

          const resp1 = await fetch(
            "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: null,
                embeds: [
                  {
                    title: "🐘 Successful Checkout!",
                    url: `https://www.amazon.com/dp/${this.ASIN}`,
                    color: 3066993,
                    fields: [
                      {
                        name: "Site",
                        value: "Amazon US",
                        inline: true,
                      },
                      {
                        name: "Proxy",
                        value: `||${this.proxy ? this.proxy : "None"}||`,
                        inline: true,
                      },
                      {
                        name: "Mode",
                        value: "Safe",
                        inline: true,
                      },
                      {
                        name: "Time Elapsed",
                        value: `${this.checkoutTime}`,
                        inline: true,
                      },
                    ],
                    footer: {
                      text: "Polygon AIO",
                      icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
                username: "PolygonAIO",
                avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
              }),
            }
          );

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                console.log("Error sending webhook 💔");
                break;
              case 404:
                console.log("Webhook doesn't exist 💔");
                break;
              case 429:
                console.log("Rate limited 💔");
                break;
              case 502:
                console.log("Discord server error 💔");
                break;
              default:
                console.log("Error:", e.response.status);
            }
          } else {
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async cardDecline() {
        let state;

        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "Checkout Failure :x:",
                  url: `https://www.amazon.com/dp/${this.ASIN}`,
                  color: 15158332,
                  fields: [
                    {
                      name: "Site",
                      value: "Amazon US",
                      inline: true,
                    },
                    {
                      name: "Proxy",
                      value: `||${this.proxy ? this.proxy : "None"}||`,
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: "Safe",
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
              username: "PolygonAIO",
              avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
            }),
          });

          const resp1 = await fetch(
            "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: null,
                embeds: [
                  {
                    title: "Checkout Failure :x:",
                    url: `https://www.amazon.com/dp/${this.ASIN}`,
                    color: 15158332,
                    fields: [
                      {
                        name: "Site",
                        value: "Amazon US",
                        inline: true,
                      },
                      {
                        name: "Mode",
                        value: "Safe",
                        inline: true,
                      },
                      {
                        name: "Time Elapsed",
                        value: `${this.checkoutTime}`,
                        inline: true,
                      },
                    ],
                    footer: {
                      text: "Polygon AIO",
                      icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
                username: "PolygonAIO",
                avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
              }),
            }
          );

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                console.log("Error sending webhook 💔");
                break;
              case 404:
                console.log("Webhook doesn't exist 💔");
                break;
              case 429:
                console.log("Rate limited 💔");
                break;
              case 502:
                console.log("Discord server error 💔");
                break;
              default:
                console.log("Error:", e.response.status);
            }
          } else {
            console.log(e);
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async handleError(e) {
        let state;

        if (typeof e.response !== "undefined") {
          state = true;

          switch (e.response.status) {
            case 400:
              console.log("Payload error");
              break;
            case 401:
              console.log("Blocked");
              break;
            case 404:
              console.log("Product not found");
              break;
            case 407:
              console.log("Proxy authentication missing");
              break;
            case 408:
              console.log("Slow proxy");
              break;
            case 429:
              console.log("Rate limited");
              break;
            case 500:
              console.log("Server error");
              break;
            default:
              console.log("Error:", e.response.statusCode);
              break;
          }
        } else {
          state = false;
        }

        return state;
      }
    }

    new amazon(
      {
        email: `${task.profile.shipEmail}`,
        password: `${task.taskColor}`,
      },
      "B096L7M4XR",
      "irZkihCgk6QPF5LHAAb0NmI6e3SQTuKghL2MncvEln2RJnSs6yyny6amcBCKXbCEsS586K8UMKxK6Nf2BfNnt%2FUJNG9v4jtgiRnMjSnJXTnWzBgIW6hXB9bfVAmXjYpC0ir7gQYkST3%2Fd0EBEETo6A%3D%3D",
      {
        error: 1111,
        monitor: 1111,
      },
      `${webhook}`
    );
  },

  Amazon: async (taskId, task) => {
    let webhook = await siteFunctionsObj.getSuccessWebhookUrl();
    console.log(webhook);
    console.log("task : ", task);
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#50F9A4"
    );
    const request = require("request-promise");
    const fetch = require("node-fetch");
    const fs = require("fs");
    const tough = require("tough-cookie");
    const delay = require("delay");
    const faker = require("faker");

    const login = require("./login");

    class amazon {
      constructor(account, ASIN, OID, delays, webhook) {
        this.accountDetails = account;

        this.ASIN = ASIN;

        this.OID = OID;

        this.delays = delays;

        this.webhook = webhook;

        this.jar = request.jar();

        this.ua = faker.internet.userAgent();

        this.request = request.defaults({
          followAllRedirects: true,
          resolveWithFullResponse: true,
          jar: this.jar,
          withCredentials: true,
        });

        this.taskData = {
          product: {
            name: null,
            OID: OID,
            image: null,
            price: null,
          },
        };

        this.flow();
      }

      async flow() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        let checkout = 0;
        await this.prepare();
        try {
          while (checkout == 0) {
            // let monitorState = await this.monitor();
            // while (!monitorState) {
            //   await delay(this.delays.monitor);
            //   monitorState = await this.monitor();
            // }
            this.loginre = 1;
            this.s = Date.now();
            try {
              let cart = 0;
              this.cart = cart;
              try {
                //CLOUD MONITORING
                let monitors = 0;
                this.monitors = monitors;

                //ATC
                let carted = 0;
                this.carted = carted;
                while (this.carted == 0) {
                  await this.initiateCheckout(); //atc

                  //SUBMIT WITH CALL BACK TO ATC
                  while (this.carted == 1) {
                    await this.getCheckout();
                    let co = 0;
                    this.co = co;
                    await this.submitCheckout(); //should be a W or L
                    if (this.carted == 2) {
                      await this.prepare();
                    }
                  }
                }
              } catch (e) {}
            } catch (e) {}
          }
        } catch (e) {
          console.log("restarting");
        }
      }

      async prepare() {
        if (fs.existsSync(`${this.accountDetails.email}.json`)) {
          const loginCookies = JSON.parse(
            fs.readFileSync(`${this.accountDetails.email}.json`, "utf8")
          );
          console.log(loginCookies);
          Object.entries(loginCookies).forEach((cookie) => {
            this.jar.setCookie(
              new tough.Cookie({
                key: cookie[0],
                value: cookie[1],
                domain: "amazon.com",
              }),
              `https://amazon.com`
            );
          });
        } else {
          console.log("Refreshing login");

          await login(this.accountDetails, this.jar, this.ua);
        }
        this.loginre = this.loginre + 1;
      }

      async monitor() {
        let state;

        console.log(`Monitoring ${this.ASIN}`);

        try {
          const resp = await this.request({
            method: "GET",
            url: "https://www.amazon.com/portal-migration/aod",
            qs: {
              asin: this.ASIN,
            },
            headers: {
              accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-encoding": "identity",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "max-age=0",
              "if-modified-since": "Mon, 26 Apr 2021 16:10:06 GMT",
              "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
              "sec-ch-ua-mobile": "?0",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "none",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1",
              "user-agent": this.ua,
            },
          });

          this.taskData.product = {
            name: html
              .split(
                '<h5 id="aod-asin-title-text" class="aod-asin-title-text-class">'
              )[1]
              .split("</h5>")[0]
              .replace(/(\r\n|\n|\r)/gm, ""),
            price: html.split('class="a-offscreen">')[1].split("<")[0],
            image: html
              .split('<img alt="" src="')[1]
              .split('" id="aod-asin-image-id"')[0],
          };

          state = true;
        } catch (e) {
          state = false;

          if (!(await this.handleError(e))) {
            console.log("Error monitoring");
          }

          await delay(this.errorDelay);
        }

        return state;
      }

      async cloud() {
        const resp = await this.request({
          method: "GET",
          url: `https://cloudapii.herokuapp.com/amazonapi`,
        });

        const data = JSON.parse(resp.body);

        const availableSKUList = data.filter(
          (_) => 20 >= (Date.now() - _.timestamp) / 1000
        );
        if (Number(availableSKUList.length) > 0) {
          const thesku2 = JSON.stringify(availableSKUList);
          const mm = thesku2.split(`,`);
          console.log(mm);
          if (thesku2.toLowerCase().includes("0")) {
            const price = mm[3].replace(`"price":"`, "").replace(`"`, "");
            this.price = price;
            console.log(price);

            if (Number(this.price) < Number("14444")) {
              const thesku = mm[1].replace(`"sitesku":"`, "").replace(`"`, "");
              console.log(thesku);
              this.ASIN = thesku;
              //SKU

              const offerid = mm[0]
                .replace(`[{"offerid":"\\"`, "")
                .replace(`\\""`, "");
              this.OID = offerid;
              //OFFERID

              this.monitors = 1;
              this.retry = 20;
              console.log(this.monitors);
            }
          }
        }
        console.log(this.monitors);
      }

      async coupon() {
        const options = {
          method: "POST",
          url: "https://www.amazon.com/gp/buy/spc/handlers/add-giftcard-promotion.html/ref=ox_pay_page_gc_add",
          headers: {
            "Accept-Encoding": "identity",
            "User-Agent": this.ua,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "identity",
            "Accept-Language": "en-US,en;q=0.5",
            Referer: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.thesku}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            TE: "trailers",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            cookie:
              'aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-target-static-id=1587083778506-611983; aws-target-data=%7B%22support%22%3A%221%22%7D; s_fid=4524CEAC41A653AC-0E6B321CFD79A919; ubid-main=130-9939383-8398064; aws-target-visitor-id=1587083778511-133740.35_0; regStatus=registering; aws-ubid-main=666-2317524-8157251; x-amz-captcha-1=1619251514827903; x-amz-captcha-2=deZrp32+0uUXKYqro1WwRQ==; lc-main=en_US; s_vnum=2038195881086%26vn%3D3; s_nr=1630518673173-Repeat; s_dslv=1630518673174; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiZWY3NDhlIiwia2V5IjoiZzZCRzhxeGZGT1dzVWlpdnRaSHUxdCswL3QwRi9tbXlVZFg2TytqeXVJNUc3WCtuMnlqcVpvdXRXRlBsNGEvV2tGalI5ajRhK3MrYnZpSS9raVNSWFNGZTIyTURNbzg0bVhROFV1NCtpcjVzdWFxNmFZYXJCRTFJcTBPMnd2U3lnR1pRRktJVko4NkkwYjZxKzFtWkF4WEM3em0yN2h1N2hzOXJsTHFlUWZxYTRRa1QzWWNDaHdOU0ROMCthRGxTaHhMZjRKYVA0SitpVnQxNlZ2NVhidDd2UmVDODUvSWp5TnZ5VUVNd0szNHJ5Y3JGN2MzSHNWQXM1TGJWVU1vUGtuN3dKY0pUT1FCaDZQR0thRU4zcGRsQ0RMV0E0SGFlRWNITDJpajR4N2F4YnlYZ3J1bWdsM1VmWDdIUFh6OTJhT2VjdWlxZXNXUEpLOS9Vd2NKclZnPT0ifQ==; x-main="ax9wbupKpCzoEh3PY7kqJdcls@Frq1W4CkRygQMKadkd0pk0Jz4fd?iMDNbqLU8M"; at-main=Atza|IwEBIFQOCBofGOHvafMd07xNTihF4mX1eqe5WF9SuQKWIOXew19uR2znPhORV0PCrRKHgumck13MtrpXnGjme-7kqcEpEA_m_GNwfvwA4t-mAz0fBikeKQhMcJk_0tBkHeClYciaz_kA_f6Mg0bzMAomT9ZDJO562wAevt0Nt5AkALhop4fAOxJo-4306nigagSkBLHg9EsqST3wKkj6AtTAwWDd; sess-at-main="F9rDv3GS44jGELwwOhP2PP23d+I+UYHgF7vda2vtitc="; sst-main=Sst1|PQFJvDOg2wBsuzz29pBctJyVCUc1AzrspnSJzaFRd2TQh-mPyrXDrYz6uUdxVKPh3GFv9taYGSZ9XWzr2xxH6Lf_pn5Hx_AYn5RGBXvsIr3-qIemzxHqP3NBgqylsCLiV239V3s43B5veDU-sV1a8N-Qa9HZ2OwwxJkoC8VT84bdbqJUuHPwjUshrzWofa6UwitTMpENp6X7TVbt-oI6w3MWeJXQxdfWIIYVpp8t4A0hbgtvgsg23-TqzjBfTpBbJXzgGkv7yKh3drxSVZI3kfLdjq7ZwvM3g7GCfrtgZmxE4LM; session-id-time=2082787201l; i18n-prefs=USD; session-id-apay=260-0514690-1580011; session-id=139-8777044-2954127; session-token="iMxIHCJNdwTZTO0Y6ACZ9PbsU3D5ZFDW5q0IE6jcV1wfUk+S3m2b2V/JgdOi2vj/XFtOSxRxrv8Z7iC0VFU5du2Qdsjbzx1o2l61YqJHgHwEPDomGJmiTvkJyEjU2VPDu0dqblINUE1+ea0m1Qt1Ssd3ZhvhYaL8WL3jT8mZVGo7Sjcb3m8OafaTBW8s/i0wJu4SUmbW7dPwDb8tiWWlkQ=="; csm-hit=tb:6BQA27TS6ZDEWMHWE3TE+s-KD1BNRWHS3FAJ8TPSJP5|1631318490314&t:1631318490314&adb:adblk_no',
          },
          form: {
            claimcode: `${this.code}`,
            disablegc: "",
            returnjson: "1",
            returnFullHTML: "1",
            hasWorkingJavascript: "1",
            fromAnywhere: "0",
          },
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          //.console.log(body2);his.co = 1
        });
      }

      async initiateCheckout() {
        let state;

        console.log("Adding to cart");

        try {
          const cookies = this.jar.getCookieString("https://amazon.com");

          this.verificationSessionID = cookies
            .split("session-id=")[1]
            .split(";")[0];

          const resp = await this.request({
            method: "GET",
            url: `https://www.amazon.com/gp/aws/cart/add.html?&OfferListingId.1=${this.OID}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
            headers: {
              "User-Agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "identity",
              "Accept-Language": "en-US,en;q=0.5",
              Referer: `https://www.amazon.com/gp/aws/cart/add.html?&ASIN.1=${this.ASIN}&Quantity.1=1&SessionId=${this.verificationSessionID}&confirmPage=confirm`,
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              "Sec-Fetch-User": "?1",
              TE: "trailers",
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
            },
          });

          this.cartId = Date.now();

          const html = resp.body;

          if (html.toLowerCase().includes("cart is empty")) {
            console.log("Product OOS");

            this.carted = 0;
            this.retry = this.retry - 1;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
            return state;
          }
          this.PID = html.match(
            new RegExp('currentPurchaseId":"(.*)","pipelineType')
          );

          this.csrfT = html.match(
            new RegExp(`anti-csrftoken-a2z' value='(.*)' /></head>`)
          );
        } catch (e) {
          this.carted = 0;

          if (!(await this.handleError(e))) {
            console.log("Error adding to cart");
            this.carted = 0;
            this.retry = this.retry - 1;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
          }

          await delay(this.errorDelay);
        }
        this.carted = 1;
        return state;
      }

      async getCheckout() {
        let state;

        console.log("Getting checkout");

        try {
          const resp = await this.request({
            method: "POST",
            url: "https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sc_proceed",
            qs: {
              isToBeGiftWrappedBefore: "0",
              proceedToRetailCheckout: "Proceed to checkout",
              proceedToCheckout: "1",
              cartInitiateId: this.cartInitiateId,
            },
            headers: {
              authority: "www.amazon.com",
              rtt: "50",
              downlink: "10",
              ect: "4g",
              "sec-ch-ua":
                '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
              "sec-ch-ua-mobile": "?1",
              "upgrade-insecure-requests": "1",
              dnt: "1",
              "user-agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Encoding": "identity",
              "sec-fetch-site": "same-origin",
              "sec-fetch-mode": "navigate",
              "sec-fetch-user": "?1",
              "sec-fetch-dest": "document",
              referer: "https://www.amazon.com/gp/cart/view.html?ref_=nav_cart",
              "accept-language": "en-US,en;q=0.9,ar-SY;q=0.8,ar;q=0.7",
            },
          });

          this.body = resp.body;
          //console.log(this.body)
          this.carted = 1;
        } catch (e) {
          console.log("Error getting checkout");
          this.carted = 0;
        }

        return state;
      }

      async submitCheckout() {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        let state;

        console.log("Submitting checkout");

        if (this.body.toLowerCase().includes("no longer available")) {
          console.log("Product OOS");
          this.retry = this.retry - 1;
          console.log(this.retry);
          if (0 > Number(this.retry)) {
            this.monitors = 0;
          }
          this.carted = 0;
          return false;
        }
        try {
          // const fasttrackExpiration = this.body.split('name="fasttrackExpiration" value="')[1].split('"')[0];
          //const countdownThreshold = this.body.split('name="countdownThreshold" value="')[1].split('"')[0];
          //const showSimplifiedCountdown = this.body.split('name="showSimplifiedCountdown" value="')[1].split('"')[0];
          // const shippingofferingid0 = this.body.split('name="shippingofferingid0.0" value="')[1].split('"')[0];
          // const dupOrderCheckArgs = this.body.split('name="dupOrderCheckArgs" value="')[1].split('"')[0];
          // const shippingofferingid01 = this.body.split('name="shippingofferingid0.1" value="')[1].split('"')[0];
          const previousshippingofferingid0 = this.body
            .split('name="previousshippingofferingid0" value="')[1]
            .split('"')[0];
          const lineitemids0 = this.body
            .split('name="lineitemids0" value="')[1]
            .split('"')[0];
          const shiptrialprefix = this.body
            .split('name="shiptrialprefix" value="')[1]
            .split('"')[0];
          const csrfToken = this.body
            .split('name="csrfToken" value="')[1]
            .split('"')[0];
          const purchaseTotal = this.body
            .split('name="purchaseTotal" value="')[1]
            .split('"')[0];
          const purchaseTotalCurrency = this.body
            .split('name="purchaseTotalCurrency" value="')[1]
            .split('"')[0];
          const purchaseID = this.body
            .split('name="purchaseID" value="')[1]
            .split('"')[0];
          const purchaseCustomerId = this.body
            .split('name="purchaseCustomerId" value="')[1]
            .split('"')[0];
          const scopeId = this.body
            .split('name="scopeId" value="')[1]
            .split('"')[0];
          //const promiseAsin = this.body.split('name="promiseAsin-0" value="')[1].split('"')[0];
          const selectedPaymentPaystationId = this.body
            .split('name="selectedPaymentPaystationId" value="')[1]
            .split('"')[0];

          const options = {
            method: "POST",
            url: "https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html/ref=ox_spc_place_order",
            qs: {
              partialCheckoutCart: "1",
              isToBeGiftWrappedBefore: "0",
              proceedToRetailCheckout: "Proceed to checkout",
              proceedToCheckout: "1",
              cartInitiateId: this.cartId,
            },
            headers: {
              "User-Agent": this.ua,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Content-Type": "application/x-www-form-urlencoded",
              Origin: "https://www.amazon.com",
              Connection: "keep-alive",
              Referer:
                "https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1",
              "Upgrade-Insecure-Requests": "1",
              TE: "Trailers",
            },
            form: {
              submitFromSPC: "1",
              // fasttrackExpiration: fasttrackExpiration,
              //countdownThreshold: countdownThreshold,
              //showSimplifiedCountdown: showSimplifiedCountdown,
              countdownId: "countdownId-0",
              //'quantity.A0934985K7TVIYW58IQ8%3A': '1',
              // dupOrderCheckArgs: dupOrderCheckArgs,
              order0: "next-1dc",
              // 'shippingofferingid0.0': shippingofferingid0,
              "guaranteetype0.0": "GUARANTEED",
              "issss0.0": "0",
              "shipsplitpriority0.0": "shipWhenever",
              "isShipWhenCompleteValid0.0": "0",
              "isShipWheneverValid0.0": "1",
              // 'shippingofferingid0.1': shippingofferingid01,
              "guaranteetype0.1": "GUARANTEED",
              "issss0.1": "0",
              "shipsplitpriority0.1": "shipWhenever",
              "isShipWhenCompleteValid0.1": "0",
              "isShipWheneverValid0.1": "1",
              previousshippingofferingid0: previousshippingofferingid0,
              previousguaranteetype0: "GUARANTEED",
              previousissss0: "0",
              previousshippriority0: "shipWhenever",
              lineitemids0: lineitemids0,
              currentshippingspeed: "next-1dc",
              previousShippingSpeed0: "next-1dc",
              currentshipsplitpreference: "shipWhenever",
              "shippriority.0.shipWhenever": "shipWhenever",
              groupcount: "1",
              shiptrialprefix: shiptrialprefix,
              csrfToken: csrfToken,
              fromAnywhere: "0",
              redirectOnSuccess: "0",
              purchaseTotal: purchaseTotal,
              purchaseTotalCurrency: purchaseTotalCurrency,
              purchaseID: purchaseID,
              purchaseCustomerId: purchaseCustomerId,
              useCtb: "1",
              scopeId: scopeId,
              isQuantityInvariant: "",
              //'promiseTime-0': promiseTime,
              //'promiseAsin-0': promiseAsin,
              selectedPaymentPaystationId: selectedPaymentPaystationId,
              hasWorkingJavascript: "1",
              placeYourOrder1: "1",
              isfirsttimecustomer: "0",
              isTFXEligible: "",
              isFxEnabled: "",
              isFXTncShown: "",
            },
          };

          const resp = await this.request(options);

          this.checkoutTime = `${(Date.now() - this.s) / 1000}s`;

          if (199 < resp.statusCode < 210) {
            console.log("Order placed");
            this.carted = 2;
            this.cardSuccess();
          } else {
            console.log("Order failed");
            this.cardDecline();
          }

          state = true;
        } catch (e) {
          this.checkoutTime = `${(Date.now() - this.s) / 1000}s`;

          if (this.body.includes("Sign-In")) {
            console.log("Login expired");
            console.log(this.loginre);
            this.loginre = this.loginre - 1;
            if (Number(this.loginre) < 0) {
              await login(this.accountDetails, this.jar, this.ua);
              this.loginre = this.loginre + 2;
              await sleep(1500);
            }

            this.retry = this.retry - 3;
            console.log(this.retry);
            if (0 > Number(this.retry)) {
              this.monitors = 0;
            }
            this.carted = 0;
          } else {
            console.log(e);
          }

          console.log("Error submitting checkout - OOS");

          this.cardDecline();

          this.carted = 0;
        }

        return state;
      }

      async cardSuccess() {
        let state;

        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "🐘 Successful Checkout!",
                  url: `https://www.amazon.com/dp/${this.ASIN}`,
                  color: 3066993,
                  fields: [
                    {
                      name: "Site",
                      value: "Amazon US",
                      inline: true,
                    },
                    {
                      name: "Proxy",
                      value: `||${this.proxy ? this.proxy : "None"}||`,
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: "Safe",
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
              username: "PolygonAIO",
              avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
            }),
          });

          const resp1 = await fetch(
            "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: null,
                embeds: [
                  {
                    title: "🐘 Successful Checkout!",
                    url: `https://www.amazon.com/dp/${this.ASIN}`,
                    color: 3066993,
                    fields: [
                      {
                        name: "Site",
                        value: "Amazon US",
                        inline: true,
                      },
                      {
                        name: "Proxy",
                        value: `||${this.proxy ? this.proxy : "None"}||`,
                        inline: true,
                      },
                      {
                        name: "Mode",
                        value: "Safe",
                        inline: true,
                      },
                      {
                        name: "Time Elapsed",
                        value: `${this.checkoutTime}`,
                        inline: true,
                      },
                    ],
                    footer: {
                      text: "Polygon AIO",
                      icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
                username: "PolygonAIO",
                avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
              }),
            }
          );

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                console.log("Error sending webhook 💔");
                break;
              case 404:
                console.log("Webhook doesn't exist 💔");
                break;
              case 429:
                console.log("Rate limited 💔");
                break;
              case 502:
                console.log("Discord server error 💔");
                break;
              default:
                console.log("Error:", e.response.status);
            }
          } else {
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async cardDecline() {
        let state;

        try {
          const resp = await fetch(this.webhook, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: null,
              embeds: [
                {
                  title: "Checkout Failure :x:",
                  url: `https://www.amazon.com/dp/${this.ASIN}`,
                  color: 15158332,
                  fields: [
                    {
                      name: "Site",
                      value: "Amazon US",
                      inline: true,
                    },
                    {
                      name: "Proxy",
                      value: `||${this.proxy ? this.proxy : "None"}||`,
                      inline: true,
                    },
                    {
                      name: "Mode",
                      value: "Safe",
                      inline: true,
                    },
                    {
                      name: "Time Elapsed",
                      value: `${this.checkoutTime}`,
                      inline: true,
                    },
                  ],
                  footer: {
                    text: "Polygon AIO",
                    icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
              username: "PolygonAIO",
              avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
            }),
          });

          const resp1 = await fetch(
            "https://discord.com/api/webhooks/877957375460532234/jgGhS54cRCbX_rvfEF7oTTDEOaXb8NnVqkf3RUtsFYbRIwK6a_IEVVK6AMq6yZdm9g0L",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: null,
                embeds: [
                  {
                    title: "Checkout Failure :x:",
                    url: `https://www.amazon.com/dp/${this.ASIN}`,
                    color: 15158332,
                    fields: [
                      {
                        name: "Site",
                        value: "Amazon US",
                        inline: true,
                      },
                      {
                        name: "Mode",
                        value: "Safe",
                        inline: true,
                      },
                      {
                        name: "Time Elapsed",
                        value: `${this.checkoutTime}`,
                        inline: true,
                      },
                    ],
                    footer: {
                      text: "Polygon AIO",
                      icon_url: "https://i.imgur.com/J6ZyYwa.gif",
                    },
                    timestamp: new Date().toISOString(),
                  },
                ],
                username: "PolygonAIO",
                avatar_url: "https://i.imgur.com/J6ZyYwa.gif",
              }),
            }
          );

          state = true;
        } catch (e) {
          state = false;
          if (typeof e.response !== "undefined") {
            switch (e.response.status) {
              case 400:
                console.log("Error sending webhook 💔");
                break;
              case 404:
                console.log("Webhook doesn't exist 💔");
                break;
              case 429:
                console.log("Rate limited 💔");
                break;
              case 502:
                console.log("Discord server error 💔");
                break;
              default:
                console.log("Error:", e.response.status);
            }
          } else {
            console.log(e);
            console.log("Error sending webhook");
          }
          await delay(this.errorDelay);
        }

        return state;
      }

      async handleError(e) {
        let state;

        if (typeof e.response !== "undefined") {
          state = true;

          switch (e.response.status) {
            case 400:
              console.log("Payload error");
              break;
            case 401:
              console.log("Blocked");
              break;
            case 404:
              console.log("Product not found");
              break;
            case 407:
              console.log("Proxy authentication missing");
              break;
            case 408:
              console.log("Slow proxy");
              break;
            case 429:
              console.log("Rate limited");
              break;
            case 500:
              console.log("Server error");
              break;
            default:
              console.log("Error:", e.response.statusCode);
              break;
          }
        } else {
          state = false;
        }

        return state;
      }
    }

    new amazon(
      {
        email: `${task.profile.shipEmail}`,
        password: `${task.taskColor}`,
      },
      `${task.taskColor}`,
      `${task.taskMonitorInput}`,
      {
        error: 3333,
        monitor: 3333,
      },
      "https://discord.com/api/webhooks/836729091054239755/JpYCDpMRvuSTXdSwtWVtFUORjfws2Os0Rj5EvXng4LCOLZHSiiFbo4NFFxXEGs2ul1Pt"
    );
  },
  BestBuy: async (taskId, task) => {
    document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    siteFunctionsObj.setStatus(
      `taskStatus_${taskId}`,
      "Starting Task",
      "#50F9A4"
    );
    document.getElementById(`taskStatus_${taskId}`);
    const browser = await firefox.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: false,
    });
    const page = await browser.newPage();

    /** Event For Stop Task */
    eventEmmiter.on(`stopTask_${taskId}`, () => {
      if (page !== undefined && page !== null) {
        page.close();
      }
      if (browser !== undefined && browser !== null) {
        browser.close();
      }
      siteFunctionsObj.stopTask(taskId);
    });

    var flag = 0;
    while (flag == 0) {
      if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
        /** Check If Task Not Running Then Exit Task Handle */
        return;
      }
      //      await page.setViewportSize({
      //      width: 84,
      //    height: 68,
      // });
      try {
        await page.goto(
          "https://www.bestbuy.com/site/CopBoxAIO/" +
            task.taskMonitorInput +
            ".p"
        );
        await siteFunctionsObj.sleep(1990);
        try {
          let oos = await page.$(
            ':is(button:has-text("Sold Out"), button:has-text("Not Available"))'
          );
          while (oos) {
            if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
              /** Check If Task Not Running Then Exit Task Handle */
              return;
            }
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "😶 OOS Waiting..",
              "#A3FDFD"
            );
            await page.click(
              ':is(button:has-text("Sold Out"), button:has-text("Not Available"))'
            );
            await page.reload();
            await siteFunctionsObj.sleep(4444);
          }
        } catch (e) {}
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "🥰 Product loaded",
          "#A3FDFD"
        );
        await page.reload();
        await page.click(".fulfillment-add-to-cart-button");
        await siteFunctionsObj.sleep(1111);
        try {
          await page.setDefaultTimeout(3540);
          let near = await page.$("text=Update Location");
          while (near) {
            if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
              /** Check If Task Not Running Then Exit Task Handle */
              return;
            }
            await page.click("text=Update Location");
            await siteFunctionsObj.sleep(4444);
            await page.click("text=Add to Cart");
            await siteFunctionsObj.sleep(1111);
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🙃 Waiting Token",
              "#A3FDFD"
            );
          }
        } catch (e) {}
        try {
          let token = await page.$(".fulfillment-add-to-cart-button");
          while (token) {
            if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
              /** Check If Task Not Running Then Exit Task Handle */
              return;
            }
            siteFunctionsObj.setStatus(
              `taskStatus_${taskId}`,
              "🙃 Waiting Token",
              "#A3FDFD"
            );
            await page.click(".fulfillment-add-to-cart-button");
            await siteFunctionsObj.sleep(1111);
          }
        } catch (e) {}
        await page.goto("https://www.bestbuy.com/cart");
        await page.setViewportSize({
          width: 1984,
          height: 1668,
        });
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "😍 Carted!",
          "#A3FDFD"
        );

        const hook = new Webhook(
          "https://discord.com/api/webhooks/847496712964014101/9PrNAu_Cs1Q67i0qMvEVNLjbyiYKeKsvzX0V8YMH2LymBCSCNTwM5M8-2CdwkutXtof9"
        );
        const embed = new MessageBuilder()
          .setTitle(`**CopBoxAIO Success! 🥳**`)
          .setAuthor(
            "CopBoxAIO",
            "https://pbs.twimg.com/profile_images/1413589729019314179/UBLMQaqt_400x400.jpg"
          )
          .setURL(
            "https://bestbuy.com/copboxaio/" +
              task.taskMonitorInput +
              ".p?skuid-" +
              task.taskMonitorInput
          )
          .addField(
            "Bestbuy Success!",
            "A user cooked " + task.taskMonitorInput + " :fire:",
            true
          )
          .setColor("#f3bfb3")
          .setThumbnail(
            "https://pbs.twimg.com/profile_images/1413589729019314179/UBLMQaqt_400x400.jpg"
          )
          .setDescription(":rocket: Very exited to announce a")
          .setImage(
            "https://pbs.twimg.com/profile_images/1413589729019314179/UBLMQaqt_400x400.jpg"
          )
          .setFooter(
            "@CopBoxAIO Success :fire:",
            "https://pbs.twimg.com/profile_images/1413589729019314179/UBLMQaqt_400x400.jpg"
          )
          .setTimestamp();

        hook.send(embed);
        await siteFunctionsObj.sleep(99999);

        //OTHER FUNCTION
        /** Event For Stop Task */
        eventEmmiter.on(`stopTask_${taskId}`, () => {
          if (page !== undefined && page !== null) {
            page.close();
          }
          if (browser !== undefined && browser !== null) {
            browser.close();
          }
          siteFunctionsObj.stopTask(taskId);
        });
        await page.setViewportSize({
          width: 84,
          height: 68,
        });
        request.open(
          "POST",
          "https://discord.com/api/webhooks/829218822296174613/wMMexq8yE5Httqa_R8e8Yht9WON1z103sLpaLNnm3mb7Mh0jLCQ9ldhBVGfDwlSdocQ9",
          true
        );
        request.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        request.send(
          JSON.stringify({
            content:
              "**Elephant Runer for**" +
              task.taskMonitorInput +
              " Hope they cook! <3 :)",
          })
        );
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          "Logging in",
          "#A3FDFD"
        );
        await page.goto("http://bestbuy.com/login");
        await page.type("#fld-e", task.profile.shipEmail);
        await page.type("#fld-p1", task.profile.shipEmail);
        if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
          /** Check If Task Not Running Then Exit Task Handle */
          return;
        }
        await page.click(
          ':is(button:has-text("Log in"), button:has-text("Sign in"))'
        );
        await siteFunctionsObj.sleep(5555);
        await page.goto("http://bestbuy.com/cart");
        await siteFunctionsObj.sleep(2222);
        a = {
          items: [
            {
              skuId: task.taskMonitorInput,
            },
          ],
        };
        a = a;
        let incart = 0;

        try {
          while (incart == 0) {
            try {
              if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
                /** Check If Task Not Running Then Exit Task Handle */
                return;
              }
              await page.evaluate((x) => {
                fetch("/cart/api/v1/addToCart", {
                  method: "POST",
                  body: JSON.stringify(x),
                  headers: {
                    "User-Agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0",
                    Accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                });
              }, a);
              var finalResponse = await page.waitForResponse(
                (response) =>
                  response.url() ===
                    "https://www.bestbuy.com/cart/api/v1/addToCart" &&
                  response.status()
              );
              var code = finalResponse.status();
              var test = code.toString();
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "🙃 Waitng for token" + test,
                "#A3FDFD"
              );
              await page.reload();
              await siteFunctionsObj.sleep(333);
            } catch (e) {
              break;
            }
            if (test == "200") {
              let incart = 1;
              await page.setViewportSize({
                width: 1840,
                height: 1680,
              });
              var request = new XMLHttpRequest();
              request.open(
                "POST",
                "https://discord.com/api/webhooks/777016423356170250/AMOtIW5zY--W8Pbsw-Z3mIiExMYCXHXTLfxYQyyd95bC3sWiL2v6RC643GislOGe6UNt"
              );
              // again, replace the url in the open method with yours
              request.setRequestHeader(
                "Content-Type",
                "application/json;charset=UTF-8"
              );

              var myEmbed = {
                author: {
                  name: "CopBoxAIO Success",
                  avatarURL:
                    "https://pbs.twimg.com/profile_images/1366407963435560962/3qsLxc7t_400x400.jpg",
                },
                title: "BestBuy",
                description:
                  "Successfully checked out " +
                  "https://www.bestbuy.com/site/CopBoxAIO/" +
                  task.taskMonitorInput +
                  ".p",
                color: hexToDecimal("#77D6FF"),
              };

              var params = {
                username: "CopBoxAIO Success",
                embeds: [myEmbed],
              };
              request.send(JSON.stringify(params));

              // function that converts a color HEX to a valid Discord color
              function hexToDecimal(hex) {
                return parseInt(hex.replace("#", ""), 16);
              }
              await page.setDefaultTimeout(35040);
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "😜 Proccessing order!",
                "#A3FDFD"
              );
              await page.goto("https://www.bestbuy.com/checkout/r/fulfillment");
              await siteFunctionsObj.sleep(1111);
              page.click("text=Switch to Shipping");
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "✔️ Needs Manual Checkout!",
                "#A3FDFD"
              );
              await siteFunctionsObj.sleep(3333);
              await page.click(
                "/html/body/div[1]/div[2]/div/div[2]/div[1]/div[1]/main/div[2]/div[2]/form/section/div/div[1]/div/div/section/div[2]/div[1]/section/section/div[1]/label/div"
              );
              siteFunctionsObj.setStatus(
                `taskStatus_${taskId}`,
                "3",
                "#A3FDFD"
              );
              await page.type(
                "#consolidatedAddresses.ui_address_2.firstName",
                task.profile.shipFirstName
              );
              await page.type(
                '//*[@id="consolidatedAddresses.ui_address_2.lastName"]',
                task.profile.shipLastName
              );
              await page.click(".autocomplete__toggle");
              await page.type(
                '//*[@id="consolidatedAddresses.ui_address_2.street"]',
                task.profile.shipAddress + task.profile.shipAddress2
              );
              await page.type(
                '//*[@id="consolidatedAddresses.ui_address_2.city"]',
                task.profile.shipCity
              );
              await page.selectOption(
                "#consolidatedAddresses.ui_address_2.state",
                task.profile.shipState
              );
              await page.type(
                "#consolidatedAddresses.ui_address_2.zipcode",
                task.profile.shipZipCode
              );
              await page.type("#user.phone", task.profile.shipPhone);
              await page.click(".btn btn-lg btn-block btn-secondary");
              await siteFunctionsObj.sleep(5555);
              await page.type(
                "#optimized-cc-card-number",
                task.profile.profileCardNo
              );
              await page.selectOption(
                ".c-dropdown v-medium c-dropdown v-medium smart-select",
                task.profile.profileExpMonth
              );
              await page.selectOption(
                ".c-dropdown v-medium c-dropdown v-medium smart-select",
                "20" + task.profile.profileExpYear
              );
              await page.type("#credit-card-cvv", task.profile.profileCVV);
            }
          }
        } catch (e) {}
        if (!siteFunctionsObj.isTaskRunning(`taskStatus_${taskId}`)) {
          /** Check If Task Not Running Then Exit Task Handle */
          return;
        }
      } catch (err) {
        siteFunctionsObj.setStatus(
          `taskStatus_${taskId}`,
          err.message,
          "#FF0000"
        );
        //siteFunctionsObj.setStatus(`taskStatus_${taskId}`, err, "#50F9A4");
      }
    }
  },
};
module.exports = siteFunctionsObj;
