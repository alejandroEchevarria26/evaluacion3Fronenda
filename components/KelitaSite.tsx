"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  categories,
  initialProducts,
  reviews,
  type Category,
  type Product,
  type ProductCategory,
} from "../data/products";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  category: "Tortas" as ProductCategory,
  stock: "",
  portions: "",
  occasions: "",
};
type ProductFormState = typeof emptyProductForm;

const emptyOrderForm = {
  name: "",
  phone: "",
  event: "",
  product: "",
  quantity: "",
  date: "",
  details: "",
};
type OrderFormState = typeof emptyOrderForm;

function formatPrice(product: Product) {
  const price = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(product.price);

  return product.pricePrefix ? `${product.pricePrefix} ${price}` : price;
}

function Header({ isAdmin, onToggleView }: { isAdmin: boolean; onToggleView: () => void }) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  const changeView = () => {
    closeMenu();
    onToggleView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-header">
      <a className="brand" href={isAdmin ? "#panel" : "#inicio"} onClick={closeMenu} aria-label="Tortas Kelita, inicio">
        <img src="/images/logo.jpeg" alt="" />
        <span>
          <strong>Tortas Kelita</strong>
          <small>La tradición de la abuela</small>
        </span>
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <nav className={open ? "site-nav is-open" : "site-nav"} aria-label="Navegación principal">
        {isAdmin ? (
          <>
            <a href="#panel" onClick={closeMenu}>Resumen</a>
            <a href="#gestion" onClick={closeMenu}>Agregar</a>
            <a href="#admin-products" onClick={closeMenu}>Productos</a>
          </>
        ) : (
          <>
            <a href="#historia" onClick={closeMenu}>Historia</a>
            <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
            <a href="#ubicacion" onClick={closeMenu}>Ubicación</a>
            <a className="button button-small" href="#pedido" onClick={closeMenu}>Hacer un pedido</a>
          </>
        )}
        <button className="view-switch" type="button" onClick={changeView}>
          {isAdmin ? "Vista cliente" : "Vista administrador"}
        </button>
      </nav>
    </header>
  );
}

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
  onQuote?: (product: Product) => void;
  onDelete: (product: Product) => void;
  isAdmin?: boolean;
};

function ProductCard({ product, onOpen, onQuote, onDelete, isAdmin = false }: ProductCardProps) {
  return (
    <article className="product-card">
      <button className="product-image-button" type="button" onClick={() => onOpen(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-category">{product.category}</span>
      </button>
      <div className="product-copy">
        <div className="product-heading">
          <h3>{product.name}</h3>
          <strong>{formatPrice(product)}</strong>
        </div>
        <p>{product.description}</p>
        <div className="stock-row">
          <span className={product.stock === 0 ? "stock-badge is-empty" : "stock-badge"}>
            Stock: {product.stock} {product.stock === 1 ? "unidad" : "unidades"}
          </span>
          <span>{product.portions}</span>
        </div>
        <div className="product-actions">
          <button className="text-button" type="button" onClick={() => onOpen(product)}>
            Ver detalles
          </button>
          {isAdmin ? (
            <button className="delete-button" type="button" onClick={() => onDelete(product)}>
              Eliminar producto
            </button>
          ) : (
            <button
              className="button button-quiet"
              type="button"
              disabled={product.stock === 0}
              onClick={() => onQuote?.(product)}
            >
              {product.stock === 0 ? "Agotado" : "Cotizar"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

type ProductModalProps = {
  product: Product;
  onClose: () => void;
  onQuote: (product: Product) => void;
  isAdmin: boolean;
};

function ProductModal({ product, onClose, onQuote, isAdmin }: ProductModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar detalles">
          &times;
        </button>
        <img className="modal-image" src={product.image} alt={product.name} />
        <div className="modal-copy">
          <span className="eyebrow">{product.category}</span>
          <div className="modal-heading">
            <h2 id="modal-title">{product.name}</h2>
            <strong>{formatPrice(product)}</strong>
          </div>
          <p>{product.description}</p>
          <dl className="product-facts">
            <div>
              <dt>Stock</dt>
              <dd>{product.stock} {product.stock === 1 ? "unidad" : "unidades"}</dd>
            </div>
            <div>
              <dt>Rendimiento</dt>
              <dd>{product.portions}</dd>
            </div>
            <div>
              <dt>Ideal para</dt>
              <dd>{product.occasions.join(" / ")}</dd>
            </div>
          </dl>
          <button
            className="button button-wide"
            type="button"
            disabled={!isAdmin && product.stock === 0}
            onClick={() => isAdmin ? onClose() : onQuote(product)}
          >
            {isAdmin
              ? "Volver a la administración"
              : product.stock === 0
                ? "Producto agotado"
                : "Cotizar este producto"}
          </button>
        </div>
      </section>
    </div>
  );
}

type CatalogManagerProps = {
  productCount: number;
  onAddProduct: (product: Product) => void;
};

// Todos los campos están controlados para mantener validaciones y reinicio consistentes.
function CatalogManager({ productCount, onAddProduct }: CatalogManagerProps) {
  const [form, setForm] = useState(emptyProductForm);
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageError, setImageError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value } as ProductFormState));
    setFormMessage("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError("");
    setFormMessage("");

    if (!file) {
      setImagePreview("");
      setImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("El archivo seleccionado debe ser una imagen.");
      setImagePreview("");
      setImageName("");
      event.target.value = "";
      return;
    }

    // La imagen se rechaza antes de leerla cuando supera el límite solicitado.
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("La imagen supera el tamaño permitido de 2 MB.");
      setImagePreview("");
      setImageName("");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
        setImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim() || !form.description.trim()) {
      setFormMessage("El nombre y la descripción son obligatorios.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormMessage("El precio debe ser mayor que 0.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setFormMessage("El stock debe ser un número entero mayor o igual a 0.");
      return;
    }

    if (!imagePreview) {
      setFormMessage("Selecciona una imagen válida de hasta 2 MB.");
      return;
    }

    const occasions = form.occasions
      .split(",")
      .map((occasion) => occasion.trim())
      .filter(Boolean);

    onAddProduct({
      id: Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      stock,
      image: imagePreview,
      portions: form.portions.trim() || "Por definir",
      occasions: occasions.length > 0 ? occasions : ["Pedido especial"],
    });

    setForm(emptyProductForm);
    setImagePreview("");
    setImageName("");
    setImageError("");
    setFormMessage("Producto agregado correctamente.");
    setFileInputKey((current) => current + 1);
  };

  return (
    <section id="gestion" className="section manager-section">
      <div className="manager-heading">
        <div>
          <span className="eyebrow">Gestión del catálogo</span>
          <h2>Agrega un nuevo producto.</h2>
          <p>Completa la información y la tarjeta aparecerá inmediatamente en el catálogo.</p>
        </div>
        <div className="product-counter" aria-live="polite">
          <span>Productos registrados</span>
          <strong>{productCount}</strong>
        </div>
      </div>

      <form className="manager-form" onSubmit={handleSubmit}>
        <div className="manager-fields">
          <div className="form-field">
            <label htmlFor="product-name">Nombre del producto</label>
            <input
              id="product-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ej: Torta de chocolate"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-category">Categoría</label>
            <select
              id="product-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="Tortas">Tortas</option>
              <option value="Regalos">Regalos</option>
              <option value="Eventos">Eventos</option>
            </select>
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="product-description">Descripción</label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe el producto, sus ingredientes y terminación"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-price">Precio</label>
            <input
              id="product-price"
              name="price"
              type="number"
              min="1"
              step="1"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="15000"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-stock">Stock</label>
            <input
              id="product-stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
              placeholder="10"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-portions">Porciones o formato</label>
            <input
              id="product-portions"
              name="portions"
              type="text"
              value={form.portions}
              onChange={handleChange}
              placeholder="Ej: 15 personas"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-occasions">Ocasiones</label>
            <input
              id="product-occasions"
              name="occasions"
              type="text"
              value={form.occasions}
              onChange={handleChange}
              placeholder="Cumpleaños, aniversario"
            />
          </div>
        </div>

        <div className="image-field">
          <label htmlFor="product-image">Imagen del producto</label>
          <label className={imagePreview ? "image-dropzone has-image" : "image-dropzone"} htmlFor="product-image">
            {imagePreview ? (
              <img src={imagePreview} alt="Vista previa del producto" />
            ) : (
              <span><strong>Seleccionar imagen</strong><small>JPG, PNG o WEBP hasta 2 MB</small></span>
            )}
          </label>
          <input
            key={fileInputKey}
            className="file-input"
            id="product-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imageName && <span className="file-name">{imageName}</span>}
          {imageError && <p className="field-error" role="alert">{imageError}</p>}
          <button className="button button-wide manager-submit" type="submit">Agregar producto</button>
          {formMessage && (
            <p className={formMessage.includes("correctamente") ? "form-status is-success" : "form-status"} role="status">
              {formMessage}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

function OrderForm({ selectedProduct, products }: { selectedProduct: string; products: Product[] }) {
  const [form, setForm] = useState(emptyOrderForm);

  useEffect(() => {
    setForm((current) => ({ ...current, product: selectedProduct }));
  }, [selectedProduct]);

  useEffect(() => {
    const customOptions = ["Torta personalizada", "Otro pedido"];
    const productStillExists = products.some((product) => product.name === form.product);
    const isCustomOption = customOptions.includes(form.product);

    if (form.product && !productStillExists && !isCustomOption) {
      setForm((current) => ({ ...current, product: "" }));
    }
  }, [products, form.product]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value } as OrderFormState));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = [
      "Hola, Tortas Kelita. Quiero solicitar una cotización:",
      "",
      `Nombre: ${form.name}`,
      `Teléfono: ${form.phone}`,
      `Producto: ${form.product}`,
      `Evento: ${form.event}`,
      `Porciones o cantidad: ${form.quantity}`,
      `Fecha deseada: ${form.date}`,
      `Detalles: ${form.details || "Sin observaciones"}`,
    ].join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Tu nombre completo" />
      </div>
      <div className="form-field">
        <label htmlFor="phone">WhatsApp</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={handleChange} placeholder="+56 9 1234 5678" />
      </div>
      <div className="form-field">
        <label htmlFor="event">Tipo de evento</label>
        <select id="event" name="event" required value={form.event} onChange={handleChange}>
          <option value="" disabled>Selecciona una opción</option>
          <option>Cumpleaños</option>
          <option>Matrimonio</option>
          <option>Aniversario</option>
          <option>Evento corporativo</option>
          <option>Otro</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="product">Producto</label>
        <select id="product" name="product" required value={form.product} onChange={handleChange}>
          <option value="" disabled>Selecciona un producto</option>
          {products.map((product) => <option key={product.id}>{product.name}</option>)}
          <option>Torta personalizada</option>
          <option>Otro pedido</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="quantity">Porciones o cantidad</label>
        <input id="quantity" name="quantity" type="number" min="1" required value={form.quantity} onChange={handleChange} placeholder="Ej: 20" />
      </div>
      <div className="form-field">
        <label htmlFor="date">Fecha deseada</label>
        <input id="date" name="date" type="date" min={new Date().toISOString().slice(0, 10)} required value={form.date} onChange={handleChange} />
      </div>
      <div className="form-field form-field-wide">
        <label htmlFor="details">Detalles del pedido</label>
        <textarea id="details" name="details" rows={4} value={form.details} onChange={handleChange} placeholder="Sabor, colores, mensaje, alergias o una idea especial" />
      </div>
      <button className="button button-wide form-submit" type="submit">Continuar en WhatsApp</button>
      <p className="form-note">Se abrirá WhatsApp con los datos listos para enviar.</p>
    </form>
  );
}

type AdminDashboardProps = {
  products: Product[];
  visibleProducts: Product[];
  category: Category;
  onCategoryChange: (category: Category) => void;
  onAddProduct: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
};

function AdminDashboard({
  products,
  visibleProducts,
  category,
  onCategoryChange,
  onAddProduct,
  onOpenProduct,
  onDeleteProduct,
}: AdminDashboardProps) {
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const lowStock = products.filter((product) => product.stock <= 3).length;
  const activeCategories = new Set(products.map((product) => product.category)).size;

  return (
    <main className="admin-dashboard">
      <section id="panel" className="section admin-overview">
        <div className="admin-title-row">
          <div>
            <span className="eyebrow">Vista administrador</span>
            <h1>Panel del catálogo.</h1>
            <p>Controla productos, existencias e imágenes desde un solo lugar.</p>
          </div>
          <span className="admin-session"><i /> Administración activa</span>
        </div>
        <div className="admin-stats">
          <article><span>Productos</span><strong>{products.length}</strong><small>registrados</small></article>
          <article><span>Stock total</span><strong>{totalStock}</strong><small>unidades disponibles</small></article>
          <article><span>Stock bajo</span><strong>{lowStock}</strong><small>productos con 3 o menos</small></article>
          <article><span>Categorías</span><strong>{activeCategories}</strong><small>categorías activas</small></article>
        </div>
      </section>

      <CatalogManager productCount={products.length} onAddProduct={onAddProduct} />

      <section id="admin-products" className="section catalog-section admin-catalog-section">
        <div className="section-heading catalog-heading">
          <div>
            <span className="eyebrow">Inventario</span>
            <h2>Productos publicados.</h2>
            <p className="catalog-count">Productos registrados: <strong>{products.length}</strong></p>
          </div>
          <div className="filters" aria-label="Filtrar inventario">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "filter is-active" : "filter"}
                type="button"
                aria-pressed={category === item}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpenProduct}
                onDelete={onDeleteProduct}
                isAdmin
              />
            ))}
          </div>
        ) : (
          <div className="empty-catalog">
            <strong>No hay productos en esta categoría.</strong>
            <span>Agrega uno nuevo desde el formulario superior.</span>
          </div>
        )}
      </section>
    </main>
  );
}

export function KelitaSite() {
  // This state is the single source of truth for cards, filters and the counter.
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(initialProducts);
  const [category, setCategory] = useState<Category>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const visibleProducts = useMemo(
    () => category === "Todos"
      ? catalogProducts
      : catalogProducts.filter((product) => product.category === category),
    [catalogProducts, category],
  );

  const requestQuote = (product: Product) => {
    setQuoteProduct(product.name);
    setSelectedProduct(null);
    window.setTimeout(() => document.getElementById("pedido")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const addProduct = (product: Product) => {
    setCatalogProducts((current) => [product, ...current]);
    setCategory("Todos");
    window.setTimeout(() => document.getElementById("admin-products")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const deleteProduct = (product: Product) => {
    // Deletion only changes the list after explicit user confirmation.
    const confirmed = window.confirm(`¿Deseas eliminar "${product.name}" del catálogo?`);
    if (!confirmed) return;

    const remainingProducts = catalogProducts.filter((item) => item.id !== product.id);
    setCatalogProducts(remainingProducts);

    if (category !== "Todos" && !remainingProducts.some((item) => item.category === category)) {
      setCategory("Todos");
    }

    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    }

    if (quoteProduct === product.name) {
      setQuoteProduct("");
    }
  };

  const toggleView = () => {
    setIsAdmin((current) => !current);
    setSelectedProduct(null);
    setCategory("Todos");
  };

  return (
    <>
      <Header isAdmin={isAdmin} onToggleView={toggleView} />
      {isAdmin ? (
        <AdminDashboard
          products={catalogProducts}
          visibleProducts={visibleProducts}
          category={category}
          onCategoryChange={setCategory}
          onAddProduct={addProduct}
          onOpenProduct={setSelectedProduct}
          onDeleteProduct={deleteProduct}
        />
      ) : (
        <>
          <main>
            <section id="inicio" className="hero">
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="eyebrow eyebrow-light">Repostería artesanal &middot; Villa Alemana</span>
                <h1>Recetas de familia para celebrar lo importante.</h1>
                <p>Tortas, alfajores y detalles hechos a mano, con ingredientes frescos y terminaciones personalizadas.</p>
                <div className="hero-actions">
                  <a className="button" href="#catalogo">Ver catálogo</a>
                  <a className="button button-glass" href="#pedido">Pedir cotización</a>
                </div>
              </div>
              <div className="hero-note"><span>Pedidos personalizados</span><strong>Para cada ocasión</strong></div>
            </section>

            <section id="historia" className="section story-section">
              <div className="section-heading story-heading">
                <div><span className="eyebrow">Nuestra historia</span><h2>El sabor casero sigue siendo el centro.</h2></div>
                <p>Elaboramos cada pedido de forma artesanal, con ingredientes frescos y atención en cada detalle, para acompañar tus momentos especiales con el sabor de casa.</p>
              </div>
              <div className="story-grid">
                <img src="/images/sublogo.png" alt="Tortas Kelita preparando una receta artesanal" loading="lazy" />
                <div className="values-list">
                  <article><span>01</span><div><h3>Hecho a mano</h3><p>Producción artesanal para cuidar textura, frescura y terminación.</p></div></article>
                  <article><span>02</span><div><h3>A tu medida</h3><p>Adaptamos sabores, colores y formato al momento que quieres celebrar.</p></div></article>
                  <article><span>03</span><div><h3>Ingredientes frescos</h3><p>Seleccionamos cada ingrediente pensando primero en el sabor.</p></div></article>
                </div>
              </div>
            </section>

            <section id="catalogo" className="section catalog-section">
              <div className="section-heading catalog-heading">
                <div>
                  <span className="eyebrow">Catálogo</span>
                  <h2>Encuentra algo para compartir.</h2>
                  <p className="catalog-count">Productos disponibles: <strong>{catalogProducts.length}</strong></p>
                </div>
                <div className="filters" aria-label="Filtrar catálogo">
                  {categories.map((item) => (
                    <button key={item} className={category === item ? "filter is-active" : "filter"} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              {visibleProducts.length > 0 ? (
                <div className="product-grid">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} onQuote={requestQuote} onDelete={deleteProduct} />
                  ))}
                </div>
              ) : (
                <div className="empty-catalog"><strong>No hay productos en esta categoría.</strong><span>Vuelve a revisar pronto.</span></div>
              )}
            </section>

            <section id="pedido" className="section order-section">
              <div className="order-intro">
                <span className="eyebrow">Tu próxima celebración</span>
                <h2>Cuéntanos qué tienes en mente.</h2>
                <p>Completa los datos esenciales. Recibirás una cotización y coordinaremos juntos los detalles.</p>
                <div className="order-contact"><strong>Horario de atención</strong><span>Lunes a viernes &middot; 09:00 a 19:00</span></div>
              </div>
              <OrderForm selectedProduct={quoteProduct} products={catalogProducts} />
            </section>

            <section id="resenas" className="section reviews-section">
              <div className="section-heading"><div><span className="eyebrow">Comentarios</span><h2>Momentos que ya endulzamos.</h2></div></div>
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <article className="review-card" key={review.name}>
                    <div className="stars" aria-label={`${review.stars} de 5 estrellas`}>
                      {Array.from({ length: review.stars }, (_, index) => <span aria-hidden="true" key={index}>&#9733;</span>)}
                    </div>
                    <blockquote>&ldquo;{review.text}&rdquo;</blockquote>
                    <footer><strong>{review.name}</strong><span>{review.date}</span></footer>
                  </article>
                ))}
              </div>
            </section>

            <section id="ubicacion" className="section location-section">
              <div className="location-copy">
                <span className="eyebrow">Ubicación</span>
                <h2>Encuéntranos en Villa Alemana.</h2>
                <p>
                  Revisa el punto de referencia en el mapa y coordina previamente
                  el retiro o la entrega de tu pedido por WhatsApp.
                </p>
                <dl className="location-details">
                  <div><dt>Comuna</dt><dd>Villa Alemana</dd></div>
                  <div><dt>Región</dt><dd>Valparaíso, Chile</dd></div>
                  <div><dt>Atención</dt><dd>Lunes a viernes, 09:00 a 19:00</dd></div>
                </dl>
              </div>
              <div className="map-frame">
                <iframe
                  title="Ubicación de Tortas Kelita en Villa Alemana"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d497.1336732029104!2d-71.38624158194376!3d-33.048478622361166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2scl!4v1778112400299!5m2!1ses-419!2scl"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </main>

          <footer className="site-footer">
            <div className="footer-brand"><img src="/images/logo.jpeg" alt="Logo de Tortas Kelita" /><div><strong>Tortas Kelita</strong><span>La tradición de la abuela</span></div></div>
            <div className="footer-links"><a href="#catalogo">Catálogo</a><a href="#ubicacion">Ubicación</a><a href="#pedido">Pedidos</a><a href="https://instagram.com/tortaskelita" target="_blank" rel="noreferrer">Instagram</a></div>
            <p>&copy; 2026 Tortas Kelita. Sitio desarrollado por Alejandro Echeverría y Brallan Reyes.</p>
          </footer>
        </>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onQuote={requestQuote}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}
