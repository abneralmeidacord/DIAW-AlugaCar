export const photos = {
  hero: 'https://hips.hearstapps.com/hmg-prod/images/gt-silver-metallic-003-sim2474-edit-65760fce378bf.jpg',
  porsche:
    'https://www.enterprise.co.uk/en/exotic-car-hire/vehicles/sports-car-convertible/porsche-911-carrera-s-coupe/_jcr_content/root/teaser_image.coreimg.png/1648144257625/porsche-911-carrera-s-coupe-hero-thumbnail-2048x1360.png',
  mercedes:
    'https://fa-coreapi-pro.azurewebsites.net/api/Storage/trim/download/mercedes_c200_68ede658aeab85001dfc8023.png',
  volvo:
    'https://ik.imagekit.io/hertzch/minilease/media/volvo_xc60_1.png?tr=w-1000%2Car-810-466%2Cfo-center',
  bmw: 'https://cdn.imgbin.com/12/2/5/imgbin-2018-bmw-320i-xdrive-car-luxury-vehicle-sedan-temperature-zones-sc-zi8vGPnCPfHDqwjcPV37GWXzr.jpg',
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
    photo: photos.volvo,
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
    photo: photos.mercedes,
    tag: 'Sua viagem merece',
  },
];

export function carTone(category) {
  if (category?.toLowerCase() === 'premium') return 'blue';
  if (category?.toLowerCase() === 'suv') return 'green';
  return 'sand';
}

export function carOf(id, availableCars = cars) {
  return (
    availableCars.find((car) => car.id === id) ||
    cars.find((car) => car.id === id) ||
    availableCars[0] ||
    cars[0]
  );
}
