import CodeCoverageCharts = require("./CodeCoverageCharts");

VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/Build/RestClient", "TFS/TestManagement/RestClient"],
(WidgetHelpers, BuildRestClientProvider, TestRestClientProvider) => {
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("CodeCoverageCharts", () => {
        const codeCoverageCharts = new CodeCoverageCharts.CodeCoverageCharts(WidgetHelpers, BuildRestClientProvider, TestRestClientProvider);
        return codeCoverageCharts;
    });
    VSS.notifyLoadSucceeded();
});