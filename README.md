## hello-world-go-action
---

This repository was creates as a 
proof of concept for writing Github Actions in Go. The structure of the repository is simple to enable its core functionality, and borrows a lot of ideas from the following articles to achieve the result we would like: [How We Write GitHub Actions in Go](https://full-stack.blend.com/how-we-write-github-actions-in-go.html) and [go-githubactions](https://github.com/sethvargo/go-githubactions). I further integrated GitHub Actions workflows to automatically build and commit binaries to the repository, so this process need not be done manually. This can be seen in the **buildgo.yaml** action. Our simple action call can be seen in **greet.yaml**, where we can see that we do infact call our repository to say hello!

### Structure

It is possible to write custom GitHub Actions which can then be used from your workflows with the `uses` directive. We want to write this Action in Go, which according to GitHub, *is* possible, however, if you write an Action in anything but JavaScript, then it cannot run natively, and you will need to run it either non-natively, or using a container, which can either be built and run within an action, or can be pulled from a container registry and run. These approached both come with their downsides however. Outlined in more detail in "How We Write GitHub Actions in Go" above, but to summarize, both running non-natively and as a container introduce significant slowdowns in the running time of any Action that uses it. There is another approach however, because Go can be built and packaged essentially as a single binary, we can then introduce a small JavaScript shim to call our binary. In our case, our small JS shim is `index.js` and we compile all our `main.go` binaries into the `bins` folder. All of this work is directly based off of the above resources. 

#### index.js
This file essentially discovers what os and architecture we are working with, then runs the relevant binary as a subprocess. We inherit the stdIO from our parent process so that log messages and any variables set within our Go environment are readable by JavaScript, but other than this, there is nothing to special here.

#### main.go
Our `main.go` file essentially just recreates the GitHub JavaScript Hello World Action within go. We get an input variable, and then log some messages and send back an output, which is read by our workflow.

#### buildgo.yaml
This workflow essentially builds our Go binaries and commits them back into our repository in the `bins` folder. Some of the key points to notice here are the use of GitHub artifacts to pass the compiled binaries between our isolated matrix run environments, and a consolidated commit environment from where we can commit all our builds together. The rest of the workflow is standard for building Go binaries. Eventually, testing will be added here to make this process more complete and error resistant.

#### greet.yaml
This is essentially GitHub's Hello World example for actions, we call our custom GitHub action to greet ourselves

#### action.yaml
This is essentially the configuration for our action. We define any input variables required, output variables, as well as our entrypoint, which is our JavaScript shim.
