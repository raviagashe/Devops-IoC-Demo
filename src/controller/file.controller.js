const uploadFile = require("../middleware/upload");
const fs = require("fs");

const lineByLine = require('n-readlines');
const uploadFileMiddleware = require("../middleware/upload");

const baseUrl = "http://localhost:8080/process/";


const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    


    res.status(200).send({
      message: "Uploaded the file successfully:"  ,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}.`,
    });
    console.log(`Error occured:${err}`);
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const getcount = (req, res) => {

    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    const fpath = directoryPath + fileName;

    try {

        var liner = new lineByLine(fpath);       
        // read the file, line by line.
    
        let line;
        var wcount=0;

        while(line = liner.next()){
            
                str = line.toString()
                str = str.replace(/(^\s*)|(\s*$)/gi,"");
                str = str.replace(/[ ]{2,}/gi," ");
                str = str.replace(/\n /,"\n");
                text = str
                text = text.trim(); // Clear ends.
                var split = text.split(/\s+/g);
                if (split.length === 1) {
                    if (split[0].trim() === '') {
                        continue;
                    } else {
                        break
                    }
                } else {
                  wcount = wcount + split.length;
                }
        

                
            };
    
            let result = [];

            result.push({
              count_of_words:  wcount.toString(), 
            });

            res.status(200).send(result);
      
          
        }catch (err) {
          res.status(500).send({
          message: `Could not process the file: ${fileName}.`,
          });
          console.log(`Error occured:${err}`);
      };
  
  
  
};


const deletefile = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    const fpath = directoryPath + fileName;
  
    try {
        fs.unlinkSync(fpath)
        //file removed

        res.status(200).send("File removed");
    } catch (err) {
        res.status(500).send({
          message: `Could not remove the file: ${fileName}.`,
        });
        console.log(`Error occured:${err}`);
      }
    
    
  };

module.exports = {
  upload,
  getListFiles,
  getcount,
  deletefile,
};