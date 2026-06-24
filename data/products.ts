export type Category = "Todos" | "Tortas" | "Regalos" | "Eventos";
export type ProductCategory = Exclude<Category, "Todos">;

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  pricePrefix?: string;
  image: string;
  description: string;
  stock: number;
  portions: string;
  occasions: string[];
};

export const categories: Category[] = ["Todos", "Tortas", "Regalos", "Eventos"];

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Torta rosa clásica",
    category: "Tortas",
    price: 15000,
    image: "/images/birthday-pink.jpeg",
    description: "Bizcocho casero con crema suave y terminación floral en tonos rosados.",
    stock: 4,
    portions: "18 a 20 personas",
    occasions: ["Cumpleaños", "Aniversario"],
  },
  {
    id: 2,
    name: "Torta temática fútbol",
    category: "Tortas",
    price: 25000,
    image: "/images/futboll.jpeg",
    description: "Torta de dos pisos, cubierta en crema y decorada con chocolate.",
    stock: 2,
    portions: "20 a 25 personas",
    occasions: ["Cumpleaños", "Evento deportivo"],
  },
  {
    id: 3,
    name: "Torta celeste elegante",
    category: "Tortas",
    price: 18000,
    image: "/images/torta10.jpeg",
    description: "Decoración celeste y blanca con perlas, lazos y terminación delicada.",
    stock: 3,
    portions: "15 a 20 personas",
    occasions: ["Bautizo", "Baby shower"],
  },
  {
    id: 4,
    name: "Torta dos pisos",
    category: "Tortas",
    price: 28000,
    image: "/images/torta7.jpeg",
    description: "Dos niveles de bizcocho artesanal con crema y detalles en lila.",
    stock: 2,
    portions: "25 a 30 personas",
    occasions: ["Celebración", "Cumpleaños"],
  },
  {
    id: 5,
    name: "Torta coral de cumpleaños",
    category: "Tortas",
    price: 18000,
    image: "/images/torta8.jpeg",
    description: "Torta familiar con crema blanca y decoración coral hecha a mano.",
    stock: 3,
    portions: "15 a 20 personas",
    occasions: ["Cumpleaños", "Familia"],
  },
  {
    id: 6,
    name: "Mini torta floral",
    category: "Regalos",
    price: 12000,
    image: "/images/torta9.jpeg",
    description: "Formato pequeño y elegante, terminado con flores y cacao.",
    stock: 5,
    portions: "6 a 8 personas",
    occasions: ["Regalo", "Aniversario"],
  },
  {
    id: 7,
    name: "Ramo de cupcakes",
    category: "Regalos",
    price: 15000,
    image: "/images/ramokut.jpeg",
    description: "Siete cupcakes decorados como flores y presentados en formato ramo.",
    stock: 4,
    portions: "7 unidades",
    occasions: ["Regalo", "Cumpleaños"],
  },
  {
    id: 8,
    name: "Ramo pastel de cupcakes",
    category: "Regalos",
    price: 15000,
    image: "/images/torta11.jpeg",
    description: "Cupcakes florales en tonos pastel con envoltorio rosado.",
    stock: 4,
    portions: "7 unidades",
    occasions: ["Regalo", "Día especial"],
  },
  {
    id: 14,
    name: "Ramo pequeño de cupcakes",
    category: "Regalos",
    price: 12000,
    image: "/images/torta12.jpeg",
    description: "Presentación compacta de cupcakes florales, lista para regalar.",
    stock: 6,
    portions: "5 unidades",
    occasions: ["Detalle", "Agradecimiento"],
  },
  {
    id: 9,
    name: "Caja de alfajores",
    category: "Regalos",
    price: 8500,
    image: "/images/alfacaja.jpeg",
    description: "Seis alfajores artesanales cubiertos en chocolate y decorados a mano.",
    stock: 10,
    portions: "6 unidades",
    occasions: ["Regalo", "Empresa"],
  },
  {
    id: 10,
    name: "Alfajor individual",
    category: "Regalos",
    price: 1500,
    image: "/images/torta4.jpeg",
    description: "Alfajor relleno de manjar, cubierto en chocolate y sellado individualmente.",
    stock: 24,
    portions: "1 unidad",
    occasions: ["Detalle", "Colación"],
  },
  {
    id: 11,
    name: "Caja surtida familiar",
    category: "Regalos",
    price: 12000,
    image: "/images/torta5.jpeg",
    description: "Selección de alfajores y cuchuflís con cobertura de chocolate.",
    stock: 8,
    portions: "12 unidades",
    occasions: ["Familia", "Regalo"],
  },
  {
    id: 12,
    name: "Caja clásica de seis",
    category: "Regalos",
    price: 8500,
    image: "/images/torta6.jpeg",
    description: "Seis alfajores caseros con decoración blanca y rosada.",
    stock: 9,
    portions: "6 unidades",
    occasions: ["Regalo", "Cumpleaños"],
  },
  {
    id: 13,
    name: "Mesa dulce para matrimonio",
    category: "Eventos",
    price: 2500,
    pricePrefix: "Desde",
    image: "/images/tortamatrimonio.jpeg",
    description: "Verrines y torta central preparados a medida para matrimonios y eventos.",
    stock: 40,
    portions: "Pedido personalizado",
    occasions: ["Matrimonio", "Evento"],
  },
];

export const reviews = [
  {
    name: "María González",
    date: "Hace 2 días",
    text: "Los alfajores se sienten realmente caseros y llegaron impecables.",
    stars: 5,
  },
  {
    name: "Juan Pablo Soto",
    date: "Hace 1 semana",
    text: "La presentación del regalo fue muy linda y todo estaba fresco.",
    stars: 5,
  },
  {
    name: "Carla R.",
    date: "Hace 2 semanas",
    text: "Buena atención y una torta preciosa, tal como la imaginamos.",
    stars: 5,
  },
];
