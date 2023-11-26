const apiUrl = 'http://localhost:8080';
let customerDocument;

async function getCustomer(document) {
  customerDocument = document;
  try {
    let response = await fetch(`${apiUrl}/customer?document=${document}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados do cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function postCustomer (body) {
  try {
    let response = await fetch(`${apiUrl}/customer`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar cliente!');
    }

    return window.alert("Cliente salvo com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

async function putCustomer (body) {
  try {
    let response = await fetch(`${apiUrl}/customer?document=${customerDocument}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar cliente!');
    }

    return window.alert("Cliente atualizado com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

async function fillFields ()  {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const customerDocument = params.get('customer');

  if (customerDocument)
    fillFieldsWithDocument(customerDocument);  
}

function getCustomerPhoto () {
  const input = document.getElementById('customerPhoto');

  if (input.files && input.files[0]) {
    const arquivo = input.files[0];
    return [arquivo.name];
  } else {
    return [];
  }
}

function cleanFields () {
  document.getElementById('name').value = "";
  document.getElementById('document').value = "";
  document.getElementById('socialName').value = "";
  document.getElementById('email').value = "";
  document.getElementById('image').value = "";
  document.getElementById('telephone').value = "";
  document.getElementById('gender').value = "";
  document.getElementById('birthDate').value = "";
  customerDocument = "";
}

async function storeCustomer () {
  try {
    const name = document.getElementById('name').value;
    const document = document.getElementById('document').value;
    const socialName = document.getElementById('socialName').value;
    const email = document.getElementById('email').value;
    const telephone = document.getElementById('telephone').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;

    if (!document)
      return window.alert("Preencha o CPF/CNPJ do cliente");

    if (!name)
      return window.alert("Preemcha o nome do cliente");

    if (!email)
      return window.alert("Preemcha o E-mail do cliente");

    if (!telephone)
      return window.alert("Preemcha o telefone do cliente");
    
    const image = getCustomerPhoto();

    const body = {
      name,
      document,
      socialName,
      email,
      image,
      telephone,
      gender,
      birthDate,
    }

    customerDocument ? await putCustomer(body) : await postCustomer(body);
    cleanFields();
  } catch (error) {
    throw new Error(error)
  }
}

async function fillFieldsWithDocument (document) {
  const customerData = await getCustomer(document);

  if (!customerData)
    return window.alert("Nnehum cliente registrado com esse documento.")

  document.getElementById('name').value = customerData.name;
  document.getElementById('document').value = customerData.document;
  document.getElementById('socialName').value = customerData.socialName;
  document.getElementById('email').value = customerData.email;
  document.getElementById('image').value = customerData.image;
  document.getElementById('telephone').value = customerData.telephone;
  document.getElementById('gender').value = customerData.gender;
  document.getElementById('birthDate').value = customerData.birthDate;
}