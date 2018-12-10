/// <reference types="vss-web-extension-sdk" />

import * as React from "react";
import ReactDOM = require("react-dom");

import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import WidgetContracts = require("TFS/Dashboards/WidgetContracts");

import { CoverageChartComponent } from "./CoverageChartComponent";

export class Widget {
    public load(widgetSettings: WidgetContracts.WidgetSettings) {
        return this.render(widgetSettings);
    }

    public reload(widgetSettings: WidgetContracts.WidgetSettings) {
        return this.render(widgetSettings);
    }

    private render(widgetSettings: WidgetContracts.WidgetSettings) {
        let size = {
            width: widgetSettings.size.columnSpan * 160 + 10,
            height: widgetSettings.size.rowSpan * 160 + 10
        };

        var $reactContainer = $(".react-container");
        // ensure widget occupies full available space
        $reactContainer
            .css("width", size.width)
            .css("height", size.height);


        let container = $reactContainer.eq(0).get()[0];
        ReactDOM.render(<CoverageChartComponent />, container); // as React.Component<any, any>;

        return WidgetHelpers.WidgetStatusHelper.Success();
    }
}

WidgetHelpers.IncludeWidgetStyles();
VSS.register("CoverageChartWidget.Widget", function (): Widget {
    return new Widget();
});
