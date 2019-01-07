import React from "react";
import { StyleSheet, View } from "react-native";

export type PortalKey = number;

export interface PortalMethods {
  mount: (children: React.ReactNode) => PortalKey;
  update: (key: PortalKey, children: React.ReactNode) => void;
  unmount: (key: PortalKey) => void;
}

interface RenderedPortal {
  key: PortalKey;
  children: React.ReactNode;
}

interface Props {
  children: React.ReactNode;
}

interface State {
  portalMethods: PortalMethods;
  portals: RenderedPortal[];
}

export const PortalContext = React.createContext<PortalMethods>(null as any);

class PortalHost extends React.Component<Props, State> {
  nextPortalKey: PortalKey;

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

  mount = (children: React.ReactNode): PortalKey => {
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

  update = (key: PortalKey, children: React.ReactNode) => {
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
