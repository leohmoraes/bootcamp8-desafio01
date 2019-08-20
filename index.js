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
var projects = [];
var requisicoes = 0;
var id = 1;

const timeStart = new Date().getTime();//Timestamp

server.use((req,res,next) => {
    console.time("performance");
    requisicoes++;
    next();
    console.timeEnd("performance");
    console.log("total de requisicoes",requisicoes);
});

server.get("/projects/", (req,res) => {
    return res.json(projects);
});

server.get("/projects/:id",(req,res) => {
    const { id } = req.params;

    var project =  projects.find(
        (it) => {
          return it.id === id;
        }
     );

    return res.json(project);
});

server.put("/projects/:id", (req,res) => {
    const { id } = req.params;
    const { title } = req.body;

    for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === id) {
          projects[i].title = title;
          break;
        }
    }

    return res.json(projects);    
});

server.delete("/projects/:id",checkID,(req,res) => {
    const { id } = req.params;

    const dataRemoved = projects.filter((el) => {
        return el.id != id;
    });
    //var deletedItem = projects.splice(index,1);

    projects = dataRemoved;
    return res.json(projects);

});

server.post("/projects",(req,res) => {
    //const id = id; //generateUUID();
    const { title } = req.body;
    //const { tasks } = req.body.tasks; //array

    projects.push({ id : id, title: title }); //, tasks: tasks
    id++;

    return res.status("201").json(projects);
});

server.post("/projects/:id/tasks",checkID,(req,res) => {
    const { title } = req.body;
    const { id } = req.params;

    for (var i = 0; i < projects.length; i++) {
        var current = projects[i];
        if (current.id == id) {
          if(current.tasks) {
             current.tasks.push(title);
             break;
          } 
            current.tasks = [title];
            break;
        }
    }

    return res.json(projects);    
});

function checkID(req,res,next) {
    const { id } = req.params;

    var project =  projects.find(
        (it) => {
            if(it.id == id) {
                return next();
            }
        }
    );

    return res.status(404).json( { error: "ID não encontrado" });
}
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
