/** @odoo-module */

import { registry } from "@web/core/registry";
import { KpiCard } from "./kpi_card/kpi_card";
import { ChartRenderer } from "./chart_renderer/chart_renderer";
import { useService } from "@web/core/utils/hooks";
const { Component, onWillStart,useRef,onMounted, useState   } = owl;
const session = require('web.session');

export class OwlSalesDashboard extends Component {
    setup(){
        this.state = useState({
            quotations: {
                value: 15,
                percentage: 60,
                userId: session.uid,
            },
            period: 90,
            
        })
        this.orm = useService("orm");
        onWillStart(async () => {
            await this.getQuotations();
            console.log(this.state.quotations.userId)
        });
    }
    
    async getQuotations(){
        const data = await this.orm.searchCount("sale.order", [['state','in',['sent','draft']],['date_order','>',this.state.date]]);
        this.state.quotations.value = data;
        
    }

    async onChangePeriod() {

        console.log(moment().subtract(this.state.period, 'days').format('L'));
        console.log(moment().subtract(this.state.period, 'days').format('DD/MM/YYYY'));
        this.state.date =moment().subtract(this.state.period, 'days').format('L');
        await this.getQuotations();
    }
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard";
OwlSalesDashboard.components = { KpiCard, ChartRenderer };

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard);