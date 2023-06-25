const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    
    eleventyConfig.addPassthroughCopy('./assets');
    
    eleventyConfig.addFilter("postDate", (dateObj) => {
      return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
    });
    
    return {
      dir: {
        input: "./",
        output: "_site"
      }
    }
  };