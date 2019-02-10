import * as React from "react";
import { WidgetSettings } from "./WidgetSettings";
import { BuildHttpClient } from "TFS/Build/RestClient";
import { TestHttpClient } from "TFS/TestManagement/RestClient";
import { BuildStatus, BuildResult, Build } from "TFS/Build/Contracts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CodeCoverageSummary } from "TFS/TestManagement/Contracts";

interface IBuildData {
    build: Build;
    coverage: CodeCoverageSummary
}

interface ICoverageChartComponentProps {
    settings: WidgetSettings;
    buildRestClient: BuildHttpClient;
    testRestClient: TestHttpClient;
}

interface ICoverageChartComponentState {
    builds: IBuildData[]
}

export class CoverageChartComponent extends React.Component<ICoverageChartComponentProps, ICoverageChartComponentState> {

    constructor(props: ICoverageChartComponentProps) {
        super(props);
        this.state = {
            builds: []
        };
    }

    getDerivedStateFromProps(props: ICoverageChartComponentProps, state: ICoverageChartComponentState) {
        this.fetchBuilds(props.settings.buildDef);
    }

    componentDidUpdate(prevProps: ICoverageChartComponentProps) {
        if (prevProps.settings.buildDef !== this.props.settings.buildDef) {
            this.fetchBuilds(this.props.settings.buildDef);
        }
    }

    componentDidMount() {
        this.fetchBuilds(this.props.settings.buildDef);
    }

    public render(): JSX.Element {
        const chartData = this.transformBuildDataIntoChartData();

        return (
            <div className="widget-component">
                <h2 className="title">Coverage Charts</h2>
                <p>{`${this.state.builds.length} Builds`}</p>
                <LineChart width={600} height={300} data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="branch" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="line" stroke="#82ca9d" />
                </LineChart>
            </div>
        );
    }

    private fetchBuilds(buildDef: number) {
        var buildData = [];

        var context = VSS.getWebContext();
        this.props.buildRestClient.getBuilds(context.project.id,
            [buildDef],
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            BuildStatus.Completed,
            BuildResult.Succeeded,
            undefined,
            undefined,
            5
        ).then((builds: Build[]) => {
            builds.map((b: Build, idx: number) => {
                // fetch coverage for each build
                this.props.testRestClient.getCodeCoverageSummary(context.project.id, b.id).then((summary: CodeCoverageSummary) => {
                    buildData.push({ build: b, coverage: summary });
                    buildData = buildData.sort((a: IBuildData, b: IBuildData) => a.build.id - b.build.id);
                    this.setState({
                        builds: buildData
                    });
                });
            });
        });
    }

    private transformBuildDataIntoChartData() {
        let chartData = [];
        this.state.builds.map((bd: IBuildData, idx: number) => {
            var buildDataForChart = {
                date: bd.build.finishTime.toUTCString(),
                branch: bd.coverage.coverageData[0].coverageStats[0].covered / bd.coverage.coverageData[0].coverageStats[0].total,
                line: bd.coverage.coverageData[0].coverageStats[1].covered / bd.coverage.coverageData[0].coverageStats[1].total
            };
            chartData.push(buildDataForChart);
        });

        return chartData;
    }
}
