module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Create a component dir/file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Component/Component.tsx.hbs",
      },
      // {
      //   type: "add",
      //   path: "src/components/{{pascalCase name}}/{{pascalCase name}}.test.js",
      //   templateFile: "plop-templates/Component/Component.test.js.hbs",
      // },
    ],
  });
};
