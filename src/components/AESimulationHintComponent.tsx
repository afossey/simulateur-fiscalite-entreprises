import React, {Component} from "react";
import {Instance} from "mobx-state-tree";
import {AEStore} from "../model/Stores";
import {Card, CardContent, Typography} from "@material-ui/core";
import {observer} from "mobx-react";

interface AESimulationHintComponentProps {
  aeStore: Instance<typeof AEStore>;
}

@observer
export class AESimulationHintComponent extends Component<AESimulationHintComponentProps> {

  constructor(props: Readonly<AESimulationHintComponentProps>) {
    super(props);
  }

  render() {
    return (
        <Card>
          <CardContent>
            <Typography variant={"h6"}>
              Conseils
            </Typography>
            <ul>
                {
                  this.props.aeStore.hasCrossedTvaThreshold() &&
                      <li>
                        <Typography paragraph={true}>
                          Le seuil de la franchise de base TVA a été dépassé.
                          Il faudra facturer la TVA à partir de { this.props.aeStore.businessData().tvaThreshold} €.
                          Vous passerez alors au régime réel simplifié de la TVA.
                        </Typography>
                      </li>
                }
            </ul>
          </CardContent>
        </Card>
    );
  }
}

const styles = {
  hintComponent: {
    paddingRight: 15,
    paddingLeft: 5
  }
};