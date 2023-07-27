import React, { useState, useEffect } from 'react';
import axios from 'axios';

import arrows from './assets/img/arrows.svg';
import './App.css';

const App = () => {
  const [currencies, setCurrencies] = useState({});
  const [fromCurrency, setFromCurrency] = useState('UAH');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [fromCountryFlag, setFromCountryFlag] = useState(null);
  const [toCountryFlag, setToCountryFlag] = useState(null);

  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        const response = await axios.get(
          'http://data.fixer.io/api/latest?access_key=f950a26f67084bffd6ef4542e41e6381'
        );
        setCurrencies(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    const fetchCountryFlags = async () => {
      try {
        const fromCountryCode = fromCurrency.substring(0, 2).toLowerCase();
        const toCountryCode = toCurrency.substring(0, 2).toLowerCase();
        const fromCountryFlagUrl = `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png1000px/${fromCountryCode}.png`;
        const toCountryFlagUrl = `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png1000px/${toCountryCode}.png`;

        setFromCountryFlag(fromCountryFlagUrl);
        setToCountryFlag(toCountryFlagUrl);
      } catch (error) {
        console.error('Error fetching country flags:', error);
      }
    };

    Promise.all([fetchExchangeData(), fetchCountryFlags()]);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fromRate = currencies[fromCurrency] || 1;
    const toRate = currencies[toCurrency] || 1;
    const convertedAmount = (amount / fromRate) * toRate;
    setConvertedAmount(convertedAmount.toFixed(2));
  }, [currencies, fromCurrency, toCurrency, amount]);

  const handleCurrencyChange = (event) => {
    const { value, name } = event.target;
    if (name === 'fromCurrency') {
      setFromCurrency(value);
    } else if (name === 'toCurrency') {
      setToCurrency(value);
    }
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    setAmount(value);
  };

  const handleExchange = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  return (
    <div className='app'>
      <h1 className='app-title'>Currency Converter</h1>
      <p className='app-text'>
        Check live rates, set rate alerts, receive notifications and more.
      </p>

      <div className='converter-block'>
        <div className='converter-inner'>
          <div className='converter-current'>
            <h3 className='converter-current-title'>From:</h3>
            <div className='converter-current-item'>
              {fromCountryFlag && (
                <img
                  src={fromCountryFlag}
                  alt='From Country Flag'
                  className='country-flag'
                />
              )}
              <select
                className='converter-select'
                name='fromCurrency'
                value={fromCurrency}
                onChange={handleCurrencyChange}>
                {Object.entries(currencies).map(([currency, rate]) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <input
                className='converter-input'
                type='number'
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>
          <button className='converter-change-btn' onClick={handleExchange}>
            <img src={arrows} alt='icon' />
          </button>

          <div className='converter-current'>
            <h3 className='converter-current-title'>To:</h3>
            <div className='converter-current-item'>
              {toCountryFlag && (
                <img
                  src={toCountryFlag}
                  alt='To Country Flag'
                  className='country-flag'
                />
              )}
              <select
                className='converter-select'
                name='toCurrency'
                value={toCurrency}
                onChange={handleCurrencyChange}>
                {Object.entries(currencies).map(([currency, rate]) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <input
                className='converter-input readonly'
                type='number'
                value={convertedAmount}
                onChange={handleAmountChange}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className='convert-info'>
        <p className='convert-info-rate'>Indicative Exchange Rate</p>1{' '}
        {fromCurrency} = {currencies[fromCurrency] || 1} {toCurrency}
      </div>
    </div>
  );
};

export default App;
