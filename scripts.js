const sunglassesData = [
  {
    name: "SunGuard Elite",
    type: "Single Vision",
    material: "Titanium",
    rating: 4.8,
    stock: 120,
    basePrice: 150,
  },
  {
    name: "SolarMax",
    type: "Bifocal",
    material: "Plastic",
    rating: 4.5,
    stock: 80,
    basePrice: 200,
  },
  {
    name: "UltraShade",
    type: "Progressive",
    material: "Metal",
    rating: 4.7,
    stock: 100,
    basePrice: 250,
  },
  {
    name: "ComfortSun",
    type: "Trifocal",
    material: "Acetate",
    rating: 4.3,
    stock: 50,
    basePrice: 180,
  },
  {
    name: "PureRay",
    type: "Photochromic",
    material: "Wood",
    rating: 4.9,
    stock: 30,
    basePrice: 300,
  },
  {
    name: "ClarityShield",
    type: "Blue Light",
    material: "Carbon Fiber",
    rating: 4.6,
    stock: 70,
    basePrice: 130,
  },
  {
    name: "DayNight Shade",
    type: "Polarized",
    material: "Stainless Steel",
    rating: 4.4,
    stock: 90,
    basePrice: 220,
  },
  {
    name: "SharpSun",
    type: "Anti-Reflective",
    material: "Aluminum",
    rating: 4.7,
    stock: 60,
    basePrice: 170,
  },
  {
    name: "FlexiSun",
    type: "Transition",
    material: "Nylon",
    rating: 4.5,
    stock: 110,
    basePrice: 190,
  },
  {
    name: "VisionRay",
    type: "Reading",
    material: "Flexon",
    rating: 4.8,
    stock: 40,
    basePrice: 140,
  },
];

const targetMinPrice = 1000; // Minimum price in NPR
const targetMaxPrice = 10000; // Maximum price in NPR

let currentSeason = "spring";
let simulationInterval;

function adjustPrice(stock, basePrice, rating) {
  let priceModifier = 1.0;

  // Adjust price based on stock levels
  if (stock >= 120) {
    priceModifier *= 0.9; // Decrease price by 10% for 120+
  } else if (stock >= 100) {
    priceModifier *= 0.95; // Decrease price by 5% for 100-119
  } else if (stock >= 80) {
    // No change for 80-99
  } else if (stock >= 60) {
    priceModifier *= 1.05; // Increase price by 5% for 60-79
  } else if (stock >= 40) {
    priceModifier *= 1.1; // Increase price by 10% for 40-59
  } else {
    priceModifier *= 1.2; // Increase price by 20% for 0-39
  }

  // Adjust price based on ratings
  if (rating >= 4.8) {
    priceModifier *= 0.95; // Decrease price by 5% for ratings 4.8+
  } else if (rating >= 4.5) {
    // No change for ratings 4.5-4.7
  } else if (rating >= 4.0) {
    priceModifier *= 1.05; // Increase price by 5% for ratings 4.0-4.4
  } else {
    priceModifier *= 1.1; // Increase price by 10% for ratings below 4.0
  }

  // Adjust price based on season
  switch (currentSeason) {
    case "spring":
      priceModifier *= 0.95; // Decrease price by 5% in spring
      break;
    case "summer":
      priceModifier *= 1.1; // Increase price by 10% in summer
      break;
    case "autumn":
      priceModifier *= 0.9; // Decrease price by 10% in autumn
      break;
    case "winter":
      priceModifier *= 0.85; // Decrease price by 15% in winter
      break;
  }

  // Calculate initial NPR price
  let nprPrice = basePrice * priceModifier;

  // Scale the NPR price to fit within the target range
  const minBasePrice = Math.min(...sunglassesData.map((s) => s.basePrice));
  const maxBasePrice = Math.max(...sunglassesData.map((s) => s.basePrice));
  const scaledPrice =
    ((nprPrice - minBasePrice) / (maxBasePrice - minBasePrice)) *
      (targetMaxPrice - targetMinPrice) +
    targetMinPrice;

  return scaledPrice;
}

function updateStock(index, newStock) {
  const sunglasses = sunglassesData[index];
  sunglasses.stock = newStock;
  const adjustedPrice = adjustPrice(
    sunglasses.stock,
    sunglasses.basePrice,
    sunglasses.rating
  );
  document.getElementById(
    `price-${index}`
  ).innerText = `NPR ${adjustedPrice.toFixed(2)}`;
  document.getElementById(`stock-${index}`).value = sunglasses.stock;
}

function updateRating(index, newRating) {
  const sunglasses = sunglassesData[index];
  sunglasses.rating = parseFloat(newRating);
  const adjustedPrice = adjustPrice(
    sunglasses.stock,
    sunglasses.basePrice,
    sunglasses.rating
  );
  document.getElementById(
    `price-${index}`
  ).innerText = `NPR ${adjustedPrice.toFixed(2)}`;
  document.getElementById(`rating-${index}`).innerText =
    sunglasses.rating.toFixed(1);
}

function updateSeason() {
  const seasonSelect = document.getElementById("season");
  currentSeason = seasonSelect.value;
  updateAllPrices();
}

function updateAllPrices() {
  sunglassesData.forEach((sunglasses, index) => {
    const adjustedPrice = adjustPrice(
      sunglasses.stock,
      sunglasses.basePrice,
      sunglasses.rating
    );
    document.getElementById(
      `price-${index}`
    ).innerText = `NPR ${adjustedPrice.toFixed(2)}`;
  });
}

function simulateStockLevels() {
  sunglassesData.forEach((sunglasses, index) => {
    let change = Math.floor(Math.random() * 10) + 1; // Random change between 1 and 10
    sunglasses.stock -= change;
    if (sunglasses.stock <= 0) {
      sunglasses.stock = 200; // Restock to 200
    }
    updateStock(index, sunglasses.stock);
  });
}

function startSimulation() {
  if (!simulationInterval) {
    simulationInterval = setInterval(simulateStockLevels, 1000); // Update every second
  }
}

function endSimulation() {
  clearInterval(simulationInterval);
  simulationInterval = null;
}

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#sunglassesTable tbody");
  sunglassesData.forEach((sunglasses, index) => {
    const adjustedPrice = adjustPrice(
      sunglasses.stock,
      sunglasses.basePrice,
      sunglasses.rating
    );
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${sunglasses.name}</td>
            <td>${sunglasses.type}</td>
            <td>${sunglasses.material}</td>
            <td id="rating-${index}">${sunglasses.rating.toFixed(1)}</td>
            <td><input type="number" id="stock-${index}" value="${
      sunglasses.stock
    }" min="0" onchange="updateStock(${index}, this.value)"></td>
            <td id="price-${index}">NPR ${adjustedPrice.toFixed(2)}</td>
            <td><button onclick="updateStock(${index}, document.getElementById('stock-${index}').value)">Update</button></td>
            <td><input type="number" step="0.1" id="ratingInput-${index}" value="${sunglasses.rating.toFixed(
      1
    )}" min="0" max="5" onchange="updateRating(${index}, this.value)"></td>
        `;
    tableBody.appendChild(row);
  });
});
