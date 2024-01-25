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
        this.actionService = useService("action");
        onWillStart(async () => {
            await this.getQuotations();
            await this.getOrders();
        });
    }

    async onChangePeriod() {
        this.getDates();
        await this.getQuotations();
        await this.getOrders();
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
        this.state.quotations.percentage = percentage.toFixed(2);
        console.log(this.state.previous_date, this.state.current_date);
    }

    async getOrders(){
        let domain = [['state','in',['sale','done']]];
        if (this.state.period > 0){
            domain.push(['date_order','>',this.state.current_date]);
            console.log(this.state.previous_date);
        }
        const data = await this.orm.searchCount("sale.order",domain);
        //this.state.quotations.value = data;

        //previous_date
        let previous_domain = [['state','in',['sale','done']]];
        if (this.state.period > 0){
            previous_domain.push(['date_order','>',this.state.previous_date],['date_order','<=',this.state.current_date]);
        }
        const prev_data = await this.orm.searchCount("sale.order",previous_domain);
        const percentage = ((data - prev_data)/prev_data) * 100 ;
        //this.state.quotations.percentage = percentage.toFixed(2);

        // revenues
        const current_revenue = await this.orm.readGroup("sale.order", domain, ["amount_total:sum"], []);
        const previous_revenue = await this.orm.readGroup("sale.order", previous_domain, ["amount_total:sum"], []);
        const revenue_percentage = ((current_revenue[0].amount_total - previous_revenue[0].amount_total)/
        previous_revenue[0].amount_total) * 100

        // average
        const current_average = await this.orm.readGroup("sale.order", domain, ["amount_total:avg"], []);
        const previous_average = await this.orm.readGroup("sale.order", previous_domain, ["amount_total:avg"], []);
        const average_percentage = ((current_average[0].amount_total - previous_average[0].amount_total)/
        previous_average[0].amount_total) * 100
        

        this.state.orders = {
            value: data,
            percentage: percentage.toFixed(2),
            revenue: `${(current_revenue[0].amount_total/1000).toFixed(2)}K`,
            revenue_percentage : revenue_percentage.toFixed(2),
            average: `${(current_average[0].amount_total/1000).toFixed(2)}K`,
            average_percentage : average_percentage.toFixed(2)
        }
    }
    viewQuotations(){
        this.actionService.doAction("sale.action_quotations_with_onboarding");
    }
   
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard";
OwlSalesDashboard.components = { KpiCard, ChartRenderer };

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard);