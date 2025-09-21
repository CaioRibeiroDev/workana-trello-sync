import puppeteer from 'puppeteer';

export async function getProjects() {
  const browser = await puppeteer.launch({
    headless: true,  
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // await page.goto("https://www.workana.com/login")
  await page.goto("https://www.workana.com/jobs?language=pt")
  await page.type("#email-input", process.env.WORKANA_EMAIL!);
  await page.type("#password-input", process.env.WORKANA_PASSWORD!);
  await page.click("button[type=submit]");
  
  await page.goto("https://www.workana.com/jobs")

  const projects = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".project-item")).map((el) => ({
      title: el.querySelector(".project-title")?.textContent?.trim(),
      link: el.querySelector("a")?.getAttribute("href"),
      budget: el.querySelector(".budget")?.textContent?.trim(),
      description: el.querySelector(".project-details")?.textContent?.trim(),
    }));
  });

  await browser.close();
  return projects;
}
