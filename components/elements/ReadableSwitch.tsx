import { Switch } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";
import IFieldValueProps from "../page-specific/app/producers/make-a-trace/MetadataForm/FieldValue/IFieldValueProps";

interface ReadableSwitchProps extends IFieldValueProps
{
    onChange: (state: boolean) => void
}

interface ReadableSwitchState
{
    isActive: boolean
}

export default class ReadableSwitch extends React.Component<ReadableSwitchProps, ReadableSwitchState>
{
    constructor( props: ReadableSwitchProps )
    {
        super(props);

        this.state = {
            isActive: this.props.defaultValue ?? false
        }
    }

    render(): ReactNode
    {
        return <Switch defaultChecked={this.state.isActive} onChange={() => {
            this.setState({
                isActive: !this.state.isActive
            },
            () => this.props.onChange( this.state.isActive )
            );
        }} />
    }
}