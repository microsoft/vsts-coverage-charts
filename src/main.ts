import CoverageChartWidget = require("./CoverageChartWidget");

VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/Build/RestClient"], (WidgetHelpers, RestClient) => {
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("CoverageChartWidget", () => {
        const coverageChartWidget = new CoverageChartWidget.CoverageChartWidget(WidgetHelpers, RestClient);
        return coverageChartWidget;
    });
    VSS.notifyLoadSucceeded();
});