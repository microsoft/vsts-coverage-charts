import * as React from "react";
import * as ReactDOM from "react-dom";
import { CoverageChartConfigComponent } from "./CoverageChartConfigComponent";

VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
    WidgetHelpers.IncludeWidgetConfigurationStyles();
    VSS.register("CoverageChartWidget-Configuration", function () {
        // const $projectKey = $("#project-picker-input");
        // const $sonarUrl = $("#sonar-url-input");

        return {
            load: function (widgetSettings, widgetConfigurationContext) {
                const settings = JSON.parse(widgetSettings.customSettings.data);

                function configurationChange() {
                    const customSettings = {
                        data: JSON.stringify({
                            projectKey: "", // $projectKey.val(),
                            sonarUrl: "" // $sonarUrl.val()
                        })
                    };
                    const eventName = WidgetHelpers.WidgetEvent.ConfigurationChange;
                    const eventArgs = WidgetHelpers.WidgetEvent.Args(customSettings);
                    widgetConfigurationContext.notify(eventName, eventArgs);
                }

                const $reactContainer = $("#react-container");
                const container = $reactContainer.eq(0).get()[0];
                ReactDOM.render(React.createElement(CoverageChartConfigComponent), container);
                // VSS.resize();

                // if (settings) {
                //     if (settings.projectKey) {
                //         $projectKey.val(settings.projectKey);
                //     }
                //     if (settings.sonarUrl) {
                //         $sonarUrl.val(settings.sonarUrl);
                //     }
                // }
                // $projectKey.on("change", function () {
                //     configurationChange();
                // });
                // $sonarUrl.on("change", function () {
                //     configurationChange();
                // });

                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            onSave: function () {
                const customSettings = {
                    data: JSON.stringify({
                        projectKey: "", // $projectKey.val(),
                        sonarUrl: "" // $sonarUrl.val()
                    })
                };
                return WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
            }
        };
    });
    VSS.notifyLoadSucceeded();
});
