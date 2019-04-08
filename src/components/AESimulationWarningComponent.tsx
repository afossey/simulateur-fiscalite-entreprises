import React, {Component} from "react";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export class AESimulationWarningComponent extends Component {

  constructor(props: Readonly<any>) {
    super(props);
  }

  render() {
    return(
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography align={"justify"} color={"secondary"}>
              La simulation suivante est une approximation se basant sur les données de l'année 2019.
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography paragraph={true} align={"justify"}>
              Elle omet volontairement :
              <ul>
                <li>
                  Les taux de la contribution à la formation professionnelle (CFP) ainsi que les taxes pour frais de chambre consulaire qui sont assez spécifiques et ne représentent que 0.2% à 0.7% de charges environ.
                </li>
                <li>
                  La cotisation foncière des entreprises (CFE) dont les modalités d'éligibilité et de calcul sont complexes.
                </li>
              </ul>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
    );
  }
}