const apiUrl = 'http://localhost:8080';
let supplier;

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
  const idSupplier = params.get('idSupplier');
  
  if (!idSupplier)
    return window.alert("Insira o Id do fornecedor. ?idSupplier={id}");
  supplier = idSupplier;
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

    await postProduct(body);
    cleanFields();
  } catch (error) {
    throw new Error(error)
  }
}