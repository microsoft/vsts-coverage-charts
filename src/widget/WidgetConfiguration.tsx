/// <reference types="vss-web-extension-sdk" />

import * as React from 'react';
import ReactDOM = require('react-dom');

import WidgetHelpers = require('TFS/Dashboards/WidgetHelpers');

import { CoverageChartConfigComponent } from './CoverageChartConfigComponent';

/** Demonstrates a widget configuration which:
 * 1-Deserializes existing settings
 * 2-Renders config UI with those settings
 * 3-Notifies widget contract of changes in configuration
 */
class WidgetConfiguration {

    public load() {

        var $reactContainer = $(".react-container");
        let container = $reactContainer.eq(0).get()[0];
        try {
            ReactDOM.render(<CoverageChartConfigComponent />, container);
        }
        catch (e) {
            return WidgetHelpers.WidgetStatusHelper.Failure(e);
        }

        // after all initial loading is done, signal to framework about sizing
        VSS.resize();
        return WidgetHelpers.WidgetStatusHelper.Success();
    }
}

VSS.register("CoverageChartWidget.Configuration", function () {
    let widgetConfiguration = new WidgetConfiguration();
    return widgetConfiguration;
});