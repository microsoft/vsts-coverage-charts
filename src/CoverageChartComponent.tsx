import * as React from "react";
import { WidgetSettings } from "./WidgetSettings";
import { BuildHttpClient } from "TFS/Build/RestClient";
import { BuildStatus, BuildResult, Build } from "TFS/Build/Contracts";

interface ICoverageChartComponentProps {
    settings: WidgetSettings;
    restClient: BuildHttpClient;
}

interface ICoverageChartComponentState {
    builds: Build[];
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
        return (
            <div className="widget-component">
                <h2 className="title">Coverage Charts</h2>
                <p>{`${this.state.builds.length} Builds`}</p>
            </div>
        );
    }

    private fetchBuilds(buildDef: number) {
        var context = VSS.getWebContext();
        this.props.restClient.getBuilds(context.project.id,
            [buildDef],
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            BuildStatus.Completed,
            BuildResult.Succeeded
        ).then((builds: Build[]) => {
            this.setState({
                builds: builds
            })
        });
    }
}
