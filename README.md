# new-project
This module initialize a new node.js project. It have the next struct:
  client:
    - That folder contains all elements front-end. The struct is the next:
      - bower.json
      - css: Css Folder
      - index.html
      - js: Js Folder
      - Partials
        - Menus: Html menus
        - Page: Html Pages
      - pics


  server:
    - That folder contains all elements back-end. It have this struct:
      - apps: Menus back-end function
      - project-name.js: Node server
      - config: Express configuration
      - libs: Libs to postgres models
      - package.json
      - routes: Routes folder
