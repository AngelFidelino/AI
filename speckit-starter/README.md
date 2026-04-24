
Provides a user-friendly toot that allows users to calculate their loan payment and view a detailed amortization schedule.

Installation
	IDE
		Visual studio code + kilo code (plugin)
	UV
		install: powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
		uv --version
		
	PNPM (Optional). Fast, disk space efficient package manager
		iwr https://get.pnpm.io/install.ps1 -useb | iex
	
	Spec Kit CLI
		install: uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
		note: If you're getting certificate issues add: "--allow-insecure-host pypi.org --allow-insecure-host files.pythonhosted.org". Don’t do that unless you fully understand the risk. It disables SSL verification.
		specify check
		Alternative (One-time Use): Uv-version uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT>
		
		uv --allow-insecure-host pypi.org --allow-insecure-host files.pythonhosted.org sync
	
	Node
		Install a modern version (Node 18+ or 20+)
		
Create New Project
	specify init <project_name>

Initialize Existing Project
	cd <project_path>
	specify init --here
	Selected AI assistant: kilocode
	Selected script type: ps (for windows)
	

In kilo code in visual studio, create a new provider

In kilo chat, select the AI agent, then type "hello" and wait for ai agent response

/speckit.constitution : set governance principles like: 80% of code coverage, sanitize all user inputs, etc

/speckit.specify: specific feature & users stories. Focus on user needs not tech solutions (frameworks or libraries)
/speckit.clarify: Iterative.  identify unclear areas. Sample: what happens when filters return no result? do you want password reset option?
/speckit.plan: define tech requirements by specifying the tech, stacj, libraries, arch, tech preferences. Sample: "use spring with minimal libraries. Perefer spring data. Store frequent access data in a redis instance"
/speckit.analyze: OPTIONAL. quality cgeck before implementation to find issues before any code is written.
/speckit.implement: let the AI buil the app: configuration files & code created, dependencies installed, test written, documentation created

Create the constitution file. This is done only once. Then pass it to the /speckit.constitution command to avoid creating a huge prompt.
	/speckit.constitution @resources/preparation/constitution.md

Create the first specification
	