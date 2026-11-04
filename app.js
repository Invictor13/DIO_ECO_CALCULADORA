(function () {
  const form = document.querySelector('#trip-form');
  const originInput = document.querySelector('#origin');
  const destinationInput = document.querySelector('#destination');
  const manualDistanceInput = document.querySelector('#manual-distance');

  const findDistance = () => window.TripCalculator.calculateDistance(
    originInput.value,
    destinationInput.value,
    window.RouteData,
    manualDistanceInput.value,
  );

  const updateRoute = () => {
    window.TripUI.hideResults();
    window.TripUI.showError('');

    const hasBothCities = originInput.value.trim() && destinationInput.value.trim();
    const isSameCity = originInput.value.trim().toLocaleLowerCase('pt-BR') ===
      destinationInput.value.trim().toLocaleLowerCase('pt-BR');

    if (!hasBothCities) {
      manualDistanceInput.disabled = true;
      window.TripUI.setRouteStatus('Escolha uma rota para verificar a distância disponível.');
      return;
    }

    if (isSameCity) {
      manualDistanceInput.disabled = true;
      window.TripUI.setRouteStatus('Origem e destino precisam ser cidades diferentes.', 'manual');
      return;
    }

    const route = window.TripCalculator.calculateDistance(
      originInput.value,
      destinationInput.value,
      window.RouteData,
      '',
    );

    if (route) {
      manualDistanceInput.value = '';
      manualDistanceInput.disabled = true;
      window.TripUI.setRouteStatus(`Rota encontrada: ${route.distance} km na base simulada.`, 'found');
      return;
    }

    manualDistanceInput.disabled = false;
    window.TripUI.setRouteStatus('Rota fora da base. Informe a distância em quilômetros.', 'manual');
  };

  [originInput, destinationInput].forEach((input) => {
    input.addEventListener('input', updateRoute);
  });

  manualDistanceInput.addEventListener('input', () => {
    window.TripUI.hideResults();
    window.TripUI.showError('');
  });

  form.addEventListener('change', (event) => {
    if (event.target.name === 'mode') {
      window.TripUI.hideResults();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();

    if (origin.toLocaleLowerCase('pt-BR') === destination.toLocaleLowerCase('pt-BR')) {
      window.TripUI.showError('Informe cidades diferentes para calcular a viagem.');
      return;
    }

    const route = findDistance();
    if (!route) {
      window.TripUI.showError('Informe uma distância válida para esta rota (maior que zero).');
      manualDistanceInput.focus();
      return;
    }

    const mode = form.elements.mode.value;
    const comparison = window.TripCalculator.calculateTrip(route.distance, window.AppConfig.emissionFactors);
    const selected = comparison.find((item) => item.key === mode);
    const credits = window.TripCalculator.calculateCredits(selected.emissions, window.AppConfig.creditPricePerTon);

    window.TripUI.render({
      origin,
      destination,
      distance: route.distance,
      source: route.source,
      mode,
      comparison,
      credits,
      creditPricePerTon: window.AppConfig.creditPricePerTon,
    });
  });

  window.TripUI.setCities(window.RouteData);
})();
