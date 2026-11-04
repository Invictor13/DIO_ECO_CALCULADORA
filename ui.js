(function () {
  const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
  const preciseNumberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });
  const currencyFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const elements = {
    cityList: document.querySelector('#city-list'),
    routeStatus: document.querySelector('#route-status'),
    manualDistance: document.querySelector('#manual-distance'),
    formError: document.querySelector('#form-error'),
    results: document.querySelector('#results'),
    comparison: document.querySelector('#comparison'),
    credits: document.querySelector('#credits'),
    distanceSource: document.querySelector('#distance-source'),
    resultDistance: document.querySelector('#result-distance'),
    resultRoute: document.querySelector('#result-route'),
    resultModeLabel: document.querySelector('#result-mode-label'),
    resultEmissions: document.querySelector('#result-emissions'),
    comparisonList: document.querySelector('#comparison-list'),
    creditQuantity: document.querySelector('#credit-quantity'),
    creditCost: document.querySelector('#credit-cost'),
    creditPriceReference: document.querySelector('#credit-price-reference'),
  };

  const setCities = (routes) => {
    const cities = [...new Set(routes.flatMap((route) => [route.origin, route.destination]))]
      .sort((first, second) => first.localeCompare(second, 'pt-BR'));

    elements.cityList.replaceChildren(...cities.map((city) => {
      const option = document.createElement('option');
      option.value = city;
      return option;
    }));
  };

  const setRouteStatus = (message, state) => {
    elements.routeStatus.className = `route-status${state ? ` route-status--${state}` : ''}`;
    elements.routeStatus.querySelector('span:last-child').textContent = message;
  };

  const showError = (message) => {
    elements.formError.textContent = message;
    elements.formError.hidden = !message;
  };

  const renderComparison = (comparison, selectedMode) => {
    const maximumEmissions = Math.max(...comparison.map((item) => item.emissions), 0);
    const fragment = document.createDocumentFragment();

    comparison.forEach((item) => {
      const row = document.createElement('div');
      row.className = `comparison-row${item.key === selectedMode ? ' comparison-row--selected' : ''}`;
      row.style.setProperty('--row-color', `var(--color-${item.key})`);

      const mode = document.createElement('div');
      mode.className = 'comparison-row__mode';
      mode.textContent = item.name;

      const track = document.createElement('div');
      track.className = 'comparison-row__bar-track';
      track.setAttribute('role', 'img');
      track.setAttribute('aria-label', `${item.name}: ${numberFormat.format(item.emissions)} kg de CO2e`);
      const bar = document.createElement('div');
      bar.className = 'comparison-row__bar';
      const width = maximumEmissions === 0 ? 0 : (item.emissions / maximumEmissions) * 100;
      bar.style.setProperty('--bar-width', `${width}%`);
      track.append(bar);

      const value = document.createElement('div');
      value.className = 'comparison-row__value';
      value.textContent = numberFormat.format(item.emissions);
      const unit = document.createElement('span');
      unit.textContent = ' kg';
      value.append(unit);

      row.append(mode, track, value);
      if (item.key === selectedMode) {
        const choice = document.createElement('span');
        choice.className = 'comparison-row__choice';
        choice.textContent = 'ESCOLHIDO';
        value.append(document.createElement('br'), choice);
      }
      fragment.append(row);
    });

    elements.comparisonList.replaceChildren(fragment);
  };

  const render = (trip) => {
    const selected = trip.comparison.find((item) => item.key === trip.mode);
    elements.distanceSource.textContent = trip.source === 'database' ? 'Rota da base simulada' : 'Distância informada';
    elements.resultDistance.textContent = numberFormat.format(trip.distance);
    elements.resultRoute.textContent = `${trip.origin} → ${trip.destination}`;
    elements.resultModeLabel.textContent = `· ${selected.name.toLocaleLowerCase('pt-BR')}`;
    elements.resultEmissions.textContent = numberFormat.format(selected.emissions);
    renderComparison(trip.comparison, trip.mode);
    elements.creditQuantity.textContent = preciseNumberFormat.format(trip.credits.credits);
    elements.creditCost.textContent = currencyFormat.format(trip.credits.cost);
    elements.creditPriceReference.textContent = currencyFormat.format(trip.creditPricePerTon);
    elements.results.hidden = false;
    elements.comparison.hidden = false;
    elements.credits.hidden = false;
    showError('');
  };

  const hideResults = () => {
    elements.results.hidden = true;
    elements.comparison.hidden = true;
    elements.credits.hidden = true;
  };

  window.TripUI = {
    setCities,
    setRouteStatus,
    showError,
    render,
    hideResults,
    elements,
  };
})();
