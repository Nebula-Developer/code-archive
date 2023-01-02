# Globe - Lightweight templates for all of your projects

Globe is a lightweight templating engine that will improve your development process when starting new projects. It allows you to easily create templates for your projects using simple project-based syntax, allowing flexibility and a quick start to your projects.

## Usage

Globe uses a simple CLI to generate your projects. To use Globe, you must first build it using the provided Makefile, otherwise download the latest release from the [releases page](https://github.com/nebula-developer/globe/releases).

### Templates:

To add a template in globe, use the `globe add` command. This will create a new template in the `~/.globe/templates` directory. You can update the template with the `globe update` command if you made any changes.

To use a template, use the `globe new` command. This will run a short wizard to ask you for the project template you would like to use, and the name and description. Once complete, it will then add the project to the current directory.

If you want to use a template without the wizard, you can use the `globe new <template> "<name>" "<description>"` command (you may also just spesify a template).

## Syntax

Globe contains variables, which are surrounded by double curly braces. These variables can be used to insert data into your template based on the project. The following variables are available:

- `{{name}}` - The name of the project
- `{{description}}` - The description of the project
- `{{author}}` - The author of the project (Global)
- `{{year}}` - The current year
- `{{license}}` - The license of the project

### Note

Globe is written in C++ with the idea of being open to everyone. If you would like to design your own CLI, you can use the `globe` library to do so. You can find the library in the `src` directory. (main.cpp is the CLI currently used)