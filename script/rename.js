var packageConfig = require('../package.json');
var fs = require("fs"),
  parseString = require("xml2js").parseString,
  xml2js = require("xml2js");

function updateXml(path, cb) {
  fs.readFile(path, "utf-8", function (err, data) {
    if (err) console.log(err);
    // we then pass the data to our method here
    parseString(data, function (err, result) {
      if (err) console.log(err);
      var json = result;

      cb(json);

      var builder = new xml2js.Builder({
        xmldec: {
          standalone: null,
          encoding: 'utf-8',
          version: '1.0'
        }, renderOpts: { 'pretty': true, 'indent': '    ', 'newline': '\n' }
      });
      var xml = builder.buildObject(json);

      fs.writeFile(path, xml, function (err, data) {
        if (err) console.log(err);

        console.log(`successfully update xml to file ${path}`);
      });
    });
  });
}

updateXml("./src/package.xml", json => {
  json.package.clientModule[0].$.name = packageConfig.widgetName;
  json.package.clientModule[0].$.version = packageConfig.version;
  json.package.clientModule[0].files[0].file[0].$.path = `${packageConfig.packagePath}/${packageConfig.name}`;
  json.package.clientModule[0].widgetFiles[0].widgetFile[0].$.path = `${packageConfig.widgetName}.xml`;
});

updateXml("./src/Graph.xml", json => {
  json.widget.$.id = `${packageConfig.packagePath}.${packageConfig.name}.${packageConfig.widgetName}`;
  json.widget.name[0] = packageConfig.widgetName;
  json.widget.description[0] = packageConfig.description;
})