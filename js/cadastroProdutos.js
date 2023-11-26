const apiUrl = 'http://localhost:8080';
let supplier;
let productCode;

async function getCategories() {
  try {
    let response = await fetch(`${apiUrl}/categories`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function getProduct(productId) {
  try {
    let response = await fetch(`${apiUrl}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados do produto');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function postProduct (body) {
  try {
    let response = await fetch(`${apiUrl}/products`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar produto!');
    }

    return window.alert("Produto salvo com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

async function putProduct (body) {
  try {
    let response = await fetch(`${apiUrl}/products/${productCode}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar produto!');
    }

    return window.alert("Produto atualizado com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

async function fillFields ()  {
  const categories = await getCategories();

  if (categories.length > 0) {
    const categorySelect = document.getElementById('categoria');
    categories.forEach((category) => {
      const option = document.createElement('option');
    
      option.value = category.id;
      option.textContent = category.description;

      categorySelect.appendChild(option);
    });
  }

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  supplier = params.get('idSupplier');
  const productId = params.get('productId');
  
  if (!supplier)
    return window.alert("Insira o Id do fornecedor. ?idSupplier={id}");

  if(productId)
    fillFieldsWithProductData(productId)
}

function getProductPhotos () {
  const input = document.getElementById('productPhoto');

  if (input.files && input.files[0]) {
    const arquivo = input.files[0];
    return [arquivo.name];
    
    //TODO IMPLEMENTAÇÃO COM STORE DE ARQUIVO
    // const reader = new FileReader();

    // reader.onload = function(e) {
    //   const resultadoBase64 = e.target.result;
    // };

    // const fileBase64 = reader.readAsDataURL(arquivo);

    // return console.log(fileBase64, typeof fileBase64);
    // return [reader.readAsDataURL(arquivo)]
  } else {
    return [];
  }
}

function cleanFields () {
  document.getElementById('nome').value = "";
  document.getElementById('price').value = 0;
  document.getElementById('altura').value = "";
  document.getElementById('largura').value = "";
  document.getElementById('comprimento').value = "";
  document.getElementById('estoque').value = "";
  document.getElementById('descricao').value = "";
  document.getElementById('categoria').value = "";
  document.getElementById('cor').value = "";
  productCode = null;
}

async function storeProduct () {
  try {

    const name = document.getElementById('nome').value;
    const productValue = document.getElementById('price').value;
    const length = document.getElementById('altura').value;
    const width = document.getElementById('largura').value;
    const longitude = document.getElementById('comprimento').value;
    const stock = document.getElementById('estoque').value;
    const description = document.getElementById('descricao').value;
    const category = document.getElementById('categoria').value;
    const color = document.getElementById('cor').value;

    if (!(productValue > 0))
      return window.alert("O preço deve ser maior que R$0,00");

    if (!name)
      return window.alert("Preemcha o nome do produto");

    if (!(length > 0))
      return window.alert("A altura deve ser maior que 0");

    if (!(width > 0))
      return window.alert("A lagura deve ser maior que 0");

    if (!(longitude > 0))
      return window.alert("O comprimento deve ser maior que 0");

    if (!(stock > 0))
      return window.alert("O estoque inicial deve ser maior que 0");
    
    if (!category)
      return window.alert("Selecione uma categoria para o produto");

    if (!color)
      return window.alert("Selecione uma cor para o produto");
    
    const productImages = getProductPhotos();

    const body = {
      idSupplier: supplier,
      name,
      productValue,
      length,
      width,
      longitude,
      productImages,
      stock,
      description,
      color,
      categories: [category],
    }

    productCode ? await putProduct(body) : await postProduct(body);
    cleanFields();
  } catch (error) {
    throw new Error(error)
  }
}

async function fillFieldsWithProductData(productId) {
  const productData = await getProduct(productId);

  console.log(productData);

  if(!productData)
    return window.alert('Não foi possível encontrar dados do produto solicitado');

  productCode = productData.id;
  document.getElementById('nome').value = productData.name;
  document.getElementById('price').value = productData.productValue;
  document.getElementById('altura').value = productData.length;
  document.getElementById('largura').value = productData.width;
  document.getElementById('comprimento').value = productData.longitude;
  document.getElementById('estoque').value = productData.stock;
  document.getElementById('descricao').value = productData.description;
  document.getElementById('categoria').value = productData.categories[0].id;
  document.getElementById('cor').value = productData.color;
}