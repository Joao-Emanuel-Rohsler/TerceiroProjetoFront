const API_URL = 'http://18.222.254.78:3000/products';
const form = document.getElementById('product-form');
const list = document.getElementById('product-list');
const toggleBtn = document.getElementById('toggle-form-btn');

let editId = null;

// Mostrar ou ocultar formulário
toggleBtn.onclick = () => {
  form.classList.toggle('hidden');
  toggleBtn.textContent = form.classList.contains('hidden') ? 'Adicionar Produto' : 'Cancelar';
};

// Submissão do formulário
form.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);

  if (editId) {
    await fetch(`${API_URL}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price }),
    });
    editId = null;
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price }),
    });
  }

  form.reset();
  form.classList.add('hidden');
  toggleBtn.textContent = 'Adicionar Produto';
  await fetchProducts();
};

// Buscar produtos
async function fetchProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  list.innerHTML = '';
  products.forEach(addProductToList);
}

// Adicionar item na lista
function addProductToList(product) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${product.name} - R$ ${product.price}</strong>
    <div>${product.description || ''}</div>
    <button class="edit-btn">Editar</button>
    <button class="delete-btn">Excluir</button>
  `;

  li.querySelector('.delete-btn').onclick = async () => {
    const confirmDelete = confirm(`Deseja realmente excluir "${product.name}"?`);
    if (confirmDelete) {
      await fetch(`${API_URL}/${product.id}`, { method: 'DELETE' });
      await fetchProducts();
    }
  };

  li.querySelector('.edit-btn').onclick = () => {
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    editId = product.id;
    form.classList.remove('hidden');
    toggleBtn.textContent = 'Cancelar';
  };

  list.appendChild(li);
}

// Iniciar
fetchProducts();
