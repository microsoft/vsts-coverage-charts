import { WidgetSize } from "TFS/Dashboards/Contracts";

export class WidgetSettings {
    buildDefs: number[];
    numBuilds: number;
    size: WidgetSize;
    showLineCoverage: boolean;
    yaxisRange: number;
}