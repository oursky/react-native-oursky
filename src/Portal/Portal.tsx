import React from "react";
import { PortalContext, PortalMethods, PortalKey } from "./PortalHost";

interface Props {
  portalMethods: PortalMethods;
  children: React.ReactNode;
}

class Portal_ extends React.Component<Props> {
  key: PortalKey = 0;

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

export default function Portal(props: { children: React.ReactNode }) {
  return (
    <PortalContext.Consumer>
      {methods => <Portal_ {...props} portalMethods={methods} />}
    </PortalContext.Consumer>
  );
}
