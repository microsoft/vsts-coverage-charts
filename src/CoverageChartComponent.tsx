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
    builds: IBuildData[][]
}

export class CoverageChartComponent extends React.Component<ICoverageChartComponentProps, ICoverageChartComponentState> {

    constructor(props: ICoverageChartComponentProps) {
        super(props);
        this.state = {
            builds: new Array(props.settings.buildDefs.length)
        };
    }

    componentDidUpdate(prevProps: ICoverageChartComponentProps) {
        if (JSON.stringify(prevProps.settings.buildDefs) !== JSON.stringify(this.props.settings.buildDefs)) {
            this.setState({
                builds: new Array(this.props.settings.buildDefs.length)
            });
            this.fetchBuilds(this.props.settings.buildDefs);
        }
    }

    componentDidMount() {
        this.fetchBuilds(this.props.settings.buildDefs);
    }

    public render(): JSX.Element {
        const chartData = this.transformBuildDataIntoChartData();
        console.log("Transformed chartdata", chartData);

        return (
            <div className="widget-component">
                <h2 className="title">Coverage Charts</h2>
                <p>{`${this.state.builds.length} Builds`}</p>
                {chartData.map((singleChartData, idx: number) => {
                    console.log("rendering", singleChartData, idx);
                    return <LineChart width={600} height={300} data={singleChartData} syncId="vsts-coverage-charts">
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="branch" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="line" stroke="#82ca9d" />
                    </LineChart>;
                })}

            </div>
        );
    }

    private fetchBuilds(buildDefs: number[]) {
        var numBuilds = this.props.settings.numBuilds;
        buildDefs.map((buildDef: number, bdidx: number) => {
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
                numBuilds
            ).then((builds: Build[]) => {
                var count = 0;
                builds.map((b: Build, idx: number) => {
                    // fetch coverage for each build
                    this.props.testRestClient.getCodeCoverageSummary(context.project.id, b.id).then((summary: CodeCoverageSummary) => {
                        count++;
                        buildData.push({ build: b, coverage: summary });
                        buildData = buildData.sort((a: IBuildData, b: IBuildData) => a.build.id - b.build.id);
                        if (count === numBuilds) {
                            var newBuilds = [...this.state.builds.map((value: IBuildData[]) => [...value])];
                            newBuilds[bdidx] = buildData;
                            console.log(bdidx, count, newBuilds);
                            this.setState({
                                builds: newBuilds
                            });
                        }
                    });
                });
            });
        }
        )

    }

    private transformBuildDataIntoChartData() {
        let chartData = new Array(this.props.settings.buildDefs.length);
        console.log("Chardata", chartData);
        this.state.builds.map((buildsId: IBuildData[], bdidx: number) => {
            chartData[bdidx] = [];
            buildsId.map((bd: IBuildData, idx: number) => {
                var buildDataForChart = {
                    date: bd.build.finishTime.toUTCString(),
                    branch: bd.coverage.coverageData[0].coverageStats[0].covered / bd.coverage.coverageData[0].coverageStats[0].total,
                    line: bd.coverage.coverageData[0].coverageStats[1].covered / bd.coverage.coverageData[0].coverageStats[1].total
                };
                chartData[bdidx].push(buildDataForChart);
            });
        });

        return chartData;
    }
}
