import { NextRouter, withRouter } from "next/router"
import React from "react";
import { ReactNode } from "react"

interface ApplicationProps {
    router: NextRouter
}

interface ApplicationState {

}

class Application extends React.Component<ApplicationProps, ApplicationState>
{
    constructor(props: ApplicationProps)
    {
        super(props);
    }

    componentDidMount()
    {
        this.props.router.replace("/app/trace-it")
    }

    render(): ReactNode
    {
        return null;
    }

}

export default withRouter(Application);


