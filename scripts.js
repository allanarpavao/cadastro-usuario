function renderInicio() {
  document.getElementById('content').innerHTML = `
    <section>
      <h2>Início</h2>
      <p style="text-align:center; font-size:1.3em;">
        Seja bem-vindo.
      </p>
    </section>
  `;
}

function renderCadastro() {
  document.getElementById('content').innerHTML = `
    <section>
      <h2>User</h2>
      <img src="images/Usuario.webp" alt="icone de usuario" class="user-icon"/>
      <div class="form-row">
        <input type="email" id="newEmail" placeholder="Email">
        <input type="text" id="newUsername" placeholder="Nome de usuário">
        <input type="password" id="newpassword" placeholder="Senha">
        <button onclick="newUser()" class="addBtn">
          <img src="images/Novo.png" alt="simbolo de mais"/>
        </button>
      </div>
    </section>
    <hr id="linha-hr" class="bottom-line" style="display:none">
    <section class="form-row-user">
      <table id="myTable" style="display:none">
        <tr>
          <th>Email</th>
          <th>Nome de usuário</th>
          <th>Data de Inclusão</th>
          <th><img src="https://cdn-icons-png.flaticon.com/512/126/126468.png" alt="icone de lixeira" width="15px" height="15px"></th>
        </tr>
      </table>
    </section>
  `;
  getUsers();
}

function navigate() {
  const hash = window.location.hash || "#inicio";
  if (hash === "#inicio") renderInicio();
  else if (hash === "#cadastro") renderCadastro();
  else renderInicio();
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);

const getUsers = async () => {
    let url = 'http://127.0.0.1:5000/usuarios/listar';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.usuarios.forEach(user => 
          insertUser(user.email, user.nome_usuario, user.data_inclusao)
        )
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

const postUser = async (inputEmail, inputUsername, inputPassword) => {
  const formData = new FormData();
  formData.append('email', inputEmail);
  formData.append('nome_usuario', inputUsername);
  formData.append('senha', inputPassword);

  let url = 'http://127.0.0.1:5000/usuarios/criar';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

const newUser = async () => {
  let inputEmail = document.getElementById("newEmail").value;
  let inputUsername = document.getElementById("newUsername").value;
  let inputPassword = document.getElementById("newpassword").value;
  let linhaHr = document.getElementById("linha-hr")
  let tabela = document.getElementById("myTable")

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  
  if (inputEmail === '' || inputUsername === '' || inputPassword === '') {
    alert("Preencha todos os campos!");
    return;
  }
    if (!emailRegex.test(inputEmail)) {
      alert("Digite um e-mail válido!");
      return;
    }

    else {
    insertUser(inputEmail, inputUsername);
    postUser(inputEmail, inputUsername, inputPassword);
    alert("Usuário adicionado!");
    linhaHr.style.display = "block";
    tabela.style.display = "table";
  }
}

const insertUser = (email, username, dataInclusao) => {
  if (!dataInclusao) {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    dataInclusao = `${dia}/${mes}/${ano}`;
  }
  var item = [email, username, dataInclusao];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("newEmail").value = "";
  document.getElementById("newUsername").value = "";
  document.getElementById("newpassword").value = "";

  removeElement();
}

const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


const removeElement = () => {
  let close = document.getElementsByClassName("close");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let row = this.parentElement.parentElement;
      const username = row.getElementsByTagName('td')[1].innerHTML;
      if (confirm("Você tem certeza?")) {
        row.remove();
        deleteUser(username);
        alert("Usuário removido!");
      }
    }
  }
}

const deleteUser = (username) => {
  let url = 'http://127.0.0.1:5000/usuarios?nome=' + encodeURIComponent(username);
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}
