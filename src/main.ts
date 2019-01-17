import CoverageChartWidget = require("./CoverageChartWidget");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("CoverageChartWidget", () => {
        const coverageChartWidget = new CoverageChartWidget.CoverageChartWidget(WidgetHelpers);
        return coverageChartWidget;
    });
    VSS.notifyLoadSucceeded();
});