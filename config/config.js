
exports.config = {
    // DirectConnect set to true 
    directConnect: true,

    // URL 
    baseUrl: "http://localhost:4200/",

    // Browser set to Chrome and Maximized 
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: [ '--start-maximized' ]
      }
    },
  
    framework: 'jasmine',
  

    specs: ['..\\test\\easy-spec.js','..\\test\\medium-spec.js','..\\test\\hard-spec.js','..\\test\\harder-spec.js'],
  

    jasmineNodeOpts: {
      defaultTimeoutInterval: 1000000
    }
  };