import * as React from "react";
import * as ReactDOM from "react-dom";
import { CoverageChartComponent } from "./CoverageChartComponent";
import { WidgetSettings } from "./WidgetSettings";

export class CoverageChartWidget {
    constructor(public WidgetHelpers, public RestClient) { }

    public load(widgetSettings) {
        return this.showWidget(widgetSettings);
    }

    public reload(widgetSettings) {
        return this.showWidget(widgetSettings);
    }

    private showWidget(widgetSettings) {
        const $reactContainer = $("#react-container");
        const container = $reactContainer.eq(0).get()[0];

        // Extract settings from widgetSettings.customSettings and ask user to configure one if none is found
        let settings = <WidgetSettings>JSON.parse(widgetSettings.customSettings.data);
        if (!settings || !settings.buildDef) {
            console.log("Sorry nothing to show, please configure the settings");
            return this.WidgetHelpers.WidgetStatusHelper.Success();
        }

        ReactDOM.render(React.createElement(CoverageChartComponent, {
            settings: settings,
            restClient: this.RestClient.getClient()
        }), container);
        return this.WidgetHelpers.WidgetStatusHelper.Success();
    }
}