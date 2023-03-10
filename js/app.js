const productsElement = document.querySelector(".catalog");
const filterName = document.getElementById("filter-name");
const filterBrand = document.getElementById("filter-brand");
const filterType = document.getElementById("filter-type");
const filterSort = document.getElementById("sort-type");

let productBrands = [];
let productTypes = [];
let jsonProducts;
let productChildren = [];

(async () => {
  let response = await fetch("data/products.json");
  loadProducts(await response.json(), filterSort.value);
})();

function loadProducts(json, sortType) {
  let products = sortProducts(json, sortType)
    .map((p) => productItem(p))
    .join("");

  productsElement.innerHTML = products;

  productChildren = Array.from(productsElement.querySelectorAll(".product"));

  loadCombo(filterBrand, productBrands.uniq().sort());
  loadCombo(filterType, productTypes.uniq().sort());

  jsonProducts = json;
}

function loadCombo(element, data) {
  data.map((item) =>
    element.insertAdjacentHTML("beforeend", `<option>${item}</option>`)
  );
}

function productItem(product) {
  productBrands = productBrands.concat([product.brand]);
  productTypes = productTypes.concat([product.product_type]);

  return `<div class="product" data-name="${product.name}" data-brand="${
    product.brand
  }" data-type="${product.product_type}" tabindex="${product.id}">
  <figure class="product-figure">
    <img src=${product.image_link} width="215" height="215" alt="${
    product.name
  }" onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${
      product.brand
    }</span><span class="product-brand background-price">R$${(
    parseFloat(product.price) * 5.5
  ).toFixed(2)}</span></div>
  </section>
  <section class="product-details">
  ${loadDetails(product)}
  </section>
  </div>`;
}

function loadDetails(product) {
  let details = ["brand", "price", "rating", "category", "product_type"];

  return Object.entries(product)
    .filter(([key, value]) => details.includes(key))
    .map(
      ([key, value]) =>
        `<div class="details-row">
          <div>${key}</div>
          <div class="details-bar">
            <div class="details-bar-bg" style="width= 250">${value}
            </div>
          </div>
        </div>`
    )
    .join("");
}

function sortProducts(products, sortType) {
  switch (sortType) {
    case "Best Rated":
      return products.sort((a, b) =>
        parseFloat(a.rating) > parseFloat(b.rating)
          ? -1
          : parseFloat(a.rating) < parseFloat(b.rating)
          ? 1
          : 0
      );
    case "Lower Prices":
      return products.sort((a, b) =>
        parseFloat(a.price * 5.5) > parseFloat(b.price * 5.5)
          ? 1
          : parseFloat(a.price * 5.5) < parseFloat(b.price * 5.5)
          ? -1
          : 0
      );
    case "Higher Prices":
      return products.sort((a, b) =>
        parseFloat(a.price * 5.5) > parseFloat(b.price * 5.5)
          ? -1
          : parseFloat(a.price * 5.5) < parseFloat(b.price * 5.5)
          ? 1
          : 0
      );
    case "A-Z":
      return products.sort((a, b) =>
        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
      );
    case "Z-A":
      return products.sort((a, b) =>
        a.name > b.name ? -1 : a.name < b.name ? 1 : 0
      );
  }
}

filterBrand.addEventListener("change", loadFilters);
filterType.addEventListener("change", loadFilters);
filterName.addEventListener("keyup", loadFilters);
filterSort.addEventListener("change", (e) => {
  loadProducts(jsonProducts, filterSort.value);
  loadFilters();
});

function loadFilters() {
  const name = filterName.value;
  const brand = filterBrand.value;
  const type = filterType.value;

  productChildren.forEach((product) => {
    if (validProduct(product, name, brand, type)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

function validProduct(product, name, brand, type) {
  const search = new RegExp(name, "i");

  const checkName = search.test(product.dataset.name);
  const checkBrand = product.dataset.brand.includes(brand);
  const checkType = product.dataset.type.includes(type);

  return checkName && checkBrand && checkType;
}

Array.prototype.uniq = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};
