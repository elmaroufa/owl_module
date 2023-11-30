/** @odoo-module  **/

import { registry } from '@web/core/registry';
import { kanbanView } from '@web/views/kanban/kanban_view';
import { KanbanController } from '@web/views/kanban/kanban_controller';
import { useService } from "@web/core/utils/hooks";
const { onWillStart } = owl;

class ResPartnerKanbanController extends KanbanController {

    setup(){
        super.setup();
        console.log("This is res partner kanban controller ");
        this.action = useService("action");
        this.orm =  useService("orm");

        onWillStart(async ()=> {
            this.customerLocation = await this.orm.readGroup("res.partner",
            [], ['state_id'], ['state_id']
            );
            console.log(this.customerLocation);
        })
    }

    openSalesView(){
        console.log("open sale views");
        this.action.doAction({
            type: "ir.actions.act_window",
            name: "Customer Sales",
            res_model: "sale.order",
            views: [[false, "list"], [false, "form"]]
        })
    }
}

export const resPartnerKanbanView = {
    ...kanbanView,
    Controller : ResPartnerKanbanController,
    buttonTemplate: "owl.ResPartnerKanbanController.Buttons",
}

registry.category("views").add("res_partner_kanban_view", resPartnerKanbanView)