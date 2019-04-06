import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from "@material-ui/core";
import {AEBusiness, AEConfig, AEStore, BusinessType} from "./model";

class App extends Component {
  constructor(props: any) {
    super(props);

    const defaultBusiness = AEBusiness.create({
      type: BusinessType.SERVICES_LIBERAL,
      nature: 'BNC'});

    const AE2019Parameters = {
      effectiveYear: '2019',
      businesses: [
        AEBusiness.create({
          type: BusinessType.BUY_SELL,
          nature: 'BIC'}),
        AEBusiness.create({
          type: BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM,
          nature: 'BIC'}),
        AEBusiness.create({
          type: BusinessType.SERVICES_LIBERAL,
          nature: 'BNC'}),
        AEBusiness.create({
          type: BusinessType.RENTAL,
          nature: 'BIC'})
      ]
    };
    const aeStore = AEStore.create({
      businessData: defaultBusiness,
      config: AEConfig.create(AE2019Parameters)
    });

    aeStore.financialData.setAnnualRevenueWithoutTaxes(70000);
    console.log(aeStore.incomeTaxForYear());
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button variant={"raised"}>Test button</Button>
        </header>
      </div>
    );
  }
}

export default App;
