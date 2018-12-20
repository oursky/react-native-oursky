// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";

type PortalKey = number;
export type PortalMethods = {
  mount: (children: React.Node) => PortalKey,
  update: (key: PortalKey, children: React.Node) => void,
  unmount: (key: PortalKey) => void,
};

type RenderedPortal = {
  key: PortalKey,
  children: React.Node,
};

type Props = {
  children: React.Node,
};

type State = {
  portalMethods: PortalMethods,
  portals: RenderedPortal[],
};

export const PortalContext = React.createContext<PortalMethods>((null: any));

class PortalHost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.nextPortalKey = 0;
    this.state = {
      portals: [],
      portalMethods: {
        mount: this.mount,
        update: this.update,
        unmount: this.unmount,
      },
    };
  }

  mount = (children: React.Node): PortalKey => {
    const portalKey = this.nextPortalKey++;
    this.setState(prevState => ({
      portals: [
        ...prevState.portals,
        {
          key: portalKey,
          children,
        },
      ],
    }));
    return portalKey;
  };

  update = (key: PortalKey, children: React.Node) => {
    this.setState(prevState => ({
      portals: prevState.portals.map(portal => {
        if (portal.key === key) {
          return {
            key,
            children,
          };
        }
        return portal;
      }),
    }));
  };

  unmount = (key: PortalKey) => {
    this.setState(prevState => ({
      portals: prevState.portals.filter(p => p.key !== key),
    }));
  };

  renderPortals() {
    return this.state.portals.map(portal => (
      <View
        key={portal.key}
        style={StyleSheet.absoluteFill}
        collapsable={false}
        pointerEvents="box-none"
      >
        {portal.children}
      </View>
    ));
  }

  render() {
    return (
      <PortalContext.Provider value={this.state.portalMethods}>
        {this.props.children}
        {this.renderPortals()}
      </PortalContext.Provider>
    );
  }
}

export default PortalHost;
