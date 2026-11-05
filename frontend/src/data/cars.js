export const photos = {
  hero: 'https://hips.hearstapps.com/hmg-prod/images/gt-silver-metallic-003-sim2474-edit-65760fce378bf.jpg',
  porsche:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/2024_Porsche_911_992_Carrera.jpg/960px-2024_Porsche_911_992_Carrera.jpg',
  mercedes:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Mercedes-Benz_C_200_AVANTGARDE_%28W206%29_front.jpg/960px-Mercedes-Benz_C_200_AVANTGARDE_%28W206%29_front.jpg',
  volvo:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/2023_Volvo_XC60_T8_R-Line_front.jpg/960px-2023_Volvo_XC60_T8_R-Line_front.jpg',
  bmw:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/BMW_320i_%28G20%2C_2023%29_%2854524564626%29.jpg/960px-BMW_320i_%28G20%2C_2023%29_%2854524564626%29.jpg',
  volvoPlus:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Volvo_XC60_B5_AWD_Pine_Grey_Metallic_CN-spec_diplomatic_front_right.jpg/960px-Volvo_XC60_B5_AWD_Pine_Grey_Metallic_CN-spec_diplomatic_front_right.jpg',
  mercedesExclusive:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Mercedes-Benz_C200_AVANTGARDE_%28W206%29_front.jpg/960px-Mercedes-Benz_C200_AVANTGARDE_%28W206%29_front.jpg',
};
export const cars = [
  {
    id: 'porsche',
    brand: 'Porsche',
    model: '911 Carrera',
    category: 'Premium',
    year: 2024,
    plate: 'DEMO-01',
    matricula: 'AC-001',
    price: 890,
    fuel: 'Gasolina',
    color: 'Prata',
    org: 'aurora',
    photo: photos.porsche,
    tag: 'Uma experiência à parte',
  },
  {
    id: 'mercedes',
    brand: 'Mercedes-Benz',
    model: 'C 200',
    category: 'Sedan',
    year: 2024,
    plate: 'DEMO-02',
    matricula: 'AC-002',
    price: 429,
    fuel: 'Híbrido',
    color: 'Prata',
    org: 'aurora',
    photo: photos.mercedes,
    tag: 'Conforto em cada detalhe',
  },
  {
    id: 'volvo',
    brand: 'Volvo',
    model: 'XC60',
    category: 'SUV',
    year: 2024,
    plate: 'DEMO-03',
    matricula: 'AC-003',
    price: 549,
    fuel: 'Híbrido',
    color: 'Branco',
    org: 'aurora',
    photo: photos.volvo,
    tag: 'Espaço para novos planos',
  },
  {
    id: 'bmw',
    brand: 'BMW',
    model: '320i',
    category: 'Sedan',
    year: 2023,
    plate: 'DEMO-04',
    matricula: 'AC-004',
    price: 389,
    fuel: 'Gasolina',
    color: 'Laranja',
    org: 'aurora',
    photo: photos.bmw,
    tag: 'O prazer de dirigir',
  },
  {
    id: 'volvo2',
    brand: 'Volvo',
    model: 'XC60 Plus',
    category: 'SUV',
    year: 2025,
    plate: 'DEMO-05',
    matricula: 'AC-005',
    price: 599,
    fuel: 'Híbrido',
    color: 'Branco',
    org: 'aurora',
    photo: photos.volvoPlus,
    tag: 'Para ir um pouco além',
  },
  {
    id: 'mercedes2',
    brand: 'Mercedes-Benz',
    model: 'C 200 Exclusive',
    category: 'Premium',
    year: 2025,
    plate: 'DEMO-06',
    matricula: 'AC-006',
    price: 489,
    fuel: 'Híbrido',
    color: 'Prata',
    org: 'aurora',
    photo: photos.mercedesExclusive,
    tag: 'Sua viagem merece',
  },
];

export function carTone(category) {
  if (category?.toLowerCase() === 'premium') return 'blue';
  if (category?.toLowerCase() === 'suv') return 'green';
  return 'sand';
}

export const defaultLocation = 'Belo Horizonte, MG';

export function carLocations(cars, selected = '') {
  return [...new Set([...cars.map((car) => car.location || defaultLocation), selected])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function carOf(id, availableCars = cars) {
  return (
    availableCars.find((car) => car.id === id) ||
    cars.find((car) => car.id === id) ||
    availableCars[0] ||
    cars[0]
  );
}
