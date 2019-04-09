import React, {Component} from "react";
import {Instance} from "mobx-state-tree";
import {SimulatorStore} from "../model/Stores";
import {Card, CardContent, Typography} from "@material-ui/core";
import {observer} from "mobx-react";
import {Commons} from "../Commons";

interface SimulationHintComponentProps {
  simulator: Instance<typeof SimulatorStore>;
}

@observer
export class SimulationHintComponent extends Component<SimulationHintComponentProps> {

  constructor(props: Readonly<SimulationHintComponentProps>) {
    super(props);
  }

  private getVflHint() {
    const vflDiff = this.props.simulator.diffBetweenVFLAndRegularIncomeTax();
    if(vflDiff < 0 && !this.props.simulator.company.hasVFL) {
      return (
          <li>
            <Typography paragraph={true}>
              Si vous êtes éligible au versement fiscal libératoire, il serait intéressant d'en faire la demande.
              Vous économiseriez { Commons.getEuroAmountLabel(Math.abs(vflDiff)) } sur votre imposition.
            </Typography>
          </li>
      )
    } else if(vflDiff > 0 && this.props.simulator.company.hasVFL) {
      return (
          <li>
            <Typography paragraph={true}>
              L'option pour le VFL semble moins intéressante que l'IR.
              Sans VFL vous économiseriez { Commons.getEuroAmountLabel(vflDiff) } sur votre imposition.
            </Typography>
          </li>
        )
    } else if(vflDiff === 0){
      return (
          <li>
            <Typography paragraph={true}>
              Le choix du VFL ou de l'IR pour votre imposition ne fait pas de différence.
            </Typography>
          </li>
      )
    }
  }

  render() {
    return (
        <Card>
          <CardContent>
            <Typography variant={"h6"}>
              Analyses
            </Typography>
            <ul>
              {
                this.props.simulator.company.isFirstYear &&
                    <li>
                      <Typography paragraph={true}>
                        Votre CA maximum possible pour cette année est de { Commons.getEuroAmountLabel(this.props.simulator.grossAnnualIncomeProrataTemporisThreshold()) } HT.
                      </Typography>
                    </li>
              }
              {
                this.getVflHint()
              }
              {
                this.props.simulator.company.hasACCRE && this.props.simulator.accreMultiplier() === 1 &&
                <li>
                  <Typography paragraph={true}>
                    L'exonération de début d'activité (ex-ACCRE) n'a plus d'effet après la 3ème année de création de l'entreprise.
                  </Typography>
                </li>
              }
              {
                this.props.simulator.hasCrossedGrossAnnualRevenueThresholdProrataTemporis() &&
                <li>
                  <Typography paragraph={true}>
                    Le seuil de CA maximum possible pour cette année, de { Commons.getEuroAmountLabel(this.props.simulator.grossAnnualIncomeProrataTemporisThreshold()) } HT, a été dépassé.
                    Attention si vous dépassez ce seuil durant deux années consécutives vous passerez au régime réel d'imposition.
                  </Typography>
                </li>
              }
              {
                this.props.simulator.hasCrossedTvaThreshold() &&
                    <li>
                      <Typography paragraph={true}>
                        Le seuil de la franchise de base TVA, de { this.props.simulator.company.tvaThreshold} € HT, a été dépassé.
                        Il faudra facturer la TVA dès le 1er jour du mois de dépassement, vous passerez alors au régime réel simplifié de la TVA.
                      </Typography>
                    </li>
              }
            </ul>
          </CardContent>
        </Card>
    );
  }
}