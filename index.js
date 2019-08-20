const express = require("express");

const server = express();

server.use(express.json());

/**
 * ROTAS:
 * POST /projects {id, titulo, tasks[]}
 * GET /projects
 * PUT /projects/:id
 * DELETE /projects/:id
 * POST /projects/:id/tasks {title}
 */

 /**
 * Utilizamos a variável `requisicoes` como
 * `let` porque vai sofrer mutação. A variável
 * `projects` poderia ser `const` porque é um `array`,
 * mas ao redefinir ela não conseguimos permissão
 */
var projects = [];
let requisicoes = 0;
var id = 1;

const timeStart = new Date().getTime();//Timestamp

/**
 * Middleware que dá log no número de requisições
 */
server.use((req,res,next) => {
    console.time("performance");
    requisicoes++;
    next();
    console.timeEnd("performance");
    console.log("total de requisicoes",requisicoes);
});

/**
 * Projects
 */
server.get("/projects/", (req,res) => {
    return res.json(projects);
});

/**
 * Project ID
 */
server.get("/projects/:id",checkID, (req,res) => {
    const { id } = req.params;

    var project =  projects.find(
        (it) => {
          return it.id == id;
        }
     );
    // const project = projects.find(p => p.id == id); //OK Gabarito

    return res.json(project);
});

/**
 * Atualizacao do Projeto
 */
server.put("/projects/:id", checkID,(req,res) => {
    const { id } = req.params;
    const { title } = req.body;

    // for (var i = 0; i < projects.length; i++) {
    //     if (projects[i].id == id) {
    //       projects[i].title = title;
    //       break;
    //     }
    // } //versao Leo OK
    const project = projects.find(p => p.id == id);
    project.title = title;

    return res.json(project);    
});

/**
 * Exclusao do Projeto
 */
server.delete("/projects/:id",checkID,(req,res) => {
    const { id } = req.params;

    const dataRemoved = projects.filter((el) => {
        return el.id != id;
    });
    // projects = dataRemoved; //Nao pode ser const!! 
    const projectIndex = projects.findIndex(p => p.id == id);
    projects.splice(projectIndex, 1);

    return res.send(); //retorna vazio

});

/**
 * Projects NEW
 */
server.post("/projects",(req,res) => {
    //const id = id; //generateUUID();
    const { title } = req.body;

    const project = {
        id,
        title,
        tasks: []
      };

    projects.push(project);
    id++;

    return res.status("201").json(projects);
});

/**
 * Nova Tarefa do projeto
 */
server.post("/projects/:id/tasks",checkID,(req,res) => {
    const { title } = req.body;
    const { id } = req.params;

    // for (var i = 0; i < projects.length; i++) {
    //     var current = projects[i];
    //     if (current.id == id) {
    //       if(current.tasks) {
    //          current.tasks.push(title);
    //          break;
    //       } 
    //         current.tasks = [title];
    //         break;
    //     }
    // } //Leo
    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);    
});

/**
 * Middleware que checa se o projeto existe
 */
function checkID(req,res,next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) {
      return res.status(404).json({ error: 'ID não encontrado' });
    }
  
    return next();
}

/**
 * Gera um Hash ID, estilo MongoDB
 */
function generateUUID() { // Public Domain/MIT
    var d = timeStart;
    const timeEnd = new Date().getTime();//Timestamp console.timeStamp("performance");
    var d2 = ((timeEnd-timeStart)*1000);//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

server.listen(3001);
