// @flow
import * as React from "react";
import { PortalContext } from "./PortalHost";
import type { PortalMethods } from "./PortalHost";

type Props = {
  portalMethods: PortalMethods,
  children: React.Node,
};

class Portal_ extends React.Component<Props> {
  key: any;

  componentDidMount() {
    this.key = this.props.portalMethods.mount(this.props.children);
  }

  componentDidUpdate() {
    this.props.portalMethods.update(this.key, this.props.children);
  }

  componentWillUnmount() {
    this.props.portalMethods.unmount(this.key);
  }

  render() {
    return null;
  }
}

export default function Portal(props: { children: React.Node }) {
  return (
    <PortalContext.Consumer>
      {methods => <Portal_ {...props} portalMethods={methods} />}
    </PortalContext.Consumer>
  );
}
