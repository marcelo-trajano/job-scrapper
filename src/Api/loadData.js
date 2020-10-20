const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
const SearchTerm = require("./SearchTerm");
const moment = require("moment");
require("dotenv").config();
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const searchTerms = [
  { term: "React", code: "R", label: "React" },
  { term: "javascript", code: "JS", label: "JavaScript" },
  { term: "react+native", code: "RN", label: "React Native" },
  { term: "node+java", code: "NJ", label: "Node + Java" },
  { term: "typescript", code: "TS", label: "TypeScript" },
  { term: "Spring+boot", code: "SB", label: "Spring Boot" },
  { term: "java", code: "J", label: "Java" },
  { term: "ingles+fluente", code: "EN", label: "Inglês Fluente" },
  { term: "flutter", code: "FT", label: "Flutter" },
  { term: "node", code: "NJS", label: "Node.js" },
  { term: "engenheiro+de+vendas", code: "ENV", label: "Eng. de Vendas" },
  { term: "pre+venda", code: "PRV", label: "Pre-Vendas" },
  { term: "pre+sales", code: "PSLS", label: "Pre Sales" },
  { term: "GraphQL", code: "GQL", label: "GraphQL" },
];

(async () => {
  searchTerms.forEach((searchTerm) => {
    let URL = `https://www.indeed.com.br/empregos?q=${searchTerm.term}&l=Brasil&sort=date`;

    request(URL, async (err, response, html) => {
      console.log(err);
      if (!err && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let totalJObs = $("#searchCountPages").text().trim();
        let s1 = totalJObs.indexOf("de ");
        let s2 = totalJObs.lastIndexOf("vagas");
        var txt = totalJObs.slice(s1 + 2, s2);
        var numb = txt.match(/\d/g);
        numb = numb.join("");

        try {
          const Search = await SearchTerm.create({
            searchTerm: searchTerm.term,
            code: searchTerm.code,
            numberOfJobs: numb,
            label: searchTerm.label,
            insertDate: Number(moment(new Date()).format("YYYYMMDD")),
          });
          console.log(Search);
        } catch (error) {
          console.log(error);
        }
      }
    });
  });
})();
