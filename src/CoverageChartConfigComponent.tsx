import * as React from "react";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export class DropdownBasicExample extends React.Component<
    {},
    {
        selectedItem?: { key: string | number | undefined };
        selectedItems: string[];
    }
    > {

    constructor(props: {}) {
        super(props);
        this.state = {
            selectedItem: undefined,
            selectedItems: []
        };
    }
    public render() {
        const { selectedItem, selectedItems } = this.state;

        return (
            <div>
                <Dropdown
                    label="Controlled example:"
                    selectedKey={selectedItem ? selectedItem.key : undefined}
                    onChange={this.changeState}
                    onFocus={() => console.log('onFocus called')}
                    onBlur={() => console.log('onBlur called')}
                    placeholder="Select an Option"
                    options={[
                        { key: 'A', text: 'Option a' },
                        { key: 'B', text: 'Option b' },
                        { key: 'C', text: 'Option c' },
                        { key: 'D', text: 'Option d' },
                        { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
                        { key: 'E', text: 'Option e' },
                        { key: 'F', text: 'Option f' },
                        { key: 'G', text: 'Option g' }
                    ]}
                />
            </div>
        );
    }

    public changeState = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        console.log('here is the things updating...' + item.key + ' ' + item.text + ' ' + item.selected);
        this.setState({ selectedItem: item });
    };
}

export class CoverageChartConfigComponent extends React.Component {

    public render() {
        return (
            <div className="widget-component">
                <DropdownBasicExample />
                <h2 className="title">Coverage Charts Config</h2>
                <p>Coming soon...</p>
            </div>
        );
    }
}
