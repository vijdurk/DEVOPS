# Checkpoint for Milestone 1:

### Tasks Implemented as part of Checkpoint 1:
- Provisioning a config server through "init" script
- Installing Ansible 
- Using Ansible to install Java, Maven, MySQL
- Installing nginx using Ansible

### Pending Tasks for completion of Milestone 1:
- Configuring credentials to access the applications
- Create a build job for iTrust
- Run the iTrust application and access it from the localhost
- Understand and populate the contents of .env file

### Issues Faced during Checkpoint 1:
- Error: "pipeline is not recognised as an internal or external command". The issue was resolved when we did "npm link"
- When the files were checked out in Windows ,".sh" files were not recognised due to formatting issues. We used dos2unix command to avoid issues for the shell files.
- Indentation of Ansible scripts (build.yml file)
- Figuring out descrepency with directory heirarchy: roles/setup/tasks Vs. roles/setup/jobs

### Team Contribution for Checkpoint 1:
- Configure "pipeline init" to initialize config server : Manvita Balachandra
- Create build.yml to install JDK, MySQL, Maven, nginx : Prithvish Doshi
- Build a component to handle multiple jobs inside build.js : Vijaya Durga Kona

### Screenshots of Execution for Checkpoint 1:

<b>pipeline init:</b>
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Checkpoint1M1-1.PNG">
</p>

<b>pipeline build build:</b>
<p align = "center">
<img width="900" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Checkpoint1M1-2.PNG">
</p>

### Project Board:

<p align = "center">
<img width=1200" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Checkpoint1M1-5.PNG">
</p>

[View Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/projects/1)

### Issue Board:

Open Issues-
<p align = "center">
<img width="1000" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Checkpoint1M1-3.PNG">
</p>

Closed Issues-
<p align = "center">
<img width="1000" alt="image" src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/blob/main/Images/Checkpoint1M1-4.PNG">
</p>

[View Issue Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/issues)






