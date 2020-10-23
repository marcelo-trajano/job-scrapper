const puppeteer = require("puppeteer");
const Positions = require("./Positions");
const mongoose = require("mongoose");
const moment = require("moment");
const cheerio = require("cheerio");
const request = require("request");
const SearchTerm = require("./SearchTerm");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36";

require("dotenv").config();
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const searchTerms = [
  //{ term: "react", code: "R", label: "React" },
  //{ term: "javascript", code: "JS", label: "JavaScri" },
  //{ term: "react+native", code: "RN", label: "React Native" },
  { term: "node+java", code: "NJ", label: "Node + Java" },
  { term: "typescript", code: "TS", label: "TypeScript" },
  { term: "Spring+boot", code: "SB", label: "Spring Boot" },
  //{ term: "java", code: "J", label: "Java" },
  //{ term: "ingles+fluente", code: "EN", label: "Inglês Fluente" },
  //{ term: "flutter", code: "FT", label: "Flutter" },
  //{ term: "node", code: "NJS", label: "Node.js" },
  //{ term: "engenheiro+de+vendas", code: "ENV", label: "Eng. de Vendas" },
  //{ term: "pre+venda", code: "PRV", label: "Pre-Vendas" },
  //{ term: "pre+sales", code: "PSLS", label: "Pre Sales" },
  //{ term: "GraphQL", code: "GQL", label: "GraphQL" },
];

const loadData = async (searchTerms) => {
  searchTerms.forEach(async (searchTerm) => {
    let URL = `https://www.indeed.com.br/empregos?q=${searchTerm.term}&l=Brasil&sort=date`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.goto(URL);

    const [jobs] = await page.$x(`//*[@id="searchCountPages"]`);

    if (jobs !== undefined) {
      const jobstext = await jobs.getProperty(`textContent`);
      let text = await jobstext.jsonValue();
      let positions = text.trim();
      let s1 = positions.indexOf("de ");
      let s2 = positions.lastIndexOf("vagas");
      var txt = positions.slice(s1 + 2, s2);
      var numb = txt.match(/\d/g);
      numb = numb.join("");

      const Search = await SearchTerm.create({
        searchTerm: searchTerm.term,
        code: searchTerm.code,
        numberOfJobs: numb,
        label: searchTerm.label,
        insertDate: Number(moment(new Date()).format("YYYYMMDD")),
      });
      if (
        Search !== null &&
        Search.searchTerm === searchTerm.term &&
        Search.code === searchTerm.code
      ) {
        await searchData(page, numb, Search.searchTerm, Search.code, browser);
      }
    }
  });
};

//&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11

const searchData = async (page, numb, searchTerm, code, browser) => {
  return new Promise(async (resolve, reject) => {
    //const SEARCH_TERM = "GraphQL";
    let URL = `https://www.indeed.com.br/empregos?q=${searchTerm}&l=Brasil&sort=date`;

    //const browser = await puppeteer.launch();
    //const page = await browser.newPage();
    //await page.setUserAgent(USER_AGENT);
    await page.goto(URL);

    let counter;

    if (numb > 1000) {
      counter = 700;
    } else {
      let tptalPages = numb / 15;
      counter = tptalPages * 10;
    }

    for (let j = 0; j < counter; j += 10) {
      console.log("PAGE " + j);
      if (j >= 10) {
        console.log("Scanning page: " + URL + `&start=${j}`);
        //const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);
        await page.goto(URL + `&start=${j}`);
        await scanPage(page, code);
        //await page.close();
      } else {
        await scanPage(page, code);
        //await page.close();
      }
      console.log("NEXT PAGE");
    }
    console.log("Scanning Done!");
    await browser.close();
    resolve();
  });
};

//searchData("react", "R");

async function scanPage(page, code) {
  return new Promise(async (resolve, reject) => {
    for (let i = 4; i <= 33; i++) {
      let position = {};

      const [title] = await page.$x(
        `/html/body/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[${i}]/h2/a`
      );
      if (title !== undefined) {
        const textContentBookTitle = await title.getProperty(`textContent`);
        let text = await textContentBookTitle.jsonValue();
        position.title = text.replace(/\n/g, "");
      }

      const [company] = await page.$x(
        `/html/body/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[${i}]/div[1]/div[1]/span[1]/a`
      );
      if (company !== undefined) {
        const companyTetx = await company.getProperty(`textContent`);
        let text = await companyTetx.jsonValue();
        position.company = text.replace(/\n/g, "");
      } else {
        const [company] = await page.$x(
          `/html/body/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[${i}]/div[1]/div[1]/span`
        );
        if (company !== undefined) {
          const companyTxt = await company.getProperty(`textContent`);
          let text = await companyTxt.jsonValue();
          position.company = text.replace(/\n/g, "");
        }
      }

      const [salary] = await page.$x(
        `html/body/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[${i}]/div[2]/span/span`
      );
      if (salary !== undefined) {
        const salaryTetx = await salary.getProperty(`textContent`);
        let text = await salaryTetx.jsonValue();
        position.salary = text.replace(/\n/g, "");
      }

      const [data] = await page.$x(
        `/html/body/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[${i}]/div[3]/div/div/div/span[1]`
      );
      if (data !== undefined) {
        const datatext = await data.getProperty(`textContent`);
        let text = await datatext.jsonValue();
        position.date = text.replace(/\n/g, "");
      }

      const [link] = await page.$x(
        `/html/body/table[2]/tbody/tr/td/table/tbody/tr/td[1]/div[${i}]/h2/a`
      );
      if (link !== undefined) {
        const linktext = await link.getProperty(`href`);
        position.link = await linktext.jsonValue();
        //let result = await getjobDetail(browser, position.link);
        //position.description = result.result;
      }

      if (Object.keys(position).length !== 0) {
        console.log(position);
        await Positions.create({
          position: position.title,
          companyName: position.company,
          salary: position.salary,
          posted: position.date,
          link: position.link,
          code: code,
          insertDate: Number(moment(new Date()).format("YYYYMMDD")),
          //description: position.description,
        });
      }
    }
    resolve();
  });
}

const getjobDetail = async (browser, address) => {
  return new Promise(async (resolve, reject) => {
    const page1 = await browser.newPage();
    await page1.goto(address);

    let result = await page1.evaluate(async () => {
      let list = [];
      document.querySelectorAll("#jobDescriptionText").forEach((b) => {
        list.push(b.innerText);
      });
      document.querySelectorAll("#jobDescriptionText p").forEach((b) => {
        list.push(b.innerText);
      });
      document.querySelectorAll("#jobDescriptionText ul li").forEach((b) => {
        list.push(b.innerText);
      });
      return list;
    });
    page1.close();
    result = await result.join(" ");
    resolve({ result });
  });
};

loadData(searchTerms);
