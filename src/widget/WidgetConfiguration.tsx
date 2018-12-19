/// <reference types="vss-web-extension-sdk" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CoverageChartConfigComponent } from "./CoverageChartConfigComponent";
// tslint:disable-next-line:no-require-imports no-implicit-dependencies
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");

class WidgetConfiguration {

    public load() {

        const $reactContainer = $(".react-container");
        const container = $reactContainer.eq(0).get()[0];
        try {
            ReactDOM.render(<CoverageChartConfigComponent />, container);
        } catch (e) {
            return WidgetHelpers.WidgetStatusHelper.Failure(e);
        }

        // after all initial loading is done, signal to framework about sizing
        VSS.resize();
        return WidgetHelpers.WidgetStatusHelper.Success();
    }
}

VSS.register("CoverageChartWidget.Configuration", () => {
    return new WidgetConfiguration();
});
