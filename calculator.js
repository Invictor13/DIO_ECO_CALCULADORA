(function () {
  const calculateDistance = (origin, destination, routes, manualDistance) => {
    const normalizedOrigin = origin.trim().toLocaleLowerCase('pt-BR');
    const normalizedDestination = destination.trim().toLocaleLowerCase('pt-BR');

    const route = routes.find((item) => {
      const routeOrigin = item.origin.toLocaleLowerCase('pt-BR');
      const routeDestination = item.destination.toLocaleLowerCase('pt-BR');
      return (
        (routeOrigin === normalizedOrigin && routeDestination === normalizedDestination) ||
        (routeOrigin === normalizedDestination && routeDestination === normalizedOrigin)
      );
    });

    if (route) {
      return { distance: route.distance, source: 'database' };
    }

    const parsedManualDistance = Number(manualDistance);
    if (Number.isFinite(parsedManualDistance) && parsedManualDistance > 0) {
      return { distance: parsedManualDistance, source: 'manual' };
    }

    return null;
  };

  const calculateTrip = (distance, emissionFactors) => {
    const comparison = Object.entries(emissionFactors).map(([key, mode]) => ({
      key,
      name: mode.name,
      factor: mode.factor,
      emissions: distance * mode.factor,
    }));

    return comparison;
  };

  const calculateCredits = (emissionsKg, pricePerTon) => {
    const credits = emissionsKg / 1000;
    return {
      credits,
      cost: credits * pricePerTon,
    };
  };

  window.TripCalculator = {
    calculateDistance,
    calculateTrip,
    calculateCredits,
  };
})();
