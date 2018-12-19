/// <reference types="vss-web-extension-sdk" />

import * as React from "react";
import * as ReactDOM from "react-dom";
// tslint:disable-next-line:no-require-imports no-implicit-dependencies
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
// tslint:disable-next-line:no-require-imports no-implicit-dependencies
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
        const size = {
            width: widgetSettings.size.columnSpan * 160 + 10,
            height: widgetSettings.size.rowSpan * 160 + 10
        };

        const $reactContainer = $(".react-container");
        // ensure widget occupies full available space
        $reactContainer
            .css("width", size.width)
            .css("height", size.height);


        const container = $reactContainer.eq(0).get()[0];
        ReactDOM.render(<CoverageChartComponent />, container); // as React.Component<any, any>;

        return WidgetHelpers.WidgetStatusHelper.Success();
    }
}

WidgetHelpers.IncludeWidgetStyles();
VSS.register("CoverageChartWidget.Widget", function (): Widget {
    return new Widget();
});
