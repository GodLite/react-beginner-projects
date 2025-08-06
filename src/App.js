import React from 'react';
import { Block } from './Block';
import './index.scss';

// Курсы валют относительно рубля -> https://www.cbr-xml-daily.ru/daily_json.js

function App() {
  const [fromCurrency, setFromCurrency] = React.useState('RUB');
  const [toCurrency, setToCurrency] = React.useState('USD')
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(1);

  // const [ratesRef.current, setratesRef.current] = React.useState({});
  const ratesRef = React.useRef({});

  React.useEffect(() => {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then((res) => res.json())
      .then((json) => {
        const result = Object.fromEntries(
          Object.entries(json.Valute).map(([currency, data]) => [
            currency,
            data.Nominal / data.Value
          ])
        );

        ratesRef.current = result;
        onChangeToPrice(toPrice);

        console.log(result);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / (ratesRef.current[fromCurrency] || 1);
    const result = price * (ratesRef.current[toCurrency] || 1);

    setToPrice(result);
    setFromPrice(value);
  }

  const onChangeToPrice = (value) => {
    const result = ((ratesRef.current[fromCurrency] || 1) / (ratesRef.current[toCurrency] || 1)) * value;

    setFromPrice(result);
    setToPrice(value);
  }

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeValue={onChangeFromPrice} onChangeCurrency={setFromCurrency} />
      <Block value={toPrice} currency={toCurrency} onChangeValue={onChangeToPrice} onChangeCurrency={setToCurrency} />
    </div>
  );
}

export default App;
