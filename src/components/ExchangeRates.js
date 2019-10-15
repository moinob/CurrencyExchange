import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isToday } from "../tools/utils.js";
import Container from "react-bootstrap/Container";
import localStorage from "local-storage";
import Table from "react-bootstrap/Table";

class ExchangeRates extends Component {
  state = {
    rates: localStorage.get("rates") || {},
    favoriate: ""
  };
  componentDidMount() {
    const lastUpdate = localStorage.get("ratesDate");
    if (!lastUpdate || !(lastUpdate && isToday(lastUpdate))) {
      fetch("https://api.exchangeratesapi.io/latest?base=USD")
        .then(res => res.json())
        .then(response => {
          console.log(response);
          this.setState({ rates: response.rates }, () => {
            localStorage.set("ratesDate", response.date);
            localStorage.set("rates", response.rates);
          });
        });
    }
  }

  render() {
    const { rates } = this.state;
    return (
      <Container>
        <h3>Rates are based on USD from {localStorage.get("ratesDate")}</h3>
        <Link to="/">go to exchange</Link>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>*</th>
              <th>Currency</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(rates).map(key => (
              <tr key={key}>
                <td>*</td>
                <td>{key}</td>
                <td>{rates[key]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
export default ExchangeRates;
