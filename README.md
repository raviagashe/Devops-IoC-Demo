Package Info:
    This package contains software artifacts to build and maintain a simple word count in a file webservice. 

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


Setup Prerequisites:
    AWS account with a power user programatic access 
        - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
        - YOUR_AWS_ACCOUNT_NUMBER
    Github account 
    Development computer Windows WSL/ubuntu or equivalent with following installed 
      - node --version v16.2.0, npm --version 7.13.0 or newer
      - Docker desktop or equivalent
      - git client
      - AWS Cli installed 

Package Contents:

This includes
    1. Node.js code artifacts 
    2. Dockerfile to build a docker image
    3. AWS Infrastructure provisioning code as CloudFormation template (./aws-resources/EcsProvision.yaml)
    4. Github Actions for setup CI/CD (./.github/aws.yml) 
    5. basic Service Testing tools and artifacts (./test)


Setup Steps:

1.  Extract package contents 

2.  Verify Running this App locally:
    This app is a simple node.js app utilizing express, cors, multer, n-readlines npm modules. the needed modules and dependencies are included in package, To run this app on developer machine

npm i
npm run start
Run the test script ./test/uploadfile_Test.sh


3. Build, Run & Test Docker image


sudo docker build -t simple-wordcount-api .

docker run -it -p 8080:8080 <image ID>

Run the test script ./test/uploadfile_Test.sh

4. Create AWS stack using NetSec.yaml cloudformation template

aws cloudformation create-stack --stack-name EcsNetSec --region us-east-1 --template-body file://./NetSec.yaml

-Check status of stack from AWS Console and run following to print stack output values 

aws cloudformation describe-stacks --stack-name ECSNetSec --output yaml


5. upload docker image to AWS ECR Repository created above

- Set image target Repository 
docker tag simple-wordcount-api:latest <YOUR_AWS_ACCOUNT_NUMBER>.dkr.ecr.us-east-1.amazonaws.com/simple-wordcount-api:latest

- perform docker login into AWS ECR
aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_NUMBER>.dkr.ecr.us-east-1.amazonaws.com

- Push docker image to AWS ECR
sudo docker push <YOUR_AWS_ACCOUNT_NUMBER>.dkr.ecr.us-east-1.amazonaws.com/simple-wordcount-api:latest

6. Create AWS stack using EcsLB.yaml cloudformation template

- Update ParameterValues from AWS stack output above and run 
aws cloudformation create-stack --stack-name EcsLBDeploy --template-body file://EcsLB.yaml --region us-east-1 --capabilities  CAPABILITY_NAMED_IAM --parameters ParameterKey=VPCID,ParameterValue=vpc-0a6217ce8faabff98 ParameterKey=Subnet1ID,ParameterValue=subnet-0aae8d481186912b6 ParameterKey=Subnet2ID,ParameterValue=subnet-06e15dfb9111a8903 ParameterKey=DomainName,ParameterValue=simple-wordcount.com ParameterKey=REPOUri,ParameterValue=<YOUR_AWS_ACCOUNT_NUMBER>.dkr.ecr.us-east-1.amazonaws.com/simple-wordcount-api


- Check status of stack from AWS Console and run following to print stack output values 

aws cloudformation describe-stacks --stack-name EcsLBDeploy --output yaml

7. Use the value of LBDNSName from above stack output and update the service_host_url bash variable value  in ./test/uploadfile_Test.sh script then run the script to test


8. If required The access to service can be limited to client IP only by updating LoadbalancerSecurityGroup from AWS console

https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#SecurityGroups:sort=group-id

Edit Inbound Rules to replace 0.0.0.0/0 (All IPs) by your specific IPs


This completes the infrastructure setup

9. For CI/CD pipeline Github Actions is used 
 - initilize git repo in project folder 
 - Setup a new git repo on github with project folder name
 - Store AWS access key in GitHub Actions secrets named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
 - setup git remote and push all folder contents
 - Watch github actions run progress which will build a new Docker image from files in github repo and deploy the container to AWS ECS 

Now we have full infrastructure provisioned running desired service and CI/CD pipeline to run future updates from development

Thats IT!! 