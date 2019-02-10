import CoverageChartWidget = require("./CoverageChartWidget");

VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/Build/RestClient", "TFS/TestManagement/RestClient"],
(WidgetHelpers, BuildRestClientProvider, TestRestClientProvider) => {
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("CoverageChartWidget", () => {
        const coverageChartWidget = new CoverageChartWidget.CoverageChartWidget(WidgetHelpers, BuildRestClientProvider, TestRestClientProvider);
        return coverageChartWidget;
    });
    VSS.notifyLoadSucceeded();
});