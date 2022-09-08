# Milestone 2 (Pipeline > Test+Analysis)

### Project Team:

- Manvita Balachandra ( mbalach )
- Prithvish Rakesh Doshi ( pdoshi )
- Vijaya Durga Kona ( vkona )

### System Dependency for Milestone 2:
- Linux OS
- Windows OS
- MAC OS with Intel processor

### Project Specification for Milestone 2:

[View Project Specification](https://github.com/CSC-DevOps/Course/blob/master/Project/M2.md) 

### Screencast for Milestone 2:
[View Screencast](https://youtu.be/v2nmkXZ_84M)

#### Mutation Coverage Formula:
There is a minor change in only displaying the formula in screencast (the calculation happening at the backend is correct):
- FAILED MUTATIONS does not include COMPILATION ERROR count, and hence the mutation coverage is FAILED / (TOTAL - COMPILATION ERRORS) which is 30% as shown.

### Steps to setup repository of Milestone 2:
- `git clone https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06.git`

- `cd DEVOPS-06`

- `npm install`

- `npm link`

- `npm install esprima`

- `npm install escodegen`

### Pre-requisites needed to run Milestone 2:
`js-yaml` is a dependency that is installed automatically. In case `pipeline init` gives an error related to `js-yaml`, please run the following command:
- `npm install js-yaml --save-prod`

 `yargs` module should be present once the repository is cloned. In case it throws an error for yargs module, please run the following command:
 - `npm install --save @types/yargs`
 
 `fs-extra` module should be present. In case it throws an error, please run the following command:
 - `npm install fs-extra`

#### Operating System Dependency:
Please run the following command from DEVOPS-06 directory
- `dos2unix pipeline/run-ansible.sh`
- `dos2unix pipeline/server-init.sh`

This can also be alternative set permanently for each user/system/project:<br>
Per system solution:<br>
`git config --system core.autocrlf false` 
<br>Per user solution:           
`git config --global core.autocrlf false`
<br>Per Project solution:            
`git config --local core.autocrlf false`  

Verify if the changes have appplied by running the below in the working directory :<br>
`git config core.autocrlf`

### Pipeline Commands to run Milestone 2:
`npm install`

`node index.js init`

Provision and configure computing environment for pipeline:

`pipeline init`
  
Trigger a build job, running steps outlined by build.yml, wait for output, and print build log:

`pipeline build mutation-coverage build.yml`
  
### Template for .env file:
<b>Create .env file in the DEVOPS-06 directory:</b>`touch .env`

`GIT_TOKEN=<YOUR_GIT_ACCESS_TOKEN>`<br>
`GIT_REPO=github.ncsu.edu/engr-csc326-staff/iTrust2-v10.git`<br>
`MY_SQL_PASSWORD=devops-06`<br>
`VM_IP=192.168.56.10`<br>
`VM_USER=vagrant`

<b>NOTE:</b> Please use your personal GIT Access Token in place of `<YOUR_GIT_ACCESS_TOKEN>`

### Main Tasks Completed in Milestone 2:
- Automation of dos2unix for windows
- build.yml modifications based on feedback from Milestone 1 evaluation
- Generate baseline snapshots
- Create test harness to generate snapshot from mutated code
- Compare snapshots using DOM-based or image-based difference
- Generate mutation coverage using test harness
- Remove secret variables from the display log
- Generating output logs and errors
- Mutation coverage calculation 

### Team Contirbution for Milestone 2:
- Working on modifications for M1 based on Feedback : Prithvish Doshi & Manvita Balachandra
- Generate baseline snapshots : Vijaya Durga Kona
- Create test harness to generate snapshot from mutated code : Prithvish Doshi and Vijaya Durga Kona
- Compare snapshots using DOM-based or image-based difference : Prithvish Doshi 
- Generate mutation coverage using test harness: Manvita Balachandra
- Remove secret variables from the display log: Vijaya Durga Kona and Manvita Balachandra
- Generating output logs and errors: Vijaya Durga Kona, Prithvish Doshi and Manvita Balachandra
- Mutation coverage calculation: Manvita Balachandra, Prithvish Doshi, Vijaya Durga Kona

### Learnings/Experiences in Milestone 2:
- Esprima and escodegen functionalities 
- ASTRewrite ast tree traversal for mutator automation
- build.yml automation to ensure plus and play of commands helps in extending the project to install any dependency
- snapshot generation 
- node-resemble-js functionalities and dependencies of resemble-js
- Importance of synchrozonization while generating multiple snapshots
- Mutation coverage calculation 

### Issues Faced in Milestone 2:
- Error: `pipeline is not recognised as an internal or external command`. The issue was resolved when we did `npm link`
- When the files were checked out in Windows ,`.sh` files were not recognised due to formatting issues. We used dos2unix command to avoid issues for the shell files.
- Indentation of Ansible scripts (mutation.yml file)
- Syncrhonization issue while calculating mutation coverage for multiple mutated snapshots simultaneously
- Esprima incremental, control statement and clone return mutations
- `ast` tree traversal and backtracking to point to necessary node attributes
- js-yaml and yargs issue when existing project directory is deleted and new pull is taken

### Screenshots of Execution for Checkpoint 2:

#### Linux System:
##### Pipeline init
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Linux_M2_init.png">
</p>

##### iTrust Job
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Linux_M2_itrust-build.png">
</p>

##### Mutation coverage job
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Linux_M2_mutation-coverage.png">
</p>

#### Windows System:
##### Pipeline init
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Windows_M2_init.png">
</p>

#### iTrust Job 
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/ItrustM2.PNG">
</p>


##### Mutation coverage job
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Windows_M2_mutation-coverage-build.png">
</p>

### Project Board:

<p align = "center">
<img width=1200" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Project-board-M2.PNG">
</p>

[View Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/projects/2)

### Issue Board:

<p align = "center">
<img width="1000" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Issue-board-M2.PNG">
</p>

[View Issue Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/issues)
