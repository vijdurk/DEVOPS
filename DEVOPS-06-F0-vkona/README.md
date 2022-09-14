## F0 FINAL EXAM 
### (PIPELINE JOBS FOR OPEN SOURCE PROJECTS and NEW FEATURE/STAGE IN PIPELINE)

### Contributor : 
- Vijaya Durga Kona(unityId: vkona)

### Project Specification for F0:

[View Project Specification](https://github.com/CSC-DevOps/Course/blob/master/Project/F0.md) 

### Screencast for F0:
[View Screencast for Pipeline job1,Static code analysis for Job1 and deployment strategy](https://www.youtube.com/watch?v=eEBGRX7OZg8)<br>
[View Screencast for Pipeline job2 and Static code analysis for Job2](https://www.youtube.com/watch?v=Be1RrzctOJo)<br>

### Steps to setup repository of Milestone 3:
- `git clone https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06.git -b F0-vkona`

- `cd DEVOPS-06`

- `npm install`

- `npm link`

<b>NOTE:</b> Please place the rsa file in DEVOPS-06 directory upon cloning

### Operating System Dependency:
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

### Pipeline Commands to run Milestone 3:
`npm install`

`node index.js init`

Provision and configure computing environment for pipeline:

`pipeline init`

Provision and bring up the cloud VMs:<br>
`pipeline prod up`

### Open Source Project 1 - POCKET CALCULATOR

Build and test the project <br>

`pipeline build calculator-build-test build.yml`

Static Code Ananlysis <br>

`pipeline build calculator-StaticCodeAnalysis build.yml`

Deploy itrust-deploy job to run with inventory file:<br>

`pipeline deploy inventory calculator-deploy build.yml`

### Open Source Project 2 - HEALTHCHECKS

Build and test the project <br>

`pipeline build healthchecks-build-test build.yml`

Static Code Ananlysis <br>

`pipeline build healthchecks-StaticCodeAnalysis build.yml`

Deploy itrust-deploy job to run with inventory file:<br>

`pipeline deploy inventory healthchecks-deploy build.yml`


### Template for .env file:
<b>Create .env file in the DEVOPS-06 directory:</b>`touch .env`

`GIT_TOKEN=<YOUR_GIT_ACCESS_TOKEN>`<br>
`GIT_REPO=github.ncsu.edu/engr-csc326-staff/iTrust2-v10.git`<br>
`MY_SQL_PASSWORD=devops-06`<br>
`VM_IP=192.168.56.10`<br>
`VM_USER=vagrant`<br>
`RSA_FINGERPRINT=<YOUR_RSA_FINGERPRINT>`

Once `prod up` is run, blue and green VM names and IP's write to the .env file

<b>NOTE:</b> Please use your personal GIT Access Token in place of `<YOUR_GIT_ACCESS_TOKEN>`

Set your digitalocean token on local system as below:
`setx DO_TOKEN <TOKEN>`

<b>NOTE:</b>
<br>
  Please use your personal digitalocean token in place of `<TOKEN>`<br>
  Please use your `<YOUR_RSA_FINGERPRINT>` to spawn your droplets from digitalocean

### NEW FEATURE - STATIC CODE ANALYSIS

Static code analysis is a method of analysing source code before a program is run. It's done by examining a set of code against a set (or multiple sets) of coding rules.<br>
This will help in revealing any issues in the stages of development and testing, which can be rectified during that stage, allowing developers to develop a strong code base.<br>

This feature was implemented in both the pipeline jobs .Details of which are explained below:<br>

#### Calculator - ESLINT PACKAGE FOR STATIC CODE ANALYSIS

- ESLINT is a tool for identifying and reporting on patterns found in the javascript code.Thisis similat to JSLINT .
- This uses an AST to evaluate patterns in the code
- This project have been configured with a policy called 'strong-loop' .This should be configured in .eslintrc.json file.
`{"extends": "strongloop"}`
- This policy is very popular as it has strong coding style
- This linting process finds out multiple static issues in code such as unnecessary escape characters,unused variables,undefined modules and so on.
- This gives in detail the line number and column number in the code
- This step has been included as a job 'calculate-StaticCodeAnalysis' in the pipeline job.<br>
 [Static Analysis report for Calculator](https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Static_code_analysis_Calculator_Using_ESLINT.txt)

#### Healthchecks - PYLINT PACKAGE FOR STATIC CODE ANALYSIS

- PYLINT is a built in package for generating the static analysis report
- This checks module for coding standards 
- This project has been configured with default pylintrc file 
- This identifies multiple issues such as missing docstrings,unused variables,Over use of Looping  if statements and unreacahable code.
- This also suggests the repeated lines that can be modularised for reuse.
- This feature added in the helps the coder to check on these issues and improve the quality of the project.<br>
[Static Analysis report for Healthchecks](https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Static_code_analysis_HealthChecks_Using_Pylint.txt)
<details>
<summary>pylintrc</summary>

```
[MASTER]

# A comma-separated list of package or module names from where C extensions may
# be loaded. Extensions are loading into the active Python interpreter and may
# run arbitrary code.
extension-pkg-allow-list=

# A comma-separated list of package or module names from where C extensions may
# be loaded. Extensions are loading into the active Python interpreter and may
# run arbitrary code. (This is an alternative name to extension-pkg-allow-list
# for backward compatibility.)
extension-pkg-whitelist=

# Return non-zero exit code if any of these messages/categories are detected,
# even if score is above --fail-under value. Syntax same as enable. Messages
# specified are enabled, while categories only check already-enabled messages.
fail-on=

# Specify a score threshold to be exceeded before program exits with error.
fail-under=10.0

# Files or directories to be skipped. They should be base names, not paths.
ignore=CVS

# Add files or directories matching the regex patterns to the ignore-list. The
# regex matches against paths and can be in Posix or Windows format.
ignore-paths=

# Files or directories matching the regex patterns are skipped. The regex
# matches against base names, not paths. The default value ignores emacs file
# locks
ignore-patterns=^\.#

# Python code to execute, usually for sys.path manipulation such as
# pygtk.require().
#init-hook=

# Use multiple processes to speed up Pylint. Specifying 0 will auto-detect the
# number of processors available to use.
jobs=1

# Control the amount of potential inferred values when inferring a single
# object. This can help the performance when dealing with large functions or
# complex, nested conditions.
limit-inference-results=100

# List of plugins (as comma separated values of python module names) to load,
# usually to register additional checkers.
load-plugins=

# Pickle collected data for later comparisons.
persistent=yes

# Minimum Python version to use for version dependent checks. Will default to
# the version used to run pylint.
py-version=3.8

# Discover python modules and packages in the file system subtree.
recursive=no

# When enabled, pylint would attempt to guess common misconfiguration and emit
# user-friendly hints instead of false-positive error messages.
suggestion-mode=yes

# Allow loading of arbitrary C extensions. Extensions are imported into the
# active Python interpreter and may run arbitrary code.
unsafe-load-any-extension=no


[MESSAGES CONTROL]

# Only show warnings with the listed confidence levels. Leave empty to show
# all. Valid levels: HIGH, CONTROL_FLOW, INFERENCE, INFERENCE_FAILURE,
# UNDEFINED.
confidence=

# Disable the message, report, category or checker with the given id(s). You
# can either give multiple identifiers separated by comma (,) or put this
# option multiple times (only on the command line, not in the configuration
# file where it should appear only once). You can also use "--disable=all" to
# disable everything first and then re-enable specific checks. For example, if
# you want to run only the similarities checker, you can use "--disable=all
# --enable=similarities". If you want to run only the classes checker, but have
# no Warning level messages displayed, use "--disable=all --enable=classes
# --disable=W".
disable=raw-checker-failed,
        bad-inline-option,
        locally-disabled,
        file-ignored,
        suppressed-message,
        useless-suppression,
        deprecated-pragma,
        use-symbolic-message-instead

# Enable the message, report, category or checker with the given id(s). You can
# either give multiple identifier separated by comma (,) or put this option
# multiple time (only on the command line, not in the configuration file where
# it should appear only once). See also the "--disable" option for examples.
enable=c-extension-no-member


[REPORTS]

# Python expression which should return a score less than or equal to 10. You
# have access to the variables 'fatal', 'error', 'warning', 'refactor',
# 'convention', and 'info' which contain the number of messages in each
# category, as well as 'statement' which is the total number of statements
# analyzed. This score is used by the global evaluation report (RP0004).
evaluation=max(0, 0 if fatal else 10.0 - ((float(5 * error + warning + refactor + convention) / statement) * 10))

# Template used to display messages. This is a python new-style format string
# used to format the message information. See doc for all details.
#msg-template=

# Set the output format. Available formats are text, parseable, colorized, json
# and msvs (visual studio). You can also give a reporter class, e.g.
# mypackage.mymodule.MyReporterClass.
output-format=text

# Tells whether to display a full report or only the messages.
reports=no

# Activate the evaluation score.
score=yes


[REFACTORING]

# Maximum number of nested blocks for function / method body
max-nested-blocks=5

# Complete name of functions that never returns. When checking for
# inconsistent-return-statements if a never returning function is called then
# it will be considered as an explicit return statement and no message will be
# printed.
never-returning-functions=sys.exit,argparse.parse_error


[LOGGING]

# The type of string formatting that logging methods do. `old` means using %
# formatting, `new` is for `{}` formatting.
logging-format-style=old

# Logging modules to check that the string format arguments are in logging
# function parameter format.
logging-modules=logging


[TYPECHECK]

# List of decorators that produce context managers, such as
# contextlib.contextmanager. Add to this list to register other decorators that
# produce valid context managers.
contextmanager-decorators=contextlib.contextmanager

# List of members which are set dynamically and missed by pylint inference
# system, and so shouldn't trigger E1101 when accessed. Python regular
# expressions are accepted.
generated-members=

# Tells whether missing members accessed in mixin class should be ignored. A
# class is considered mixin if its name matches the mixin-class-rgx option.
ignore-mixin-members=yes

# Tells whether to warn about missing members when the owner of the attribute
# is inferred to be None.
ignore-none=yes

# This flag controls whether pylint should warn about no-member and similar
# checks whenever an opaque object is returned when inferring. The inference
# can return multiple potential results while evaluating a Python object, but
# some branches might not be evaluated, which results in partial inference. In
# that case, it might be useful to still emit no-member and other checks for
# the rest of the inferred objects.
ignore-on-opaque-inference=yes

# List of class names for which member attributes should not be checked (useful
# for classes with dynamically set attributes). This supports the use of
# qualified names.
ignored-classes=optparse.Values,thread._local,_thread._local

# List of module names for which member attributes should not be checked
# (useful for modules/projects where namespaces are manipulated during runtime
# and thus existing member attributes cannot be deduced by static analysis). It
# supports qualified module names, as well as Unix pattern matching.
ignored-modules=

# Show a hint with possible names when a member name was not found. The aspect
# of finding the hint is based on edit distance.
missing-member-hint=yes

# The minimum edit distance a name should have in order to be considered a
# similar match for a missing member name.
missing-member-hint-distance=1

# The total number of similar names that should be taken in consideration when
# showing a hint for a missing member.
missing-member-max-choices=1

# Regex pattern to define which classes are considered mixins ignore-mixin-
# members is set to 'yes'
mixin-class-rgx=.*[Mm]ixin

# List of decorators that change the signature of a decorated function.
signature-mutators=


[SPELLING]

# Limits count of emitted suggestions for spelling mistakes.
max-spelling-suggestions=4

# Spelling dictionary name. Available dictionaries: none. To make it work,
# install the 'python-enchant' package.
spelling-dict=

# List of comma separated words that should be considered directives if they
# appear and the beginning of a comment and should not be checked.
spelling-ignore-comment-directives=fmt: on,fmt: off,noqa:,noqa,nosec,isort:skip,mypy:

# List of comma separated words that should not be checked.
spelling-ignore-words=

# A path to a file that contains the private dictionary; one word per line.
spelling-private-dict-file=

# Tells whether to store unknown words to the private dictionary (see the
# --spelling-private-dict-file option) instead of raising a message.
spelling-store-unknown-words=no


[STRING]

# This flag controls whether inconsistent-quotes generates a warning when the
# character used as a quote delimiter is used inconsistently within a module.
check-quote-consistency=no

# This flag controls whether the implicit-str-concat should generate a warning
# on implicit string concatenation in sequences defined over several lines.
check-str-concat-over-line-jumps=no


[SIMILARITIES]

# Comments are removed from the similarity computation
ignore-comments=yes

# Docstrings are removed from the similarity computation
ignore-docstrings=yes

# Imports are removed from the similarity computation
ignore-imports=no

# Signatures are removed from the similarity computation
ignore-signatures=no

# Minimum lines number of a similarity.
min-similarity-lines=4


[VARIABLES]

# List of additional names supposed to be defined in builtins. Remember that
# you should avoid defining new builtins when possible.
additional-builtins=

# Tells whether unused global variables should be treated as a violation.
allow-global-unused-variables=yes

# List of names allowed to shadow builtins
allowed-redefined-builtins=

# List of strings which can identify a callback function by name. A callback
# name must start or end with one of those strings.
callbacks=cb_,
          _cb

# A regular expression matching the name of dummy variables (i.e. expected to
# not be used).
dummy-variables-rgx=_+$|(_[a-zA-Z0-9_]*[a-zA-Z0-9]+?$)|dummy|^ignored_|^unused_

# Argument names that match this expression will be ignored. Default to name
# with leading underscore.
ignored-argument-names=_.*|^ignored_|^unused_

# Tells whether we should check for unused import in __init__ files.
init-import=no

# List of qualified module names which can have objects that can redefine
# builtins.
redefining-builtins-modules=six.moves,past.builtins,future.builtins,builtins,io


[MISCELLANEOUS]

# List of note tags to take in consideration, separated by a comma.
notes=FIXME,
      XXX,
      TODO

# Regular expression of note tags to take in consideration.
#notes-rgx=


[FORMAT]

# Expected format of line ending, e.g. empty (any line ending), LF or CRLF.
expected-line-ending-format=

# Regexp for a line that is allowed to be longer than the limit.
ignore-long-lines=^\s*(# )?<?https?://\S+>?$

# Number of spaces of indent required inside a hanging or continued line.
indent-after-paren=4

# String used as indentation unit. This is usually "    " (4 spaces) or "\t" (1
# tab).
indent-string='    '

# Maximum number of characters on a single line.
max-line-length=100

# Maximum number of lines in a module.
max-module-lines=1000

# Allow the body of a class to be on the same line as the declaration if body
# contains single statement.
single-line-class-stmt=no

# Allow the body of an if to be on the same line as the test if there is no
# else.
single-line-if-stmt=no


[BASIC]

# Naming style matching correct argument names.
argument-naming-style=snake_case

# Regular expression matching correct argument names. Overrides argument-
# naming-style. If left empty, argument names will be checked with the set
# naming style.
#argument-rgx=

# Naming style matching correct attribute names.
attr-naming-style=snake_case

# Regular expression matching correct attribute names. Overrides attr-naming-
# style. If left empty, attribute names will be checked with the set naming
# style.
#attr-rgx=

# Bad variable names which should always be refused, separated by a comma.
bad-names=foo,
          bar,
          baz,
          toto,
          tutu,
          tata

# Bad variable names regexes, separated by a comma. If names match any regex,
# they will always be refused
bad-names-rgxs=

# Naming style matching correct class attribute names.
class-attribute-naming-style=any

# Regular expression matching correct class attribute names. Overrides class-
# attribute-naming-style. If left empty, class attribute names will be checked
# with the set naming style.
#class-attribute-rgx=

# Naming style matching correct class constant names.
class-const-naming-style=UPPER_CASE

# Regular expression matching correct class constant names. Overrides class-
# const-naming-style. If left empty, class constant names will be checked with
# the set naming style.
#class-const-rgx=

# Naming style matching correct class names.
class-naming-style=PascalCase

# Regular expression matching correct class names. Overrides class-naming-
# style. If left empty, class names will be checked with the set naming style.
#class-rgx=

# Naming style matching correct constant names.
const-naming-style=UPPER_CASE

# Regular expression matching correct constant names. Overrides const-naming-
# style. If left empty, constant names will be checked with the set naming
# style.
#const-rgx=

# Minimum line length for functions/classes that require docstrings, shorter
# ones are exempt.
docstring-min-length=-1

# Naming style matching correct function names.
function-naming-style=snake_case

# Regular expression matching correct function names. Overrides function-
# naming-style. If left empty, function names will be checked with the set
# naming style.
#function-rgx=

# Good variable names which should always be accepted, separated by a comma.
good-names=i,
           j,
           k,
           ex,
           Run,
           _

# Good variable names regexes, separated by a comma. If names match any regex,
# they will always be accepted
good-names-rgxs=

# Include a hint for the correct naming format with invalid-name.
include-naming-hint=no

# Naming style matching correct inline iteration names.
inlinevar-naming-style=any

# Regular expression matching correct inline iteration names. Overrides
# inlinevar-naming-style. If left empty, inline iteration names will be checked
# with the set naming style.
#inlinevar-rgx=

# Naming style matching correct method names.
method-naming-style=snake_case

# Regular expression matching correct method names. Overrides method-naming-
# style. If left empty, method names will be checked with the set naming style.
#method-rgx=

# Naming style matching correct module names.
module-naming-style=snake_case

# Regular expression matching correct module names. Overrides module-naming-
# style. If left empty, module names will be checked with the set naming style.
#module-rgx=

# Colon-delimited sets of names that determine each other's naming style when
# the name regexes allow several styles.
name-group=

# Regular expression which should only match function or class names that do
# not require a docstring.
no-docstring-rgx=^_

# List of decorators that produce properties, such as abc.abstractproperty. Add
# to this list to register other decorators that produce valid properties.
# These decorators are taken in consideration only for invalid-name.
property-classes=abc.abstractproperty

# Regular expression matching correct type variable names. If left empty, type
# variable names will be checked with the set naming style.
#typevar-rgx=

# Naming style matching correct variable names.
variable-naming-style=snake_case

# Regular expression matching correct variable names. Overrides variable-
# naming-style. If left empty, variable names will be checked with the set
# naming style.
#variable-rgx=


[IMPORTS]

# List of modules that can be imported at any level, not just the top level
# one.
allow-any-import-level=

# Allow wildcard imports from modules that define __all__.
allow-wildcard-with-all=no

# Analyse import fallback blocks. This can be used to support both Python 2 and
# 3 compatible code, which means that the block might have code that exists
# only in one or another interpreter, leading to false positives when analysed.
analyse-fallback-blocks=no

# Deprecated modules which should not be used, separated by a comma.
deprecated-modules=

# Output a graph (.gv or any supported image format) of external dependencies
# to the given file (report RP0402 must not be disabled).
ext-import-graph=

# Output a graph (.gv or any supported image format) of all (i.e. internal and
# external) dependencies to the given file (report RP0402 must not be
# disabled).
import-graph=

# Output a graph (.gv or any supported image format) of internal dependencies
# to the given file (report RP0402 must not be disabled).
int-import-graph=

# Force import order to recognize a module as part of the standard
# compatibility libraries.
known-standard-library=

# Force import order to recognize a module as part of a third party library.
known-third-party=enchant

# Couples of modules and preferred modules, separated by a comma.
preferred-modules=


[DESIGN]

# List of regular expressions of class ancestor names to ignore when counting
# public methods (see R0903)
exclude-too-few-public-methods=

# List of qualified class names to ignore when counting class parents (see
# R0901)
ignored-parents=

# Maximum number of arguments for function / method.
max-args=5

# Maximum number of attributes for a class (see R0902).
max-attributes=7

# Maximum number of boolean expressions in an if statement (see R0916).
max-bool-expr=5

# Maximum number of branch for function / method body.
max-branches=12

# Maximum number of locals for function / method body.
max-locals=15

# Maximum number of parents for a class (see R0901).
max-parents=7

# Maximum number of public methods for a class (see R0904).
max-public-methods=20

# Maximum number of return / yield for function / method body.
max-returns=6

# Maximum number of statements in function / method body.
max-statements=50

# Minimum number of public methods for a class (see R0903).
min-public-methods=2


[CLASSES]

# Warn about protected attribute access inside special methods
check-protected-access-in-special-methods=no

# List of method names used to declare (i.e. assign) instance attributes.
defining-attr-methods=__init__,
                      __new__,
                      setUp,
                      __post_init__

# List of member names, which should be excluded from the protected access
# warning.
exclude-protected=_asdict,
                  _fields,
                  _replace,
                  _source,
                  _make

# List of valid names for the first argument in a class method.
valid-classmethod-first-arg=cls

# List of valid names for the first argument in a metaclass class method.
valid-metaclass-classmethod-first-arg=cls


[EXCEPTIONS]

# Exceptions that will emit a warning when being caught. Defaults to
# "BaseException, Exception".
overgeneral-exceptions=BaseException,
                       Exception

```
</details>




### Main Tasks Completed in F0:

- Build,test and deploy two open source projects through pipeline jobs
- Implemented the new feature STATIC CODE ANALYSIS in the pipeline

### Learnings/Experiences in F0:

- Introduced to practical usage of pipelines
- Understood the general standards for the standard pipeline 
- While searching for new features , I learnt new things which is really helpful

### Issues faced in F0:

- Faced difficulties to find the projects which has test suites 
- Setting up the new step of static code analysis has opened many errors which are really tough to debug
- Different interpretations of ansible and shell commands
- Environment issues in windows made my job tough.

### Screenshots of Execution for F0:

##### Pipeline init

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/init_f0_1.png">
</p>

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/init_f0.png">
</p>

##### Calculator deployment on BLUE

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Calculator_Blue_server.png">
</p>

##### Calculator deployment on GREEN

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Calculator_Green_server.png">
</p>

##### Calculator TESTING 

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Testing_Calculator1.png">
</p>
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Testing_Calculator2.png">
</p>

##### Calculator STATIC CODE ANALYSIS 

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Static_Code_analysis_output.png">
</p>

##### BLUE GREEN STRATEGY

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Blue_green_strategy.png">
</p>

##### HEALTHCHECKS Deployment on BLUE

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Healthchecks_blue_server.png">
</p>

##### HEALTHCHECKS Deployment on GREEN

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Healthchecks_green_server.png">
</p>

##### HEALTHCHECKS TESTING

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/HealthChecks_testing.png">
</p>

##### HEALTHCHECKS STATIC CODE ANALYSIS

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Static_code_analysis_Healthchecks_output.png">
</p>

# Milestone 3 (Pipeline > Deployment)

### Project Team:

- Manvita Balachandra ( mbalach )
- Prithvish Rakesh Doshi ( pdoshi )
- Vijaya Durga Kona ( vkona )

### System Dependency for Milestone 3:
- Linux OS
- Windows OS
- MAC OS with Intel processor

### Project Specification for Milestone 3:

[View Project Specification](https://github.com/CSC-DevOps/Course/blob/master/Project/M3.md) 

### Screencast for Milestone 3:
[View Screencast](https://www.youtube.com/watch?v=evVUiWuww24)

### Steps to setup repository of Milestone 3:
- `git clone https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06.git`

- `cd DEVOPS-06`

- `npm install`

- `npm link`

<b>NOTE:</b> Please place the rsa file in DEVOPS-06 directory upon cloning

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

### Pipeline Commands to run Milestone 3:
`npm install`

`node index.js init`

Provision and configure computing environment for pipeline:

`pipeline init`
  
Trigger a build job, running steps outlined by build.yml, wait for output, and print build log:

`pipeline build itrust-build build.yml`<br>
`pipeline build mutation-coverage build.yml`

Provision and bring up the cloud VMs:<br>
`pipeline prod up`

Deploy itrust-deploy job to run with inventory file:<br>
`pipeline deploy inventory itrust-deploy build.yml`


### Template for .env file:
<b>Create .env file in the DEVOPS-06 directory:</b>`touch .env`

`GIT_TOKEN=<YOUR_GIT_ACCESS_TOKEN>`<br>
`GIT_REPO=github.ncsu.edu/engr-csc326-staff/iTrust2-v10.git`<br>
`MY_SQL_PASSWORD=devops-06`<br>
`VM_IP=192.168.56.10`<br>
`VM_USER=vagrant`<br>
`RSA_FINGERPRINT=<YOUR_RSA_FINGERPRINT>`

Once `prod up` is run, blue and green VM names and IP's write to the .env file

<b>NOTE:</b> Please use your personal GIT Access Token in place of `<YOUR_GIT_ACCESS_TOKEN>`

Set your digitalocean token on local system as below:
`setx DO_TOKEN <TOKEN>`

<b>NOTE:</b>
<br>
  Please use your personal digitalocean token in place of `<TOKEN>`<br>
  Please use your `<YOUR_RSA_FINGERPRINT>` to spawn your droplets from digitalocean

### Main Tasks Completed in Milestone 3:
- Ensure droplets are enabled on digitalocean with `pipeline prod up`
- Use SSH key for authentication for droplet creation
- Provision Digitalocean droplets via node js
- Script for `pipeline deploy` command
- Modification of iTrust2-v10 repository to ensure creation of war files
- Test iTrust deploy part using war files created by droplet
- Creating job specification for iTrust deployment using Tomcat
- Implementing blue green deployment stratergy on cloud servers
- Testing deployment script on blue/green servers

### Team Contirbution for Milestone 3:
- Ensure droplets are enabled on digitalocean with `pipeline prod up`: Prithvish Doshi
- Use SSH key for authentication for droplet creation: Prithvish and Vijaya Durga Kona
- Provision Digitalocean droplets via node js: Manvita Balachandra and Vijaya Durga Kona
- Script for `pipeline deploy` command: Vijaya Durga Kona
- Modification of iTrust2-v10 repository to ensure creation of war files: Manvita Balachandra and Prithvish Doshi
- Test iTrust deploy part using war files created by droplet: Manvita Balachandra
- Creating job specification for iTrust deployment using Tomcat: Manvita Balachandra and Prithvish Doshi and Vijaya Durga Kona
- Implementing blue green deployment stratergy on cloud servers: Prithvish Doshi and Vijaya Durga Kona and Manvita Balachandra
- Testing deployment script on blue/green servers: Vijaya Durga Kona and Manvita Balachandra and Prithvish Doshi

### Learnings/Experiences in Milestone 3:
- Time and Stress Management because of multiple submissions at the same time
- Blue Green Deployment stratergy
- Changes to be made for war file to execute
- Troubleshooting database password issues for iTrust2 login
- Running proxy for Blue/Green to deliver service with redirecting to a speceific server's application when one fails to render
- Using inventory file to run with generated details for blue/green deployment

### Issues Faced in Milestone 3:
- War file failing to execute on iTrust2-v10
- Modification of the iTrust codes to ensure war file is generated and able to render service
- Generalizing the IPs and access them dynamically
- Understanding and working of blue/green and proxy

### Screenshots of Execution for Checkpoint 3:

##### Pipeline init
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Windows_M2_init.png">
</p>

#### iTrust Job 
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/ItrustM2.PNG">
</p>


##### Mutation coverage job
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Windows_M2_mutation-coverage-build.png">
</p>

#### iTrust Deploy Job
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/M3deploy.PNG">
</p>

##### iTrust Deployment on Blue
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Blue.jpeg">
</p>

#### iTrust Deployment on Green 
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Green.jpeg">
</p>

#### iTrust Deployment on Proxy: 
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/proxy.jpeg">
</p>

### Project Board:

<p align = "center">
<img width=1200" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/1M3_ProjectBoard.PNG">
</p>

[View Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/projects/3)

### Issue Board:

<p align = "center">
<img width="1000" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/2M3_issues.PNG">
</p>

[View Issue Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/issues)

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
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Linux_M2_init.png">
</p>

##### iTrust Job
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Linux_M2_itrust-build.png">
</p>

##### Mutation coverage job
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Linux_M2_mutation-coverage.png">
</p>

#### Windows System:
##### Pipeline init
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Windows_M2_init.png">
</p>

#### iTrust Job 
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/ItrustM2.PNG">
</p>


##### Mutation coverage job
<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Windows_M2_mutation-coverage-build.png">
</p>

### Project Board:

<p align = "center">
<img width=1200" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Project-board-M2.PNG">
</p>

[View Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/projects/2)

### Issue Board:

<p align = "center">
<img width="1000" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Issue-board-M2.PNG">
</p>

[View Issue Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/issues)

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
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/2M1.PNG">
</p>

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/1M1.PNG">
</p>

#### Linux System:

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/linux_init_result.png">
</p>

<p align = "center">
<img width="900" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/linux_build_successful.png">
</p>

### Project Board:

<p align = "center">
<img width=1200" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Project-board-M1.PNG">
</p>

[View Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/projects/1)

### Issue Board:

<p align = "center">
<img width="1000" alt="image" src="https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/Images/Issue-board-M1.PNG">
</p>

[View Issue Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-06/issues)

### Screencast for Milestone 1:
[View Screencast](https://youtu.be/jHuGoz0y0QM)

### Checkpoint Report for Milestone 1:
[View CHECKPOINT-M1 Report](https://github.com/vijdurk/DEVOPS/blob/main/DEVOPS-06-F0-vkona/CHECKPOINT-M1.md)
