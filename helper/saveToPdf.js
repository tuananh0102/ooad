const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const { uploadFile, uploadFileWithPath } = require("./uploadImageHelper");

const DUMMYCV = {
  cv: {
    id: "1",
    name: "Cv's Name",
    nameUser: "Job",
    birthday: "2009-02-02",
    phone: "0123456789",
    email: "hiepxxxxxx@gmail.com",
    website: "none",
    address: "109xxxxxx",
    sex: "male",
    experience: [
      {
        company: "Google",
        startDate: "2000-10-10",
        endDate: "2000-10-10",
        position: "Manager",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est sit amet facilisis. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.",
      },
      {
        company: "Google",
        startDate: "2020-10-10",
        endDate: "2000-10-10",
        position: "manager",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est sit amet facilisis. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.",
      },
    ],
    activities: [
      {
        organization: "Hiepdx",
        startDate: "2020-10-10",
        endDate: "2020-10-10",
        position: "manager",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est sit amet facilisis. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.",
      },
    ],
    education: [
      {
        school: "Hiepdx",
        startDate: "2020-10-10",
        endDate: "2020-10-10",
        position: "manager",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est sit amet facilisis. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.",
      },
    ],
    skills: [
      {
        skill: "design",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est sit amet facilisis. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.",
      },
      {
        skill: "cloud",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt eget nullam non nisi est sit amet facilisis. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.",
      },
    ],
  },
};

module.exports.createPDF = async (data) => {
  if (!data) return "Data is empty";
  var templateHtml = fs.readFileSync(path.join(process.cwd(), "/helper/cv.hbs"), "utf8");
  var template = handlebars.compile(templateHtml);
  var html = template(data);
  var milis = new Date();
  milis = milis.getTime();

  var pdfPath = `${process.cwd()}/helper/${data.cv.name}-${milis}.pdf`;

  var options = {
    width: "1230px",
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    margin: {
      top: "30px",
      bottom: "30px",
    },
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });

  var page = await browser.newPage();

  await page.setContent(html);

  await page.pdf(options);
  await browser.close();
  const url = await uploadFileWithPath(pdfPath, "application/pdf");
  return url;
};

module.exports.randomPDF = async () => {
  const data = DUMMYCV;
  if (!data) return "Data is empty";
  var templateHtml = fs.readFileSync(path.join(process.cwd(), "/helper/cv.hbs"), "utf8");
  var template = handlebars.compile(templateHtml);
  var html = template(data);
  var milis = new Date();
  milis = milis.getTime();

  var pdfPath = `${process.cwd()}/helper/${data.cv.name}-${milis}.pdf`;

  var options = {
    width: "1230px",
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    margin: {
      top: "30px",
      bottom: "30px",
    },
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });

  var page = await browser.newPage();

  await page.setContent(html);

  await page.pdf(options);
  await browser.close();
  const url = await uploadFileWithPath(pdfPath, "application/pdf");
  return url;
};
