import * as React from "react";
import * as ReactDOM from "react-dom";
import { CoverageChartComponent } from "./CoverageChartComponent";
import { WidgetSettings } from "./WidgetSettings";

export class CodeCoverageCharts {
    constructor(public WidgetHelpers, public BuildRestClientProvider, public TestRestClientProvider) { }

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
        settings.size = widgetSettings.size;
        if (!settings || !settings.buildDefs || settings.buildDefs.length === 0) {
            console.log("Sorry nothing to show, please configure the settings");
            settings = {
                buildDefs: [],
                numBuilds: 5,
                size: widgetSettings.size,
                showLineCoverage: true,
                yaxisRange: 1
            };
        }

        ReactDOM.render(React.createElement(CoverageChartComponent, {
            settings: settings,
            buildRestClient: this.BuildRestClientProvider.getClient(),
            testRestClient: this.TestRestClientProvider.getClient()
        }), container);
        return this.WidgetHelpers.WidgetStatusHelper.Success();
    }
}