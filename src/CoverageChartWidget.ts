import * as React from "react";
import * as ReactDOM from "react-dom";
import { CoverageChartComponent } from "./CoverageChartComponent";

export class CoverageChartWidget {
    constructor(
        public WidgetHelpers ) { }

    public load(widgetSettings) {
        return this.showWidget(widgetSettings);
    }

    public reload(widgetSettings) {
        return this.showWidget(widgetSettings);
    }

    private showWidget(widgetSettings) {
        const $reactContainer = $("#react-container");
        const container = $reactContainer.eq(0).get()[0];
        ReactDOM.render(React.createElement(CoverageChartComponent), container);

        // Extract settings from widgetSettings.customSettings and ask user to configure one if none is found
        let settings = JSON.parse(widgetSettings.customSettings.data);
        if (!settings || !settings.projectKey || !settings.sonarUrl  ) {
            console.log("Sorry nothing to show, please configure the settings");
            return this.WidgetHelpers.WidgetStatusHelper.Success();
        }

        try {
            return $.getJSON( settings.sonarUrl + settings.projectKey, (data) => {
                // if (data.projectStatus.status === "OK") {
                //     $span.text("passed");
                //     $span.addClass("level levelOk");
                // }
                // else {
                //     $span.text("failed");
                //     $span.addClass("level levelFailed");
                // }
                // $container.append($span);
                return this.WidgetHelpers.WidgetStatusHelper.Success();
            });
        } catch (e) {
            console.log(e);
        }
    }
}