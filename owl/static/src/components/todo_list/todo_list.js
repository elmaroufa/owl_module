/** @odoo-module  **/

import { registry } from '@web/core/registry';
const { Component, useState, onWillStart } = owl;
import { useService } from "@web/core/utils/hooks";

export class OwlTodoList extends Component{

    setup(){
        this.state = useState({
            task: {name: "", color: "#FF0000", completed: false},
            taskList: [],
            isEdit: false,
            activeId: false
        })
        this.orm = useService("orm")
        this.model = "owl.todo.list";
        onWillStart( async ()=> {
            await this.getAllTasks()
        })
    }

    async getAllTasks(){
        this.state.taskList = await this.orm.searchRead(this.model,[], ["name", "color", "completed"])
    }

    addTask(){

    }

    editTask(task){
        this.state.activeId = task.id
        this.state.isEdit = true
        this.state.task = {...task}
    }

    async saveTask(){

       if(!this.state.isEdit){
        await this.orm.create(this.model, [this.state.task]);
       }else{
        await this.orm.write(this.model, [this.state.activeId], this.state.task);
       }
       
       await this.getAllTasks();
    }

}

OwlTodoList.template = 'owl.TodoList'
registry.category('actions').add('owl.action_owl_todo_list_js', OwlTodoList);