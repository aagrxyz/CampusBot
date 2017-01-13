module.exports = {
  get_papers : function(entry)
  {
    var fs = require("fs-extra");
    var path = require('path');
    var EasyZip = require('easy-zip').EasyZip;
    var zip5 = new EasyZip();

    function getDirectories(srcpath) {
      return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
      });
    }
    var entry = entry.toUpperCase();
    var papers_dir = "QuestionPapers/COL";
    var output_home_dir = "output";
    var output_dir = output_home_dir + "/" + entry;
    var json_location ="database/data_base.json";
    var content = fs.readFileSync(json_location);
    var data_base =  JSON.parse(content);
    var courses = [];
    data_base[entry]["courses"].map(function(a){courses.push(a.course);});

    if (!fs.existsSync(output_dir))
    {
        fs.mkdirSync(output_dir);
    }
    var dir1 = getDirectories(papers_dir);
    no_courses = dir1.length;
    for(i = 0; i<no_courses ; i++)
    {
      if(courses.includes(dir1[i]))
      {
        fs.copy(papers_dir+"/"+dir1[i], output_dir + "/"+ dir1[i], function (err) 
        {
          if (err) 
          {
            console.error(err);
          } 
          else 
          {
            zip5.zipFolder(output_dir, function()
            {
                zip5.writeToFile(output_home_dir+"/" +entry+".zip");
            });
          }
        });
      }
    }
  }
};
