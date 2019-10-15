import React, { Component } from "react";
import { Link } from "react-router-dom";
import localStorage from "local-storage";
import { isToday } from "../tools/utils.js";
import Currency from "./CurrencySelector.js";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class ExchangeManager extends Component {
  state = {
    currencies: [],
    rates: [],
    fromCurrency: localStorage.get("fromCurrency") || "EUR",
    toCurrency: localStorage.get("toCurrency") || "USD",
    amount: localStorage.get("amount") || "",
    result: localStorage.get("result") || "",
    currentExchangeRate: {
      from: "",
      to: "",
      rate: ""
    }
  };
  componentDidMount() {
    const currencyList = localStorage.get("currencies") || [];
    if (isToday(localStorage.get("ratesDate")) && currencyList.length > 0)
      this.setState({ currencies: currencyList });
    else {
      fetch("https://api.exchangeratesapi.io/latest?base=USD")
        .then(res => res.json())
        .then(response => {
          this.setState({ rates: response });
          for (const key in response.rates) {
            currencyList.push(key);
          }
          this.setState({ currencies: currencyList }, () => {
            localStorage.set("currencies", currencyList);
            localStorage.set("ratesDate", response.date);
            localStorage.set("rates", response.rates);
          });
        });
    }
  }

  handleOnAmountChange = e => {
    this.setState({ amount: e.target.value }, this.convertCurrency);
  };
  handleOnCurrencyChange = e => {
    const {
      target: { name, value }
    } = e;
    this.setState({ [name]: value }, this.convertCurrency);
  };
  convertCurrency = () => {
    const { toCurrency, fromCurrency, amount } = this.state;
    const { to, from, rate } = this.state.currentExchangeRate;
    localStorage.set("fromCurrency", fromCurrency);
    localStorage.set("toCurrency", toCurrency);
    localStorage.set("amount", amount);
    if (!amount) return;
    if (fromCurrency === toCurrency)
      this.setState({ result: this.state.amount });
    else if (fromCurrency === from && toCurrency === to && rate >= 0) {
      const result = this.state.amount * rate;
      this.setState({ result: result.toFixed(2) }, () => {
        localStorage.set("result", result.toFixed(2));
      });
    } else if (fromCurrency !== toCurrency) {
      fetch(
        "https://api.exchangeratesapi.io/latest?base=" +
          fromCurrency +
          "&symbols=" +
          toCurrency
      )
        .then(res => res.json())
        .then(response => {
          this.setState({
            currentExchangeRate: {
              to: toCurrency,
              from: fromCurrency,
              rate: response.rates[toCurrency]
            }
          });
          const result = this.state.amount * response.rates[toCurrency];
          this.setState({ result: result.toFixed(2) }, () => {
            localStorage.set("result", result.toFixed(2));
          });
        })
        .catch(err => {
          alert(err.message);
        });
    }
  };
  handleSwitch = () => {
    const newToCurrency = this.state.fromCurrency;
    this.setState(
      {
        fromCurrency: this.state.toCurrency,
        toCurrency: newToCurrency
      },
      this.convertCurrency
    );
  };
  render() {
    return (
      <Container>
        <Row>
          <Col sm>
            <Currency
              name="fromCurrency"
              onAmountChange={this.handleOnAmountChange}
              onCurrencyChange={this.handleOnCurrencyChange}
              currencies={this.state.currencies}
              value={this.state.amount}
              currency={this.state.fromCurrency}
            />
          </Col>
          <Col sm className={"marginAuto"}>
            <Button onClick={this.handleSwitch}>Switch</Button>
          </Col>
          <Col sm>
            <Currency
              name="toCurrency"
              currencies={this.state.currencies}
              onAmountChange={this.handleOnAmountChange}
              onCurrencyChange={this.handleOnCurrencyChange}
              value={this.state.result}
              disabled
              currency={this.state.toCurrency}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/rates">view all rates</Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default ExchangeManager;
