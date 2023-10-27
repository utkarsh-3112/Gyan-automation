import { By, Builder, Select, logging } from "selenium-webdriver";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
async function script() {
  let driver = await new Builder().forBrowser("chrome").build();
  // await driver.manage().setTimeouts({ implicit: 2000 });
  await driver.get("https://iris.nitk.ac.in/gyan");
  const username = await driver.findElement(By.id("user_login"));
  const password = await driver.findElement(By.id("user_password"));
  await username.sendKeys(process.env.USER_NAME);
  await password.sendKeys(process.env.PASSWORD);
  // press enter
  await password.sendKeys("\n");
  // await driver.findElement(By.className("btn-primary")).click();
  // await driver.findElement(By.className("lnr-graduation-hat")).click();
  // await driver.findElement(By.linkText("Gyan")).click();
  let button_element = await driver.findElement(
    By.xpath(
      "//td[text()='Placements']/following-sibling::td/a[contains(@class, 'btn-primary')]"
    )
  );
  await button_element.click();
  const companyName = await driver.findElement(By.id("filterrific_company"));
  await companyName.sendKeys("Amazon");
  const department = await driver.findElement(By.id("filterrific_department"));
  const select = new Select(department);
  await select.selectByVisibleText("All");
  await driver.findElement(By.css("input.btn.btn-primary")).click();
  let gyanLinks = [];
  while (true) {
    try {
      let next = await driver
        .findElement(By.linkText("Next ›"))
        .getAttribute("href");
      let views = await driver.findElements(By.linkText("View"));
      for (let view of views) {
        gyanLinks.push(await view.getAttribute("href"));
      }
      await driver.navigate().to(next);
    } catch (e) {
      let views = await driver.findElements(By.linkText("View"));
      for (let view of views) {
        gyanLinks.push(await view.getAttribute("href"));
      }
      break;
    }
  }
  console.log(gyanLinks);
  let allGyan = "";
  for (let link of gyanLinks) {
    await driver.navigate().to(link);
    let gyan = await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[3]/div/div[1]/div[2]/div[2]/div[2]/div[2]/div/div[2]/div[4]/div[2]"
        )
      )
      .getText();
    if (
      !gyan.includes("Please refer to my internship gyan:") &&
      !gyan.includes("PPO") &&
      !gyan.includes("Refer internship Gyan")
    ) {
      allGyan = allGyan + "\n\n" + gyan;
    }
  }
  console.log(allGyan);
  fs.writeFile("output.txt", allGyan, (err) => {
    if (err) throw err;
    console.log("File has been saved!");
  });
}

script();
