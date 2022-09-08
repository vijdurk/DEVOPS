# Milestone 1 (Pipeline > Build)

### Project Team:

- Manvita Balachandra ( mbalach )
- Prithvish Rakesh Doshi ( pdoshi )
- Vijaya Durga Kona ( vkona )

### System Dependency for Milestone 1:
- Linux OS
- Windows OS
- MAC OS with Intel processor

### Project Specification for Milestone 1:

[View Project Specification](https://github.com/CSC-DevOps/Course/blob/master/Project/M1.md) 

### Steps to setup repository of Milestone 1:
- `git clone https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06.git`

- `cd DEVOPS-06`

- `npm install`

- `npm link`

### Pre-requisites needed to run Milestone 1:
`js-yaml` is a dependency that is installed automatically. In case `pipeline init` gives an error related to `js-yaml`, please run the following command:
- `npm install js-yaml --save-prod`

#### Operating System Dependency - Only for Windows users:
Please run the following command from DEVOPS-06 directory
- `dos2unix pipeline/run-ansible.sh`
- `dos2unix pipeline/server-init.sh`

### Pipeline Commands to run Milestone 1:
Provision and configure computing environment for pipeline:

`pipeline init`
  
Trigger a build job, running steps outlined by build.yml, wait for output, and print build log:

`pipeline build itrust-build build.yml` 
  
### Template for .env file:
<b>Create .env file in the DEVOPS-06 directory:</b>`touch .env`

`GIT_TOKEN=<YOUR_GIT_ACCESS_TOKEN>`<br>
`GIT_REPO=github.ncsu.edu/engr-csc326-staff/iTrust2-v10.git`<br>
`MY_SQL_PASSWORD=devops-06`<br>
`VM_IP=192.168.56.10`<br>
`VM_USER=vagrant`

<b>NOTE:</b> Please use your personal GIT Access Token in place of `<YOUR_GIT_ACCESS_TOKEN>`

### Main Tasks Completed in Milestone 1:
- Provision a project-server with Ubuntu `focal` 20.04 image using `bakerx`
- Preserve the details of the configured server in a file ( inventory.ini )
- Display the details of the configured server as output on the console
- Configure the build server ( project-server )
- Create a build job specification with setup, jobs heirarchy
- Install maven, jdk, java11, nodejs, wget, set debconf-utils. Set MySQL password and clone the git repository.
- Parse application.yml.template to application.yml to store correct details
- Run `cd iTrust2 && mvn --batch-mode --update-snapshots clean test`

### Team Contirbution for Milestone 1:
- Provision the build server to come up with ubuntu focal image, ip, username, private_key : Manvita Balachandra
- Create build.yml to install JDK, MySQL, Maven, JAVA11 : Prithvish Doshi
- Build a component to handle multiple jobs inside build.js : Vijaya Durga Kona
- Ensure .env file is accessible by playbook/js file locally and even on the build server : Vijaya Durga Kona & Manvita Balachandra
- Parsed the design hierarchy for execution of tasks in yaml file : Prithvish Doshi & Vijaya Durga Kona
- Automatically configured build environment : Manvita Balachandra & Prithvish Doshi & Vijaya Durga Kona
- Generate git access token : Manvita Balachandra
- Handle credentials and service state for MySQL : Vijaya Durga Kona & Prithvish Doshi
- Handled pre-cloning functions and set debconf-utils : Prithvish Doshi & Manvita Balachandra
- Cloned https://github.ncsu.edu/engr-csc326-staff/iTrust2-v10 repository to correct path : Vijaya Durga Kona
- Parsed application.yml.template file to application.yml : Prithvish Doshi
- Perform maven test on Windows : Vijaya Durga Kona
- Perform maven test on Linux : Prithvish Doshi
- Document the project details in README.md and record a screencast for demo : Manvita Balachandra

### Learnings/Experiences in Milestone 1:
- Provisioning a VM and accessing VM details
- Private key handling 
- Ansible script and its dependencies
- MySQL dependencies and checks while running on remote server
- Effect of time synchronization issues 
- Handling .env file variable declarations

### Issues Faced in Milestone 1:
- Error: `pipeline is not recognised as an internal or external command`. The issue was resolved when we did `npm link`
- When the files were checked out in Windows ,`.sh` files were not recognised due to formatting issues. We used dos2unix command to avoid issues for the shell files.
- Indentation of Ansible scripts (build.yml file)
- Figuring out descrepency with directory heirarchy: roles/setup/tasks Vs. roles/setup/jobs
- Coming up with own ansible readable file design to access files through the given file hierarchy as mentioned in project description
- Parsing our design for ansible to read them
- ntp time issues prevented us from executing maven tests
- Issue with sed command not being able to change the file contents in application.yml
- MySQL password issues on remote server (project-server)
- Accessing the .env variables in the code for server to read it without issues

### Screenshots of Execution for Checkpoint 1:

#### Windows System:
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/2M1.PNG">
</p>

<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/1M1.PNG">
</p>

#### Linux System:

<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/linux_init_result.png">
</p>

<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/linux_build_successful.png">
</p>

### Project Board:

<p align = "center">
<img width=1200" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Project-board-M1.PNG">
</p>

[View Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/projects/1)

### Issue Board:

<p align = "center">
<img width="1000" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Issue-board-M1.PNG">
</p>

[View Issue Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/issues)

### Screencast for Milestone 1:
[View Screencast](https://youtu.be/jHuGoz0y0QM)

### Checkpoint Report for Milestone 1:
[View CHECKPOINT-M1 Report](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/CHECKPOINT-M1.md)
