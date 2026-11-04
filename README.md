# Rota Leve

Calculadora estática de emissões de viagens, feita com HTML, CSS e JavaScript puro. A aplicação compara bicicleta, carro, ônibus e caminhão, usando uma base simulada de rotas brasileiras.

**Calculadora publicada:** https://invictor13.github.io/dio-eco-calculadora/

## Como usar

1. Informe a origem e o destino. As cidades sugeridas vêm da base local de rotas.
2. Selecione um meio de transporte.
3. Quando a rota não estiver cadastrada, informe a distância manual em quilômetros.
4. Selecione **Calcular viagem** para ver a distância, a emissão estimada, o comparativo e o custo de compensação.

As rotas são exemplos simulados e não representam necessariamente o trajeto rodoviário mais curto. A calculadora considera uma viagem em uma direção.

## Como o cálculo funciona

`calculator.js` concentra as funções de cálculo. `calculateDistance` procura a rota nos dois sentidos; quando não encontra, usa a distância manual válida. Assim, a busca de rotas pode ser substituída por uma API sem alterar o restante da aplicação.

As emissões são calculadas por `distância em km × fator do meio de transporte`, com os fatores ilustrativos definidos em `config.js`:

| Meio | Fator (kg CO2e/km) |
| --- | ---: |
| Bicicleta | 0 |
| Carro | 0,192 |
| Ônibus | 0,089 |
| Caminhão | 0,75 |

Os fatores são simplificações didáticas por quilômetro percorrido; não são uma avaliação de ciclo de vida nem consideram ocupação, carga, combustível ou condições do percurso. Bicicleta é considerada sem emissão operacional direta.

Para compensar, a emissão em quilogramas é convertida em toneladas (`kg ÷ 1.000`). Essa quantidade corresponde aos créditos estimados em t CO2e. O custo é `créditos × preço por tonelada`, configurado inicialmente em R$ 50,00 por t CO2e. É uma estimativa, não uma cotação de mercado.

## Arquivos e ordem de construção

1. `index.html`: estrutura semântica do formulário e das áreas de resultado, inicialmente ocultas.
2. `style.css`: apresentação responsiva e paleta definida em variáveis CSS.
3. `routes.js` e `config.js`: rotas simuladas, fatores de emissão e preço do crédito.
4. `calculator.js`, `ui.js` e `app.js`: cálculos isolados, atualização da interface e eventos do formulário.
5. `.github/workflows/pages.yml`: publicação automática no GitHub Pages a cada atualização da branch `main`.

Um prompt útil para gerar cada arquivo em etapas:

> Crie somente o arquivo `calculator.js` para esta calculadora, em JavaScript puro. Isole a busca de distância em `calculateDistance(origin, destination, routes, manualDistance)`, procurando rotas nos dois sentidos e retornando a distância manual quando não houver correspondência. Inclua também funções separadas para emissões e créditos de carbono. Não crie nem altere outros arquivos.

Os scripts podem ser verificados no console do navegador por `window.TripCalculator`, `window.RouteData` e `window.AppConfig`. Também foram validados com `node --check` e casos de rota cadastrada, distância manual, emissões e créditos.

## Publicação

O workflow de GitHub Actions publica o conteúdo estático quando há um push para `main`. Em **Settings > Pages**, a origem de build deve estar definida como **GitHub Actions**. A primeira execução pode ser iniciada manualmente na aba **Actions**.
