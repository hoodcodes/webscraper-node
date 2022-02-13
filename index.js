const PORT = 7777;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const { links } = require('express/lib/response');

const app = express();

// const url = 'https://www.theguardian.com/uk';

// axios(url)
//   .then(response => {
//     const html = response.data;
//     const $ = cheerio.load(html);
//     const articles = [];

//     $('.fc-item__title', html).each(function() {
//       const title = $(this).text();
//       const articleUrl = $(this).find('a').attr('href');
//       articles.push({
//         title,
//         articleUrl
//       })
//     });
//     console.log(articles);
//   }).catch(err => console.log(err));

const baseUrl = 'https://www.bestbuy.com';

axios(baseUrl)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const links = [];
    const deals = [];

    function onlyUnique(value, index, self){
      return self.indexOf(value) === index;
    }

    $('.bottom-left-links', html).each(function() {
      const title = $(this).text();
      const url = baseUrl + $(this).attr('href');
      links.push({
        title,
        url
      });
      //console.log(links);
    })
    const uniqueLinks = links.filter(onlyUnique);

    const dealOfTheDay = uniqueLinks.filter(link => {
      return link.title == 'Deal of the Day';
    })
    console.log(dealOfTheDay);

    dealOfTheDay.forEach(link => {
      axios.get(link.url)
        .then(response => {
          const html = response.data;
          const $ = cheerio.load(html);
          //console.log(html);

          $('.wf-offer', html).each(function() {
            const product = $(this).text();
            const productUrl = baseUrl + $(this).find('a').attr('href');
            const regularPrice = $(this).find('.pricing-price__regular-price').text();
            const savings = $(this).find('.pricing-price__savings').text();
            const salePrice = $(this).find('.priceView-hero-price').text();
            const dealEndsIn = $(this).find('.priceview-expiration-timer').text();

            deals.push({
              product,
              productUrl,
              regularPrice,
              savings,
              salePrice,
              dealEndsIn
            });
          });      
          console.log(deals);
        });
      });
  }).catch(err => console.log(err));

app.listen(PORT,() => console.log(`server running on PORT ${PORT}`));