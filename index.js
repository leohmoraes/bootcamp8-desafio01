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
const projects = [];
const timeStart = new Date().getTime();//Timestamp

server.use((req,res,next) => {
    console.time("performance");
    next();
    console.timeEnd("performance");
});

server.get("/projects/", (req,res) => {
    return res.json(projects);
});
server.post("/projects",(req,res) => {
    const id = generateUUID();
    const { title } = req.body;
    //const { tasks } = req.body.tasks; //array

    projects.push({ id : id, title: title }); //, tasks: tasks

    return res.status("201").json(projects);
});

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
