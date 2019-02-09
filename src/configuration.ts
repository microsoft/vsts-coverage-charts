import * as React from "react";
import * as ReactDOM from "react-dom";
import { CoverageChartConfigComponent } from "./CoverageChartConfigComponent";
import { WidgetSettings } from "./WidgetSettings";

VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/Build/RestClient"], function (WidgetHelpers, RestClient) {
    WidgetHelpers.IncludeWidgetConfigurationStyles();
    VSS.register("CoverageChartWidget-Configuration", function () {
        let settings;

        return {
            load: function (widgetSettings, widgetConfigurationContext) {
                settings = <WidgetSettings> JSON.parse(widgetSettings.customSettings.data);

                function onSettingsChanged (newSettings: WidgetSettings) {
                    settings = newSettings;
                    const customSettings = {
                        data: JSON.stringify(newSettings)
                    };
                    const eventName = WidgetHelpers.WidgetEvent.ConfigurationChange;
                    const eventArgs = WidgetHelpers.WidgetEvent.Args(customSettings);
                    widgetConfigurationContext.notify(eventName, eventArgs);
                }

                const $reactContainer = $("#react-container");
                const container = $reactContainer.eq(0).get()[0];

                ReactDOM.render(React.createElement(CoverageChartConfigComponent, {
                    restClient: RestClient.getClient(),
                    initialSettings: settings,
                    onSettingsChanged: (newSettings: WidgetSettings) => onSettingsChanged(newSettings)
                }), container);
                VSS.resize();

                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            onSave: function () {
                const customSettings = {
                    data: JSON.stringify(settings)
                };
                return WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
            }
        };
    });
    VSS.notifyLoadSucceeded();
});