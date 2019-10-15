import React from "react";
import Form from "react-bootstrap/Form";

export default function Currency({
  currencies = [],
  name = "",
  value = "",
  onAmountChange,
  onCurrencyChange,
  disabled,
  currency = "eur"
}) {
  return (
    <Form>
      <Form.Group>
        <Form.Label>{name}:</Form.Label>
        <Form.Control
          as="select"
          name={name}
          value={currency}
          onChange={onCurrencyChange}
        >
          {currencies.map(cur => (
            <option>{cur}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Amount</Form.Label>

        {disabled ? (
          <Form.Control type="number" value={value} disabled />
        ) : (
          <Form.Control type="number" value={value} onChange={onAmountChange} />
        )}
      </Form.Group>
    </Form>
  );
}
