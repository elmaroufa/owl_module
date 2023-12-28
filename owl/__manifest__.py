# -*- coding: utf-8 -*-
{
    'name' : 'OWL Tutorial',
    'version' : '1.0',
    'summary': 'OWL Tutorial',
    'sequence': -1,
    'description': """OWL Tutorial""",
    'category': 'OWL',
    'depends' : ['base', 'web', 'sale', 'board'],
    'data': [
        'security/ir.model.access.csv',
        'views/todo_list.xml',
        'views/res_partner.xml',
    ],
    'demo': [
    ],
    'installable': True,
    'application': True,
    'assets': {
        'web.assets_backend': [
            'owl/static/src/components/*/*.js',
            'owl/static/src/components/*/*.xml',
            'owl/static/src/components/*/*.scss',
            'owl/static/src/components/dashboard/sales_dashboard.js',
            'owl/static/src/components/dashboard/sales_dashboard.xml',
            'owl/static/src/components/dashboard/kpi_card/kpi_card.js',
            'owl/static/src/components/dashboard/kpi_card/kpi_card.xml',
            'owl/static/src/components/dashboard/chart_renderer/chart_renderer.js',
            'owl/static/src/components/dashboard/chart_renderer/chart_renderer.xml',
        ],
    },
}