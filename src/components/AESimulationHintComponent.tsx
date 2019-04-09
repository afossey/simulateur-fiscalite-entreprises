import React, {Component} from "react";
import {Instance} from "mobx-state-tree";
import {AEStore} from "../model/Stores";
import {Card, CardContent, Typography} from "@material-ui/core";
import {observer} from "mobx-react";
import {Commons} from "../Commons";

interface AESimulationHintComponentProps {
  aeStore: Instance<typeof AEStore>;
}

@observer
export class AESimulationHintComponent extends Component<AESimulationHintComponentProps> {

  constructor(props: Readonly<AESimulationHintComponentProps>) {
    super(props);
  }

  private getVflHint() {
    const vflDiff = this.props.aeStore.diffBetweenVFLAndRegularIncomeTax();
    if(vflDiff < 0) {
      return (
          <li>
            <Typography paragraph={true}>
              Si vous êtes éligible au versement fiscal libératoire, il serait intéressant d'en faire la demande.
              Vous gagneriez { Commons.getEuroAmountLabel(Math.abs(vflDiff)) } sur votre imposition comparée à l'IR.
            </Typography>
          </li>
      )
    } else if(vflDiff > 0) {
      return (
          <li>
            <Typography paragraph={true}>
              L'option pour le VFL semble moins intéressante que l'IR.
              Vous perdriez { Commons.getEuroAmountLabel(vflDiff) } sur votre imposition.
            </Typography>
          </li>
        )
    } else {
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
                this.props.aeStore.companyData.isFirstYear &&
                    <li>
                      <Typography paragraph={true}>
                        Votre CA maximum possible pour cette année est de { Commons.getEuroAmountLabel(this.props.aeStore.grossAnnualIncomeProrataTemporisThreshold()) } HT.
                      </Typography>
                    </li>
              }
              {
                this.getVflHint()
              }
              {
                this.props.aeStore.hasACCRE && this.props.aeStore.accreMultiplier() === 1 &&
                <li>
                  <Typography paragraph={true}>
                    L'exonération de début d'activité (ex-ACCRE) n'a plus d'effet après la 3ème année de création de l'entreprise.
                  </Typography>
                </li>
              }
              {
                this.props.aeStore.hasCrossedGrossAnnualRevenueThresholdProrataTemporis() &&
                <li>
                  <Typography paragraph={true}>
                    Le seuil de CA maximum possible pour cette année, de { Commons.getEuroAmountLabel(this.props.aeStore.grossAnnualIncomeProrataTemporisThreshold()) } HT, a été dépassé.
                    Attention si vous dépassez ce seuil durant deux années consécutives vous passerez au régime réel d'imposition.
                  </Typography>
                </li>
              }
              {
                this.props.aeStore.hasCrossedTvaThreshold() &&
                    <li>
                      <Typography paragraph={true}>
                        Le seuil de la franchise de base TVA, de { this.props.aeStore.businessData().tvaThreshold} € HT, a été dépassé.
                        Il faudra facturer la TVA dès le 1er jour du mois de dépassement, vous passerez alors au régime réel simplifié de la TVA.
                        Si vous déclarez pendant deux années consécutives un CA > au seuil de franchise, vous devrez alors facturer la TVA à compter du 1er janvier qui suit ces deux années.
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