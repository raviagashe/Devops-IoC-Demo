Package Info:
    This package contains software artifacts to build and maintain a simple word count in a file webservice. This includes
    1. Node.js code artifacts 
    2. Dockerfile to build a docker image
    3. AWS Infrastructure provisioning code as CloudFormation template (./aws-resources/EcsProvision.yaml)
    4. Github Actions for setup CI/CD (./.github/aws.yml) 
    5. basic Service Testing tools and artifacts (./test)

Setup Prerequisites:
    AWS account with a power user programatic access
    Github account 

About the App:
    This app provides a REST API webservice with following methods 

-
    POST /upload

    Example Request
        curl --location 
             --request POST "http://localhost:8080/upload" 
             --form file=@$testdata.txt

    Example Response
        {"message":"Uploaded the file successfully:"} 
-
    GET /files

    Example Request
        curl --location 
             --request GET http://localhost:8080/files

    Example Response
        [
            {
                "name":"1626393102199_20210715-165142_testdata.txt",
                "url":"http://localhost:8080/process/1626393102199_20210715-165142_testdata.txt"
            }
        ]
-
    GET /process/<Serevr_File_Name>

    Example Request
        curl --location 
             --request GET http://localhost:8080/process/1626393102199_20210715-165142_testdata.txt

    Example Response
        [
            {
                "count_of_words":"0"
            }
        ]

    GET /remove/<Serevr_File_Name>

    Example Request
        curl --location 
             --request GET http://localhost:8080/remove/1626393102199_20210715-165142_testdata.txt

    Example Response
        {"message":"File removed"}


Running this App locally:
    This app is a simple node.js app utilizing express, cors, multer, n-readlines npm modules. the needed modules and dependencies are included in package, To run this app on Node.js / ubuntu local setup having  node --version v16.2.0, npm --version 7.13.0 or newer , To run 

npm i
npm run start
Run the test script ./test/uploadfile_Test.sh


