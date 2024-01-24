/** @odoo-module */

import { registry } from "@web/core/registry";
import { KpiCard } from "./kpi_card/kpi_card";
import { ChartRenderer } from "./chart_renderer/chart_renderer";
import { useService } from "@web/core/utils/hooks";
const { Component, onWillStart,useRef,onMounted, useState   } = owl;
//const session = require('web.session');

export class OwlSalesDashboard extends Component {
    setup(){
        this.state = useState({
            quotations: {
                value: 15,
                percentage: 60,
            },
            period: 90,
            
        })
        this.orm = useService("orm");
        onWillStart(async () => {
            await this.getQuotations();
           
        });
    }

    async onChangePeriod() {
        this.getDates();
        await this.getQuotations();
    }

    getDates(){
        this.state.current_date = moment().subtract(this.state.period, 'days').format('L');
        this.state.previous_date = moment().subtract(this.state.period * 2, 'days').format('L');
    }
    
    async getQuotations(){
        let domain = [['state','in',['sent','draft']]];
        if (this.state.period > 0){
            domain.push(['date_order','>',this.state.current_date]);
            console.log(this.state.previous_date);
        }
        const data = await this.orm.searchCount("sale.order",domain);
        this.state.quotations.value = data;

        //previous_date
        let previous_domain = [['state','in',['sent','draft']]];
        if (this.state.period > 0){
            previous_domain.push(['date_order','>',this.state.previous_date],['date_order','<=',this.state.current_date]);
        }
        const prev_data = await this.orm.searchCount("sale.order",previous_domain);
        const percentage = ((data - prev_data)/prev_data) * 100 ;
        this.state.quotations.percentage = percentage;
        console.log(this.state.previous_date, this.state.current_date);
    }

   
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard";
OwlSalesDashboard.components = { KpiCard, ChartRenderer };

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard);